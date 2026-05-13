using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class LoaiTaiKhoanBll : ILoaiTaiKhoanBll
{
    private readonly ILoaiTaiKhoanDal _dal;
    private readonly IAuditLogDal _auditLogDal;

    public LoaiTaiKhoanBll(ILoaiTaiKhoanDal dal, IAuditLogDal auditLogDal)
    {
        _dal = dal;
        _auditLogDal = auditLogDal;
    }

    private async Task GhiAuditLogAsync(int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                TenBang = "tbl_loaitaikhoan",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<List<LoaiTaiKhoanDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return await _dal.LayDanhSachAsync(ct);
    }

    public async Task<LoaiTaiKhoanDto?> LayChiTietAsync(int id, CancellationToken ct = default)
    {
        return await _dal.LayTheoIdAsync(id, ct);
    }

    public async Task<int> TaoMoiAsync(TaoLoaiTaiKhoanDto dto, CancellationToken ct = default)
    {
        var id = await _dal.TaoMoiAsync(dto, ct);
        await GhiAuditLogAsync(id, "INSERT", null, dto);
        return id;
    }

    public async Task<bool> CapNhatAsync(int id, TaoLoaiTaiKhoanDto dto, CancellationToken ct = default)
    {
        var loaiHienTai = await _dal.LayTheoIdAsync(id, ct);
        var result = await _dal.CapNhatAsync(id, dto, ct);
        if (result && loaiHienTai != null)
            await GhiAuditLogAsync(id, "UPDATE", loaiHienTai, dto);
        return result;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var loai = await _dal.LayTheoIdAsync(id, ct);
        var result = await _dal.XoaAsync(id, ct);
        if (result && loai != null)
            await GhiAuditLogAsync(id, "DELETE", loai, null);
        return result;
    }
}
