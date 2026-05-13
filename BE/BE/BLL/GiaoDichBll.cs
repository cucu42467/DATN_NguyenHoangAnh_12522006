using System.Text.Json;
using BLL.Interfaces;
using BLL.Services;
using Common;
using DAL;
using DAL.Interfaces;
using DTO;

namespace BLL;

/// <summary>
/// Business Logic Layer cho GiaoDich - có cache cho dashboard stats
/// </summary>
public class GiaoDichBll : IGiaoDichBll
{
    private readonly IGiaoDichDal _giaoDichDal;
    private readonly ITaiKhoanDal _taiKhoanDal;
    private readonly IAuditLogDal _auditLogDal;
    private readonly ICacheService _cache;
    private readonly IGiaoDichService _giaoDichService;

    public GiaoDichBll(
        IGiaoDichDal giaoDichDal, 
        ITaiKhoanDal taiKhoanDal, 
        IAuditLogDal auditLogDal,
        ICacheService cache,
        IGiaoDichService giaoDichService)
    {
        _giaoDichDal = giaoDichDal;
        _taiKhoanDal = taiKhoanDal;
        _auditLogDal = auditLogDal;
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _giaoDichService = giaoDichService;
    }

    private async Task GhiAuditLogAsync(int? nguoiDungId, int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_giaodich",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<PagedResponse<GiaoDichDto>> LayDanhSachAsync(int nguoiDungId, LocGiaoDichDto? filter = null, int page = 1, int pageSize = 20, CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        try
        {
            // KHÔNG cache danh sách giao dịch vì có filter/pagination
            var taiKhoans = await _taiKhoanDal.LayDanhSachTheoNguoiDungAsync(nguoiDungId, ct);
            if (!taiKhoans.Any()) return new PagedResponse<GiaoDichDto> { Page = page, PageSize = pageSize };

            return await _giaoDichDal.LayDanhSachTheoNguoiDungAsync(nguoiDungId, filter, page, pageSize, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy danh sách giao dịch của người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<GiaoDichDto?> LayChiTietAsync(int giaoDichId, int nguoiDungId, CancellationToken ct = default)
    {
        try
        {
            // Cache chi tiết giao dịch - ít thay đổi
            var cacheKey = $"app:transaction:{giaoDichId}";
            
            return await _cache.GetOrSetAsync(
                cacheKey,
                async () =>
                {
                    var giaoDich = await _giaoDichDal.LayTheoIdAsync(giaoDichId, ct);
                    if (giaoDich == null || giaoDich.NguoiDungId != nguoiDungId) return null;
                    return giaoDich;
                },
                CacheExpirationOptions.MediumTerm // 10 phút
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy chi tiết giao dịch ID {giaoDichId}: {ex.Message}", ex);
        }
    }

    public async Task<int> TaoMoiAsync(TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        try
        {
            // Chuyển đổi DTO cũ sang DTO mới
            var request = new ThemGiaoDichRequest
            {
                TaiKhoanId = dto.TaiKhoanNguonId,
                SoTien = dto.SoTien,
                LoaiGiaoDich = ChuyenDoiLoaiGiaoDich(dto.LoaiGiaoDich),
                NgayGiaoDich = dto.NgayGiaoDich ?? DateTime.Now,
                TaiKhoanDichId = dto.TaiKhoanDichId,
                DanhMucId = dto.DanhMucId,
                MoTa = dto.GhiChu,
                TenGiaoDich = dto.GhiChu,   // ← THÊM MỚI
                TienTe = dto.TienTe,
                TyGiaQuyDoi = dto.TyGiaQuyDoi,
                NguonTao = dto.NguonTao,
                ViTri = dto.ViTri,
                LaTuDong = dto.LaTuDong ?? false,
                DoTinCay = dto.DoTinCay,
                MaGiaoDichNgoai = dto.MaGiaoDichNgoai,
                XacNhanTaoNganSach = dto.XacNhanTaoNganSach ?? false
            };

            // Gọi Service mới để xử lý đầy đủ 10 bước
            var result = await _giaoDichService.ThemGiaoDichDayDuAsync(request, nguoiDungId, null, ct);

            if (!result.ThanhCong)
            {
                throw new InvalidOperationException(result.ThongBao ?? "Đã xảy ra lỗi khi tạo giao dịch");
            }

            // Invalidate cache liên quan
            await InvalidateUserCacheAsync(nguoiDungId);

            return result.GiaoDichId;
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tạo giao dịch mới: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Chuyển đổi loại giao dịch từ string (THU/CHI/CHUYEN_KHOAN hoặc 1/2/3) sang sbyte
    /// </summary>
    private static sbyte ChuyenDoiLoaiGiaoDich(string? loaiGiaoDich)
    {
        if (string.IsNullOrEmpty(loaiGiaoDich))
            return 2; // Mặc định là Chi

        var loai = loaiGiaoDich.ToUpperInvariant().Trim();
        return loai switch
        {
            "THU" or "1" => 1,
            "CHI" or "2" => 2,
            "CHUYEN_KHOAN" or "3" => 3,
            _ => 2 // Mặc định là Chi
        };
    }

    public async Task<TaoGiaoDichResponseDto> TaoMoiWithKiemTraAsync(TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        try
        {
            // Chuyển đổi DTO cũ sang DTO mới
            var request = new ThemGiaoDichRequest
            {
                TaiKhoanId = dto.TaiKhoanNguonId,
                SoTien = dto.SoTien,
                LoaiGiaoDich = ChuyenDoiLoaiGiaoDich(dto.LoaiGiaoDich),
                NgayGiaoDich = dto.NgayGiaoDich ?? DateTime.Now,
                TaiKhoanDichId = dto.TaiKhoanDichId,
                DanhMucId = dto.DanhMucId,
                MoTa = dto.GhiChu,
                TenGiaoDich = dto.GhiChu,   // ← THÊM MỚI
                TienTe = dto.TienTe,
                TyGiaQuyDoi = dto.TyGiaQuyDoi,
                NguonTao = dto.NguonTao,
                ViTri = dto.ViTri,
                LaTuDong = dto.LaTuDong ?? false,
                DoTinCay = dto.DoTinCay,
                MaGiaoDichNgoai = dto.MaGiaoDichNgoai,
                XacNhanTaoNganSach = dto.XacNhanTaoNganSach ?? false
            };

            // Gọi Service mới để xử lý đầy đủ 10 bước
            var result = await _giaoDichService.ThemGiaoDichDayDuAsync(request, nguoiDungId, null, ct);

            // Chuyển đổi response
            return new TaoGiaoDichResponseDto
            {
                ThanhCong = result.ThanhCong,
                GiaoDichId = result.GiaoDichId,
                ThongBaoLoi = result.ThanhCong ? null : result.ThongBao
            };
        }
        catch (Exception ex)
        {
            return new TaoGiaoDichResponseDto 
            { 
                ThanhCong = false, 
                ThongBaoLoi = $"Lỗi khi tạo giao dịch: {ex.Message}" 
            };
        }
    }

    public async Task<bool> CapNhatAsync(int giaoDichId, TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        try
        {
            // Chuyển đổi DTO cũ sang DTO mới
                var request = new SuaGiaoDichRequest
                {
                    GiaoDichId = giaoDichId,
                    TaiKhoanId = dto.TaiKhoanNguonId,
                    SoTien = dto.SoTien,
                    LoaiGiaoDich = ChuyenDoiLoaiGiaoDich(dto.LoaiGiaoDich),
                    NgayGiaoDich = dto.NgayGiaoDich ?? DateTime.Now,
                    TaiKhoanDichId = dto.TaiKhoanDichId,
                    DanhMucId = dto.DanhMucId,
                    MoTa = dto.GhiChu,
                    TenGiaoDich = dto.GhiChu,   // ← THÊM MỚI
                    TienTe = dto.TienTe,
                TyGiaQuyDoi = dto.TyGiaQuyDoi,
                ViTri = dto.ViTri
            };

            // Gọi Service mới để xử lý đầy đủ 10 bước
            var result = await _giaoDichService.SuaGiaoDichAsync(request, nguoiDungId, null, ct);

            if (!result.ThanhCong)
            {
                throw new InvalidOperationException(result.ThongBao ?? "Đã xảy ra lỗi khi cập nhật giao dịch");
            }

            // Invalidate cache liên quan
            await InvalidateUserCacheAsync(nguoiDungId);

            return result.ThanhCong;
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi cập nhật giao dịch ID {giaoDichId}: {ex.Message}", ex);
        }
    }

    public async Task<PreviewCapNhatGiaoDichDto> XemTruocCapNhatAsync(int giaoDichId, TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        var preview = new PreviewCapNhatGiaoDichDto
        {
            GiaoDichId = giaoDichId,
            SoTienMoi = dto.SoTien,
            LoaiGiaoDichMoi = dto.LoaiGiaoDich ?? ""
        };

        try
        {
            var giaoDichHienTai = await _giaoDichDal.LayTheoIdAsync(giaoDichId, ct);
            if (giaoDichHienTai == null || giaoDichHienTai.NguoiDungId != nguoiDungId)
            {
                preview.CoLoi = true;
                preview.ThongBao = "Không tìm thấy giao dịch hoặc bạn không có quyền.";
                return preview;
            }

            preview.SoTienHienTai = giaoDichHienTai.SoTien;
            preview.LoaiGiaoDichHienTai = giaoDichHienTai.LoaiGiaoDich ?? "";

            var taiKhoanNguon = await _taiKhoanDal.LayTheoIdAsync(giaoDichHienTai.TaiKhoanNguonId ?? 0, ct);
            if (taiKhoanNguon != null)
            {
                preview.TenTaiKhoanNguonHienTai = taiKhoanNguon.TenTaiKhoan;
                preview.SoDuTaiKhoanNguonHienTai = taiKhoanNguon.SoDu;
            }

            var taiKhoanMoi = await _taiKhoanDal.LayTheoIdAsync(dto.TaiKhoanNguonId, ct);
            if (taiKhoanMoi != null)
            {
                preview.TenTaiKhoanNguonMoi = taiKhoanMoi.TenTaiKhoan;
            }

            var loaiCu = giaoDichHienTai.LoaiGiaoDich?.ToUpperInvariant() ?? "";
            var isChiTieuCu = loaiCu == "CHI" || loaiCu == "2";
            var isThuNhapCu = loaiCu == "THU" || loaiCu == "1";
            var isChuyenKhoanCu = loaiCu == "CHUYEN_KHOAN" || loaiCu == "3";

            var loaiMoi = dto.LoaiGiaoDich?.ToUpperInvariant() ?? "";
            var isChiTieuMoi = loaiMoi == "CHI" || loaiMoi == "2";
            var isThuNhapMoi = loaiMoi == "THU" || loaiMoi == "1";
            var isChuyenKhoanMoi = loaiMoi == "CHUYEN_KHOAN" || loaiMoi == "3";

            decimal soDuSauHoanLai = 0;
            decimal soDuSauCapNhat = 0;

            var cungTaiKhoan = taiKhoanMoi == null || (taiKhoanNguon != null && taiKhoanMoi.TaiKhoanId == taiKhoanNguon.TaiKhoanId);

            if (cungTaiKhoan ? taiKhoanNguon != null : taiKhoanMoi != null)
            {
                if (cungTaiKhoan)
                {
                    var tacDongCu = 0m;
                    var tacDongMoi = 0m;

                    if (isChiTieuCu) tacDongCu = -giaoDichHienTai.SoTien;
                    else if (isThuNhapCu) tacDongCu = giaoDichHienTai.SoTien;
                    else if (isChuyenKhoanCu) tacDongCu = -giaoDichHienTai.SoTien;

                    if (isChiTieuMoi) tacDongMoi = -dto.SoTien;
                    else if (isThuNhapMoi) tacDongMoi = dto.SoTien;
                    else if (isChuyenKhoanMoi) tacDongMoi = -dto.SoTien;

                    soDuSauCapNhat = taiKhoanNguon!.SoDu - tacDongCu + tacDongMoi;
                    soDuSauHoanLai = taiKhoanNguon!.SoDu;
                }
                else
                {
                    soDuSauHoanLai = taiKhoanNguon!.SoDu;
                    if (isChiTieuCu) soDuSauHoanLai += giaoDichHienTai.SoTien;
                    else if (isThuNhapCu) soDuSauHoanLai -= giaoDichHienTai.SoTien;
                    else if (isChuyenKhoanCu) soDuSauHoanLai += giaoDichHienTai.SoTien;

                    soDuSauCapNhat = taiKhoanMoi!.SoDu;
                    if (isChiTieuMoi || isChuyenKhoanMoi) soDuSauCapNhat -= dto.SoTien;
                    else if (isThuNhapMoi) soDuSauCapNhat += dto.SoTien;
                }
            }

            preview.SoDuSauKhiHoanLai = soDuSauHoanLai;
            preview.SoDuSauKhiCapNhat = soDuSauCapNhat;

            if (soDuSauCapNhat < 0)
            {
                preview.CoLoi = true;
                preview.CanhBao = $"Không thể cập nhật. Số dư sẽ âm ({soDuSauCapNhat:N0}đ).";
            }
            else if (soDuSauHoanLai < dto.SoTien && (isChiTieuMoi || isChuyenKhoanMoi))
            {
                preview.CoLoi = true;
                preview.CanhBao = $"Không thể cập nhật. Số dư tạm ({soDuSauHoanLai:N0}đ) không đủ để chi {dto.SoTien:N0}đ.";
            }

            return preview;
        }
        catch (Exception ex)
        {
            preview.CoLoi = true;
            preview.ThongBao = $"Lỗi khi xem trước: {ex.Message}";
            return preview;
        }
    }

    public async Task<bool> XoaAsync(int giaoDichId, int nguoiDungId, CancellationToken ct = default)
    {
        try
        {
            var giaoDich = await _giaoDichDal.LayTheoIdAsync(giaoDichId, ct);
            if (giaoDich == null || giaoDich.NguoiDungId != nguoiDungId)
                return false;

            var taiKhoan = await _taiKhoanDal.LayTheoIdAsync(giaoDich.TaiKhoanNguonId ?? 0, ct);
            if (taiKhoan != null)
            {
                var loai = giaoDich.LoaiGiaoDich?.ToUpperInvariant() ?? "";
                var isChiTieu = loai == "CHI" || loai == "2";
                var isThuNhap = loai == "THU" || loai == "1";
                var isChuyenKhoan = loai == "CHUYEN_KHOAN" || loai == "3";

                if (isChiTieu)
                    await _taiKhoanDal.CapNhatSoDuAsync(giaoDich.TaiKhoanNguonId ?? 0, taiKhoan.SoDu + giaoDich.SoTien, ct);
                else if (isThuNhap)
                    await _taiKhoanDal.CapNhatSoDuAsync(giaoDich.TaiKhoanNguonId ?? 0, taiKhoan.SoDu - giaoDich.SoTien, ct);
                else if (isChuyenKhoan && giaoDich.TaiKhoanDichId.HasValue)
                {
                    await _taiKhoanDal.CapNhatSoDuAsync(giaoDich.TaiKhoanNguonId ?? 0, taiKhoan.SoDu + giaoDich.SoTien, ct);
                    var taiKhoanDich = await _taiKhoanDal.LayTheoIdAsync(giaoDich.TaiKhoanDichId.Value, ct);
                    if (taiKhoanDich != null)
                        await _taiKhoanDal.CapNhatSoDuAsync(giaoDich.TaiKhoanDichId.Value, taiKhoanDich.SoDu - giaoDich.SoTien, ct);
                }
            }

            var result = await _giaoDichDal.XoaAsync(giaoDichId, ct);

            if (result)
            {
                await GhiAuditLogAsync(nguoiDungId, giaoDichId, "DELETE", giaoDich, null);
                
                // Invalidate cache
                await _cache.RemoveAsync($"app:transaction:{giaoDichId}");
                await InvalidateUserCacheAsync(nguoiDungId);
            }

            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi xóa giao dịch ID {giaoDichId}: {ex.Message}", ex);
        }
    }

    // === CACHE HELPER ===
    private async Task InvalidateUserCacheAsync(int nguoiDungId)
    {
        // Invalidate dashboard cache
        await _cache.RemoveByPrefixAsync($"app:tong-quan:{nguoiDungId}");
        // Invalidate báo cáo cache
        await _cache.RemoveByPrefixAsync($"app:report:{nguoiDungId}");
        // Invalidate account balance cache
        await _cache.RemoveByPrefixAsync($"app:account:user:{nguoiDungId}");
    }

    // ============ Dashboard Stats - CACHE ============

    public async Task<int> DemTongGiaoDichHeThongAsync(CancellationToken ct = default)
    {
        var cacheKey = "admin:stats:total-transactions";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.DemTongGiaoDichHeThongAsync(ct),
            CacheExpirationOptions.ShortTerm // 5 phút
        );
    }

    public async Task<decimal> DemTongThuThangHienTaiAsync(CancellationToken ct = default)
    {
        var cacheKey = $"admin:stats:income:{DateTime.Now:yyyyMM}";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.DemTongThuThangHienTaiAsync(ct),
            CacheExpirationOptions.ShortTerm
        );
    }

    public async Task<decimal> DemTongChiThangHienTaiAsync(CancellationToken ct = default)
    {
        var cacheKey = $"admin:stats:expense:{DateTime.Now:yyyyMM}";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.DemTongChiThangHienTaiAsync(ct),
            CacheExpirationOptions.ShortTerm
        );
    }

    public async Task<List<ThongKeGiaoDichThangDto>> LayThongKe6ThangGanNhatAsync(CancellationToken ct = default)
    {
        var cacheKey = "admin:stats:6months";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.LayThongKe6ThangGanNhatAsync(ct),
            CacheExpirationOptions.ReportSimple // 15 phút
        );
    }

    public async Task<List<ChiTieuTheoDanhMucDto>> LayChiTieuTheoDanhMucAsync(int top = 6, CancellationToken ct = default)
    {
        var cacheKey = $"admin:stats:top-categories:{top}";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.LayChiTieuTheoDanhMucAsync(top, ct),
            CacheExpirationOptions.ReportSimple
        );
    }

    // ============ Báo cáo thống kê mở rộng ============

    public async Task<int> DemGiaoDichThanhCongAsync(CancellationToken ct = default)
    {
        var cacheKey = "admin:stats:success-count";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.DemGiaoDichThanhCongAsync(ct),
            CacheExpirationOptions.ShortTerm
        );
    }

    public async Task<int> DemGiaoDichLoiAsync(CancellationToken ct = default)
    {
        var cacheKey = "admin:stats:error-count";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.DemGiaoDichLoiAsync(ct),
            CacheExpirationOptions.ShortTerm
        );
    }

    public async Task<int> DemGiaoDichTheoNguonAsync(string nguon, CancellationToken ct = default)
    {
        var cacheKey = $"admin:stats:by-source:{nguon}";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.DemGiaoDichTheoNguonAsync(nguon, ct),
            CacheExpirationOptions.ShortTerm
        );
    }

    public async Task<List<GiaoDichTheoDanhMucDto>> LayGiaoDichTheoDanhMucFullAsync(CancellationToken ct = default)
    {
        var cacheKey = "admin:stats:categories-full";
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _giaoDichDal.LayGiaoDichTheoDanhMucFullAsync(ct),
            CacheExpirationOptions.ReportComplex // 30 phút
        );
    }

    // Admin methods - KHÔNG cache (có filter)
    public async Task<PagedResponse<AdminGiaoDichDto>> LayDanhSachAdminAsync(
        int page, int pageSize, int? userId, sbyte? loai,
        DateTime? tuNgay, DateTime? denNgay, string? q,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 200) pageSize = 200;

        return await _giaoDichDal.LayDanhSachAdminAsync(page, pageSize, userId, loai, tuNgay, denNgay, q, ct);
    }
}
