using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class NguoiDungLoginDto
    {
        public int NguoiDungId { get; set; }
        public string Email { get; set; }

        public string SoDienThoai { get; set; }
        public string MatKhau { get; set; }
        public int? TrangThai { get; set; }
    }
}
