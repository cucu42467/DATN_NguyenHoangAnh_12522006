using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;
using System.Globalization;

namespace DAL;

public class DanhMucDal : IDanhMucDal
{
    private readonly AppDbContext _context;

    public DanhMucDal(Models.Data.AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<DanhMucDto>> LayDanhSachTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default)
    {
        // Chỉ lấy danh mục: TrangThai = 1 (Hiển thị) và DaXoa = 0 (Chưa xóa)
        var data = await _context.TblDanhmucs
            .Where(d => (d.NguoiDungId == nguoiDungId || d.NguoiDungId == null) 
                && (d.DaXoa == 0 || d.DaXoa == null)
                && d.TrangThai == 1) // Chỉ lấy danh mục hiển thị
            .ToListAsync(ct);

        return MapToDto(data);
    }

    public async Task<List<DanhMucDto>> LayDanhSachHeThongAsync(CancellationToken ct = default)
    {
        // Chỉ lấy danh mục hệ thống: TrangThai = 1 (Hiển thị) và DaXoa = 0 (Chưa xóa)
        var data = await _context.TblDanhmucs
            .Where(d => d.NguoiDungId == null 
                && (d.DaXoa == 0 || d.DaXoa == null)
                && d.TrangThai == 1)
            .ToListAsync(ct);

        return MapToDto(data);
    }

    public async Task<DanhMucDto?> LayTheoIdAsync(int danhMucId, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblDanhmucs
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.DanhMucId == danhMucId && (d.NguoiDungId == nguoiDungId || d.NguoiDungId == null) && (d.DaXoa == 0 || d.DaXoa == null), ct);

        if (entity == null) return null;
        return MapToDto(entity);
    }

    public async Task<int> TaoMoiAsync(TaoDanhMucDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        // Kiểm tra trùng tên danh mục (cùng loại, cùng người dùng)
        var trungTen = await _context.TblDanhmucs.AnyAsync(
            d => d.TenDanhMuc.ToLower() == dto.TenDanhMuc.ToLower().Trim()
                 && d.LoaiDanhMucId == ChuyenLoaiDanhMuc(dto.LoaiDanhMuc)
                 && (d.NguoiDungId == nguoiDungId || d.NguoiDungId == null)
                 && d.DaXoa == 0,
            ct);
        if (trungTen)
            throw new InvalidOperationException("Tên danh mục đã tồn tại. Vui lòng chọn tên khác.");

        var loaiDanhMucId = ChuyenLoaiDanhMuc(dto.LoaiDanhMuc);
        var danhMuc = new TblDanhmuc
        {
            TenDanhMuc = dto.TenDanhMuc.Trim(),
            MoTa = dto.MoTa,  // ← THÊM MỚI
            MauSac = dto.MauSac,
            Icon = string.IsNullOrWhiteSpace(dto.Icon) ? null : dto.Icon.Trim(),
            LoaiDanhMucId = loaiDanhMucId,
            DanhMucChaId = dto.ChaId,
            NguoiDungId = nguoiDungId,
            CapDo = dto.CapDo.HasValue ? (sbyte?)dto.CapDo.Value : (sbyte?)1,
            DuongDan = dto.DuongDan,
            DaXoa = 0,
            TrangThai = 0 // Mặc định = 0 (đợi xét duyệt từ admin)
        };

        _context.TblDanhmucs.Add(danhMuc);
        await _context.SaveChangesAsync(ct);
        return danhMuc.DanhMucId;
    }

    public async Task<bool> CapNhatAsync(int danhMucId, TaoDanhMucDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblDanhmucs.FirstOrDefaultAsync(
            x => x.DanhMucId == danhMucId && x.NguoiDungId == nguoiDungId,
            ct);
        if (entity == null) return false;

        entity.TenDanhMuc = dto.TenDanhMuc;
        entity.MoTa = dto.MoTa;  // ← THÊM MỚI
        entity.MauSac = dto.MauSac;
        entity.Icon = dto.Icon;
        entity.DanhMucChaId = dto.ChaId;
        entity.LoaiDanhMucId = ChuyenLoaiDanhMuc(dto.LoaiDanhMuc);
        if (dto.CapDo.HasValue)
        {
            entity.CapDo = (sbyte?)dto.CapDo.Value;
        }
        entity.DuongDan = dto.DuongDan;

        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int danhMucId, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblDanhmucs.FirstOrDefaultAsync(
            x => x.DanhMucId == danhMucId && x.NguoiDungId == nguoiDungId,
            ct);
        if (entity == null) return false;

        // Xóa mềm
        entity.DaXoa = 1;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> CapNhatThuTuAsync(int danhMucId, int thuTuMoi, int nguoiDungId, CancellationToken ct = default)
    {
        // Chỉ cho phép cập nhật thứ tự danh mục CÁ NHÂN (NguoiDungId = nguoiDungId)
        var entity = await _context.TblDanhmucs.FirstOrDefaultAsync(
            x => x.DanhMucId == danhMucId && x.NguoiDungId == nguoiDungId,
            ct);
        if (entity == null) return false;

        entity.ThuTu = thuTuMoi;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private DanhMucDto MapToDto(TblDanhmuc entity)
    {
        return new DanhMucDto
        {
            DanhMucId = entity.DanhMucId,
            TenDanhMuc = entity.TenDanhMuc,
            MoTa = entity.MoTa,  // ← THÊM MỚI
            MauSac = entity.MauSac,
            LoaiDanhMuc = entity.LoaiDanhMucId == 1 ? "THU" : "CHI",
            LoaiDanhMucId = entity.LoaiDanhMucId,
            ChaId = entity.DanhMucChaId,
            Icon = string.IsNullOrWhiteSpace(entity.Icon)
                ? null
                : (entity.Icon.Trim().StartsWith("/ICON/", StringComparison.OrdinalIgnoreCase)
                    ? entity.Icon.Trim()
                    : $"/ICON/{entity.Icon.Trim().TrimStart('/')}"),
            LaHeThong = entity.NguoiDungId == null,
            CapDo = entity.CapDo,
            DuongDan = entity.DuongDan,
            ThuTu = entity.ThuTu ?? 0
        };
    }

    private List<DanhMucDto> MapToDto(List<TblDanhmuc> entities)
    {
        return entities.Select(e => MapToDto(e)).ToList();
    }

    private static int ChuyenLoaiDanhMuc(string loaiDanhMuc)
    {
        // DB: tbl_loai_danhmuc: 1=Thu nhập, 2=Chi tiêu
        // FE: "THU" | "CHI"
        if (string.IsNullOrWhiteSpace(loaiDanhMuc)) return 2;
        var v = loaiDanhMuc.Trim();
        if (int.TryParse(v, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id))
            return id;
        if (v.Equals("THU", StringComparison.OrdinalIgnoreCase)) return 1;
        if (v.Equals("CHI", StringComparison.OrdinalIgnoreCase)) return 2;
        return 2;
    }
}

