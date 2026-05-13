using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO;

namespace BLL.Interfaces;

public interface IThongBaoService
{
    // CRUD
    Task<ThongBaoDanhSachDto> GetDanhSachAsync(int nguoiDungId, ThongBaoLocDto? loc = null);
    Task<ThongBaoDto?> GetByIdAsync(int id);
    Task<int> TaoThongBaoAsync(int nguoiDungId, string tieuDe, string? noiDung, 
        int loaiThongBao, string? loaiDoiTuong = null, int? doiTuongId = null);
    Task MarkDaDocAsync(int thongBaoId);
    Task MarkAllDaDocAsync(int nguoiDungId);
    Task XoaThongBaoAsync(int id);
    
    // Đếm
    Task<ThongBaoDemDto> DemThongBaoAsync(int nguoiDungId);
    
    // Thông báo hệ thống
    Task<List<ThongBaoHeThongDto>> GetThongBaoHeThongAsync();

    // Tự động - gọi từ BackgroundService
    Task XuLyThongBaoTuDongAsync();
}
