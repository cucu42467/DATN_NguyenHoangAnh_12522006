using DAL.Interfaces;
using DTO;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;

namespace BLL;

public class AiService
{
    private readonly IAiModelDal _aiModelDal;
    private readonly ILogger<AiService> _logger;
    private readonly HttpClient _httpClient;

    // Cache config để tránh query DB mỗi lần call
    private AiModelDto? _cachedModel;
    private DateTime _cacheExpiry = DateTime.MinValue;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(5);

    public AiService(IAiModelDal aiModelDal, ILogger<AiService> logger)
    {
        _aiModelDal = aiModelDal;
        _logger = logger;
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(180)
        };
    }

    private async Task<AiModelDto> LayModelTuDBAsync(string mucDich = "chat", CancellationToken ct = default)
    {
        // Kiểm tra cache trước
        if (_cachedModel != null && DateTime.UtcNow < _cacheExpiry)
        {
            return _cachedModel;
        }

        // Load từ DB
        var model = await _aiModelDal.LayModelTheoMucDichAsync(mucDich);

        if (model == null)
        {
            _logger.LogWarning("[AiService] Khong tim thay model AI voi muc dich '{MucDich}' trong DB. Thu lay model 'chat' mac dinh.", mucDich);
            model = await _aiModelDal.LayModelTheoMucDichAsync("chat");
        }

        if (model == null)
        {
            _logger.LogError("[AiService] Khong co model AI nao duoc cau hinh trong bang tbl_ai_model!");
            throw new Exception("Chua cau hinh AI model. Vui long them model AI trong bang tbl_ai_model.");
        }

        // Cache lại
        _cachedModel = model;
        _cacheExpiry = DateTime.UtcNow.Add(_cacheDuration);

        var maskedKey = !string.IsNullOrEmpty(model.ApiKey) && model.ApiKey.Length > 8
            ? $"{model.ApiKey.Substring(0, 4)}...{model.ApiKey.Substring(model.ApiKey.Length - 4)}"
            : "***";
        _logger.LogInformation("[AiService] Da load AI config tu DB - Provider: {Provider}, Model: {Model}, Key: {KeyPrefix}",
            model.Provider, model.TenModel, maskedKey);

        return model;
    }

    public async Task<AiModelDto?> GetCurrentModelAsync(string mucDich = "chat", CancellationToken ct = default)
    {
        try
        {
            return await LayModelTuDBAsync(mucDich, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Loi khi lay AI model");
            return null;
        }
    }

    // ================= CALL AI CORE =================
    private async Task<string> CallAiCoreAsync(string prompt, List<GeminiChatMessage>? lichSuTinNhan, string mucDich, CancellationToken ct)
    {
        var model = await LayModelTuDBAsync(mucDich, ct);

        var apiKey = model.ApiKey ?? throw new Exception($"API Key khong ton tai cho model {model.TenModel}");
        var apiUrl = model.ApiUrl ?? "https://openrouter.ai/api/v1/chat/completions";

        _logger.LogInformation("Calling AI API. Provider: {Provider}, Model: {Model}, URL: {Url}", model.Provider, model.TenModel, apiUrl);

        var messages = new List<object>();

        if (lichSuTinNhan != null)
        {
            foreach (var item in lichSuTinNhan)
            {
                var role = item.VaiTro?.ToLower() == "model" ? "assistant" : "user";
                messages.Add(new { role, content = item.NoiDung });
            }
        }

        messages.Add(new { role = "user", content = prompt });

        var body = new
        {
            model = model.TenModel,
            messages,
            temperature = 0.7,
            max_tokens = 2048
        };

        try
        {
            var json = JsonSerializer.Serialize(body);
            using var request = new HttpRequestMessage(HttpMethod.Post, apiUrl)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

            HttpResponseMessage response;
            try
            {
                response = await _httpClient.SendAsync(request, ct);
            }
            catch (TaskCanceledException ex) when (ex.InnerException is TimeoutException)
            {
                _logger.LogWarning("AI API timeout, retrying...");
                // Retry once
                using var retryRequest = new HttpRequestMessage(HttpMethod.Post, apiUrl)
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
                retryRequest.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
                response = await _httpClient.SendAsync(retryRequest, ct);
            }

            var responseContent = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("AI API Request Failed! Status: {StatusCode}, Response: {Response}", (int)response.StatusCode, responseContent);
                throw new Exception($"AI API failed with status {response.StatusCode}");
            }

            using var doc = JsonDocument.Parse(responseContent);
            var root = doc.RootElement;
            if (!root.TryGetProperty("choices", out var choices) || choices.GetArrayLength() == 0)
            {
                _logger.LogWarning("AI API returned success but no choice was found.");
                return string.Empty;
            }

            var message = choices[0].GetProperty("message");
            var content = message.GetProperty("content").GetString() ?? string.Empty;
            return content;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to parse AI response JSON.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred while calling AI.");
            throw;
        }
    }

    // ================= PUBLIC: Call AI for Query =================
    /// <summary>
    /// Public method để call AI với custom prompt
    /// Used by AI Query Service
    /// </summary>
    public async Task<string> CallAiAsync(string prompt, List<GeminiChatMessage>? lichSuTinNhan, string mucDich = "chat", CancellationToken ct = default)
    {
        return await CallAiCoreAsync(prompt, lichSuTinNhan, mucDich, ct);
    }

    // ================= PHÂN TÍCH =================
    public async Task<GeminiPhanTichResponse> PhanTichChiTieuAsync(
        decimal tongThu,
        decimal tongChi,
        Dictionary<string, decimal> chiTheoDanhMuc,
        string? nganSach = null,
        CancellationToken ct = default)
    {
        try
        {
            var prompt = TaoPromptPhanTich(tongThu, tongChi, chiTheoDanhMuc, nganSach);

            var text = await CallAiCoreAsync(prompt, null, "phan_tich_chi_tieu", ct);

            if (string.IsNullOrWhiteSpace(text))
                return TaoFallbackResponse(tongThu, tongChi, chiTheoDanhMuc);

            var clean = CleanJsonString(text);

            var result = JsonSerializer.Deserialize<GeminiPhanTichResponse>(clean,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result ?? TaoFallbackResponse(tongThu, tongChi, chiTheoDanhMuc);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Phân tích lỗi → fallback");
            return TaoFallbackResponse(tongThu, tongChi, chiTheoDanhMuc);
        }
    }

    // ================= CHAT =================
    public async Task<GeminiChatResponse> ChatAsync(
        string tinNhan,
        List<GeminiChatMessage>? lichSuTinNhan,
        string loaiYeuCau,
        decimal? thuNhap = null,
        decimal? tongChi = null,
        decimal? tongThu = null,
        Dictionary<string, decimal>? chiTheoDanhMuc = null,
        decimal? soDu = null,
        List<string>? mucTieu = null,
        List<GiaoDichDto>? giaoDichChiTiet = null,
        CancellationToken ct = default)
    {
        try
        {
            var prompt = TaoPromptChat(tinNhan, lichSuTinNhan, loaiYeuCau,
                thuNhap, tongChi, tongThu, chiTheoDanhMuc, soDu, mucTieu, giaoDichChiTiet);

            var text = await CallAiCoreAsync(prompt, lichSuTinNhan, "chat", ct);

            if (string.IsNullOrWhiteSpace(text))
            {
                return new GeminiChatResponse
                {
                    PhanHoi = "Không thể xử lý yêu cầu.",
                    LoaiPhanHoi = "WARNING"
                };
            }

            return XuLyPhanHoiChat(text, loaiYeuCau);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Chat lỗi");

            return new GeminiChatResponse
            {
                PhanHoi = "Đã xảy ra lỗi. Vui lòng thử lại.",
                LoaiPhanHoi = "WARNING"
            };
        }
    }

    // ================= PROMPT =================
    private string TaoPromptChat(
        string tinNhan,
        List<GeminiChatMessage>? lichSuTinNhan,
        string loaiYeuCau,
        decimal? thuNhap,
        decimal? tongChi,
        decimal? tongThu,
        Dictionary<string, decimal>? chiTheoDanhMuc,
        decimal? soDu,
        List<string>? mucTieu,
        List<GiaoDichDto>? giaoDichChiTiet)
    {
        var sb = new StringBuilder();

        sb.AppendLine("Bạn là cố vấn tài chính AI của người dùng. Dữ liệu tài chính bên dưới có thể hỗ trợ câu trả lời của bạn.");

        if (thuNhap.HasValue || tongChi.HasValue || tongThu.HasValue || soDu.HasValue)
        {
            sb.AppendLine("Dữ liệu tổng quan:");
            if (thuNhap.HasValue) sb.AppendLine($"- Thu nhập tháng này: {thuNhap.Value:N0}");
            if (tongChi.HasValue) sb.AppendLine($"- Tổng chi tiêu tháng này: {tongChi.Value:N0}");
            if (tongThu.HasValue) sb.AppendLine($"- Tổng thu nhập tháng này: {tongThu.Value:N0}");
            if (soDu.HasValue) sb.AppendLine($"- Số dư tài khoản hiện tại: {soDu.Value:N0}");
        }

        if (chiTheoDanhMuc != null && chiTheoDanhMuc.Any())
        {
            sb.AppendLine("Chi tiêu theo danh mục:");
            foreach (var item in chiTheoDanhMuc.OrderByDescending(x => x.Value).Take(5))
            {
                sb.AppendLine($"- {item.Key}: {item.Value:N0}");
            }
        }

        if (giaoDichChiTiet != null && giaoDichChiTiet.Any())
        {
            sb.AppendLine("Danh sách giao dịch chi tiết của tháng hiện tại:");
            sb.AppendLine("ID | Ngày | Loại | Danh mục | Tài khoản nguồn | Tài khoản đích | Số tiền | Ghi chú");
            sb.AppendLine("---|---|---|---|---|---|---|---");
            foreach (var gd in giaoDichChiTiet.Take(50))
            {
                sb.AppendLine($"{gd.GiaoDichId} | {gd.NgayGiaoDich:yyyy-MM-dd} | {gd.LoaiGiaoDich} | {gd.TenDanhMuc ?? ""} | {gd.TenTaiKhoanNguon ?? ""} | {gd.TenTaiKhoanDich ?? ""} | {gd.SoTien:N0} | {gd.GhiChu?.Replace("|", "\\|") ?? ""}");
            }
            if (giaoDichChiTiet.Count > 50)
            {
                sb.AppendLine($"(Hiển thị 50 giao dịch đầu tiên trên tổng {giaoDichChiTiet.Count} giao dịch.)");
            }
        }

        if (mucTieu != null && mucTieu.Any())
        {
            sb.AppendLine($"Mục tiêu đang theo dõi: {string.Join(", ", mucTieu)}");
        }

        sb.AppendLine($"Loại yêu cầu: {loaiYeuCau}");
        sb.AppendLine();
        sb.AppendLine($"Câu hỏi: {tinNhan}");
        sb.AppendLine();
            sb.AppendLine("QUAN TRỌNG - HƯỚNG DẪN TRẢ LỜI:");
            sb.AppendLine("1. KHÔNG suy nghĩ trước khi trả lời. KHÔNG viết thinking, reasoning, hay phân tích bên trong.");
            sb.AppendLine("2. Trả lời BẰNG TIẾNG VIỆT THUẦN TÚY.");
            sb.AppendLine("3. CHỈ trả về JSON hợp lệ, không có gì khác ngoài JSON.");
            sb.AppendLine("4. KHÔNG thêm markdown code block, KHÔNG thêm comment, KHÔNG thêm giải thích.");
            sb.AppendLine();
            sb.AppendLine("Trả lời ngay JSON thuần (KHÔNG có ```json hay bất kỳ text nào khác):");
            sb.AppendLine(@"{""phanHoi"":""##TIEUDE## Tiêu đề\n###SUBTIEUDE### Nội dung\n-ITEM~ Mục 1"",""loaiPhanHoi"":""TEXT"",""goiYHanDong"":[],""duLieuBieuDo"":null}");

        return sb.ToString();
    }

    private string TaoPromptPhanTich(decimal tongThu, decimal tongChi, Dictionary<string, decimal> chiTheoDanhMuc, string? nganSach)
    {
        return $"Thu: {tongThu}, Chi: {tongChi}. Phân tích và trả JSON.";
    }

    // ================= CLEAN =================
    private string CleanJsonString(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "{}";

        var output = input.Trim();

        // Loại bỏ markdown code block
        if (output.StartsWith("```"))
        {
            var lines = output.Split('\n');
            if (lines.Length > 2)
            {
                output = string.Join("\n", lines.Skip(1).Take(lines.Length - 2));
            }
            else
            {
                output = output.Replace("```", "").Trim();
            }
        }

        // Loại bỏ "json" sau ```
        if (output.StartsWith("json", StringComparison.OrdinalIgnoreCase))
        {
            output = output.Substring(4).Trim();
        }

        // Tìm dấu { đầu tiên và } cuối cùng để trích JSON
        var firstBrace = output.IndexOf('{');
        var lastBrace = output.LastIndexOf('}');

        if (firstBrace >= 0 && lastBrace > firstBrace)
        {
            output = output.Substring(firstBrace, lastBrace - firstBrace + 1);
        }

        return output;
    }

    // ================= FALLBACK =================
    private GeminiPhanTichResponse TaoFallbackResponse(decimal tongThu, decimal tongChi, Dictionary<string, decimal> chiTheoDanhMuc)
    {
        return new GeminiPhanTichResponse
        {
            GoiY = new List<GeminiGoiY>
            {
                new()
                {
                    Loai = "GOI_Y",
                    TieuDe = "Fallback",
                    NoiDung = "Không lấy được AI"
                }
            },
            PhanTich = new GeminiPhanTichKetQua
            {
                TongThu = tongThu,
                TongChi = tongChi,
                TyLeTietKiem = "0%",
                DanhMucNhieuNhat = ""
            }
        };
    }

    private GeminiChatResponse XuLyPhanHoiChat(string text, string loaiYeuCau)
    {
        try
        {
            var cleaned = CleanJsonString(text);
            var parsed = JsonSerializer.Deserialize<GeminiChatResponse>(cleaned,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (parsed != null) return parsed;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Parse JSON thất bại, thử xử lý text thuần");
        }

        // Fallback: trả về text thuần nếu JSON lỗi
        return new GeminiChatResponse
        {
            PhanHoi = text.Trim(),
            LoaiPhanHoi = "TEXT",
            DuLieuBieuDo = null,
            DuLieuDanhSach = null,
            GoiYHanDong = new List<GeminiGoiYHanDong>()
        };
    }
}