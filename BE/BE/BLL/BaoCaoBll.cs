using BLL.Interfaces;
using DAL.Interfaces;
using DTO;
using Common;

namespace BLL;

/// <summary>
/// Business Logic Layer cho Báo cáo - sử dụng MemoryCache để tối ưu hiệu năng
/// </summary>
public class BaoCaoBll : IBaoCaoBll
{
    private readonly IBaoCaoDal _dal;
    private readonly ICacheService _cache;

    public BaoCaoBll(IBaoCaoDal dal, ICacheService cache)
    {
        _dal = dal ?? throw new ArgumentNullException(nameof(dal));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    public async Task<BaoCaoTongHopChiSoDto> LayTongHopChiSoAsync(int nguoiDungId, string duration, int? thang, int? nam, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        try
        {
            // Tạo cache key duy nhất cho request này
            var cacheKey = CacheKeys.BaoCaoTongHop(nguoiDungId, duration ?? "month", thang, nam);

            // Sử dụng GetOrSet pattern - lấy từ cache hoặc gọi DB nếu không có
            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayTongHopChiSoAsync(nguoiDungId, duration, thang, nam, tuNgay, denNgay, ct),
                CacheExpirationOptions.MediumTerm  // Cache 10 phút
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy tổng hợp chỉ số báo cáo: {ex.Message}", ex);
        }
    }

    public async Task<BaoCaoTongQuanDto> LayBieuDoTongQuanAsync(int nguoiDungId, string duration, int? thang, int? nam, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        try
        {
            // Biểu đồ thường ít thay đổi - cache lâu hơn
            var cacheKey = $"app:chart:tong-quan:{nguoiDungId}:{duration}:{thang}:{nam}";

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayBieuDoTongQuanAsync(nguoiDungId, duration, thang, nam, tuNgay, denNgay, ct),
                CacheExpirationOptions.ReportComplex  // Cache 30 phút
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy biểu đồ tổng quan: {ex.Message}", ex);
        }
    }

    public async Task<PhanBoDanhMucDto> LayPhanBoDanhMucAsync(int nguoiDungId, string duration, int? thang, int? nam, string loai, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        try
        {
            // Phân bổ danh mục thay đổi theo tháng - cache ngắn hơn
            var cacheKey = $"app:chart:phan-bo:{nguoiDungId}:{loai}:{thang}:{nam}";

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayPhanBoDanhMucAsync(nguoiDungId, duration, thang, nam, loai, tuNgay, denNgay, ct),
                CacheExpirationOptions.ReportSimple  // Cache 15 phút
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy phân bổ danh mục: {ex.Message}", ex);
        }
    }

    public async Task<AdminTongQuanDto> LayTongQuanAdminAsync(CancellationToken ct = default)
    {
        try
        {
            // Dashboard admin - cache ngắn vì dữ liệu hay thay đổi
            var cacheKey = "app:admin:dashboard";

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayTongQuanAdminAsync(ct),
                CacheExpirationOptions.ShortTerm  // Cache 5 phút
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy tổng quan admin: {ex.Message}", ex);
        }
    }

    public async Task<TangTruongUserDto> LayTangTruongUserAsync(int? nam = null, string? duration = null, DateTime? tuNgay = null, DateTime? denNgay = null, CancellationToken ct = default)
    {
        try
        {
            var cacheKey = $"app:admin:growth:{nam}:{duration}";

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayTangTruongUserAsync(nam, duration, tuNgay, denNgay, ct),
                CacheExpirationOptions.ReportComplex
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy tăng trưởng user: {ex.Message}", ex);
        }
    }

    public async Task<DongBoKetQuaDto> DongBoNganSachAsync(int? nguoiDungId = null, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        try
        {
            // Đồng bộ = thay đổi data → KHÔNG cache, invalidate sau khi đồng bộ
            var result = await _dal.DongBoNganSachAsync(nguoiDungId, thang, nam, ct);

            // Invalidate các cache liên quan đến ngân sách
            if (nguoiDungId.HasValue)
            {
                await _cache.RemoveAsync(CacheKeys.NganSachAll(nguoiDungId.Value));
                // Invalidate báo cáo ngân sách của user
                await _cache.RemoveByPrefixAsync($"app:report:budget:user:{nguoiDungId.Value}");
            }
            else
            {
                // Invalidate tất cả cache ngân sách
                await _cache.RemoveByPrefixAsync("app:budget:");
                await _cache.RemoveByPrefixAsync("app:report:budget:");
            }

            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi đồng bộ ngân sách: {ex.Message}", ex);
        }
    }

    public async Task<DongBoKetQuaDto> DongBoTongHopThangAsync(int? nguoiDungId = null, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        try
        {
            var result = await _dal.DongBoTongHopThangAsync(nguoiDungId, thang, nam, ct);

            // Invalidate cache tổng hợp
            if (nguoiDungId.HasValue)
            {
                await _cache.RemoveByPrefixAsync($"app:report:summary:{nguoiDungId.Value}");
            }
            else
            {
                await _cache.RemoveByPrefixAsync("app:report:");
            }

            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi đồng bộ tổng hợp tháng: {ex.Message}", ex);
        }
    }

    public async Task<DongBoKetQuaDto> KiemTraLechAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default)
    {
        try
        {
            return await _dal.KiemTraLechAsync(nguoiDungId, thang, nam, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi kiểm tra lệch: {ex.Message}", ex);
        }
    }

    // Các API báo cáo mới - sử dụng cache
    public async Task<BaoCaoTaiKhoanDto> LayBaoCaoTaiKhoanAsync(int nguoiDungId, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        try
        {
            var cacheKey = CacheKeys.BaoCaoTaiKhoan(nguoiDungId, thang, nam);

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayBaoCaoTaiKhoanAsync(nguoiDungId, thang, nam, ct),
                CacheExpirationOptions.MediumTermWithAbsolute.Sliding
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy báo cáo tài khoản: {ex.Message}", ex);
        }
    }

    public async Task<BaoCaoDanhMucDto> LayBaoCaoDanhMucAsync(int nguoiDungId, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        try
        {
            var cacheKey = CacheKeys.BaoCaoDanhMuc(nguoiDungId, thang, nam);

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayBaoCaoDanhMucAsync(nguoiDungId, thang, nam, ct),
                CacheExpirationOptions.MediumTerm
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy báo cáo danh mục: {ex.Message}", ex);
        }
    }

    public async Task<BaoCaoNganSachDto> LayBaoCaoNganSachAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default)
    {
        try
        {
            var cacheKey = CacheKeys.BaoCaoNganSach(nguoiDungId, thang, nam);

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayBaoCaoNganSachAsync(nguoiDungId, thang, nam, ct),
                CacheExpirationOptions.ReportSimple
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy báo cáo ngân sách: {ex.Message}", ex);
        }
    }

    public async Task<BaoCaoMucTieuDto> LayBaoCaoMucTieuAsync(int nguoiDungId, CancellationToken ct = default)
    {
        try
        {
            var cacheKey = CacheKeys.BaoCaoMucTieu(nguoiDungId);

            return await _cache.GetOrSetAsync(
                cacheKey,
                async () => await _dal.LayBaoCaoMucTieuAsync(nguoiDungId, ct),
                CacheExpirationOptions.MediumTerm
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy báo cáo mục tiêu: {ex.Message}", ex);
        }
    }
}
