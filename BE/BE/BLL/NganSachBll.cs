using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Models.Data;
using Models;

namespace BLL;

/// <summary>
/// Business Logic Layer cho NganSach - có cache
/// </summary>
public class NganSachBll : INganSachBll
{
    private readonly INganSachDal _nganSachDal;
    private readonly IAuditLogDal _auditLogDal;
    private readonly IServiceProvider _serviceProvider;
    private readonly ICacheService _cache;

    public NganSachBll(
        INganSachDal nganSachDal, 
        IAuditLogDal auditLogDal, 
        IServiceProvider serviceProvider,
        ICacheService cache)
    {
        _nganSachDal = nganSachDal;
        _auditLogDal = auditLogDal;
        _serviceProvider = serviceProvider;
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    private async Task GhiAuditLogAsync(int? nguoiDungId, int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_ngansach",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<List<NganSachDto>> LayDanhSachAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default)
    {
        var cacheKey = $"app:budget:user:{nguoiDungId}:list:{thang}:{nam}";
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _nganSachDal.LayDanhSachAsync(nguoiDungId, thang, nam, ct),
            CacheExpirationOptions.MediumTerm // 10 phút
        );
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, ThietLapNganSachDto dto, CancellationToken ct = default)
    {
        var id = await _nganSachDal.TaoMoiAsync(nguoiDungId, dto, ct);
        await GhiAuditLogAsync(nguoiDungId, id, "INSERT", null, dto);
        
        // Xóa cache
        await InvalidateUserNganSachCacheAsync(nguoiDungId);
        
        return id;
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, int nganSachId, ThietLapNganSachDto dto, CancellationToken ct = default)
    {
        var nganSachHienTai = await _nganSachDal.LayTheoIdAsync(nganSachId, nguoiDungId, ct);
        if (nganSachHienTai == null) return false;

        var result = await _nganSachDal.CapNhatAsync(nguoiDungId, nganSachId, dto, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, nganSachId, "UPDATE", nganSachHienTai, dto);
            
            // Xóa cache
            await InvalidateUserNganSachCacheAsync(nguoiDungId);
        }
        return result;
    }

    public async Task<bool> CapNhatHanMucAsync(int nguoiDungId, int nganSachId, decimal hanMucMoi, CancellationToken ct = default)
    {
        var nganSachHienTai = await _nganSachDal.LayTheoIdAsync(nganSachId, nguoiDungId, ct);
        if (nganSachHienTai == null) return false;

        var result = await _nganSachDal.CapNhatHanMucAsync(nguoiDungId, nganSachId, hanMucMoi, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, nganSachId, "UPDATE_HANMUC", nganSachHienTai.HanMuc, hanMucMoi);
            
            // Xóa cache
            await InvalidateUserNganSachCacheAsync(nguoiDungId);
        }
        return result;
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default)
    {
        var nganSach = await _nganSachDal.LayTheoIdAsync(nganSachId, nguoiDungId, ct);
        if (nganSach == null) return false;

        var result = await _nganSachDal.XoaAsync(nguoiDungId, nganSachId, ct);
        if (result)
        {
            await GhiAuditLogAsync(nguoiDungId, nganSachId, "DELETE", nganSach, null);
            
            // Xóa cache
            await InvalidateUserNganSachCacheAsync(nguoiDungId);
        }
        return result;
    }

    public async Task<NganSachDto?> LayChiTietAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.NganSach(nguoiDungId, nganSachId, 0); // thang/nam = 0 cho chi tiết
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _nganSachDal.LayTheoIdAsync(nganSachId, nguoiDungId, ct),
            CacheExpirationOptions.MediumTerm
        );
    }

    public async Task<List<GiaoDichDto>> LayGiaoDichTheoNganSachAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default)
    {
        // KHÔNG cache vì query có filter phức tạp
        var nganSach = await _nganSachDal.LayTheoIdAsync(nganSachId, nguoiDungId, ct);
        if (nganSach == null)
            throw new InvalidOperationException("Không tìm thấy ngân sách");

        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<Models.Data.AppDbContext>();

        var giaoDichList = await context.TblGiaodiches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NguoiDungId == nguoiDungId
                && x.DanhMucId == nganSach.DanhMucId
                && x.NgayGiaoDich.Month == nganSach.Thang
                && x.NgayGiaoDich.Year == nganSach.Nam
                && (x.LoaiGiaoDich == 2))
            .OrderByDescending(x => x.NgayGiaoDich)
            .ToListAsync(ct);

        return giaoDichList.Select(x => new GiaoDichDto
        {
            GiaoDichId = x.GiaoDichId,
            SoTien = x.SoTien,
            GhiChu = x.MoTa,
            NgayGiaoDich = x.NgayGiaoDich,
            LoaiGiaoDich = x.LoaiGiaoDich.ToString(),
            TenDanhMuc = x.DanhMuc?.TenDanhMuc,
            TrangThai = x.TrangThai
        }).ToList();
    }

    // ============ Dashboard Stats ============

    public async Task<List<CanhBaoNganSachAdminDto>> LayCanhBaoVuotMucAsync(CancellationToken ct = default)
        => await _nganSachDal.LayCanhBaoVuotMucAsync(ct);

    private async Task InvalidateUserNganSachCacheAsync(int nguoiDungId)
    {
        // Xóa cache ngân sách của user trong vài tháng gần đây
        var now = DateTime.Now;
        for (int i = -1; i <= 3; i++)
        {
            var d = now.AddMonths(i);
            var cacheKey = $"app:budget:user:{nguoiDungId}:list:{d.Month}:{d.Year}";
            await _cache.RemoveAsync(cacheKey);
        }
    }
}
