using DAL;
using DTO;
using Models;
using BLL.Interfaces;
using DAL.Interfaces;


namespace BLL;

public class LichsuDangnhapBll : ILichsuDangnhapBll
{
    private readonly ILichsuDangnhapDal _lichsuDal;

    public LichsuDangnhapBll(ILichsuDangnhapDal lichsuDal)
    {
        _lichsuDal = lichsuDal;
    }

    public async Task<List<LichSuDangNhapDto>> LayTatCaAsync(
        CancellationToken huyBo = default)
    {
        var ds = await _lichsuDal.LayTatCaAsync(huyBo);

        return ds.Select(MapDto).ToList();
    }

    public async Task<List<LichSuDangNhapDto>> LayTheoNguoiDungAsync(
        int nguoiDungId,
        CancellationToken huyBo = default)
    {
        var ds = await _lichsuDal.LayTheoNguoiDungAsync(
            nguoiDungId,
            huyBo);

        return ds.Select(MapDto).ToList();
    }

    public async Task<LichSuDangNhapDto?> LayTheoIdAsync(
        int id,
        CancellationToken huyBo = default)
    {
        var item = await _lichsuDal.LayTheoIdAsync(id, huyBo);

        if (item == null)
            return null;

        return MapDto(item);
    }

    public async Task<List<LichSuDangNhapDto>> LayPhanTrangAsync(
        int page,
        int pageSize,
        CancellationToken huyBo = default)
    {
        var ds = await _lichsuDal.LayPhanTrangAsync(
            page,
            pageSize,
            huyBo);

        return ds.Select(MapDto).ToList();
    }

    public async Task<List<LichSuDangNhapDto>> LayTheoNguoiDungPhanTrangAsync(
        int nguoiDungId,
        int page,
        int pageSize,
        CancellationToken huyBo = default)
    {
        var ds = await _lichsuDal.LayTheoNguoiDungPhanTrangAsync(
            nguoiDungId,
            page,
            pageSize,
            huyBo);

        return ds.Select(MapDto).ToList();
    }

    private static LichSuDangNhapDto MapDto(
        TblLichsuDangnhap x)
    {
        return new LichSuDangNhapDto
        {
            Id = x.Id,
            NguoiDungId = x.NguoiDungId,
            HoTen = x.NguoiDung?.HoTen,
            ThoiGian = x.ThoiGian,
            IpAddress = x.IpAddress,
            ThietBi = x.ThietBi,
            HeDieuHanh = x.HeDieuHanh,
            ViTri = x.ViTri,
            ThanhCong = x.KetQua == 1
        };
    }

    // ============ Báo cáo bảo mật ============

    public async Task<List<DangNhapThatBaiDto>> LayDangNhapThatBaiAsync(int gioiHan, CancellationToken ct = default)
    {
        return await _lichsuDal.LayDangNhapThatBaiAsync(gioiHan, ct);
    }

    public async Task<List<HoatDongBatThuongDto>> LayHoatDongBatThuongAsync(CancellationToken ct = default)
    {
        return await _lichsuDal.LayHoatDongBatThuongAsync(ct);
    }
}