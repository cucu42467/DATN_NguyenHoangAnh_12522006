using DTO;

namespace BLL.Interfaces;

public interface IPhanHoiTraLoiBll
{
    // Lấy danh sách câu trả lời theo phản hồi
    Task<List<PhanHoiTraloiDto>> LayDanhSachTheoPhanHoiIdAsync(int phanHoiId);
    
    // Tạo câu trả lời mới (admin hoặc user)
    Task<int> TaoTraLoiAsync(int phanHoiId, int nguoiGuiId, string noiDung);
    
    // Đếm phản hồi chưa đọc của người dùng
    Task<int> DemTraLoiChuaDocAsync(int nguoiDungId);
    
    // Lấy danh sách phản hồi của người dùng (kèm trạng thái đã đọc)
    Task<List<PhanHoiDto>> LayDanhSachPhanHoiCuaToiAsync(int nguoiDungId);
    
    // Đánh dấu đã đọc phản hồi
    Task<bool> DanhDauDaDocAsync(int phanHoiId, int nguoiDungId);
    
    // Đánh dấu đã đọc tất cả phản hồi của người dùng
    Task<bool> DanhDauTatCaDaDocAsync(int nguoiDungId);
}
