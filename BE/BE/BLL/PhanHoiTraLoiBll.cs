using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class PhanHoiTraLoiBll : IPhanHoiTraLoiBll
{
    private readonly IPhanHoiTraLoiDal _phanHoiTraLoiDal;

    public PhanHoiTraLoiBll(IPhanHoiTraLoiDal phanHoiTraLoiDal)
    {
        _phanHoiTraLoiDal = phanHoiTraLoiDal;
    }

    public async Task<List<PhanHoiTraloiDto>> LayDanhSachTheoPhanHoiIdAsync(int phanHoiId)
    {
        if (phanHoiId <= 0)
            throw new ArgumentException("ID phản hồi không hợp lệ");

        return await _phanHoiTraLoiDal.LayDanhSachTheoPhanHoiIdAsync(phanHoiId);
    }

    public async Task<int> TaoTraLoiAsync(int phanHoiId, int nguoiGuiId, string noiDung)
    {
        if (phanHoiId <= 0)
            throw new ArgumentException("ID phản hồi không hợp lệ");

        if (nguoiGuiId <= 0)
            throw new ArgumentException("ID người gửi không hợp lệ");

        if (string.IsNullOrWhiteSpace(noiDung))
            throw new ArgumentException("Nội dung không được để trống");

        if (noiDung.Trim().Length < 5)
            throw new ArgumentException("Nội dung phải có ít nhất 5 ký tự");

        return await _phanHoiTraLoiDal.TaoTraLoiAsync(phanHoiId, nguoiGuiId, noiDung);
    }

    public async Task<int> DemTraLoiChuaDocAsync(int nguoiDungId)
    {
        if (nguoiDungId <= 0)
            return 0;

        return await _phanHoiTraLoiDal.DemTraLoiChuaDocAsync(nguoiDungId);
    }

    public async Task<List<PhanHoiDto>> LayDanhSachPhanHoiCuaToiAsync(int nguoiDungId)
    {
        if (nguoiDungId <= 0)
            throw new ArgumentException("ID người dùng không hợp lệ");

        return await _phanHoiTraLoiDal.LayDanhSachPhanHoiCuaToiAsync(nguoiDungId);
    }

    public async Task<bool> DanhDauDaDocAsync(int phanHoiId, int nguoiDungId)
    {
        if (phanHoiId <= 0)
            throw new ArgumentException("ID phản hồi không hợp lệ");

        if (nguoiDungId <= 0)
            throw new ArgumentException("ID người dùng không hợp lệ");

        return await _phanHoiTraLoiDal.DanhDauDaDocAsync(phanHoiId, nguoiDungId);
    }

    public async Task<bool> DanhDauTatCaDaDocAsync(int nguoiDungId)
    {
        if (nguoiDungId <= 0)
            throw new ArgumentException("ID người dùng không hợp lệ");

        return await _phanHoiTraLoiDal.DanhDauTatCaDaDocAsync(nguoiDungId);
    }
}
