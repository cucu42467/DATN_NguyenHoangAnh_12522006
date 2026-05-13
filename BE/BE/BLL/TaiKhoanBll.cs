using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

/// <summary>
/// Business Logic Layer cho TaiKhoan - có cache
/// </summary>
public class TaiKhoanBll : ITaiKhoanBll
{
    private readonly ITaiKhoanDal _taiKhoanDal;
    private readonly IAuditLogDal _auditLogDal;
    private readonly ICacheService _cache;

    public TaiKhoanBll(ITaiKhoanDal taiKhoanDal, IAuditLogDal auditLogDal, ICacheService cache)
    {
        _taiKhoanDal = taiKhoanDal;
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
                TenBang = "tbl_taikhoan",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<List<TaiKhoanDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.TaiKhoanAll(nguoiDungId);
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _taiKhoanDal.LayDanhSachTheoNguoiDungAsync(nguoiDungId, ct),
            CacheExpirationOptions.MediumTerm // 10 phút
        );
    }

    public async Task<TaiKhoanDto?> LayChiTietAsync(int taiKhoanId, int nguoiDungId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.TaiKhoan(taiKhoanId);
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                var taiKhoan = await _taiKhoanDal.LayTheoIdAsync(taiKhoanId, ct);
                if (taiKhoan == null || taiKhoan.NguoiDungId != nguoiDungId) return null;
                return taiKhoan;
            },
            CacheExpirationOptions.MediumTerm
        );
    }

    public async Task<int> TaoMoiAsync(TaoTaiKhoanDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        var id = await _taiKhoanDal.TaoMoiAsync(dto, nguoiDungId, ct);
        await GhiAuditLogAsync(nguoiDungId, id, "INSERT", null, dto);
        
        // Xóa cache danh sách
        await _cache.RemoveAsync(CacheKeys.TaiKhoanAll(nguoiDungId));
        
        return id;
    }

    public async Task<bool> CapNhatAsync(int taiKhoanId, TaoTaiKhoanDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        Console.WriteLine($"[DEBUG BLL] CapNhatAsync - ID: {taiKhoanId}, dto: {System.Text.Json.JsonSerializer.Serialize(dto)}");
        var taiKhoanHienTai = await _taiKhoanDal.LayTheoIdAsync(taiKhoanId, ct);
        Console.WriteLine($"[DEBUG BLL] TaiKhoanHienTai: {taiKhoanHienTai != null}");

        if (taiKhoanHienTai == null || taiKhoanHienTai.NguoiDungId != nguoiDungId)
            return false;

        var result = await _taiKhoanDal.CapNhatAsync(taiKhoanId, dto, nguoiDungId, ct);
        Console.WriteLine($"[DEBUG BLL] CapNhatAsync result: {result}");
        
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, taiKhoanId, "UPDATE", taiKhoanHienTai, dto);
            
            // Xóa cache
            await _cache.RemoveAsync(CacheKeys.TaiKhoan(taiKhoanId));
            await _cache.RemoveAsync(CacheKeys.TaiKhoanAll(nguoiDungId));
        }
        
        return result;
    }

    public async Task<bool> XoaAsync(int taiKhoanId, int nguoiDungId, CancellationToken ct = default)
    {
        var taiKhoan = await _taiKhoanDal.LayTheoIdAsync(taiKhoanId, ct);
        if (taiKhoan == null || taiKhoan.NguoiDungId != nguoiDungId)
            return false;

        var result = await _taiKhoanDal.XoaAsync(taiKhoanId, nguoiDungId, ct);
        
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, taiKhoanId, "DELETE", taiKhoan, null);
            
            // Xóa cache
            await _cache.RemoveAsync(CacheKeys.TaiKhoan(taiKhoanId));
            await _cache.RemoveAsync(CacheKeys.TaiKhoanAll(nguoiDungId));
        }
        
        return result;
    }

    public async Task<bool> CapNhatTrangThaiAsync(int taiKhoanId, int nguoiDungId, int trangThai, CancellationToken ct = default)
    {
        var result = await _taiKhoanDal.CapNhatTrangThaiAsync(taiKhoanId, nguoiDungId, trangThai, ct);
        
        if (result)
        {
            await _cache.RemoveAsync(CacheKeys.TaiKhoan(taiKhoanId));
            await _cache.RemoveAsync(CacheKeys.TaiKhoanAll(nguoiDungId));
        }
        
        return result;
    }
}
