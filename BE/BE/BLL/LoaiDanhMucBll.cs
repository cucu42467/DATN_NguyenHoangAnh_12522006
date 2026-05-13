using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class LoaiDanhMucBll : ILoaiDanhMucBll
{
    private readonly ILoaiDanhMucDal _loaiDanhMucDal;
    private readonly IAuditLogDal _auditLogDal;

    public LoaiDanhMucBll(ILoaiDanhMucDal loaiDanhMucDal, IAuditLogDal auditLogDal)
    {
        _loaiDanhMucDal = loaiDanhMucDal;
        _auditLogDal = auditLogDal;
    }

    private async Task GhiAuditLogAsync(int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                TenBang = "tbl_loaidanhmuc",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<List<LoaiDanhMucDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        try
        {
            return await _loaiDanhMucDal.LayDanhSachAsync(ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy danh sách loại danh mục: {ex.Message}", ex);
        }
    }

    public async Task<LoaiDanhMucDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        try
        {
            return await _loaiDanhMucDal.LayTheoIdAsync(id, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy loại danh mục ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<LoaiDanhMucDto?> LayTheoDanhMucIdAsync(int danhMucId, CancellationToken ct = default)
    {
        try
        {
            return await _loaiDanhMucDal.LayTheoDanhMucIdAsync(danhMucId, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy loại danh mục theo DanhMucId {danhMucId}: {ex.Message}", ex);
        }
    }

    public async Task<int> TaoMoiAsync(TaoLoaiDanhMucDto dto, CancellationToken ct = default)
    {
        try
        {
            var id = await _loaiDanhMucDal.TaoMoiAsync(dto, ct);
            await GhiAuditLogAsync(id, "INSERT", null, dto);
            return id;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tạo loại danh mục mới: {ex.Message}", ex);
        }
    }

    public async Task<bool> CapNhatAsync(int id, TaoLoaiDanhMucDto dto, CancellationToken ct = default)
    {
        try
        {
            var loaiHienTai = await _loaiDanhMucDal.LayTheoIdAsync(id, ct);
            var result = await _loaiDanhMucDal.CapNhatAsync(id, dto, ct);
            if (result && loaiHienTai != null)
                await GhiAuditLogAsync(id, "UPDATE", loaiHienTai, dto);
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi cập nhật loại danh mục ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        try
        {
            var loai = await _loaiDanhMucDal.LayTheoIdAsync(id, ct);
            var result = await _loaiDanhMucDal.XoaAsync(id, ct);
            if (result && loai != null)
                await GhiAuditLogAsync(id, "DELETE", loai, null);
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi xóa loại danh mục ID {id}: {ex.Message}", ex);
        }
    }
}

