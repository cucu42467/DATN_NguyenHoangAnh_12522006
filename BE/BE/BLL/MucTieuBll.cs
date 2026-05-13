using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

/// <summary>
/// Business Logic Layer cho MucTieu - có cache
/// </summary>
public class MucTieuBll : IMucTieuBll
{
    private readonly IMucTieuDal _mucTieuDal;
    private readonly IDongGopMucTieuDal _dongGopDal;
    private readonly IAuditLogDal _auditLogDal;
    private readonly ICacheService _cache;

    public MucTieuBll(
        IMucTieuDal mucTieuDal, 
        IDongGopMucTieuDal dongGopDal, 
        IAuditLogDal auditLogDal,
        ICacheService cache)
    {
        _mucTieuDal = mucTieuDal;
        _dongGopDal = dongGopDal;
        _auditLogDal = auditLogDal;
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
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

    public async Task<List<MucTieuDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.MucTieuAll(nguoiDungId);
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _mucTieuDal.LayDanhSachAsync(nguoiDungId, ct),
            CacheExpirationOptions.MediumTerm // 10 phút
        );
    }

    public async Task<MucTieuDto?> LayChiTietAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.MucTieu(mucTieuId);
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _mucTieuDal.LayChiTietAsync(nguoiDungId, mucTieuId, ct),
            CacheExpirationOptions.MediumTerm
        );
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, TaoMucTieuDto dto, CancellationToken ct = default)
    {
        var id = await _mucTieuDal.TaoMoiAsync(nguoiDungId, dto, ct);
        await GhiAuditLogAsync(nguoiDungId, id, "tbl_muctieu", "INSERT", null, dto);
        
        // Xóa cache
        await _cache.RemoveAsync(CacheKeys.MucTieuAll(nguoiDungId));
        
        return id;
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, int mucTieuId, TaoMucTieuDto dto, CancellationToken ct = default)
    {
        var mucTieuHienTai = await _mucTieuDal.LayChiTietAsync(nguoiDungId, mucTieuId, ct);
        if (mucTieuHienTai == null) return false;

        var result = await _mucTieuDal.CapNhatAsync(nguoiDungId, mucTieuId, dto, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, mucTieuId, "tbl_muctieu", "UPDATE", mucTieuHienTai, dto);
            
            // Xóa cache
            await _cache.RemoveAsync(CacheKeys.MucTieu(mucTieuId));
            await _cache.RemoveAsync(CacheKeys.MucTieuAll(nguoiDungId));
        }
        return result;
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        var mucTieu = await _mucTieuDal.LayChiTietAsync(nguoiDungId, mucTieuId, ct);
        if (mucTieu == null) return false;

        var result = await _mucTieuDal.XoaAsync(nguoiDungId, mucTieuId, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, mucTieuId, "tbl_muctieu", "HIDE", mucTieu, null);
            
            // Xóa cache
            await _cache.RemoveAsync(CacheKeys.MucTieu(mucTieuId));
            await _cache.RemoveAsync(CacheKeys.MucTieuAll(nguoiDungId));
        }
        return result;
    }

    public async Task<bool> XoaVinhVienAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        var mucTieu = await _mucTieuDal.LayChiTietAsync(nguoiDungId, mucTieuId, ct);
        if (mucTieu == null) return false;

        var result = await _mucTieuDal.XoaVinhVienAsync(nguoiDungId, mucTieuId, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, mucTieuId, "tbl_muctieu", "DELETE_PERMANENT", mucTieu, null);
            
            // Xóa cache
            await _cache.RemoveAsync(CacheKeys.MucTieu(mucTieuId));
            await _cache.RemoveAsync(CacheKeys.MucTieuAll(nguoiDungId));
        }
        return result;
    }

    public async Task<List<DongGopMucTieuDto>> LayDanhSachDongGopAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        // KHÔNG cache vì có thể thay đổi thường xuyên
        return await _dongGopDal.LayDanhSachAsync(nguoiDungId, mucTieuId, ct);
    }

    public async Task<int> TaoDongGopAsync(int nguoiDungId, int mucTieuId, TaoDongGopMucTieuDto dto, CancellationToken ct = default)
    {
        var id = await _dongGopDal.TaoMoiAsync(nguoiDungId, mucTieuId, dto, ct);
        await GhiAuditLogAsync(nguoiDungId, id, "tbl_donggop_muctieu", "INSERT", null, dto);
        
        // Xóa cache mục tiêu vì đã thêm đóng góp
        await _cache.RemoveAsync(CacheKeys.MucTieu(mucTieuId));
        await _cache.RemoveAsync(CacheKeys.MucTieuAll(nguoiDungId));
        
        return id;
    }
}
