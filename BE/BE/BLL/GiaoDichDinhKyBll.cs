using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class GiaoDichDinhKyBll : IGiaoDichDinhKyBll
{
    private readonly IGiaoDichDinhKyDal _dal;
    private readonly IAuditLogDal _auditLogDal;

    public GiaoDichDinhKyBll(IGiaoDichDinhKyDal dal, IAuditLogDal auditLogDal)
    {
        _dal = dal;
        _auditLogDal = auditLogDal;
    }

    private async Task GhiAuditLogAsync(int? nguoiDungId, int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_giaodich_dinhky",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<List<GiaoDichDinhKyDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayDanhSachAsync(nguoiDungId, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy danh sách giao dịch định kỳ của người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, TaoGiaoDichDinhKyDto dto, CancellationToken ct = default)
    {
        try
        {
            var id = await _dal.TaoMoiAsync(nguoiDungId, dto, ct);
            await GhiAuditLogAsync(nguoiDungId, id, "INSERT", null, dto);
            return id;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tạo giao dịch định kỳ mới: {ex.Message}", ex);
        }
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, int id, TaoGiaoDichDinhKyDto dto, CancellationToken ct = default)
    {
        try
        {
            var gdkHienTai = await _dal.LayTheoIdAsync(id, nguoiDungId, ct);
            if (gdkHienTai == null) return false;

            var result = await _dal.CapNhatAsync(nguoiDungId, id, dto, ct);
            if (result)
                await GhiAuditLogAsync(nguoiDungId, id, "UPDATE", gdkHienTai, dto);
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi cập nhật giao dịch định kỳ ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        try
        {
            var gdk = await _dal.LayTheoIdAsync(id, nguoiDungId, ct);
            if (gdk == null) return false;

            var result = await _dal.XoaAsync(nguoiDungId, id, ct);
            if (result)
                await GhiAuditLogAsync(nguoiDungId, id, "DELETE", gdk, null);
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi xóa giao dịch định kỳ ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<int> DemDangHoatDongAsync(CancellationToken ct)
    {
        return await _dal.DemDangHoatDongAsync(ct);
    }

    public async Task<int> DemNgungHoatDongAsync(CancellationToken ct)
    {
        return await _dal.DemNgungHoatDongAsync(ct);
    }

    public async Task<int> DemNguoiDungSuDungAsync(CancellationToken ct)
    {
        return await _dal.DemNguoiDungSuDungAsync(ct);
    }
}

