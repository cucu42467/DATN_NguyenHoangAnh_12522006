using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

using DAL.Interfaces;

namespace DAL;

public class ChatAiDal : IChatAiDal
{
    private readonly AppDbContext _context;
    public ChatAiDal(AppDbContext context) { _context = context; }

    public async Task<List<ChatAiDto>> LayLichSuAsync(int nguoiDungId)
    {
        return await _context.TblChatAis
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId)
            .OrderByDescending(x => x.ThoiGian)
            .Select(x => new ChatAiDto
            {
                ChatId = x.ChatId,
                NguoiDungId = x.NguoiDungId,
                CauHoi = x.CauHoi,
                TraLoi = x.TraLoi,
                ModelAI = x.ModelAI,
                SoToken = x.SoToken,
                ChiPhi = x.ChiPhi,
                ThoiGian = x.ThoiGian,
                TrangThai = x.TrangThai,
                // ← THÊM MỚI: 4 trường cuộc hội thoại
                CuocHoiThoaiId = x.CuocHoiThoaiId,
                TieuDe = x.TieuDe,
                VaiTro = x.VaiTro,
                ThuTu = x.ThuTu
            }).ToListAsync();
    }

    public async Task<int> LuuChatAsync(ChatAiDto dto)
    {
        // Xác định CuocHoiThoaiId - nếu null thì tạo mới   // ← THÊM MỚI
        string cuocHoiThoaiId;
        int thuTu;

        if (string.IsNullOrEmpty(dto.CuocHoiThoaiId))
        {
            // Tin đầu tiên của cuộc hội thoại mới - tạo GUID mới
            cuocHoiThoaiId = Guid.NewGuid().ToString();
            thuTu = 1;

            // Nếu có TieuDe, lưu luôn vào tin đầu tiên
            // (TieuDe chỉ lưu ở tin nhắn đầu tiên của cuộc hội thoại)
        }
        else
        {
            cuocHoiThoaiId = dto.CuocHoiThoaiId;

            // Đếm số tin nhắn hiện có trong cuộc hội thoại để xác định ThuTu
            thuTu = await _context.TblChatAis
                .CountAsync(x => x.CuocHoiThoaiId == cuocHoiThoaiId) + 1;
        }

        var entity = new TblChatAi
        {
            NguoiDungId = dto.NguoiDungId,
            CauHoi = dto.CauHoi,
            TraLoi = dto.TraLoi,
            ModelAI = dto.ModelAI,
            SoToken = dto.SoToken,
            ChiPhi = dto.ChiPhi,
            ThoiGian = DateTime.Now,
            TrangThai = 1,
            // ← THÊM MỚI: 4 trường cuộc hội thoại
            CuocHoiThoaiId = cuocHoiThoaiId,
            TieuDe = thuTu == 1 ? (dto.TieuDe ?? dto.CauHoi[..Math.Min(100, dto.CauHoi.Length)]) : null,
            VaiTro = dto.VaiTro ?? "user",
            ThuTu = thuTu
        };

        _context.TblChatAis.Add(entity);
        await _context.SaveChangesAsync();
        return entity.ChatId;
    }

    public async Task<bool> XoaLichSuAsync(int nguoiDungId)
    {
        var items = await _context.TblChatAis.Where(x => x.NguoiDungId == nguoiDungId).ToListAsync();
        _context.TblChatAis.RemoveRange(items);
        await _context.SaveChangesAsync();
        return true;
    }
}
