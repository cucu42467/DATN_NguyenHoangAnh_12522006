using DTO;

namespace BLL.Interfaces;

public interface IBaoCaoBll
{
    Task<BaoCaoTongHopChiSoDto> LayTongHopChiSoAsync(int nguoiDungId, string duration, int? thang, int? nam, DateTime? tuNgay = null, DateTime? denNgay = null, CancellationToken ct = default);
    Task<BaoCaoTongQuanDto> LayBieuDoTongQuanAsync(int nguoiDungId, string duration, int? thang, int? nam, DateTime? tuNgay = null, DateTime? denNgay = null, CancellationToken ct = default);
    Task<PhanBoDanhMucDto> LayPhanBoDanhMucAsync(int nguoiDungId, string duration, int? thang, int? nam, string loai, DateTime? tuNgay = null, DateTime? denNgay = null, CancellationToken ct = default);

    Task<AdminTongQuanDto> LayTongQuanAdminAsync(CancellationToken ct = default);
    Task<TangTruongUserDto> LayTangTruongUserAsync(int? nam = null, string? duration = null, DateTime? tuNgay = null, DateTime? denNgay = null, CancellationToken ct = default);

    // Các API báo cáo mới
    Task<BaoCaoTaiKhoanDto> LayBaoCaoTaiKhoanAsync(int nguoiDungId, int? thang = null, int? nam = null, CancellationToken ct = default);
    Task<BaoCaoDanhMucDto> LayBaoCaoDanhMucAsync(int nguoiDungId, int? thang = null, int? nam = null, CancellationToken ct = default);
    Task<BaoCaoNganSachDto> LayBaoCaoNganSachAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default);
    Task<BaoCaoMucTieuDto> LayBaoCaoMucTieuAsync(int nguoiDungId, CancellationToken ct = default);

    /// <summary>
    /// Đồng bộ lại SoTienDaChi cho tbl_ngansach từ tbl_giaodich
    /// </summary>
    Task<DongBoKetQuaDto> DongBoNganSachAsync(int? nguoiDungId = null, int? thang = null, int? nam = null, CancellationToken ct = default);

    /// <summary>
    /// Đồng bộ lại TongChi/TongThu cho tbl_tonghop_thang từ tbl_giaodich
    /// </summary>
    Task<DongBoKetQuaDto> DongBoTongHopThangAsync(int? nguoiDungId = null, int? thang = null, int? nam = null, CancellationToken ct = default);

    /// <summary>
    /// Kiểm tra và trả về thông tin lệch giữa ngân sách và giao dịch
    /// </summary>
    Task<DongBoKetQuaDto> KiemTraLechAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default);
}
