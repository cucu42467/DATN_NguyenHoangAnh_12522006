using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

/// <summary>
/// Business Logic Layer cho DanhMuc - có cache
/// </summary>
public class DanhMucBll : IDanhMucBll
{
    private readonly IDanhMucDal _danhMucDal;
    private readonly IAuditLogDal _auditLogDal;
    private readonly ICacheService _cache;

    public DanhMucBll(IDanhMucDal danhMucDal, IAuditLogDal auditLogDal, ICacheService cache)
    {
        _danhMucDal = danhMucDal;
        _auditLogDal = auditLogDal;
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    private async Task GhiAuditLogAsync(int? nguoiDungId, int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_danhmuc",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<List<DanhMucDto>> LayDanhSachAsync(int nguoiDungId, int? loaiDanhMucId = null, bool includeChildren = false, CancellationToken ct = default)
    {
        // Cache key dựa theo user (ko filter theo loai vì filter ở memory)
        var cacheKey = CacheKeys.DanhMucAll(nguoiDungId);
        
        var data = await _cache.GetOrSetAsync(
            cacheKey,
            () => _danhMucDal.LayDanhSachTheoNguoiDungAsync(nguoiDungId, ct),
            CacheExpirationOptions.ReferenceData // 2 giờ - danh mục ít thay đổi
        );

        if (loaiDanhMucId.HasValue)
        {
            data = data.Where(x => x.LoaiDanhMucId == loaiDanhMucId.Value).ToList();
        }

        _ = includeChildren;

        return data;
    }

    public async Task<DanhMucDto?> LayTheoIdAsync(int danhMucId, int nguoiDungId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.DanhMuc(danhMucId);
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _danhMucDal.LayTheoIdAsync(danhMucId, nguoiDungId, ct),
            CacheExpirationOptions.ReferenceData
        );
    }

    public async Task<int> TaoMoiAsync(TaoDanhMucDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        var id = await _danhMucDal.TaoMoiAsync(dto, nguoiDungId, ct);
        await GhiAuditLogAsync(nguoiDungId, id, "INSERT", null, dto);
        
        // Xóa cache danh sách
        await _cache.RemoveAsync(CacheKeys.DanhMucAll(nguoiDungId));
        
        return id;
    }

    public async Task<bool> CapNhatAsync(int danhMucId, TaoDanhMucDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        var danhMucHienTai = await _danhMucDal.LayTheoIdAsync(danhMucId, nguoiDungId, ct);
        if (danhMucHienTai == null) return false;

        var result = await _danhMucDal.CapNhatAsync(danhMucId, dto, nguoiDungId, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, danhMucId, "UPDATE", danhMucHienTai, dto);
            
            // Xóa cache
            await _cache.RemoveAsync(CacheKeys.DanhMuc(danhMucId));
            await _cache.RemoveAsync(CacheKeys.DanhMucAll(nguoiDungId));
        }
        return result;
    }

    public async Task<bool> XoaAsync(int danhMucId, int nguoiDungId, CancellationToken ct = default)
    {
        var danhMuc = await _danhMucDal.LayTheoIdAsync(danhMucId, nguoiDungId, ct);
        if (danhMuc == null) return false;

        var result = await _danhMucDal.XoaAsync(danhMucId, nguoiDungId, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, danhMucId, "DELETE", danhMuc, null);
            
            // Xóa cache
            await _cache.RemoveAsync(CacheKeys.DanhMuc(danhMucId));
            await _cache.RemoveAsync(CacheKeys.DanhMucAll(nguoiDungId));
        }
        return result;
    }

    public async Task<bool> CapNhatThuTuAsync(int danhMucId, int thuTuMoi, int nguoiDungId, CancellationToken ct = default)
    {
        var result = await _danhMucDal.CapNhatThuTuAsync(danhMucId, thuTuMoi, nguoiDungId, ct);
        
        if (result)
        {
            await _cache.RemoveAsync(CacheKeys.DanhMucAll(nguoiDungId));
        }
        
        return result;
    }
}
