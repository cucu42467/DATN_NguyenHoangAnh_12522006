using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Interfaces;
using DAL.Interfaces;
using Models;
using Common;
using DTO;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace BE.BLL;

public class ThongBaoService : IThongBaoService
{
    private readonly IThongBaoDal _dal;
    private readonly ITaiKhoanDal _taiKhoanDal;
    private readonly INhacNhoDal _nhacNhoDal;
    private readonly INganSachDal _nganSachDal;
    private readonly IMucTieuDal _mucTieuDal;
    private readonly ICaiDatDal _caiDatDal;
    private readonly IEmailService _emailService;
    private readonly ILogger<ThongBaoService> _logger;

    public ThongBaoService(
        IThongBaoDal dal,
        ITaiKhoanDal taiKhoanDal,
        INhacNhoDal nhacNhoDal,
        INganSachDal nganSachDal,
        IMucTieuDal mucTieuDal,
        ICaiDatDal caiDatDal,
        IEmailService emailService,
        ILogger<ThongBaoService> logger)
    {
        _dal = dal;
        _taiKhoanDal = taiKhoanDal;
        _nhacNhoDal = nhacNhoDal;
        _nganSachDal = nganSachDal;
        _mucTieuDal = mucTieuDal;
        _caiDatDal = caiDatDal;
        _emailService = emailService;
        _logger = logger;
    }

    #region CRUD

    public async Task<ThongBaoDanhSachDto> GetDanhSachAsync(int nguoiDungId, ThongBaoLocDto? loc = null)
    {
        var ds = await _dal.GetDanhSachAsync(nguoiDungId, loc);
        var tongSo = ds.Count; // TODO: Đếm tổng đúng

        return new ThongBaoDanhSachDto
        {
            DanhSach = ds.Select(MapToDto).ToList(),
            TongSo = tongSo,
            TrangHienTai = loc?.Trang ?? 1,
            TongTrang = (int)Math.Ceiling(tongSo / (double)(loc?.TongDong ?? 20))
        };
    }

    public async Task<ThongBaoDto?> GetByIdAsync(int id)
    {
        var entity = await _dal.GetByIdAsync(id);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<int> TaoThongBaoAsync(int nguoiDungId, string tieuDe, string? noiDung,
        int loaiThongBao, string? loaiDoiTuong = null, int? doiTuongId = null)
    {
        var tb = new TblThongbao
        {
            NguoiDungId = nguoiDungId,
            TieuDe = tieuDe,
            NoiDung = noiDung,
            LoaiThongBao = loaiThongBao,
            LoaiDoiTuong = loaiDoiTuong,
            DoiTuongId = doiTuongId,
            NgayTao = TimeHelper.NowInVietnam()
        };

        return await _dal.InsertAsync(tb);
    }

    public async Task MarkDaDocAsync(int thongBaoId)
    {
        await _dal.MarkDaDocAsync(thongBaoId);
    }

    public async Task MarkAllDaDocAsync(int nguoiDungId)
    {
        await _dal.MarkAllDaDocAsync(nguoiDungId);
    }

    public async Task XoaThongBaoAsync(int id)
    {
        await _dal.DeleteAsync(id);
    }

    public async Task<ThongBaoDemDto> DemThongBaoAsync(int nguoiDungId)
    {
        var tongSo = await _dal.GetDanhSachAsync(nguoiDungId, new ThongBaoLocDto { TongDong = 1000 });
        var chuaDoc = await _dal.DemChuaDocAsync(nguoiDungId);

        return new ThongBaoDemDto
        {
            TongSo = tongSo.Count,
            ChuaDoc = chuaDoc
        };
    }

    public async Task<List<ThongBaoHeThongDto>> GetThongBaoHeThongAsync()
    {
        var ds = await _dal.GetThongBaoHeThongAsync();
        return ds.Select(t => new ThongBaoHeThongDto
        {
            ThongBaoHeThongId = t.ThongBaoHeThongId,
            TieuDe = t.TieuDe,
            NoiDung = t.NoiDung,
            Loai = t.Loai,
            NgayGui = t.NgayGui,
            NgayHetHan = t.NgayHetHan
        }).ToList();
    }

    #endregion

    #region Xử lý tự động (BackgroundService gọi)

    public async Task XuLyThongBaoTuDongAsync()
    {
        _logger.LogDebug("⏰ Bắt đầu xử lý thông báo tự động: {Time}", TimeHelper.NowInVietnam());

        try
        {
            // 1. Kiểm tra số dư thấp
            await KiemTraSoDuThapAsync();

            // 2. Kiểm tra nhắc lịch
            await KiemTraNhacLichAsync();

            // 3. Kiểm tra vượt ngân sách
            await KiemTraVuotNganSachAsync();

            // 4. Kiểm tra mục tiêu
            await KiemTraMucTieuAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Lỗi khi xử lý thông báo tự động");
        }
    }

    private async Task KiemTraSoDuThapAsync()
    {
        // Lấy tất cả người dùng có cài đặt
        var danhSachCaiDat = await _caiDatDal.GetAllWithThongBaoBatAsync();
        var thoiGianHienTai = TimeHelper.NowInVietnam();

        foreach (var caiDat in danhSachCaiDat)
        {
            try
            {
                // Parse cài đặt thông báo
                var thongBaoSetting = ParseCaiDatThongBao(caiDat.ThongBaoJson);
                if (thongBaoSetting?.SoDuThap?.Bat != true)
                    continue;

                var nguong = thongBaoSetting.SoDuThap.Nguong;

                // Lấy tài khoản của user
                var taiKhoans = await _taiKhoanDal.GetByNguoiDungIdAsync(caiDat.NguoiDungId);

                foreach (var tk in taiKhoans)
                {
                    // Kiểm tra số dư < ngưỡng
                    if (tk.SoDu >= nguong)
                        continue;

                    // Kiểm tra đã gửi trong 24h chưa?
                    var daGui = await _dal.DaGuiGanDayAsync(
                        caiDat.NguoiDungId,
                        LoaiThongBaoTuDong.SoDuThap,
                        tk.TaiKhoanId,
                        TimeSpan.FromHours(24));

                    if (daGui)
                        continue; // Đã gửi gần đây

                    // Tạo thông báo
                    var noiDung = $"Tài khoản '{tk.TenTaiKhoan}' có số dư thấp: {SoTienHelper.DinhDangVND(tk.SoDu)}";
                    await TaoThongBaoAsync(
                        caiDat.NguoiDungId,
                        "⚠️ Cảnh báo số dư thấp",
                        noiDung,
                        (int)LoaiThongBaoEnum.CanhBao,
                        LoaiDoiTuongThongBao.TaiKhoan.ToString(),
                        tk.TaiKhoanId);

                    // Ghi nhận đã gửi
                    await _dal.InsertDaGuiAsync(new TblDaguiThongbao
                    {
                        NguoiDungId = caiDat.NguoiDungId,
                        LoaiThongBao = LoaiThongBaoTuDong.SoDuThap,
                        ThamChieuId = tk.TaiKhoanId,
                        ThoiGianGui = thoiGianHienTai
                    });

                    // Gửi email nếu cài đặt
                    if (thongBaoSetting.Email)
                    {
                        await GuiEmailThongBaoAsync(caiDat.NguoiDungId, "⚠️ Cảnh báo số dư thấp", noiDung);
                    }

                    _logger.LogInformation("✅ Đã gửi thông báo số dư thấp cho user {UserId}, TK {TaiKhoanId}",
                        caiDat.NguoiDungId, tk.TaiKhoanId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi kiểm tra số dư thấp cho user {UserId}", caiDat.NguoiDungId);
            }
        }
    }

    private async Task KiemTraNhacLichAsync()
    {
        var danhSachCaiDat = await _caiDatDal.GetAllWithThongBaoBatAsync();
        var thoiGianHienTai = TimeHelper.NowInVietnam();

        foreach (var caiDat in danhSachCaiDat)
        {
            try
            {
                var thongBaoSetting = ParseCaiDatThongBao(caiDat.ThongBaoJson);
                if (thongBaoSetting?.NhacLich?.Bat != true)
                    continue;

                var truocPhut = thongBaoSetting.NhacLich.TruocPhut;

                // Lấy nhắc nhở đến hạn trong N phút tới
                var nhacs = await _nhacNhoDal.GetDenHanAsync(caiDat.NguoiDungId, truocPhut);

                foreach (var nhac in nhacs)
                {
                    // Kiểm tra đã gửi trong X phút chưa?
                    var daGui = await _dal.DaGuiGanDayAsync(
                        caiDat.NguoiDungId,
                        LoaiThongBaoTuDong.NhacLich,
                        nhac.NhacNhoId,
                        TimeSpan.FromMinutes(truocPhut));

                    if (daGui)
                        continue;

                    var noiDung = $"Nhắc nhở: {nhac.TieuDe}" + 
                        (string.IsNullOrEmpty(nhac.NoiDung) ? "" : $" - {nhac.NoiDung}");
                    await TaoThongBaoAsync(
                        caiDat.NguoiDungId,
                        "📅 Nhắc nhở",
                        noiDung,
                        (int)LoaiThongBaoEnum.NhacNho,
                        LoaiDoiTuongThongBao.Lich.ToString(),
                        nhac.NhacNhoId);

                    await _dal.InsertDaGuiAsync(new TblDaguiThongbao
                    {
                        NguoiDungId = caiDat.NguoiDungId,
                        LoaiThongBao = LoaiThongBaoTuDong.NhacLich,
                        ThamChieuId = nhac.NhacNhoId,
                        ThoiGianGui = thoiGianHienTai
                    });

                    if (thongBaoSetting.Email)
                    {
                        await GuiEmailThongBaoAsync(caiDat.NguoiDungId, "📅 Nhắc nhở", noiDung);
                    }

                    _logger.LogInformation("✅ Đã gửi nhắc nhở cho user {UserId}, NhacNho {NhacNhoId}",
                        caiDat.NguoiDungId, nhac.NhacNhoId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi kiểm tra nhắc nhở cho user {UserId}", caiDat.NguoiDungId);
            }
        }
    }

    private async Task KiemTraVuotNganSachAsync()
    {
        var danhSachCaiDat = await _caiDatDal.GetAllWithThongBaoBatAsync();
        var thoiGianHienTai = TimeHelper.NowInVietnam();
        var homNay = thoiGianHienTai.Date;

        foreach (var caiDat in danhSachCaiDat)
        {
            try
            {
                var thongBaoSetting = ParseCaiDatThongBao(caiDat.ThongBaoJson);
                if (thongBaoSetting?.VuotNganSach?.Bat != true)
                    continue;

                var phanTram = thongBaoSetting.VuotNganSach.PhanTram;

                // Lấy ngân sách
                var nganSachs = await _nganSachDal.GetByNguoiDungIdAsync(caiDat.NguoiDungId);

                foreach (var ns in nganSachs)
                {
                    // Kiểm tra theo tháng/năm
                    if (ns.Thang != homNay.Month || ns.Nam != homNay.Year)
                        continue;

                    // Tính chi tiêu hôm nay theo ngân sách này
                    var tongChi = await _nganSachDal.TongChiTieuAsync(
                        ns.NganSachId,
                        homNay,
                        homNay);

                    // Tránh chia cho 0
                    if (ns.HanMuc <= 0)
                        continue;

                    var tyLe = (tongChi / ns.HanMuc) * 100;

                    if (tyLe < phanTram)
                        continue;

                    // Kiểm tra đã gửi hôm nay chưa
                    var daGui = await _dal.DaGuiGanDayAsync(
                        caiDat.NguoiDungId,
                        LoaiThongBaoTuDong.VuotNganSach,
                        ns.NganSachId,
                        TimeSpan.FromHours(24));

                    if (daGui)
                        continue;

                    var noiDung =
                        $"Ngân sách '{ns.TenDanhMuc}' đã sử dụng {tyLe:F0}% " +
                        $"({SoTienHelper.DinhDangVND(tongChi)}/" +
                        $"{SoTienHelper.DinhDangVND(ns.HanMuc)})";

                    await TaoThongBaoAsync(
                        caiDat.NguoiDungId,
                        "⚠️ Cảnh báo ngân sách",
                        noiDung,
                        (int)LoaiThongBaoEnum.CanhBao,
                        LoaiDoiTuongThongBao.NganSach.ToString(),
                        ns.NganSachId);

                    await _dal.InsertDaGuiAsync(new TblDaguiThongbao
                    {
                        NguoiDungId = caiDat.NguoiDungId,
                        LoaiThongBao = LoaiThongBaoTuDong.VuotNganSach,
                        ThamChieuId = ns.NganSachId,
                        ThoiGianGui = thoiGianHienTai
                    });

                    if (thongBaoSetting.Email)
                    {
                        await GuiEmailThongBaoAsync(
                            caiDat.NguoiDungId,
                            "⚠️ Cảnh báo ngân sách",
                            noiDung);
                    }

                    _logger.LogInformation(
                        "✅ Đã gửi cảnh báo ngân sách cho user {UserId}, NS {NganSachId}",
                        caiDat.NguoiDungId,
                        ns.NganSachId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi kiểm tra ngân sách cho user {UserId}", caiDat.NguoiDungId);
            }
        }
    }

    private async Task KiemTraMucTieuAsync()
    {
        var danhSachCaiDat = await _caiDatDal.GetAllWithThongBaoBatAsync();
        var thoiGianHienTai = TimeHelper.NowInVietnam();

        foreach (var caiDat in danhSachCaiDat)
        {
            try
            {
                var thongBaoSetting = ParseCaiDatThongBao(caiDat.ThongBaoJson);
                if (thongBaoSetting?.MucTieu?.Bat != true)
                    continue;

                var mucs = await _mucTieuDal.GetByNguoiDungIdAsync(caiDat.NguoiDungId);

                foreach (var mt in mucs)
                {
                    if (mt.SoTienDaDat <= 0)
                        continue;

                    var tyLe = (mt.SoTienDaDat / mt.SoTienMucTieu) * 100;
                    var cacMoc = thongBaoSetting.MucTieu.MocPhanTram;

                    foreach (var moc in cacMoc)
                    {
                        if (tyLe < moc)
                            continue; // Chưa đạt mốc này

                        // Kiểm tra đã thông báo mốc này chưa?
                        var key = $"{LoaiThongBaoTuDong.MucTieu}_{mt.MucTieuId}_{moc}";
                        var daGui = await _dal.DaGuiGanDayAsync(
                            caiDat.NguoiDungId,
                            key,
                            mt.MucTieuId,
                            TimeSpan.FromDays(365)); // Mốc này chỉ gửi 1 lần

                        if (daGui)
                            continue;

                        var noiDung = $"Mục tiêu '{mt.TenMucTieu}' đã đạt {moc}% ({SoTienHelper.DinhDangVND(mt.SoTienDaDat)}/{SoTienHelper.DinhDangVND(mt.SoTienMucTieu)})";
                        await TaoThongBaoAsync(
                            caiDat.NguoiDungId,
                            $"🎯 Mục tiêu đạt {moc}%",
                            noiDung,
                            (int)LoaiThongBaoEnum.ThanhCong,
                            LoaiDoiTuongThongBao.MucTieu.ToString(),
                            mt.MucTieuId);

                        await _dal.InsertDaGuiAsync(new TblDaguiThongbao
                        {
                            NguoiDungId = caiDat.NguoiDungId,
                            LoaiThongBao = key,
                            ThamChieuId = mt.MucTieuId,
                            ThoiGianGui = thoiGianHienTai
                        });

                        if (thongBaoSetting.Email)
                        {
                            await GuiEmailThongBaoAsync(caiDat.NguoiDungId, $"🎯 Mục tiêu đạt {moc}%", noiDung);
                        }

                        _logger.LogInformation("✅ Đã gửi mốc {Moc}% mục tiêu cho user {UserId}", moc, caiDat.NguoiDungId);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi kiểm tra mục tiêu cho user {UserId}", caiDat.NguoiDungId);
            }
        }
    }

    #endregion

    #region Helpers

    private ThongBaoDto MapToDto(TblThongbao entity)
    {
        return new ThongBaoDto
        {
            ThongBaoId = entity.ThongBaoId,
            NguoiDungId = entity.NguoiDungId,
            TieuDe = entity.TieuDe,
            NoiDung = entity.NoiDung,
            LoaiThongBao = entity.LoaiThongBao,
            LoaiDoiTuong = entity.LoaiDoiTuong,
            DoiTuongId = entity.DoiTuongId,
            DuongDanDieuHuong = entity.DuongDanDieuHuong,
            NgayTao = entity.NgayTao,

            // FIX
            DaDoc = entity.DaDoc == 1,

            NgayHetHan = entity.NgayHetHan
        };
    }
    private CaiDatThongBaoDto? ParseCaiDatThongBao(string? json)
    {
        if (string.IsNullOrEmpty(json))
            return null;

        try
        {
            return JsonSerializer.Deserialize<CaiDatThongBaoDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch
        {
            return null;
        }
    }

    private async Task GuiEmailThongBaoAsync(int nguoiDungId, string tieuDe, string noiDung)
    {
        try
        {
            // Lấy email người dùng
            // TODO: Gọi service lấy email
            _logger.LogInformation("📧 Gửi email cho user {UserId}: {TieuDe}", nguoiDungId, tieuDe);
            // await _emailService.GuiThongBaoAsync(email, tieuDe, noiDung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Lỗi gửi email cho user {UserId}", nguoiDungId);
        }
    }

    #endregion
}
