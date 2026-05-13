using BLL.Interfaces;
using BLL.AIQuery;
using DAL.Interfaces;
using DTO;
using Microsoft.Extensions.Logging;

namespace BLL;

public class AiBll : IAiBll
{
    private readonly IAiDal _dal;
    private readonly AiService _aiService;
    private readonly AiQueryService _aiQueryService;
    private readonly IChatAiDal _chatAiDal;
    private readonly ILogger<AiBll> _logger;

    public AiBll(IAiDal dal, AiService aiService, AiQueryService aiQueryService, IChatAiDal chatAiDal, ILogger<AiBll> logger)
    {
        _dal = dal;
        _aiService = aiService;
        _aiQueryService = aiQueryService;
        _chatAiDal = chatAiDal;
        _logger = logger;
    }

    public async Task<DuDoanAIChartDto> LayDuDoanAsync(int nguoiDungId, int? thang, int? nam, CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayDuDoanAsync(nguoiDungId, thang, nam, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy dự đoán AI cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<List<LoiKhuyenAIDto>> LayGoiYAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayGoiYAsync(nguoiDungId, page, pageSize, daDoc, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy gợi ý AI cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<bool> DanhDauGoiYDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        try
        {
            return await _dal.DanhDauGoiYDaDocAsync(nguoiDungId, id, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi đánh dấu gợi ý đã đọc ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<List<CanhBaoHeThongDto>> LayCanhBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayCanhBaoAsync(nguoiDungId, page, pageSize, daDoc, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy cảnh báo cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<bool> DanhDauCanhBaoDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        try
        {
            return await _dal.DanhDauCanhBaoDaDocAsync(nguoiDungId, id, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi đánh dấu cảnh báo đã đọc ID {id}: {ex.Message}", ex);
        }
    }



    public async Task<GeminiPhanTichResponse> PhanTichChiTieuBangGeminiAsync(
        int nguoiDungId,
        DateTime? tuNgay,
        DateTime? denNgay,
        CancellationToken ct = default)
    {
        try
        {
            var data = await _dal.LayDuLieuPhanTichAsync(nguoiDungId, tuNgay, denNgay, ct);

            return await _aiService.PhanTichChiTieuAsync(
                data.TongThu,
                data.TongChi,
                data.ChiTheoDanhMuc,
                data.NganSach,
                ct
            );
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi phân tích AI cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<GeminiChatResponse> ChatVoiGeminiAsync(
        int nguoiDungId,
        string tinNhan,
        List<GeminiChatMessage>? lichSuTinNhan,
        string loaiYeuCau,
        CancellationToken ct = default)
    {
        try
        {
            // Lấy dữ liệu tổng hợp (luôn luôn cần)
            var data = await _dal.LayDuLieuChatAsync(nguoiDungId, ct);

            // Kiểm tra xem câu hỏi có cần truy vấn database chi tiết không
            var canhTruyVan = CanhTruyVanDatabase(tinNhan);

            if (canhTruyVan)
            {
                // Gọi AiQueryService để truy vấn database thực sự
                var queryResponse = await TruyVanDuLieuBoiAiQueryAsync(nguoiDungId, tinNhan, lichSuTinNhan, ct);
                await LuuChatVaoCSDLAsync(nguoiDungId, tinNhan, queryResponse);
                return queryResponse;
            }

            // Kiểm tra câu hỏi về kế hoạch/phân tích → cần dữ liệu chi tiết
            var canhTruyVanChiTiet = CanhTruyVanDuLieuChiTiet(tinNhan);
            if (canhTruyVanChiTiet)
            {
                // Lấy thêm dữ liệu chi tiết
                var dataChiTiet = await _dal.LayDuLieuPhanTichAsync(nguoiDungId, null, null, ct);

                // Gọi AI với dữ liệu chi tiết (TongThu là thu nhập)
                var chiTietResponse = await _aiService.ChatAsync(
                    tinNhan,
                    lichSuTinNhan,
                    loaiYeuCau,
                    dataChiTiet.TongThu,  // ThuNhap = TongThu
                    dataChiTiet.TongChi,
                    dataChiTiet.TongThu,
                    dataChiTiet.ChiTheoDanhMuc,
                    data.SoDu,
                    data.MucTieu,
                    data.GiaoDichChiTiet,
                    ct
                );
                await LuuChatVaoCSDLAsync(nguoiDungId, tinNhan, chiTietResponse);
                return chiTietResponse;
            }

            // Flow cơ bản - dùng dữ liệu tổng hợp
            var response = await _aiService.ChatAsync(
                tinNhan,
                lichSuTinNhan,
                loaiYeuCau,
                data.ThuNhap,
                data.TongChi,
                data.TongThu,
                data.ChiTheoDanhMuc,
                data.SoDu,
                data.MucTieu,
                data.GiaoDichChiTiet,
                ct
            );

            // Lưu vào CSDL
            await LuuChatVaoCSDLAsync(nguoiDungId, tinNhan, response);

            return response;
        }
        catch (Exception ex)
        {
            // Log lỗi ra console/database (đã có logger tự động)
            // Trả về response thân thiện cho user thay vì throw exception
            return new GeminiChatResponse
            {
                PhanHoi = "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.",
                LoaiPhanHoi = "ERROR",
                DuLieuBieuDo = null,
                DuLieuDanhSach = null,
                GoiYHanDong = new List<GeminiGoiYHanDong>
                {
                    new() { HanhDong = "THU_LAI", NoiDung = "Thử lại" }
                }
            };
        }
    }

    private async Task LuuChatVaoCSDLAsync(int nguoiDungId, string cauHoi, GeminiChatResponse traLoi)
    {
        try
        {
            var dto = new ChatAiDto
            {
                NguoiDungId = nguoiDungId,
                CauHoi = cauHoi,
                TraLoi = traLoi.PhanHoi,
                ModelAI = "NVIDIA-Nemotron-3",
                SoToken = null,
                ChiPhi = null,
                TrangThai = 1
            };
            await _chatAiDal.LuuChatAsync(dto);
        }
        catch
        {
            // Không throw lỗi để không ảnh hưởng chat chính
        }
    }

    private bool CanhTruyVanDuLieuChiTiet(string tinNhan)
    {
        var question = tinNhan.ToLowerInvariant();

        // Những từ khóa cần dữ liệu chi tiết để phân tích
        var canhTruyVan = new[]
        {
            // Kế hoạch
            "kế hoạch", "ke hoach", "plan",
            // Tiết kiệm
            "tiết kiệm", "tiet kiem", "save money", "saving",
            // Phân tích
            "phân tích", "phan tich", "analyze",
            // Gợi ý
            "gợi ý", "goi y", "suggest", "recommend",
            // So sánh
            "so sánh", "so sanh", "compare",
            // Xu hướng
            "xu hướng", "xu huong", "trend",
            // Đánh giá
            "đánh giá", "danh gia", "evaluate",
            // Tối ưu
            "tối ưu", "toi uu", "optimize",
            // Chiến lược
            "chiến lược", "chien luoc", "strategy"
        };

        foreach (var keyword in canhTruyVan)
        {
            if (question.Contains(keyword))
                return true;
        }

        return false;
    }

    private bool CanhTruyVanDatabase(string tinNhan)
    {
        var question = tinNhan.ToLowerInvariant();

        // Những từ khóa cho thấy user muốn xem dữ liệu cụ thể
        var canhTruyVan = new[]
        {
            // Thông báo
            "thông báo", "thong bao", "notification",
            // Giao dịch
            "giao dịch", "giao dich", "transaction",
            // Tài khoản
            "tài khoản", "tai khoan", "account",
            // Ngân sách
            "ngân sách", "ngan sach", "budget",
            // Mục tiêu
            "mục tiêu", "muc tieu", "goal",
            // Cảnh báo
            "cảnh báo", "canh bao", "warning",
            // Gợi ý
            "gợi ý", "goi y", "recommendation",
            // Giao dịch định kỳ
            "định kỳ", "dinh ky", "recurring",
            // Danh mục
            "danh mục", "danh muc", "category",
            // Câu hỏi về số lượng
            "bao nhiêu", "bao nhieu", "có bao", "có gì", "có không",
            // Câu hỏi về danh sách
            "danh sách", "danh sach", "list", "xem", "lấy", "lay", "hiển thị", "hien thi",
            // Câu hỏi top/n
            "top ", "3 ", "5 ", "10 ", "đầu", "mới nhất", "moi nhat", "gần nhất", "gan nhat", "cuối"
        };

        foreach (var keyword in canhTruyVan)
        {
            if (question.Contains(keyword))
                return true;
        }

        return false;
    }

    public async Task<GeminiChatDataDto> LayDuLieuChatAsync(
        int nguoiDungId,
        CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayDuLieuChatAsync(nguoiDungId, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy dữ liệu AI cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<List<ThongBaoDto>> LayThongBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayThongBaoAsync(nguoiDungId, page, pageSize, daDoc, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy thông báo cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<bool> DanhDauThongBaoDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        try
        {
            return await _dal.DanhDauThongBaoDaDocAsync(nguoiDungId, id, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi đánh dấu thông báo đã đọc ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<int> TaoThongBaoTuCanhBaoAsync(int nguoiDungId, CanhBaoHeThongDto canhBao, CancellationToken ct = default)
    {
        try
        {
            var thongBao = new TaoThongBaoDto
            {
                NguoiDungId = nguoiDungId,
                TieuDe = "Cảnh báo chi tiêu",
                NoiDung = canhBao.NoiDung,
                LoaiThongBao = 2 // LoaiThongBao = 2 cho CanhBao
            };

            return await _dal.TaoThongBaoAsync(thongBao, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tạo thông báo từ cảnh báo cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<int> TaoThongBaoTuGoiYAsync(int nguoiDungId, LoiKhuyenAIDto goiY, CancellationToken ct = default)
    {
        try
        {
            var thongBao = new TaoThongBaoDto
            {
                NguoiDungId = nguoiDungId,
                TieuDe = "Gợi ý từ AI",
                NoiDung = goiY.NoiDung,
                LoaiThongBao = 3 // LoaiThongBao = 3 cho GoiY
            };

            return await _dal.TaoThongBaoAsync(thongBao, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tạo thông báo từ gợi ý cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<int> TaoThongBaoTuDuDoanAsync(int nguoiDungId, string noiDung, CancellationToken ct = default)
    {
        try
        {
            var thongBao = new TaoThongBaoDto
            {
                NguoiDungId = nguoiDungId,
                TieuDe = "Dự đoán tài chính",
                NoiDung = noiDung,
                LoaiThongBao = 4 // LoaiThongBao = 4 cho DuDoan
            };

            return await _dal.TaoThongBaoAsync(thongBao, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tạo thông báo từ dự đoán cho người dùng {nguoiDungId}: {ex.Message}", ex);
        }
    }

    public async Task<GeminiChatResponse> TruyVanDuLieuBoiAiQueryAsync(
        int nguoiDungId,
        string cauHoi,
        List<GeminiChatMessage>? lichSuTinNhan = null,
        CancellationToken ct = default)
    {
        try
        {
            // Gọi AiQueryService để truy vấn database
            var queryResult = await _aiQueryService.ExecuteQueryAsync(nguoiDungId, cauHoi, lichSuTinNhan, ct);

            if (!queryResult.Success)
            {
                _logger.LogWarning("AI Query thất bại cho câu hỏi '{CauHoi}': {Loi}", cauHoi, queryResult.Message);
                return new GeminiChatResponse
                {
                    PhanHoi = "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.",
                    LoaiPhanHoi = "ERROR",
                    DuLieuBieuDo = null,
                    DuLieuDanhSach = null,
                    GoiYHanDong = new List<GeminiGoiYHanDong>
                    {
                        new() { HanhDong = "THU_LAI", NoiDung = "Thử lại" }
                    }
                };
            }

            if (queryResult.Rows == null || queryResult.Rows.Count == 0)
            {
                return new GeminiChatResponse
                {
                    PhanHoi = "Không có dữ liệu nào phù hợp với yêu cầu của bạn.",
                    LoaiPhanHoi = "TEXT",
                    DuLieuBieuDo = null,
                    DuLieuDanhSach = null,
                    GoiYHanDong = new List<GeminiGoiYHanDong>()
                };
            }

            // Xây dựng response đẹp dựa trên loại bảng
            return XayDungPhanHoiDanhSach(queryResult, cauHoi);
        }
        catch (Exception)
        {
            // Log lỗi đã được xử lý tự động bởi framework
            // Trả về message thân thiện cho user
            return new GeminiChatResponse
            {
                PhanHoi = "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.",
                LoaiPhanHoi = "ERROR",
                DuLieuBieuDo = null,
                DuLieuDanhSach = null,
                GoiYHanDong = new List<GeminiGoiYHanDong>
                {
                    new() { HanhDong = "THU_LAI", NoiDung = "Thử lại" }
                }
            };
        }
    }

    private GeminiChatResponse XayDungPhanHoiDanhSach(BLL.AIQuery.AiQueryResponse queryResult, string cauHoi)
    {
        var tableName = queryResult.TableName?.ToLowerInvariant() ?? "";
        var rows = queryResult.Rows;

        // Tạo danh sách các mục
        var cacMuc = new List<GeminiMucDanhSach>();

        // Map icon và màu theo loại
        string iconMacDinh = "bell";
        string mauSacMacDinh = "blue";

        foreach (var row in rows.Take(10))
        {
            var muc = new GeminiMucDanhSach();

            // Xác định loại bảng và map fields
            if (tableName.Contains("thongbao"))
            {
                muc.TieuDe = GetFieldValue(row, "TieuDe") ?? "Thông báo";
                muc.MoTa = GetFieldValue(row, "NoiDung");
                muc.Ngay = FormatNgay(GetFieldValue(row, "NgayTao"));
                var daDoc = GetFieldValue(row, "DaDoc");
                muc.TrangThai = daDoc == "0" || daDoc == "False" ? "Chưa đọc" : "Đã đọc";
                muc.Icon = "bell";
                muc.MauSac = daDoc == "0" || daDoc == "False" ? "orange" : "gray";
                iconMacDinh = "bell";
                mauSacMacDinh = "orange";
            }
            else if (tableName.Contains("canhbao"))
            {
                muc.TieuDe = "Cảnh báo";
                muc.MoTa = GetFieldValue(row, "NoiDung");
                muc.Ngay = FormatNgay(GetFieldValue(row, "NgayTao"));
                var loai = GetFieldValue(row, "LoaiCanhBao");
                muc.TrangThai = loai switch
                {
                    "1" => "Thấp",
                    "2" => "Trung bình",
                    "3" => "Cao",
                    _ => loai ?? ""
                };
                muc.Icon = "alert-triangle";
                muc.MauSac = loai switch
                {
                    "3" => "red",
                    "2" => "orange",
                    _ => "yellow"
                };
                iconMacDinh = "alert-triangle";
                mauSacMacDinh = "red";
            }
            else if (tableName.Contains("goiy"))
            {
                muc.TieuDe = "Gợi ý từ AI";
                muc.MoTa = GetFieldValue(row, "NoiDung");
                muc.Ngay = FormatNgay(GetFieldValue(row, "NgayTao"));
                muc.Icon = "lightbulb";
                muc.MauSac = "purple";
                iconMacDinh = "lightbulb";
                mauSacMacDinh = "purple";
            }
            else if (tableName.Contains("giaodich"))
            {
                muc.TieuDe = GetFieldValue(row, "MoTa") ?? "Giao dịch";
                var soTien = GetFieldValue(row, "SoTien");
                var loai = GetFieldValue(row, "LoaiGiaoDich");
                muc.GiaTri = FormatSoTien(soTien, loai);
                muc.Ngay = FormatNgay(GetFieldValue(row, "NgayGiaoDich"));
                muc.Icon = loai == "1" ? "arrow-down" : "arrow-up";
                muc.MauSac = loai == "1" ? "green" : "red";
                iconMacDinh = "dollar-sign";
                mauSacMacDinh = "gray";
            }
            else if (tableName.Contains("taikhoan"))
            {
                muc.TieuDe = GetFieldValue(row, "TenTaiKhoan") ?? "Tài khoản";
                var soDu = GetFieldValue(row, "SoDu");
                muc.GiaTri = FormatSoTien(soDu);
                muc.MoTa = GetFieldValue(row, "MoTa");
                muc.Icon = "wallet";
                muc.MauSac = "blue";
                iconMacDinh = "wallet";
                mauSacMacDinh = "blue";
            }
            else if (tableName.Contains("ngansach"))
            {
                muc.TieuDe = "Ngân sách";
                var daChi = GetFieldValue(row, "SoTienDaChi");
                var toiDa = GetFieldValue(row, "SoTienToiDa");
                muc.GiaTri = $"{FormatSoTien(daChi)} / {FormatSoTien(toiDa)}";
                muc.MoTa = $"Tháng {GetFieldValue(row, "Thang")}/{GetFieldValue(row, "Nam")}";
                muc.Icon = "pie-chart";
                muc.MauSac = "indigo";
                iconMacDinh = "pie-chart";
                mauSacMacDinh = "indigo";
            }
            else if (tableName.Contains("muctieu"))
            {
                muc.TieuDe = GetFieldValue(row, "TenMucTieu") ?? "Mục tiêu";
                var hienTai = GetFieldValue(row, "SoTienHienTai");
                var mongMuon = GetFieldValue(row, "SoTienMongMuon");
                muc.GiaTri = $"{FormatSoTien(hienTai)} / {FormatSoTien(mongMuon)}";
                var trangThai = GetFieldValue(row, "TrangThai");
                muc.TrangThai = trangThai switch
                {
                    "1" => "Đang theo dõi",
                    "2" => "Hoàn thành",
                    _ => trangThai
                };
                muc.Icon = "target";
                muc.MauSac = "emerald";
                iconMacDinh = "target";
                mauSacMacDinh = "emerald";
            }
            else
            {
                // Generic fallback - hiển thị tất cả fields
                foreach (var kvp in row)
                {
                    if (kvp.Value != null && !string.IsNullOrEmpty(kvp.Value.ToString()))
                    {
                        muc.TieuDe = kvp.Key;
                        muc.MoTa = kvp.Value.ToString();
                        break;
                    }
                }
            }

            cacMuc.Add(muc);
        }

        // Tạo response
        var tieuDe = queryResult.TableDisplayName ?? queryResult.TableName ?? "Dữ liệu";
        tieuDe = char.ToUpper(tieuDe[0]) + tieuDe.Substring(1);

        var loaiDanhSach = tableName.Contains("thongbao") ? "THONG_BAO" :
                           tableName.Contains("canhbao") ? "CANH_BAO" :
                           tableName.Contains("goiy") ? "GOI_Y" :
                           tableName.Contains("giaodich") ? "GIAO_DICH" :
                           tableName.Contains("taikhoan") ? "TAI_KHOAN" :
                           tableName.Contains("ngansach") ? "NGAN_SACH" :
                           tableName.Contains("muctieu") ? "MUC_TIEU" : "KHAC";

        var phanHoiTomTat = $"Tìm thấy {rows.Count} {tieuDe.ToLower()}. " +
            (cacMuc.Count > 0 ? $"Mới nhất: {cacMuc[0].TieuDe}" : "");

        return new GeminiChatResponse
        {
            PhanHoi = phanHoiTomTat,
            LoaiPhanHoi = "LIST",
            DuLieuDanhSach = new GeminiDuLieuDanhSach
            {
                TieuDe = tieuDe,
                Loai = loaiDanhSach,
                CacMuc = cacMuc
            },
            DuLieuBieuDo = null,
            GoiYHanDong = new List<GeminiGoiYHanDong>()
        };
    }

    private string? GetFieldValue(Dictionary<string, object?> row, string fieldName)
    {
        // Tìm field không phân biệt hoa thường
        foreach (var kvp in row)
        {
            if (kvp.Key.Equals(fieldName, StringComparison.OrdinalIgnoreCase))
            {
                return kvp.Value?.ToString();
            }
        }
        return null;
    }

    private string FormatNgay(string? ngayStr)
    {
        if (string.IsNullOrEmpty(ngayStr)) return "";

        if (DateTime.TryParse(ngayStr, out var ngay))
        {
            var now = DateTime.Now;
            var diff = (now.Date - ngay.Date).Days;

            if (diff == 0) return "Hôm nay";
            if (diff == 1) return "Hôm qua";
            if (diff < 7) return $"{diff} ngày trước";

            return ngay.ToString("dd/MM/yyyy");
        }

        return ngayStr ?? "";
    }

    private string FormatSoTien(string? soTienStr, string? loai = null)
    {
        if (string.IsNullOrEmpty(soTienStr)) return "";

        if (decimal.TryParse(soTienStr, out var soTien))
        {
            var prefix = loai switch
            {
                "1" => "+",
                "2" => "-",
                "3" => "",
                _ => ""
            };
            return $"{prefix}{soTien:N0}đ";
        }

        return soTienStr;
    }

    // ================== ADMIN IMPLEMENTATIONS ==================

    public async Task<List<LoiKhuyenAIDto>> LayDanhSachGoiYAdminAsync(
        int page = 1,
        int pageSize = 20,
        string? trangThai = null,
        string? loai = null,
        CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayDanhSachGoiYAdminAsync(page, pageSize, trangThai, loai, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy danh sách gợi ý AI (Admin): {ex.Message}", ex);
        }
    }

    public async Task<bool> DuyetGoiYAsync(int id, CancellationToken ct = default)
    {
        try
        {
            return await _dal.DuyetGoiYAsync(id, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi duyệt gợi ý AI ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<bool> TuChoiGoiYAsync(int id, CancellationToken ct = default)
    {
        try
        {
            return await _dal.TuChoiGoiYAsync(id, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi từ chối gợi ý AI ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<bool> XoaGoiYAsync(int id, CancellationToken ct = default)
    {
        try
        {
            return await _dal.XoaGoiYAsync(id, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi xóa gợi ý AI ID {id}: {ex.Message}", ex);
        }
    }

    public async Task<int> TaoGoiYAdminAsync(LoiKhuyenAIDto dto, CancellationToken ct = default)
    {
        try
        {
            return await _dal.TaoGoiYAdminAsync(dto, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi tạo gợi ý AI (Admin): {ex.Message}", ex);
        }
    }

    public async Task<ThongKeAIDto> LayThongKeAIAsync(CancellationToken ct = default)
    {
        try
        {
            return await _dal.LayThongKeAIAsync(ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi lấy thống kê AI: {ex.Message}", ex);
        }
    }
}

