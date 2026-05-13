using System.Text;
using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Http;

namespace BLL;

public class ImportBll : IImportBll
{
    private readonly IImportDal _importDal;
    private readonly IAuditLogDal _auditLogDal;

    public ImportBll(IImportDal importDal, IAuditLogDal auditLogDal)
    {
        _importDal = importDal;
        _auditLogDal = auditLogDal;
    }

    private async Task GhiAuditLogAsync(int? nguoiDungId, int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_import_file",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<TaoImportPhanHoiDto> TaiLenAsync(int nguoiDungId, int taiKhoanId, IFormFile file, string? dinhDang, CancellationToken ct = default)
    {
        try
        {
            if (file.Length <= 0) throw new InvalidOperationException("File rỗng.");

            // MVP: không phụ thuộc thư viện parse; lưu raw lines vào tbl_import_chitiet để admin/user review.
            // FE hiện cũng import client-side; API này phục vụ luồng import server-side về sau.
            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, leaveOpen: false);

            var lines = new List<string>();
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync(ct);
                if (line == null) break;
                if (!string.IsNullOrWhiteSpace(line)) lines.Add(line);
                if (lines.Count >= 5000) break; // giới hạn an toàn
            }

            var importId = await _importDal.TaoImportAsync(
                nguoiDungId,
                taiKhoanId,
                file.FileName,
                lines.Count,
                ct);

            var chiTiet = lines.Select(l => new ImportChiTietDto
            {
                ImportId = importId,
                MoTa = l,
                TrangThaiXuLy = 0, // 0=pending
                GhiChuLoi = string.IsNullOrWhiteSpace(dinhDang) ? null : $"DINH_DANG:{dinhDang}"
            });

            await _importDal.ThemChiTietAsync(nguoiDungId, importId, chiTiet, ct);

            // Ghi audit log
            await GhiAuditLogAsync(nguoiDungId, importId, "INSERT", null, new { TenFile = file.FileName, TongDong = lines.Count });

            return new TaoImportPhanHoiDto
            {
                ImportId = importId,
                TrangThai = 0
            };
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tải lên file import: {ex.Message}", ex);
        }
    }

    public async Task<ImportFileDto?> LayImportAsync(int nguoiDungId, int importId, CancellationToken ct = default)
    {
        try
        {
            return await _importDal.LayImportAsync(nguoiDungId, importId, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy thông tin import ID {importId}: {ex.Message}", ex);
        }
    }

    public async Task<List<ImportChiTietDto>> LayChiTietAsync(int nguoiDungId, int importId, LocImportChiTietDto loc, CancellationToken ct = default)
    {
        try
        {
            return await _importDal.LayChiTietAsync(nguoiDungId, importId, loc, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy chi tiết import ID {importId}: {ex.Message}", ex);
        }
    }

    public async Task<bool> XacNhanAsync(int nguoiDungId, int importId, CancellationToken ct = default)
    {
        try
        {
            // MVP: đánh dấu đã xử lý + completed.
            var ok = await _importDal.DanhDauChiTietDaXuLyAsync(nguoiDungId, importId, trangThaiXuLy: 1, ct);
            if (!ok) return false;
            var result = await _importDal.CapNhatTrangThaiImportAsync(nguoiDungId, importId, trangThai: 1, ct);
            if (result)
                await GhiAuditLogAsync(nguoiDungId, importId, "CONFIRM", null, new { TrangThai = 1 });
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi xác nhận import ID {importId}: {ex.Message}", ex);
        }
    }

    public async Task<bool> HuyAsync(int nguoiDungId, int importId, CancellationToken ct = default)
    {
        try
        {
            // 2 = cancelled
            var result = await _importDal.CapNhatTrangThaiImportAsync(nguoiDungId, importId, trangThai: 2, ct);
            if (result)
                await GhiAuditLogAsync(nguoiDungId, importId, "CANCEL", null, new { TrangThai = 2 });
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi hủy import ID {importId}: {ex.Message}", ex);
        }
    }

    public async Task<List<ImportFileDto>> LayDanhSachAdminAsync(int page, int pageSize, sbyte? trangThai, CancellationToken ct = default)
    {
        try
        {
            return await _importDal.LayDanhSachAdminAsync(page, pageSize, trangThai, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy danh sách import admin: {ex.Message}", ex);
        }
    }

    public async Task<List<ImportChiTietDto>> LayChiTietAdminAsync(int importId, int page, int pageSize, CancellationToken ct = default)
    {
        try
        {
            return await _importDal.LayChiTietAdminAsync(importId, page, pageSize, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy chi tiết import admin ID {importId}: {ex.Message}", ex);
        }
    }
}
