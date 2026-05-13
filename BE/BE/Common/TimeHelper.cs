namespace Common;

public static class TimeHelper
{
    public static readonly TimeZoneInfo VietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

    public static DateTime NowInVietnam()
    {
        return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, VietnamTimeZone);
    }

    public static DateTime ToVietnamTime(this DateTime utcDateTime)
    {
        if (utcDateTime.Kind == DateTimeKind.Unspecified)
            utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, VietnamTimeZone);
    }

    public static DateTime ToUtc(this DateTime localDateTime)
    {
        return TimeZoneInfo.ConvertTimeToUtc(localDateTime, VietnamTimeZone);
    }

    public static DateTime StartOfDay(this DateTime date)
    {
        return new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, date.Kind);
    }

    public static DateTime EndOfDay(this DateTime date)
    {
        return new DateTime(date.Year, date.Month, date.Day, 23, 59, 59, 999, date.Kind);
    }

    /// <summary>
    /// Giữ nguyên ngày, set giờ:phút:giây = thời điểm hiện tại (theo múi giờ Việt Nam)
    /// </summary>
    public static DateTime SetTimeToNowInVietnam(this DateTime date)
    {
        var now = NowInVietnam();
        return new DateTime(date.Year, date.Month, date.Day, now.Hour, now.Minute, now.Second, now.Millisecond);
    }

    public static DateTime StartOfMonth(this DateTime date)
    {
        return new DateTime(date.Year, date.Month, 1, 0, 0, 0, date.Kind);
    }

    public static DateTime EndOfMonth(this DateTime date)
    {
        return new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 23, 59, 59, 999, date.Kind);
    }
}
