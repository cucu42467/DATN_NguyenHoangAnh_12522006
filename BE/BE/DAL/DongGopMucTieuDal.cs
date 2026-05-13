using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class DongGopMucTieuDal : IDongGopMucTieuDal
{
    private readonly AppDbContext _context;

    public DongGopMucTieuDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<DongGopMucTieuDto>> LayDanhSachAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        var tonTai = await _context.TblMuctieus.AnyAsync(
            x => x.MucTieuId == mucTieuId && x.NguoiDungId == nguoiDungId,
            ct);
        if (!tonTai) return new List<DongGopMucTieuDto>();

        var data = await _context.TblDonggopMuctieus
            .AsNoTracking()
            .Where(x => x.MucTieuId == mucTieuId)
            .OrderByDescending(x => x.NgayDongGop ?? DateTime.MinValue)
            .ThenByDescending(x => x.Id)
            .ToListAsync(ct);

        return data.Select(x => new DongGopMucTieuDto
        {
            Id = x.Id,
            MucTieuId = x.MucTieuId,
            SoTien = x.SoTien,
            NgayDongGop = x.NgayDongGop,
            GhiChu = x.GhiChu
        }).ToList();
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, int mucTieuId, TaoDongGopMucTieuDto dto, CancellationToken ct = default)
    {
        var mucTieu = await _context.TblMuctieus
            .FirstOrDefaultAsync(x => x.MucTieuId == mucTieuId && x.NguoiDungId == nguoiDungId, ct);
        if (mucTieu == null) throw new InvalidOperationException("Không tìm thấy mục tiêu.");

        // Load tài khoản nếu có
        if (mucTieu.TaiKhoanId.HasValue)
        {
            var taiKhoan = await _context.TblTaikhoans
                .FirstOrDefaultAsync(x => x.TaiKhoanId == mucTieu.TaiKhoanId.Value, ct);
            
            if (taiKhoan == null) throw new InvalidOperationException("Không tìm thấy tài khoản liên kết.");
            
            if (taiKhoan.SoDu < dto.SoTien)
                throw new InvalidOperationException("Số dư tài khoản không đủ.");
            
            taiKhoan.SoDu -= dto.SoTien;
            _context.Entry(taiKhoan).State = EntityState.Modified;
        }

        var entity = new TblDonggopMuctieu
        {
            MucTieuId = mucTieuId,
            SoTien = dto.SoTien,
            NgayDongGop = dto.NgayDongGop ?? TimeHelper.NowInVietnam(),
            GhiChu = dto.GhiChu
        };

        _context.TblDonggopMuctieus.Add(entity);

        mucTieu.SoTienHienTai = (mucTieu.SoTienHienTai ?? 0m) + dto.SoTien;
        _context.Entry(mucTieu).State = EntityState.Modified;
        
        if (mucTieu.SoTienHienTai >= mucTieu.SoTienMucTieu)
            mucTieu.TrangThai = 2; // completed

        await _context.SaveChangesAsync(ct);
        return entity.Id;
    }
}

