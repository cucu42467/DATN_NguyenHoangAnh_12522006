using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("tbl_reset_token")]
public class TblResetToken
{
    [Key]
    [Column("reset_token_id")]
    public int ResetTokenId { get; set; }

    [Column("email")]
    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    [Column("reset_token")]
    [Required]
    [MaxLength(255)]
    public string ResetToken { get; set; } = null!;

    [Column("nguoi_dung_id")]
    public int NguoiDungId { get; set; }

    [Column("ngay_tao")]
    public DateTime NgayTao { get; set; }

    [Column("ngay_het_han")]
    public DateTime NgayHetHan { get; set; }

    [Column("da_su_dung")]
    public bool DaSuDung { get; set; } = false;
}
