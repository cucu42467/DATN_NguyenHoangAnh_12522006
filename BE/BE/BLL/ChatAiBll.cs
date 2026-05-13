using DAL.Interfaces;
using DTO;

using BLL.Interfaces;

namespace BLL;

public class ChatAiBll : IChatAiBll
{
    private readonly IChatAiDal _chatAiDal;
    public ChatAiBll(IChatAiDal chatAiDal) { _chatAiDal = chatAiDal; }
    public Task<List<ChatAiDto>> LayLichSuAsync(int nguoiDungId) => _chatAiDal.LayLichSuAsync(nguoiDungId);
    public Task<int> LuuChatAsync(ChatAiDto dto) => _chatAiDal.LuuChatAsync(dto);
    public Task<bool> XoaLichSuAsync(int nguoiDungId) => _chatAiDal.XoaLichSuAsync(nguoiDungId);
}
