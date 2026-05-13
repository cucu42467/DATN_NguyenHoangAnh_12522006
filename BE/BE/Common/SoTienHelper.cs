using System.Globalization;

namespace Common;

public static class SoTienHelper
{
    public static string DinhDangVND(decimal soTien)
    {
        return soTien.ToString("N0", CultureInfo.GetCultureInfo("vi-VN")) + "đ";
    }

    public static string DinhDangVND(double soTien)
    {
        return soTien.ToString("N0", CultureInfo.GetCultureInfo("vi-VN")) + "đ";
    }

    public static string DinhDangVND(int soTien)
    {
        return soTien.ToString("N0", CultureInfo.GetCultureInfo("vi-VN")) + "đ";
    }
}
