using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class PhanHoiBll : IPhanHoiBll
{
    private readonly IPhanHoiDal _phanHoiDal;

    public PhanHoiBll(IPhanHoiDal phanHoiDal)
    {
        _phanHoiDal = phanHoiDal;
    }

    public async Task<List<PhanHoiDto>> LayTatCaAsync(int? nguoiDungId = null)
    {
        if (nguoiDungId.HasValue)
            return await _phanHoiDal.LayDanhSachTheoNguoiDungAsync(nguoiDungId.Value);
        return new List<PhanHoiDto>();
    }

    public async Task<PhanHoiDto?> LayTheoIdAsync(int id)
    {
        return await _phanHoiDal.LayTheoIdAsync(id);
    }

    public async Task<int> TaoMoiAsync(PhanHoiDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.TieuDe))
            throw new ArgumentException("Tiêu đề không được để trống");

        if (string.IsNullOrWhiteSpace(dto.NoiDung))
            throw new ArgumentException("Nội dung không được để trống");

        if (dto.TieuDe.Trim().Length < 5)
            throw new ArgumentException("Tiêu đề phải có ít nhất 5 ký tự");

        if (dto.NoiDung.Trim().Length < 10)
            throw new ArgumentException("Nội dung phải có ít nhất 10 ký tự");

        return await _phanHoiDal.TaoPhanHoiAsync(dto.NguoiDungId, dto.TieuDe, dto.NoiDung);
    }

    public async Task<bool> CapNhatAsync(int id, PhanHoiDto dto)
    {
        if (dto.TrangThai.HasValue)
            return await _phanHoiDal.CapNhatTrangThaiAsync(id, dto.TrangThai.Value);
        return false;
    }

    public async Task<bool> XoaAsync(int id)
    {
        return await _phanHoiDal.CapNhatTrangThaiAsync(id, 99); // Đánh dấu đã xóa
    }

    public async Task<bool> CapNhatTrangThaiAsync(int id, sbyte trangThai)
    {
        return await _phanHoiDal.CapNhatTrangThaiAsync(id, trangThai);
    }

    public async Task<int> DemPhanHoiChoXuLyAsync()
    {
        return await _phanHoiDal.DemPhanHoiChoXuLyAsync();
    }

    // ============ Báo cáo thống kê ============

    public async Task<ThongKePhanHoiDto> LayThongKePhanHoiAsync(CancellationToken ct = default)
    {
        var result = await _phanHoiDal.LayThongKePhanHoiAsync(ct);
        return result ?? new ThongKePhanHoiDto();
    }
}
