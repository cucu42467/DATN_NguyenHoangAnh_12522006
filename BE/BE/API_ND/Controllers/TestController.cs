using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace API_ND.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    private readonly Models.Data.AppDbContext _db;

    public TestController(Models.Data.AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Test kết nối CSDL - trả về thông tin database
    /// </summary>
    [HttpGet("ket-noi-csdl")]
    [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
    public IActionResult TestKetNoiCsdl()
    {
        try
        {
            // Kiểm tra kết nối
            var duocKhoiTao = _db.Database.CanConnect();
            
            // Đếm số bảng/user trong DB
            var soNguoiDung = _db.TblNguoidungs.Count();

            return Ok(new
            {
                thanhCong = true,
                thongDiep = "Kết nối CSDL thành công!",
                duLieu = new
                {
                    ketNoi = duocKhoiTao ? "OK" : "FAILED",
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                thanhCong = false,
                thongDiep = "Lỗi kết nối CSDL",
                loi = ex.Message
            });
        }
    }

    /// <summary>
    /// Lấy danh sách người dùng để test
    /// </summary>
    [HttpGet("danh-sach-nguoi-dung")]
    [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
    public IActionResult LayDanhSachNguoiDung()
    {
        try
        {
            var nguoiDungs = _db.TblNguoidungs
                .Select(x => new
                {
                    x.NguoiDungId,
                    x.Email,
                    x.HoTen,
                    x.SoDienThoai,
                    CoMatKhau = x.MatKhau != null,
                    x.TrangThai
                })
                .ToList();

            return Ok(new
            {
                thanhCong = true,
                soLuong = nguoiDungs.Count,
                nguoiDungs
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                thanhCong = false,
                thongDiep = "Lỗi truy vấn",
                loi = ex.Message
            });
        }
    }
}
