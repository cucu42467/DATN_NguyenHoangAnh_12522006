using System;

namespace DTO;

public class LoginHistoryDto
{
    public int Id { get; set; }
    public int NguoiDungId { get; set; }
    public DateTime ThoiGian { get; set; }
    public string? IpAddress { get; set; }
    public string? ThietBi { get; set; }
    public sbyte? TrangThai { get; set; }
}

public class SessionDto
{
    public int SessionId { get; set; }
    public int NguoiDungId { get; set; }
    public string RefreshToken { get; set; } = null!;
    public string? IpAddress { get; set; }
    public string? ThietBi { get; set; }
    public string? HeDieuHanh { get; set; }
    public DateTime? HetHan { get; set; }
    public sbyte? TrangThai { get; set; }
    public DateTime? NgayTao { get; set; }
}

public class UserBehaviorDto
{
    public int Id { get; set; }
    public int NguoiDungId { get; set; }
    public string LoaiHanhVi { get; set; } = null!;
    public string? ChiTiet { get; set; }
    public DateTime? ThoiGian { get; set; }
}

public class SystemConfigDto
{
    public int Id { get; set; }
    public string MaCauHinh { get; set; } = null!;
    public string GiaTri { get; set; } = null!;
    public string? MoTa { get; set; }
    public DateTime? NgayCapNhat { get; set; }
}

public class FeatureFlagDto
{
    public int FeatureId { get; set; }
    public string TenFeature { get; set; } = null!;
    public bool BatTat { get; set; }
    public string? MoTa { get; set; }
}
