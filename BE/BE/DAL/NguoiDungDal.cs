using Common;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;
using DTO;
using BCrypt.Net;
using ClosedXML;

namespace DAL;

public class NguoiDungDal : INguoiDungDal
{
    private readonly AppDbContext _db;

    public NguoiDungDal(AppDbContext db)
    {
        _db = db;
    }

    private static NguoiDungDto MapToDto(TblNguoidung entity)
    {
        return new NguoiDungDto
        {
            NguoiDungId = entity.NguoiDungId,
            HoTen = entity.HoTen,
            Email = entity.Email,
            SoDienThoai = entity.SoDienThoai,
            MatKhau = null,
            AnhDaiDien = entity.AnhDaiDien,
            NgayTao = entity.NgayTao,
            TrangThai = entity.TrangThai,
            DaXoa = entity.DaXoa,
            EmailDaXacThuc = entity.EmailDaXacThuc == 1,
            Dang2FA = entity.Dang2FA == 1,
            LanDangNhapCuoi = entity.LanDangNhapCuoi,
            VaiTro = entity.TblNguoidungVaitros?
                .Select(x => x.VaiTro?.TenVaiTro)
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .Distinct()
                .Cast<string>()
                .ToList() ?? new List<string>()
        };
    }

    public async Task<NguoiDungDto?> LayTheoSoDienThoaiAsync(string soDienThoai, CancellationToken huyBo = default)
    {
        var sdt = soDienThoai.Trim();
        var entity = await _db.TblNguoidungs
            .AsNoTracking()
            .Include(u => u.TblNguoidungVaitros)
            .ThenInclude(nv => nv.VaiTro)
            .FirstOrDefaultAsync(u => u.SoDienThoai == sdt && u.DaXoa == 0, huyBo);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<NguoiDungDto> DangKyNguoiDungAsync(YeuCauDangKyDto yeuCau, CancellationToken huyBo = default)
    {
        if (await LayTheoEmailAsync(yeuCau.Email, huyBo) != null)
            throw new InvalidOperationException("Email đã tồn tại");

        if (!string.IsNullOrWhiteSpace(yeuCau.SoDienThoai) && await LayTheoSoDienThoaiAsync(yeuCau.SoDienThoai, huyBo) != null)
            throw new InvalidOperationException("Số điện thoại đã tồn tại");

        var dto = new NguoiDungDto
        {
            HoTen = yeuCau.HoTen.Trim(),
            Email = yeuCau.Email.Trim(),
            SoDienThoai = yeuCau.SoDienThoai?.Trim(),
            MatKhau = BCrypt.Net.BCrypt.HashPassword(yeuCau.MatKhau),
            NgayTao = TimeHelper.NowInVietnam(),
            TrangThai = 1,
            EmailDaXacThuc = false,
            Dang2FA = false,
        };

        return await ThemMoiAsync(dto, huyBo);
    }

    public async Task<NguoiDungDto?> LayTheoEmailHoacSoDienThoaiAsync(string tenDangNhap, CancellationToken huyBo = default)
    {
        var key = tenDangNhap.Trim();
        var entity = await _db.TblNguoidungs
            .AsNoTracking()
            .Include(u => u.TblNguoidungVaitros)
            .ThenInclude(nv => nv.VaiTro)
            .FirstOrDefaultAsync(
                u => (u.Email == key || u.SoDienThoai == key) && u.DaXoa == 0,
                huyBo);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<NguoiDungDto?> LayTheoIdAsync(int nguoiDungId, CancellationToken huyBo = default)
    {
        var entity = await _db.TblNguoidungs
            .AsNoTracking()
            .Include(u => u.TblNguoidungVaitros)
            .ThenInclude(nv => nv.VaiTro)
            .FirstOrDefaultAsync(u => u.NguoiDungId == nguoiDungId && u.DaXoa == 0, huyBo);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<NguoiDungDto?> LayTheoEmailAsync(string email, CancellationToken huyBo = default)
    {
        var e = email.Trim();
        var entity = await _db.TblNguoidungs
            .AsNoTracking()
            .Include(u => u.TblNguoidungVaitros)
            .ThenInclude(nv => nv.VaiTro)
            .FirstOrDefaultAsync(u => u.Email == e && u.DaXoa == 0, huyBo);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<NguoiDungDto> ThemMoiAsync(NguoiDungDto dto, CancellationToken huyBo = default)
    {
        var entity = new TblNguoidung
        {
            HoTen = dto.HoTen,
            Email = dto.Email,
            SoDienThoai = dto.SoDienThoai,
            MatKhau = dto.MatKhau,
            AnhDaiDien = dto.AnhDaiDien,
            NgayTao = dto.NgayTao,
            TrangThai = dto.TrangThai,
            EmailDaXacThuc = (sbyte?)(dto.EmailDaXacThuc ? 1 : 0),
            Dang2FA = (sbyte?)(dto.Dang2FA ? 1 : 0),
            DaXoa = 0
        };
        _db.TblNguoidungs.Add(entity);
        await _db.SaveChangesAsync(huyBo);
        return MapToDto(entity);
    }

    public async Task<(List<NguoiDungDto> Items, int TotalCount)> LayDanhSachAdminAsync(
        int page,
        int pageSize,
        LocNguoiDungFilter? filter = null,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 200) pageSize = 200;

        // Base query with includes
        var query = _db.TblNguoidungs
            .AsNoTracking()
            .Include(x => x.TblNguoidungVaitros)
                .ThenInclude(x => x.VaiTro)
            .Include(x => x.TblNguoidungSocials)
            .AsQueryable();

        // Apply filters
        if (filter != null)
        {
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.ToLower();
                query = query.Where(x =>
                    x.HoTen.ToLower().Contains(search) ||
                    x.Email.ToLower().Contains(search) ||
                    (x.SoDienThoai != null && x.SoDienThoai.Contains(search)));
            }

            if (!string.IsNullOrWhiteSpace(filter.TrangThai))
            {
                query = filter.TrangThai switch
                {
                    "HOAT_DONG" => query.Where(x => x.TrangThai == 1 && x.DaXoa == 0),
                    "KHOA" => query.Where(x => x.TrangThai == 0 && x.DaXoa == 0),
                    "DA_XOA" => query.Where(x => x.DaXoa == 1),
                    _ => query.Where(x => x.DaXoa == 0)
                };
            }
            else
            {
                query = query.Where(x => x.DaXoa == 0);
            }

            if (!string.IsNullOrWhiteSpace(filter.VaiTro))
            {
                query = query.Where(x =>
                    x.TblNguoidungVaitros.Any(v => v.VaiTro != null && v.VaiTro.TenVaiTro == filter.VaiTro));
            }

            if (!string.IsNullOrWhiteSpace(filter.PhuongThucDangNhap))
            {
                if (filter.PhuongThucDangNhap == "GOOGLE")
                {
                    query = query.Where(x => x.TblNguoidungSocials.Any(s => s.Provider == "GOOGLE"));
                }
                else if (filter.PhuongThucDangNhap == "THUONG")
                {
                    query = query.Where(x => !x.TblNguoidungSocials.Any());
                }
            }

            if (!string.IsNullOrWhiteSpace(filter.TuNgay) && DateTime.TryParse(filter.TuNgay, out var tuNgay))
            {
                query = query.Where(x => x.NgayTao >= tuNgay);
            }

            if (!string.IsNullOrWhiteSpace(filter.DenNgay) && DateTime.TryParse(filter.DenNgay, out var denNgay))
            {
                denNgay = denNgay.AddDays(1);
                query = query.Where(x => x.NgayTao < denNgay);
            }
        }
        else
        {
            query = query.Where(x => x.DaXoa == 0);
        }

        // Sorting
        IOrderedQueryable<TblNguoidung> orderedQuery;
        switch (filter?.SortBy?.ToLower(), filter?.SortDir?.ToLower())
        {
            case ("hoten", "asc"):
                orderedQuery = query.OrderBy(x => x.HoTen);
                break;
            case ("hoten", _):
                orderedQuery = query.OrderByDescending(x => x.HoTen);
                break;
            case ("email", "asc"):
                orderedQuery = query.OrderBy(x => x.Email);
                break;
            case ("email", _):
                orderedQuery = query.OrderByDescending(x => x.Email);
                break;
            case ("ngaytao", "asc"):
                orderedQuery = query.OrderBy(x => x.NgayTao);
                break;
            default:
                orderedQuery = query.OrderByDescending(x => x.NgayTao);
                break;
        }

        var totalCount = await query.CountAsync(ct);

        var users = await orderedQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var items = users.Select(u => new NguoiDungDto
        {
            NguoiDungId = u.NguoiDungId,
            HoTen = u.HoTen,
            Email = u.Email,
            SoDienThoai = u.SoDienThoai,
            AnhDaiDien = u.AnhDaiDien,
            NgayTao = u.NgayTao,
            TrangThai = u.TrangThai,
            DaXoa = u.DaXoa,
            EmailDaXacThuc = u.EmailDaXacThuc == 1,
            LanDangNhapCuoi = u.LanDangNhapCuoi,
            PhuongThucDangNhap = u.TblNguoidungSocials.Any() ? "GOOGLE" : "THUONG",
            VaiTro = u.TblNguoidungVaitros
                .Where(v => v.VaiTro != null)
                .Select(v => v.VaiTro!.TenVaiTro)
                .Distinct()
                .ToList()
        }).ToList();

        return (items, totalCount);
    }

    public async Task<NguoiDungChiTietDto?> LayChiTietAdminFullAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.TblNguoidungs
            .AsNoTracking()
            .Include(x => x.TblNguoidungVaitros)
                .ThenInclude(x => x.VaiTro)
            .Include(x => x.TblNguoidungSocials)
            .Include(x => x.TblTaikhoans)
            .Include(x => x.TblGiaodiches)
            .Include(x => x.TblTonghopThangs)
            .Include(x => x.TblCaidat)
            .FirstOrDefaultAsync(x => x.NguoiDungId == id, ct);

        if (entity == null) return null;

        // Lấy tổng hợp tháng hiện tại
        var now = TimeHelper.NowInVietnam();
        var thangHienTai = entity.TblTonghopThangs
            .FirstOrDefault(t => t.Thang == now.Month && t.Nam == now.Year);

        // Đếm giao dịch
        var giaoDich = entity.TblGiaodiches
            .Where(g => g.NgayGiaoDich >= new DateTime(now.Year, now.Month, 1))
            .ToList();

        return new NguoiDungChiTietDto
        {
            NguoiDungId = entity.NguoiDungId,
            HoTen = entity.HoTen,
            Email = entity.Email,
            SoDienThoai = entity.SoDienThoai,
            AnhDaiDien = entity.AnhDaiDien,
            NgayTao = entity.NgayTao,
            TrangThai = entity.TrangThai ?? 1,
            DaXoa = entity.DaXoa ?? 0,
            EmailDaXacThuc = entity.EmailDaXacThuc == 1,
            SoDienThoaiDaXacThuc = entity.SoDienThoaiDaXacThuc == 1,
            LanDangNhapCuoi = entity.LanDangNhapCuoi,
            VaiTro = entity.TblNguoidungVaitros
                .Where(v => v.VaiTro != null)
                .Select(v => v.VaiTro!.TenVaiTro)
                .ToList(),
            TaiKhoan = entity.TblTaikhoans
                .Select(t => new TaiKhoanThongKeDto
                {
                    TaiKhoanId = t.TaiKhoanId,
                    TenTaiKhoan = t.TenTaiKhoan,
                    LoaiTaiKhoan = t.LoaiTaiKhoan?.TenLoai ?? "Không rõ",
                    SoDu = t.SoDu ?? 0,
                    Icon = t.Icon,
                    MauSac = t.MauSac
                }).ToList(),
            GiaoDich = new GiaoDichThongKeDto
            {
                TongGiaoDich = giaoDich.Count,
                TongThuThang = thangHienTai?.TongThu ?? giaoDich.Where(g => g.LoaiGiaoDich == 1).Sum(g => g.SoTien),
                TongChiThang = thangHienTai?.TongChi ?? giaoDich.Where(g => g.LoaiGiaoDich == 2).Sum(g => g.SoTien)
            },
            SocialLogins = entity.TblNguoidungSocials
                .Select(s => new SocialLoginDto
                {
                    Id = s.Id,
                    Provider = s.Provider,
                    EmailSocial = s.EmailSocial,
                    NgayLienKet = s.NgayLienKet ?? DateTime.MinValue
                }).ToList(),
            CaiDat = entity.TblCaidat != null ? new CaiDatThongKeDto
            {
                NgonNgu = entity.TblCaidat.NgonNgu,
                TienTe = entity.TblCaidat.TienTe,
                CheDoToi = entity.TblCaidat.CheDoToi == 1,
                DinhDangNgay = entity.TblCaidat.DinhDangNgay,
                NhanThongBao = entity.TblCaidat.NhanThongBao == 1
            } : null
        };
    }

    public async Task<int> TaoMoiAdminAsync(TaoNguoiDungAdminDto dto, CancellationToken ct = default)
    {
        var entity = new TblNguoidung
        {
            HoTen = dto.HoTen.Trim(),
            Email = dto.Email.Trim().ToLower(),
            SoDienThoai = string.IsNullOrWhiteSpace(dto.SoDienThoai) ? null : dto.SoDienThoai.Trim(),
            MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
            NgayTao = TimeHelper.NowInVietnam(),
            TrangThai = dto.TrangThai,
            EmailDaXacThuc = 0,
            Dang2FA = 0,
            DaXoa = 0
        };

        _db.TblNguoidungs.Add(entity);
        await _db.SaveChangesAsync(ct);

        return entity.NguoiDungId;
    }

    public async Task<bool> CapNhatAdminAsync(int id, CapNhatNguoiDungAdminDto dto, CancellationToken ct = default)
    {
        var entity = await _db.TblNguoidungs.FirstOrDefaultAsync(x => x.NguoiDungId == id, ct);
        if (entity == null) return false;

        if (!string.IsNullOrWhiteSpace(dto.HoTen))
            entity.HoTen = dto.HoTen.Trim();

        if (dto.SoDienThoai != null)
            entity.SoDienThoai = string.IsNullOrWhiteSpace(dto.SoDienThoai) ? null : dto.SoDienThoai.Trim();

        if (dto.TrangThai.HasValue)
            entity.TrangThai = dto.TrangThai.Value;

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int nguoiDungId, CancellationToken huyBo = default)
    {
        var entity = await _db.TblNguoidungs.FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId, huyBo);
        if (entity == null) return false;

        // Soft delete
        entity.DaXoa = 1;
        await _db.SaveChangesAsync(huyBo);
        return true;
    }

    public async Task<PagedResponse<LichSuDangNhapDto>> LayLichSuDangNhapAsync(int nguoiDungId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId)
            .OrderByDescending(x => x.ThoiGian);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new LichSuDangNhapDto
            {
                Id = x.Id,
                NguoiDungId = x.NguoiDungId,
                HoTen = null,
                ThoiGian = x.ThoiGian,
                IpAddress = x.IpAddress,
                ThietBi = x.ThietBi,
                HeDieuHanh = x.HeDieuHanh,
                ViTri = x.ViTri,
                ThanhCong = x.KetQua == 1
            })
            .ToListAsync(ct);

        return new PagedResponse<LichSuDangNhapDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<bool> CapNhatTrangThaiAsync(int nguoiDungId, sbyte trangThai, CancellationToken huyBo = default)
    {
        var entity = await _db.TblNguoidungs.FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId, huyBo);
        if (entity == null) return false;

        entity.TrangThai = trangThai;
        await _db.SaveChangesAsync(huyBo);
        return true;
    }

    public async Task<NguoiDungMeDto?> LayMeAsync(int nguoiDungId, CancellationToken huyBo = default)
    {
        var u = await _db.TblNguoidungs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId, huyBo);
        if (u == null) return null;

        return new NguoiDungMeDto
        {
            NguoiDungId = u.NguoiDungId,
            HoTen = u.HoTen,
            Email = u.Email,
            SoDienThoai = u.SoDienThoai,
            AnhDaiDien = u.AnhDaiDien,
            NgayTao = u.NgayTao,
            TrangThai = u.TrangThai,
            EmailDaXacThuc = u.EmailDaXacThuc,
            SoDienThoaiDaXacThuc = u.SoDienThoaiDaXacThuc,
            Dang2FA = u.Dang2FA,
            LanDangNhapCuoi = u.LanDangNhapCuoi,
            DaXoa = u.DaXoa
        };
    }

    public async Task<bool> CapNhatMeAsync(int nguoiDungId, CapNhatNguoiDungMeDto dto, CancellationToken huyBo = default)
    {
        var u = await _db.TblNguoidungs.FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId, huyBo);
        if (u == null) return false;

        u.HoTen = dto.HoTen.Trim();
        u.SoDienThoai = string.IsNullOrWhiteSpace(dto.SoDienThoai) ? null : dto.SoDienThoai.Trim();
        u.AnhDaiDien = string.IsNullOrWhiteSpace(dto.AnhDaiDien) ? null : dto.AnhDaiDien.Trim();

        await _db.SaveChangesAsync(huyBo);
        return true;
    }

    public async Task<List<string>> LayVaiTroTheoNguoiDungIdAsync(int nguoiDungId, CancellationToken huyBo = default)
    {
        var vaiTro = await _db.TblNguoidungVaitros
            .AsNoTracking()
            .Where(uv => uv.NguoiDungId == nguoiDungId)
            .Join(_db.TblVaitros,
                uv => uv.VaiTroId,
                v => v.VaiTroId,
                (uv, v) => v.TenVaiTro)
            .ToListAsync(huyBo);

        return vaiTro ?? new List<string>();
    }

    public async Task<bool> CapNhatMatKhauAsync(int nguoiDungId, string matKhauMoi, CancellationToken huyBo = default)
    {
        var entity = await _db.TblNguoidungs.FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId, huyBo);
        if (entity == null) return false;

        entity.MatKhau = BCrypt.Net.BCrypt.HashPassword(matKhauMoi);
        await _db.SaveChangesAsync(huyBo);
        return true;
    }

    public async Task<bool> DoiMatKhauAsync(int nguoiDungId, DoiMatKhauDto dto, CancellationToken huyBo = default)
    {
        var entity = await _db.TblNguoidungs.FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId, huyBo);
        if (entity == null) return false;

        if (string.IsNullOrEmpty(entity.MatKhau))
        {
            entity.MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhauMoi);
            _db.Entry(entity).State = EntityState.Modified;
            await _db.SaveChangesAsync(huyBo);
            return true;
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.MatKhauCu, entity.MatKhau))
            return false;

        entity.MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhauMoi);
        _db.Entry(entity).State = EntityState.Modified;
        await _db.SaveChangesAsync(huyBo);
        return true;
    }

    public async Task<NguoiDungLoginDto?> LayDangNhapAsync(string key, CancellationToken ct = default)
    {
        var k = key.Trim();

        var entity = await _db.TblNguoidungs
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Email == k || x.SoDienThoai == k,
                ct);

        if (entity == null) return null;

        return new NguoiDungLoginDto
        {
            NguoiDungId = entity.NguoiDungId,
            Email = entity.Email,
            SoDienThoai = entity.SoDienThoai,
            MatKhau = entity.MatKhau,
            TrangThai = entity.TrangThai
        };
    }

    // ============ Dashboard Stats ============

    public async Task<int> DemNguoiDungHoatDongAsync(CancellationToken ct = default)
    {
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.TrangThai == 1 && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemNguoiDungMoi7NgayAsync(CancellationToken ct = default)
    {
        var ngay7Truoc = TimeHelper.NowInVietnam().AddDays(-7);
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.NgayTao >= ngay7Truoc && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemNguoiDungBiVoHieuHoaAsync(CancellationToken ct = default)
    {
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.TrangThai == 0 && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<ThongKeNguoiDungDto> LayThongKeTangTruongNguoiDungAsync(int nam, CancellationToken ct = default)
    {
        var ngayDauNam = new DateTime(nam, 1, 1);
        var ngayCuoiNam = new DateTime(nam, 12, 31, 23, 59, 59);

        var result = new ThongKeNguoiDungDto
        {
            Labels = new List<string>(),
            Data = new List<decimal>()
        };

        var thangNames = new[] { "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12" };

        for (int thang = 1; thang <= 12; thang++)
        {
            result.Labels.Add(thangNames[thang - 1]);

            var ngayDauThang = new DateTime(nam, thang, 1);
            var ngayCuoiThang = ngayDauThang.AddMonths(1).AddDays(-1);

            var dem = await _db.TblNguoidungs
                .AsNoTracking()
                .Where(x => x.NgayTao >= ngayDauThang && x.NgayTao <= ngayCuoiThang && x.DaXoa == 0)
                .CountAsync(ct);

            result.Data.Add(dem);
        }

        return result;
    }

    public async Task<ThongKeTongQuanNguoiDungDto> LayThongKeTongQuanAsync(CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var dauThang = new DateTime(now.Year, now.Month, 1);

        return new ThongKeTongQuanNguoiDungDto
        {
            TongNguoiDung = await _db.TblNguoidungs.AsNoTracking().Where(x => x.DaXoa == 0).CountAsync(ct),
            DangHoatDong = await _db.TblNguoidungs.AsNoTracking().Where(x => x.TrangThai == 1 && x.DaXoa == 0).CountAsync(ct),
            BiKhoa = await _db.TblNguoidungs.AsNoTracking().Where(x => x.TrangThai == 0 && x.DaXoa == 0).CountAsync(ct),
            DangKyThangNay = await _db.TblNguoidungs.AsNoTracking().Where(x => x.NgayTao >= dauThang && x.DaXoa == 0).CountAsync(ct)
        };
    }

    public async Task<ThongKeTongQuanNguoiDungDto> LayThongKeTheoLocAsync(LocNguoiDungFilter filter, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var dauThang = new DateTime(now.Year, now.Month, 1);

        var query = _db.TblNguoidungs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(x =>
                x.HoTen.ToLower().Contains(search) ||
                x.Email.ToLower().Contains(search) ||
                (x.SoDienThoai != null && x.SoDienThoai.Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(filter.TrangThai))
        {
            query = filter.TrangThai switch
            {
                "HOAT_DONG" => query.Where(x => x.TrangThai == 1 && x.DaXoa == 0),
                "KHOA" => query.Where(x => x.TrangThai == 0 && x.DaXoa == 0),
                "DA_XOA" => query.Where(x => x.DaXoa == 1),
                _ => query
            };
        }
        else
        {
            query = query.Where(x => x.DaXoa == 0);
        }

        if (!string.IsNullOrWhiteSpace(filter.TuNgay) && DateTime.TryParse(filter.TuNgay, out var tuNgay))
        {
            query = query.Where(x => x.NgayTao >= tuNgay);
        }

        if (!string.IsNullOrWhiteSpace(filter.DenNgay) && DateTime.TryParse(filter.DenNgay, out var denNgay))
        {
            query = query.Where(x => x.NgayTao <= denNgay);
        }

        var total = await query.CountAsync(ct);
        var hoatDong = await query.CountAsync(x => x.TrangThai == 1, ct);
        var biKhoa = await query.CountAsync(x => x.TrangThai == 0, ct);
        var thangNay = await query.CountAsync(x => x.NgayTao >= dauThang, ct);

        return new ThongKeTongQuanNguoiDungDto
        {
            TongNguoiDung = total,
            DangHoatDong = hoatDong,
            BiKhoa = biKhoa,
            DangKyThangNay = thangNay
        };
    }

    public async Task<byte[]> XuatExcelAsync(LocNguoiDungFilter? filter, CancellationToken ct = default)
    {
        var (items, _) = await LayDanhSachAdminAsync(1, 10000, filter, ct);

        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var ws = workbook.Worksheets.Add("Danh sach nguoi dung");

        // Header
        ws.Cell(1, 1).Value = "STT";
        ws.Cell(1, 2).Value = "Họ tên";
        ws.Cell(1, 3).Value = "Email";
        ws.Cell(1, 4).Value = "Số điện thoại";
        ws.Cell(1, 5).Value = "Vai trò";
        ws.Cell(1, 6).Value = "Trạng thái";
        ws.Cell(1, 7).Value = "Xác thực Email";
        ws.Cell(1, 8).Value = "Ngày tạo";

        ws.Row(1).Style.Font.Bold = true;
        ws.Row(1).Style.Fill.BackgroundColor = ClosedXML.Excel.XLColor.LightGray;

        // Data
        for (int i = 0; i < items.Count; i++)
        {
            var item = items[i];
            ws.Cell(i + 2, 1).Value = i + 1;
            ws.Cell(i + 2, 2).Value = item.HoTen;
            ws.Cell(i + 2, 3).Value = item.Email;
            ws.Cell(i + 2, 4).Value = item.SoDienThoai ?? "";
            ws.Cell(i + 2, 5).Value = string.Join(", ", item.VaiTro);
            ws.Cell(i + 2, 6).Value = item.TrangThai == 1 ? "Hoạt động" : item.TrangThai == 0 ? "Khóa" : "Đã xóa";
            ws.Cell(i + 2, 7).Value = item.EmailDaXacThuc ? "Đã xác thực" : "Chưa xác thực";
            ws.Cell(i + 2, 8).Value = item.NgayTao?.ToString("dd/MM/yyyy") ?? "";
        }

        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        return ms.ToArray();
    }

    // ============ Báo cáo thống kê mở rộng ============

    public async Task<int> DemTongNguoiDungAsync(CancellationToken ct = default)
    {
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemNguoiDungDaXoaAsync(CancellationToken ct = default)
    {
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.DaXoa == 1)
            .CountAsync(ct);
    }

    public async Task<int> DemEmailDaXacThucAsync(CancellationToken ct = default)
    {
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.EmailDaXacThuc == 1 && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemSDTDaXacThucAsync(CancellationToken ct = default)
    {
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.SoDienThoai != null && x.SoDienThoai.Length >= 10 && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemDang2FAAsync(CancellationToken ct = default)
    {
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.Dang2FA == 1 && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemSocialProviderAsync(string provider, CancellationToken ct = default)
    {
        return await _db.TblNguoidungSocials
            .AsNoTracking()
            .Where(x => x.Provider == provider)
            .CountAsync(ct);
    }

    public async Task<int> DemNguoiDungMoiTheoNgayAsync(DateTime date, CancellationToken ct = default)
    {
        var startOfDay = date.Date;
        var endOfDay = startOfDay.AddDays(1);
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.NgayTao >= startOfDay && x.NgayTao < endOfDay && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemNguoiDungMoiTheoTuanAsync(DateTime weekStart, CancellationToken ct = default)
    {
        var weekEnd = weekStart.AddDays(7);
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.NgayTao >= weekStart && x.NgayTao < weekEnd && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<int> DemNguoiDungMoiTheoThangAsync(int month, int year, CancellationToken ct = default)
    {
        var startOfMonth = new DateTime(year, month, 1);
        var endOfMonth = startOfMonth.AddMonths(1);
        return await _db.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.NgayTao >= startOfMonth && x.NgayTao < endOfMonth && x.DaXoa == 0)
            .CountAsync(ct);
    }

    public async Task<List<NguoiDungDto>> LayNguoiDungKhongHoatDongAsync(DateTime cutoffDate, CancellationToken ct = default)
    {
        var entities = await _db.TblNguoidungs
            .AsNoTracking()
            .Include(x => x.TblNguoidungVaitros)
            .ThenInclude(x => x.VaiTro)
            .Where(x => (x.LanDangNhapCuoi == null || x.LanDangNhapCuoi < cutoffDate) && x.DaXoa == 0)
            .OrderBy(x => x.LanDangNhapCuoi)
            .Take(100)
            .ToListAsync(ct);

        return entities.Select(MapToDto).ToList();
    }
}
