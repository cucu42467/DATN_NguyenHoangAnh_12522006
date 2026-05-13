using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;
using System.Diagnostics;

namespace DAL;

public class NganSachDal : INganSachDal
{
    private readonly AppDbContext _context;

    public NganSachDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<NganSachDto>> LayDanhSachAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default)
    {
        var data = await _context.TblNgansaches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NguoiDungId == nguoiDungId && x.Thang == thang && x.Nam == nam && x.TrangThai == 1)
            .OrderBy(x => x.DanhMuc.TenDanhMuc)
            .ToListAsync(ct);

        // Tính SoTienDaChi trực tiếp từ tbl_giaodich
        var tuNgay = new DateTime(nam, thang, 1);
        var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

        var chiTieuTheoDanhMuc = await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId
                        && x.NgayGiaoDich >= tuNgay
                        && x.NgayGiaoDich <= denNgay
                        && x.LoaiGiaoDich == 2  // Chi
                        && x.DanhMucId.HasValue)
            .GroupBy(x => x.DanhMucId)
            .Select(g => new { DanhMucId = g.Key, Tong = g.Sum(x => x.SoTien) })
            .ToListAsync(ct);

        var dictChiTieu = chiTieuTheoDanhMuc.ToDictionary(x => x.DanhMucId!.Value, x => x.Tong);

        return data.Select(x => {
            var soTienDaChi = dictChiTieu.TryGetValue(x.DanhMucId, out var tong) ? tong : 0m;
            return new NganSachDto
            {
                NganSachId = x.NganSachId,
                DanhMucId = x.DanhMucId,
                TenDanhMuc = x.DanhMuc.TenDanhMuc,
                HanMuc = x.SoTienToiDa,
                DaDung = soTienDaChi, // Tính trực tiếp từ tbl_giaodich
                Thang = x.Thang,
                Nam = x.Nam,
                Icon = x.DanhMuc.Icon,
                MauSac = x.DanhMuc.MauSac,
                // ← THÊM MỚI: 2 trường mới
                GhiChu = x.GhiChu,
                CanhBaoPhanTram = x.CanhBaoPhanTram
            };
        }).ToList();
    }

    public async Task<NganSachDto?> LayTheoIdAsync(int nganSachId, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblNgansaches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .FirstOrDefaultAsync(x => x.NganSachId == nganSachId && x.NguoiDungId == nguoiDungId, ct);
        
        if (entity == null) return null;
        
        // Tính SoTienDaChi trực tiếp từ tbl_giaodich
        var tuNgay = new DateTime(entity.Nam, entity.Thang, 1);
        var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

        var soTienDaChi = await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId
                        && x.DanhMucId == entity.DanhMucId
                        && x.NgayGiaoDich >= tuNgay
                        && x.NgayGiaoDich <= denNgay
                        && x.LoaiGiaoDich == 2) // Chi
            .SumAsync(x => (decimal?)x.SoTien, ct) ?? 0m;
        
        return new NganSachDto
        {
            NganSachId = entity.NganSachId,
            DanhMucId = entity.DanhMucId,
            TenDanhMuc = entity.DanhMuc.TenDanhMuc,
            HanMuc = entity.SoTienToiDa,
            DaDung = soTienDaChi, // Tính trực tiếp từ tbl_giaodich
            Thang = entity.Thang,
            Nam = entity.Nam,
            Icon = entity.DanhMuc.Icon,
            MauSac = entity.DanhMuc.MauSac,
            // ← THÊM MỚI: 2 trường mới
            GhiChu = entity.GhiChu,
            CanhBaoPhanTram = entity.CanhBaoPhanTram
        };
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, ThietLapNganSachDto dto, CancellationToken ct = default)
    {
        // 1 user + 1 danh muc + thang/nam chỉ nên có 1 budget
        var tonTai = await _context.TblNgansaches.AnyAsync(
            x => x.NguoiDungId == nguoiDungId && x.DanhMucId == dto.DanhMucId && x.Thang == dto.Thang && x.Nam == dto.Nam,
            ct);
        if (tonTai) throw new InvalidOperationException("Ngân sách danh mục này đã tồn tại trong tháng/năm đã chọn.");

        var entity = new TblNgansach
        {
            NguoiDungId = nguoiDungId,
            DanhMucId = dto.DanhMucId,
            SoTienToiDa = dto.HanMuc,
            Thang = dto.Thang,
            Nam = dto.Nam,
            SoTienDaChi = 0m,
            PhanTramDaDung = 0,
            TrangThai = 1
        };

        _context.TblNgansaches.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.NganSachId;
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, int nganSachId, ThietLapNganSachDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblNgansaches.FirstOrDefaultAsync(
            x => x.NganSachId == nganSachId && x.NguoiDungId == nguoiDungId,
            ct);
        if (entity == null) return false;

        // không cho đổi tháng/năm/danh mục sang record trùng
        var trung = await _context.TblNgansaches.AnyAsync(
            x => x.NganSachId != nganSachId
                 && x.NguoiDungId == nguoiDungId
                 && x.DanhMucId == dto.DanhMucId
                 && x.Thang == dto.Thang
                 && x.Nam == dto.Nam,
            ct);
        if (trung) throw new InvalidOperationException("Ngân sách bị trùng với một bản ghi khác trong cùng tháng/năm.");

        entity.DanhMucId = dto.DanhMucId;
        entity.SoTienToiDa = dto.HanMuc;
        entity.Thang = dto.Thang;
        entity.Nam = dto.Nam;

        if (entity.SoTienDaChi.HasValue && entity.SoTienToiDa > 0)
        {
            entity.PhanTramDaDung = (float)(entity.SoTienDaChi.Value / entity.SoTienToiDa * 100m);
        }

        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> CapNhatHanMucAsync(int nguoiDungId, int nganSachId, decimal hanMucMoi, CancellationToken ct = default)
    {
        Debug.WriteLine($"[CapNhatHanMuc] START - nguoiDungId={nguoiDungId}, nganSachId={nganSachId}, hanMucMoi={hanMucMoi}");
        Console.WriteLine($"[CapNhatHanMuc] START - nguoiDungId={nguoiDungId}, nganSachId={nganSachId}, hanMucMoi={hanMucMoi}");
        
        try
        {
            // Tính PhanTramDaDung
            var entity = await _context.TblNgansaches.FirstOrDefaultAsync(
                x => x.NganSachId == nganSachId && x.NguoiDungId == nguoiDungId,
                ct);
                
            Debug.WriteLine($"[CapNhatHanMuc] entity found: {entity != null}");
            if (entity != null)
            {
                Debug.WriteLine($"[CapNhatHanMuc] current SoTienToiDa: {entity.SoTienToiDa}");
            }
            
            if (entity == null) return false;

            var soTienDaChi = entity.SoTienDaChi ?? 0m;
            float phanTram = hanMucMoi > 0 ? (float)(soTienDaChi / hanMucMoi * 100m) : 0;
            Debug.WriteLine($"[CapNhatHanMuc] calculated PhanTramDaDung: {phanTram}");

            // Use ExecuteUpdateAsync for direct SQL update
            var affected = await _context.TblNgansaches
                .Where(x => x.NganSachId == nganSachId && x.NguoiDungId == nguoiDungId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.SoTienToiDa, hanMucMoi)
                    .SetProperty(x => x.PhanTramDaDung, phanTram),
                    ct);

            Debug.WriteLine($"[CapNhatHanMuc] rows affected: {affected}");

            // Verify: đọc lại từ DB để xác nhận
            var verify = await _context.TblNgansaches
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.NganSachId == nganSachId, ct);
            Debug.WriteLine($"[CapNhatHanMuc] Verify - SoTienToiDa after update: {verify?.SoTienToiDa}");
            Debug.WriteLine($"[CapNhatHanMuc] END - success: {affected > 0}");

            return affected > 0;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[CapNhatHanMuc] ERROR: {ex.Message}");
            Debug.WriteLine($"[CapNhatHanMuc] StackTrace: {ex.StackTrace}");
            throw;
        }
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default)
    {
        // Sử dụng ExecuteUpdateAsync để đảm bảo update được thực hiện trực tiếp xuống DB
        var affected = await _context.TblNgansaches
            .Where(x => x.NganSachId == nganSachId && x.NguoiDungId == nguoiDungId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.TrangThai, (sbyte)0),
                ct);
        
        return affected > 0;
    }

    // ============================================
    // Xử lý khi giao dịch thay đổi
    // ============================================

    /// <summary>
    /// Tính lại SoTienDaChi cho ngân sách dựa trên tổng chi tiêu thực tế trong tháng
    /// </summary>
    public async Task TinhLaiSoTienDaChiAsync(int nguoiDungId, int danhMucId, int thang, int nam, CancellationToken ct = default)
    {
        var tuNgay = new DateTime(nam, thang, 1);
        var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

        // Tính tổng chi tiêu thực tế từ tbl_giaodich
        var soTienDaChi = await _context.TblGiaodiches
            .Where(x => x.NguoiDungId == nguoiDungId
                        && x.DanhMucId == danhMucId
                        && x.NgayGiaoDich >= tuNgay
                        && x.NgayGiaoDich <= denNgay
                        && x.LoaiGiaoDich == 2  // Chi
                        && x.TrangThai == 1)    // Đang hiển thị
            .SumAsync(x => (decimal?)x.SoTien, ct) ?? 0m;

        await CapNhatSoTienDaChiAsync(nguoiDungId, danhMucId, thang, nam, soTienDaChi, ct);
    }

    /// <summary>
    /// Tạo ngân sách mới nếu chưa có, với hạn mức mặc định = 0
    /// </summary>
    public async Task<int> TaoMoiNeuChuaCoAsync(int nguoiDungId, int danhMucId, int thang, int nam, CancellationToken ct = default)
    {
        // Kiểm tra đã có chưa
        var tonTai = await _context.TblNgansaches.AnyAsync(
            x => x.NguoiDungId == nguoiDungId 
                 && x.DanhMucId == danhMucId 
                 && x.Thang == thang 
                 && x.Nam == nam 
                 && x.TrangThai == 1,
            ct);

        if (tonTai)
        {
            var existing = await _context.TblNgansaches
                .FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId 
                                         && x.DanhMucId == danhMucId 
                                         && x.Thang == thang 
                                         && x.Nam == nam, ct);
            return existing?.NganSachId ?? 0;
        }

        var entity = new TblNgansach
        {
            NguoiDungId = nguoiDungId,
            DanhMucId = danhMucId,
            SoTienToiDa = 0m,  // Hạn mức mặc định = 0
            Thang = thang,
            Nam = nam,
            SoTienDaChi = 0m,
            PhanTramDaDung = 0,
            TrangThai = 1
        };

        _context.TblNgansaches.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.NganSachId;
    }

    /// <summary>
    /// Cập nhật SoTienDaChi cho ngân sách
    /// </summary>
    public async Task CapNhatSoTienDaChiAsync(int nguoiDungId, int danhMucId, int thang, int nam, decimal soTienDaChiMoi, CancellationToken ct = default)
    {
        var entity = await _context.TblNgansaches
            .FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId 
                                    && x.DanhMucId == danhMucId 
                                    && x.Thang == thang 
                                    && x.Nam == nam 
                                    && x.TrangThai == 1, ct);

        if (entity == null)
        {
            // Tạo mới nếu chưa có
            var id = await TaoMoiNeuChuaCoAsync(nguoiDungId, danhMucId, thang, nam, ct);
            if (id > 0)
            {
                // Cập nhật SoTienDaChi cho bản ghi vừa tạo
                await _context.TblNgansaches
                    .Where(x => x.NganSachId == id)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.SoTienDaChi, soTienDaChiMoi),
                        ct);

                // Tính lại PhanTramDaDung (ngân sách mới có SoTienToiDa = 0)
                await _context.TblNgansaches
                    .Where(x => x.NganSachId == id && x.SoTienToiDa > 0)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.PhanTramDaDung, 0f),
                        ct);
            }
            return;
        }

        // Cập nhật SoTienDaChi cho bản ghi hiện tại
        await _context.TblNgansaches
            .Where(x => x.NganSachId == entity.NganSachId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.SoTienDaChi, soTienDaChiMoi),
                ct);

        // Tính lại PhanTramDaDung
        if (entity.SoTienToiDa > 0)
        {
            await _context.TblNgansaches
                .Where(x => x.NganSachId == entity.NganSachId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.PhanTramDaDung, (float)(soTienDaChiMoi / entity.SoTienToiDa * 100m)),
                    ct);
        }
    }

    // ============ Dashboard Stats ============

    public async Task<List<CanhBaoNganSachAdminDto>> LayCanhBaoVuotMucAsync(CancellationToken ct = default)
    {
        var data = await _context.TblNgansaches
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .Include(x => x.DanhMuc)
            .Where(x => x.SoTienToiDa > 0 && x.PhanTramDaDung > 100)
            .OrderByDescending(x => x.PhanTramDaDung)
            .Take(10)
            .ToListAsync(ct);

        return data.Select(x => new CanhBaoNganSachAdminDto
        {
            NguoiDungId = x.NguoiDungId,
            HoTen = x.NguoiDung?.HoTen ?? "Không rõ",
            TenDanhMuc = x.DanhMuc?.TenDanhMuc ?? "Không rõ",
            PhanTramDaDung = (double)(x.PhanTramDaDung ?? 0),
            ThangNam = $"T{x.Thang}/{x.Nam}"
        }).ToList();
    }

    // Thông báo tự động - lấy tất cả ngân sách của user
    public async Task<List<NganSachDto>> GetByNguoiDungIdAsync(int nguoiDungId)
    {
        var data = await _context.TblNgansaches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NguoiDungId == nguoiDungId && x.TrangThai == 1)
            .ToListAsync();

        return data.Select(x => new NganSachDto
        {
            NganSachId = x.NganSachId,
            DanhMucId = x.DanhMucId,
            TenDanhMuc = x.DanhMuc?.TenDanhMuc ?? "",
            HanMuc = x.SoTienToiDa,
            DaDung = x.SoTienDaChi ?? 0,
            Thang = x.Thang,
            Nam = x.Nam,
            Icon = x.DanhMuc?.Icon,
            MauSac = x.DanhMuc?.MauSac,
            GhiChu = x.GhiChu,
            CanhBaoPhanTram = x.CanhBaoPhanTram
        }).ToList();
    }

    // Tổng chi tiêu theo ngân sách trong khoảng thời gian
    public async Task<decimal> TongChiTieuAsync(int nganSachId, DateTime tuNgay, DateTime denNgay)
    {
        var nganSach = await _context.TblNgansaches
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.NganSachId == nganSachId);

        if (nganSach == null) return 0;

        return await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nganSach.NguoiDungId
                        && x.DanhMucId == nganSach.DanhMucId
                        && x.NgayGiaoDich >= tuNgay
                        && x.NgayGiaoDich <= denNgay
                        && x.LoaiGiaoDich == 2)
            .SumAsync(x => (decimal?)x.SoTien) ?? 0m;
    }
}

