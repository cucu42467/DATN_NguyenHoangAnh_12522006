using BLL.Interfaces;
using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PhanHoiTraLoiController : ControllerBase
{
    private readonly IPhanHoiTraLoiBll _phanHoiTraLoiBll;

    public PhanHoiTraLoiController(IPhanHoiTraLoiBll phanHoiTraLoiBll)
    {
        _phanHoiTraLoiBll = phanHoiTraLoiBll;
    }

    [HttpGet("{phanHoiId}")]
    public async Task<ActionResult<ApiResponse<List<PhanHoiTraloiDto>>>> GetByPhanHoiId(int phanHoiId)
    {
        var data = await _phanHoiTraLoiBll.LayDanhSachTheoPhanHoiIdAsync(phanHoiId);
        return Ok(new ApiResponse<List<PhanHoiTraloiDto>> { Success = true, Data = data });
    }

    [HttpGet("dem-chua-doc/{nguoiDungId}")]
    public async Task<ActionResult<ApiResponse<int>>> DemChuaDoc(int nguoiDungId)
    {
        var count = await _phanHoiTraLoiBll.DemTraLoiChuaDocAsync(nguoiDungId);
        return Ok(new ApiResponse<int> { Success = true, Data = count });
    }

    [HttpGet("danh-sach-cua-toi/{nguoiDungId}")]
    public async Task<ActionResult<ApiResponse<List<PhanHoiDto>>>> GetDanhSachCuaToi(int nguoiDungId)
    {
        var data = await _phanHoiTraLoiBll.LayDanhSachPhanHoiCuaToiAsync(nguoiDungId);
        return Ok(new ApiResponse<List<PhanHoiDto>> { Success = true, Data = data });
    }

    [HttpPut("danh-dau-da-doc/{phanHoiId}/{nguoiDungId}")]
    public async Task<ActionResult<ApiResponse<bool>>> DanhDauDaDoc(int phanHoiId, int nguoiDungId)
    {
        var result = await _phanHoiTraLoiBll.DanhDauDaDocAsync(phanHoiId, nguoiDungId);
        return Ok(new ApiResponse<bool> { Success = true, Data = result });
    }

    [HttpPut("danh-dau-tat-ca-da-doc/{nguoiDungId}")]
    public async Task<ActionResult<ApiResponse<bool>>> DanhDauTatCaDaDoc(int nguoiDungId)
    {
        var result = await _phanHoiTraLoiBll.DanhDauTatCaDaDocAsync(nguoiDungId);
        return Ok(new ApiResponse<bool> { Success = true, Data = result });
    }
}
