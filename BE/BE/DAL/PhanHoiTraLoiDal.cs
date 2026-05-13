using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class PhanHoiTraLoiDal : IPhanHoiTraLoiDal
{
    private readonly AppDbContext _context;

    public PhanHoiTraLoiDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PhanHoiTraloiDto>> LayDanhSachTheoPhanHoiIdAsync(int phanHoiId, CancellationToken ct = default)
    {
        var list = await _context.TblPhanhoiTralois
            .AsNoTracking()
            .Include(x => x.NguoiGui)
                .ThenInclude(ng => ng!.TblNguoidungVaitros)
            .Where(x => x.PhanHoiId == phanHoiId)
            .OrderBy(x => x.NgayGui)
            .ToListAsync(ct);

        return list.Select(MapToDto).ToList();
    }

    public async Task<int> TaoTraLoiAsync(int phanHoiId, int nguoiGuiId, string noiDung, CancellationToken ct = default)
    {
        var traLoi = new TblPhanhoiTraloi
        {
            PhanHoiId = phanHoiId,
            NguoiGuiId = nguoiGuiId,
            NoiDung = noiDung.Trim(),
            NgayGui = TimeHelper.NowInVietnam()
        };

        _context.TblPhanhoiTralois.Add(traLoi);
        await _context.SaveChangesAsync(ct);

        // Cập nhật trạng thái phản hồi thành "Đã giải quyết" (2)
        var phanHoi = await _context.TblPhanhois.FindAsync(new object[] { phanHoiId }, ct);
        if (phanHoi != null)
        {
            phanHoi.TrangThai = 2;
            await _context.SaveChangesAsync(ct);
        }

        return traLoi.TraLoiId;
    }

    public async Task<int> DemTraLoiChuaDocAsync(int nguoiDungId, CancellationToken ct = default)
    {
        // Đếm các phản hồi có câu trả lời mà người dùng chưa đọc
        // (Những phản hồi có trạ thái = 2 và có câu trả lời từ admin)
        var count = await _context.TblPhanhois
            .AsNoTracking()
            .Include(x => x.TblPhanhoiTralois)
            .Where(x => x.NguoiDungId == nguoiDungId 
                && x.TrangThai == 2 
                && x.TblPhanhoiTralois.Any())
            .CountAsync(ct);

        return count;
    }

    private static PhanHoiTraloiDto MapToDto(TblPhanhoiTraloi entity)
    {
        return new PhanHoiTraloiDto
        {
            TraLoiId = entity.TraLoiId,
            PhanHoiId = entity.PhanHoiId,
            NguoiGuiId = entity.NguoiGuiId,
            TenNguoiGui = entity.NguoiGui?.HoTen,
            LaAdmin = entity.NguoiGui?.TblNguoidungVaitros?.Any(v => v.VaiTroId == 1) ?? false,
            NoiDung = entity.NoiDung,
            NgayGui = entity.NgayGui,
            DaDoc = entity.DaDoc
        };
    }

    public async Task<List<PhanHoiDto>> LayDanhSachPhanHoiCuaToiAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var danhSach = await _context.TblPhanhois
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .Include(x => x.TblPhanhoiTralois)
            .Where(x => x.NguoiDungId == nguoiDungId)
            .OrderByDescending(x => x.NgayTao)
            .ToListAsync(ct);

        return danhSach.Select(x => new PhanHoiDto
        {
            PhanHoiId = x.PhanHoiId,
            NguoiDungId = x.NguoiDungId,
            TenNguoiDung = x.NguoiDung?.HoTen,
            TieuDe = x.TieuDe,
            NoiDung = x.NoiDung,
            TrangThai = x.TrangThai,
            TrangThaiText = GetTrangThaiText(x.TrangThai),
            NgayTao = x.NgayTao,
            SoCauTraLoi = x.TblPhanhoiTralois.Count,
            SoCauTraLoiChuaDoc = x.TblPhanhoiTralois.Count(tl => !tl.DaDoc && tl.NguoiGuiId != nguoiDungId)
        }).ToList();
    }

    public async Task<bool> DanhDauDaDocAsync(int phanHoiId, int nguoiDungId, CancellationToken ct = default)
    {
        // Đánh dấu tất cả câu trả lời trong phản hồi này là đã đọc
        // (trừ những câu trả lời do chính người dùng gửi)
        var count = await _context.TblPhanhoiTralois
            .Where(x => x.PhanHoiId == phanHoiId && x.NguoiGuiId != nguoiDungId)
            .ExecuteUpdateAsync(x => x.SetProperty(t => t.DaDoc, true), ct);

        return count >= 0;
    }

    public async Task<bool> DanhDauTatCaDaDocAsync(int nguoiDungId, CancellationToken ct = default)
    {
        // Lấy danh sách PhanHoiId của người dùng
        var phanHoiIds = await _context.TblPhanhois
            .Where(x => x.NguoiDungId == nguoiDungId)
            .Select(x => x.PhanHoiId)
            .ToListAsync(ct);

        if (!phanHoiIds.Any())
            return true;

        // Đánh dấu tất cả câu trả lời là đã đọc (trừ của chính user)
        var count = await _context.TblPhanhoiTralois
            .Where(x => phanHoiIds.Contains(x.PhanHoiId) && x.NguoiGuiId != nguoiDungId)
            .ExecuteUpdateAsync(x => x.SetProperty(t => t.DaDoc, true), ct);

        return count >= 0;
    }

    private static string GetTrangThaiText(sbyte trangThai)
    {
        return trangThai switch
        {
            0 => "Chờ xử lý",
            1 => "Đang xử lý",
            2 => "Đã giải quyết",
            3 => "Từ chối",
            _ => "Không xác định"
        };
    }
}
