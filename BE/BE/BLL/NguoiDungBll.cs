using System.Text.Json;
using Common;
using BLL.Interfaces;
using DAL;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class NguoiDungBll : INguoiDungBll
{
    private readonly INguoiDungDal _dal;
    private readonly INguoiDungVaitroDal _vaiTroDal;
    private readonly INguoiDungSocialDal _socialDal;
    private readonly ITaiKhoanDal _taiKhoanDal;
    private readonly IGiaoDichDal _giaoDichDal;
    private readonly ICaiDatDal _caiDatDal;
    private readonly IXacThucBll _xacThucBll;
    private readonly IAuditLogDal _auditLogDal;

    public NguoiDungBll(
        INguoiDungDal dal,
        INguoiDungVaitroDal vaiTroDal,
        INguoiDungSocialDal socialDal,
        ITaiKhoanDal taiKhoanDal,
        IGiaoDichDal giaoDichDal,
        ICaiDatDal caiDatDal,
        IXacThucBll xacThucBll,
        IAuditLogDal auditLogDal)
    {
        _dal = dal;
        _vaiTroDal = vaiTroDal;
        _socialDal = socialDal;
        _taiKhoanDal = taiKhoanDal;
        _giaoDichDal = giaoDichDal;
        _caiDatDal = caiDatDal;
        _xacThucBll = xacThucBll;
        _auditLogDal = auditLogDal;
    }

    private async Task GhiAuditLogAsync(int? nguoiDungId, int? banGhiId, string tenBang, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = nguoiDungId,
                TenBang = tenBang,
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    // === USER PROFILE (API_ND) ===
    public async Task<NguoiDungMeDto?> LayMeAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _dal.LayMeAsync(nguoiDungId, ct);
    }

    public async Task<bool> CapNhatMeAsync(int nguoiDungId, CapNhatNguoiDungMeDto dto, CancellationToken ct = default)
    {
        var nguoiDungCu = await _dal.LayMeAsync(nguoiDungId, ct);
        var result = await _dal.CapNhatMeAsync(nguoiDungId, dto, ct);
        if (result && nguoiDungCu != null)
            await GhiAuditLogAsync(nguoiDungId, nguoiDungId, "tbl_nguoidung", "UPDATE", nguoiDungCu, dto);
        return result;
    }

    public async Task<bool> DoiMatKhauAsync(int nguoiDungId, DoiMatKhauDto dto, CancellationToken ct = default)
    {
        var result = await _dal.DoiMatKhauAsync(nguoiDungId, dto, ct);
        if (result)
            await GhiAuditLogAsync(nguoiDungId, nguoiDungId, "tbl_nguoidung", "CHANGE_PASSWORD", null, new { ThoiGian = TimeHelper.NowInVietnam() });
        return result;
    }

    // === ADMIN (API_QT) ===
    public async Task<PagedResponse<NguoiDungDto>> LayDanhSachAdminAsync(
        int page = 1,
        int pageSize = 10,
        LocNguoiDungFilter? filter = null,
        CancellationToken ct = default)
    {
        var result = await _dal.LayDanhSachAdminAsync(page, pageSize, filter, ct);

        return new PagedResponse<NguoiDungDto>
        {
            Items = result.Items,
            Page = page,
            PageSize = pageSize,
            TotalCount = result.TotalCount
        };
    }

    public async Task<NguoiDungDto?> LayChiTietAdminAsync(int id, CancellationToken ct = default)
        => await _dal.LayTheoIdAsync(id, ct);

    public async Task<NguoiDungChiTietDto?> LayChiTietAdminFullAsync(int id, CancellationToken ct = default)
        => await _dal.LayChiTietAdminFullAsync(id, ct);

    public async Task<int> TaoMoiAsync(TaoNguoiDungAdminDto dto, CancellationToken ct = default)
    {
        // Kiểm tra email đã tồn tại chưa
        var existing = await _dal.LayTheoEmailAsync(dto.Email, ct);
        if (existing != null)
            throw new InvalidOperationException("Email đã được sử dụng bởi người dùng khác");

        var nguoiDungId = await _dal.TaoMoiAdminAsync(dto, ct);

        // Gán vai trò
        if (dto.VaiTroId > 0)
        {
            await _vaiTroDal.GanVaiTroAsync(nguoiDungId, dto.VaiTroId, ct);
        }

        await GhiAuditLogAsync(null, nguoiDungId, "tbl_nguoidung", "INSERT", null, dto);
        return nguoiDungId;
    }

    public async Task<bool> CapNhatAdminAsync(int id, CapNhatNguoiDungAdminDto dto, CancellationToken ct = default)
    {
        var nguoiDungCu = await _dal.LayTheoIdAsync(id, ct);
        var result = await _dal.CapNhatAdminAsync(id, dto, ct);

        if (result && nguoiDungCu != null)
        {
            await GhiAuditLogAsync(null, id, "tbl_nguoidung", "UPDATE", nguoiDungCu, dto);

            // Cập nhật vai trò nếu có
            if (dto.VaiTroId.HasValue)
            {
                await _vaiTroDal.GanVaiTroAsync(id, dto.VaiTroId.Value, ct);
                await GhiAuditLogAsync(null, id, "tbl_nguoidung_vaitro", "UPDATE", null, new { VaiTroId = dto.VaiTroId });
            }
        }

        return result;
    }

    public async Task<bool> CapNhatVaiTroAsync(int id, string vaiTro, CancellationToken ct = default)
    {
        var nguoiDung = await _dal.LayTheoIdAsync(id, ct);
        if (nguoiDung == null) return false;

        var vaiTroEntity = await _vaiTroDal.LayTheoTenAsync(vaiTro, ct);
        if (vaiTroEntity == null) return false;

        await _vaiTroDal.GanVaiTroAsync(id, vaiTroEntity.VaiTroId, ct);
        await GhiAuditLogAsync(null, id, "tbl_nguoidung_vaitro", "UPDATE", null, new { VaiTro = vaiTro });

        return true;
    }

    public async Task<bool> KhoaTaiKhoanAsync(int id, bool khoa, string? lyDo = null, CancellationToken ct = default)
    {
        var nguoiDung = await _dal.LayTheoIdAsync(id, ct);
        var result = await _xacThucBll.KhoaTaiKhoanAsync(id, khoa);

        if (result && nguoiDung != null)
        {
            await GhiAuditLogAsync(null, id, "tbl_nguoidung", khoa ? "LOCK" : "UNLOCK", nguoiDung, new { BiKhoa = khoa, LyDo = lyDo });
        }

        return result;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var nguoiDung = await _dal.LayTheoIdAsync(id, ct);
        var result = await _dal.XoaAsync(id, ct);

        if (result && nguoiDung != null)
            await GhiAuditLogAsync(null, id, "tbl_nguoidung", "DELETE", nguoiDung, null);

        return result;
    }

    public async Task<int> KhoaNhieuAsync(List<int> ids, string lyDo, CancellationToken ct = default)
    {
        var count = 0;
        foreach (var id in ids)
        {
            var result = await KhoaTaiKhoanAsync(id, true, lyDo, ct);
            if (result) count++;
        }
        return count;
    }

    public async Task<int> MoKhoaNhieuAsync(List<int> ids, CancellationToken ct = default)
    {
        var count = 0;
        foreach (var id in ids)
        {
            var result = await KhoaTaiKhoanAsync(id, false, null, ct);
            if (result) count++;
        }
        return count;
    }

    public async Task<bool> GuiEmailResetMatKhauAsync(string email, CancellationToken ct = default)
    {
        var nguoiDung = await _dal.LayTheoEmailAsync(email, ct);
        if (nguoiDung == null) return false;

        await _xacThucBll.GuiEmailDatLaiMatKhauAsync(email, ct);
        await GhiAuditLogAsync(null, nguoiDung.NguoiDungId, "tbl_nguoidung", "RESET_PASSWORD_REQUEST", null, new { Email = email });

        return true;
    }

    public async Task<PagedResponse<LichSuDangNhapDto>> LayLichSuDangNhapAsync(int nguoiDungId, int page, int pageSize, CancellationToken ct = default)
    {
        return await _dal.LayLichSuDangNhapAsync(nguoiDungId, page, pageSize, ct);
    }

    // ============ Dashboard Stats ============

    public async Task<int> DemNguoiDungHoatDongAsync(CancellationToken ct = default)
        => await _dal.DemNguoiDungHoatDongAsync(ct);

    public async Task<int> DemNguoiDungMoi7NgayAsync(CancellationToken ct = default)
        => await _dal.DemNguoiDungMoi7NgayAsync(ct);

    public async Task<int> DemNguoiDungBiVoHieuHoaAsync(CancellationToken ct = default)
        => await _dal.DemNguoiDungBiVoHieuHoaAsync(ct);

    public async Task<ThongKeNguoiDungDto> LayThongKeTangTruongNguoiDungAsync(int nam, CancellationToken ct = default)
        => await _dal.LayThongKeTangTruongNguoiDungAsync(nam, ct);

    public async Task<ThongKeTongQuanNguoiDungDto> LayThongKeTongQuanAsync(CancellationToken ct = default)
        => await _dal.LayThongKeTongQuanAsync(ct);

    public async Task<ThongKeTongQuanNguoiDungDto> LayThongKeTheoLocAsync(LocNguoiDungFilter filter, CancellationToken ct = default)
        => await _dal.LayThongKeTheoLocAsync(filter, ct);

    public async Task<byte[]> XuatExcelAsync(LocNguoiDungFilter? filter, CancellationToken ct = default)
        => await _dal.XuatExcelAsync(filter, ct);

    // ============ Báo cáo thống kê mở rộng ============

    public async Task<int> DemTongNguoiDungAsync(CancellationToken ct = default)
        => await _dal.DemTongNguoiDungAsync(ct);

    public async Task<int> DemNguoiDungDaXoaAsync(CancellationToken ct = default)
        => await _dal.DemNguoiDungDaXoaAsync(ct);

    public async Task<int> DemEmailDaXacThucAsync(CancellationToken ct = default)
        => await _dal.DemEmailDaXacThucAsync(ct);

    public async Task<int> DemSDTDaXacThucAsync(CancellationToken ct = default)
        => await _dal.DemSDTDaXacThucAsync(ct);

    public async Task<int> DemDang2FAAsync(CancellationToken ct = default)
        => await _dal.DemDang2FAAsync(ct);

    public async Task<int> DemSocialProviderAsync(string provider, CancellationToken ct = default)
        => await _dal.DemSocialProviderAsync(provider, ct);

    public async Task<int> DemNguoiDungMoiTheoNgayAsync(DateTime date, CancellationToken ct = default)
        => await _dal.DemNguoiDungMoiTheoNgayAsync(date, ct);

    public async Task<int> DemNguoiDungMoiTheoTuanAsync(DateTime weekStart, CancellationToken ct = default)
        => await _dal.DemNguoiDungMoiTheoTuanAsync(weekStart, ct);

    public async Task<int> DemNguoiDungMoiTheoThangAsync(int month, int year, CancellationToken ct = default)
        => await _dal.DemNguoiDungMoiTheoThangAsync(month, year, ct);

    public async Task<List<NguoiDungDto>> LayNguoiDungKhongHoatDongAsync(DateTime cutoffDate, CancellationToken ct = default)
        => await _dal.LayNguoiDungKhongHoatDongAsync(cutoffDate, ct);
}
