using DTO;

namespace BLL.Interfaces;

public interface IChatAiBll
{
    Task<List<ChatAiDto>> LayLichSuAsync(int nguoiDungId);
    Task<int> LuuChatAsync(ChatAiDto dto);
    Task<bool> XoaLichSuAsync(int nguoiDungId);
}
