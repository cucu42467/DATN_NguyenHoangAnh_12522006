using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("tbl_otp")]
public class TblOtp
{
    [Key]
    [Column("otp_id")]
    public int OtpId { get; set; }

    [Column("email")]
    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    [Column("otp_code")]
    [Required]
    [MaxLength(10)]
    public string OtpCode { get; set; } = null!;

    [Column("loai")]
    [Required]
    [MaxLength(20)]
    public string Loai { get; set; } = "EMAIL"; // EMAIL hoặc SMS

    [Column("ngay_tao")]
    public DateTime NgayTao { get; set; }

    [Column("ngay_het_han")]
    public DateTime NgayHetHan { get; set; }

    [Column("so_lan_sai")]
    public int SoLanSai { get; set; } = 0;

    [Column("da_su_dung")]
    public bool DaSuDung { get; set; } = false;
}
