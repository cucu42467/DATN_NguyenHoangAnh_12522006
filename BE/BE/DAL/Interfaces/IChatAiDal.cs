using DTO;

namespace DAL.Interfaces;

public interface IChatAiDal
{
    Task<List<ChatAiDto>> LayLichSuAsync(int nguoiDungId);
    Task<int> LuuChatAsync(ChatAiDto dto);
    Task<bool> XoaLichSuAsync(int nguoiDungId);
}
