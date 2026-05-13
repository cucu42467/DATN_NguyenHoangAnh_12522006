using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class ImportDal : IImportDal
{
    private readonly AppDbContext _context;

    public ImportDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> TaoImportAsync(int nguoiDungId, int taiKhoanId, string? tenFile, int tongDong, CancellationToken ct = default)
    {
        var entity = new TblImportFile
        {
            NguoiDungId = nguoiDungId,
            TaiKhoanId = taiKhoanId,
            TenFile = tenFile,
            NgayImport = TimeHelper.NowInVietnam(),
            TongDong = tongDong,
            SoDongThanhCong = 0,
            SoDongLoi = 0,
            TrangThai = 0 // 0=processing/draft
        };

        _context.TblImportFiles.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.ImportId;
    }

    public async Task<ImportFileDto?> LayImportAsync(int nguoiDungId, int importId, CancellationToken ct = default)
    {
        var entity = await _context.TblImportFiles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.ImportId == importId && x.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return null;

        return new ImportFileDto
        {
            ImportId = entity.ImportId,
            TaiKhoanId = entity.TaiKhoanId,
            TenFile = entity.TenFile,
            NgayImport = entity.NgayImport,
            TongDong = entity.TongDong ?? 0,
            SoDongThanhCong = entity.SoDongThanhCong ?? 0,
            SoDongLoi = entity.SoDongLoi ?? 0,
            TrangThai = entity.TrangThai ?? 0
        };
    }

    public async Task<List<ImportChiTietDto>> LayChiTietAsync(int nguoiDungId, int importId, LocImportChiTietDto loc, CancellationToken ct = default)
    {
        if (loc.Page < 1) loc.Page = 1;
        if (loc.PageSize < 1) loc.PageSize = 20;
        if (loc.PageSize > 200) loc.PageSize = 200;

        var owner = await _context.TblImportFiles.AsNoTracking()
            .AnyAsync(x => x.ImportId == importId && x.NguoiDungId == nguoiDungId, ct);
        if (!owner) return new List<ImportChiTietDto>();

        var query = _context.TblImportChitiets
            .AsNoTracking()
            .Where(x => x.ImportId == importId);

        if (loc.TrangThaiXuLy.HasValue)
            query = query.Where(x => x.TrangThaiXuLy == loc.TrangThaiXuLy.Value);

        var data = await query
            .OrderByDescending(x => x.Id)
            .Skip((loc.Page - 1) * loc.PageSize)
            .Take(loc.PageSize)
            .ToListAsync(ct);

        return data.Select(x => new ImportChiTietDto
        {
            Id = x.Id,
            ImportId = x.ImportId,
            NgayGiaoDich = x.NgayGiaoDich,
            MoTa = x.MoTa,
            SoTien = x.SoTien,
            DanhMucGoiY = x.DanhMucGoiY,
            DoTinCay = x.DoTinCay,
            TrangThaiXuLy = x.TrangThaiXuLy ?? 0,
            GhiChuLoi = x.GhiChuLoi,
            CapNhatLuc = x.CapNhatLuc
        }).ToList();
    }

    public async Task<int> ThemChiTietAsync(int nguoiDungId, int importId, IEnumerable<ImportChiTietDto> chiTiet, CancellationToken ct = default)
    {
        var owner = await _context.TblImportFiles
            .AnyAsync(x => x.ImportId == importId && x.NguoiDungId == nguoiDungId, ct);
        if (!owner) throw new InvalidOperationException("Import không tồn tại.");

        var list = chiTiet.Select(x => new TblImportChitiet
        {
            ImportId = importId,
            NgayGiaoDich = x.NgayGiaoDich,
            MoTa = x.MoTa,
            SoTien = x.SoTien,
            DanhMucGoiY = x.DanhMucGoiY,
            DoTinCay = x.DoTinCay,
            TrangThaiXuLy = x.TrangThaiXuLy,
            GhiChuLoi = x.GhiChuLoi,
            CapNhatLuc = TimeHelper.NowInVietnam()
        }).ToList();

        _context.TblImportChitiets.AddRange(list);
        return await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> CapNhatTrangThaiImportAsync(int nguoiDungId, int importId, sbyte trangThai, CancellationToken ct = default)
    {
        var entity = await _context.TblImportFiles
            .FirstOrDefaultAsync(x => x.ImportId == importId && x.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return false;

        entity.TrangThai = trangThai;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DanhDauChiTietDaXuLyAsync(int nguoiDungId, int importId, sbyte trangThaiXuLy, CancellationToken ct = default)
    {
        var owner = await _context.TblImportFiles
            .AnyAsync(x => x.ImportId == importId && x.NguoiDungId == nguoiDungId, ct);
        if (!owner) return false;

        var rows = await _context.TblImportChitiets
            .Where(x => x.ImportId == importId)
            .ToListAsync(ct);

        foreach (var r in rows)
        {
            r.TrangThaiXuLy = trangThaiXuLy;
            r.CapNhatLuc = TimeHelper.NowInVietnam();
        }

        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<ImportFileDto>> LayDanhSachAdminAsync(int page, int pageSize, sbyte? trangThai, CancellationToken ct = default)
    {
        var query = _context.TblImportFiles.AsNoTracking().AsQueryable();
        if (trangThai.HasValue) query = query.Where(x => x.TrangThai == trangThai.Value);

        var data = await query
            .OrderByDescending(x => x.NgayImport)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return data.Select(x => new ImportFileDto
        {
            ImportId = x.ImportId,
            TaiKhoanId = x.TaiKhoanId,
            TenFile = x.TenFile,
            NgayImport = x.NgayImport,
            TongDong = x.TongDong ?? 0,
            SoDongThanhCong = x.SoDongThanhCong ?? 0,
            SoDongLoi = x.SoDongLoi ?? 0,
            TrangThai = x.TrangThai ?? 0
        }).ToList();
    }

    public async Task<List<ImportChiTietDto>> LayChiTietAdminAsync(int importId, int page, int pageSize, CancellationToken ct = default)
    {
        var data = await _context.TblImportChitiets.AsNoTracking()
            .Where(x => x.ImportId == importId)
            .OrderByDescending(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return data.Select(x => new ImportChiTietDto
        {
            Id = x.Id,
            ImportId = x.ImportId,
            NgayGiaoDich = x.NgayGiaoDich,
            MoTa = x.MoTa,
            SoTien = x.SoTien,
            DanhMucGoiY = x.DanhMucGoiY,
            DoTinCay = x.DoTinCay,
            TrangThaiXuLy = x.TrangThaiXuLy ?? 0,
            GhiChuLoi = x.GhiChuLoi,
            CapNhatLuc = x.CapNhatLuc
        }).ToList();
    }
}
