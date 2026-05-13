using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models;
using DTO;

namespace DAL.Interfaces;

public interface IThongBaoDal
{
    // CRUD Thông báo
    Task<List<TblThongbao>> GetDanhSachAsync(int nguoiDungId, ThongBaoLocDto? loc = null);
    Task<TblThongbao?> GetByIdAsync(int id);
    Task<int> InsertAsync(TblThongbao thongBao);
    Task UpdateAsync(TblThongbao thongBao);
    Task DeleteAsync(int id);
    Task<int> DemChuaDocAsync(int nguoiDungId);
    Task MarkDaDocAsync(int thongBaoId);
    Task MarkAllDaDocAsync(int nguoiDungId);

    // Theo dõi đã gửi (tránh trùng)
    Task<bool> DaGuiGanDayAsync(int nguoiDungId, string loaiThongBao, int? thamChieuId, TimeSpan khoangThoiGian);
    Task InsertDaGuiAsync(TblDaguiThongbao daGui);
    Task<List<TblDaguiThongbao>> GetDaGuiAsync(int nguoiDungId, string loaiThongBao);

    // Thông báo hệ thống
    Task<List<TblThongbaoHeThong>> GetThongBaoHeThongAsync();

    // Aliases for BLL compatibility
    Task<List<TblThongbao>> LayDanhSachAsync(int nguoiDungId, ThongBaoLocDto? loc = null);
    Task<TblThongbao?> LayTheoIdAsync(int id);
    Task<int> TaoMoiAsync(TaoThongBaoDto taoThongBaoDto, CancellationToken ct = default);
    Task<bool> DanhDauDaDocAsync(int thongBaoId);
    Task<int> DemChuaDocAsync(int nguoiDungId, int? thang = null, int? nam = null);
    Task<bool> XoaAsync(int id);
    Task<List<TblThongbao>> LayDanhSachTatCaAsync(ThongBaoLocDto? loc = null);
    Task<TblThongbao?> LayTheoIdAdminAsync(int id);
    Task<object> LayThongKeThongBaoAsync();
}
