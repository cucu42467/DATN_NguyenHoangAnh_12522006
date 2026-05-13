-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 188.40.211.10
-- Thời gian đã tạo: Th5 13, 2026 lúc 11:24 AM
-- Phiên bản máy phục vụ: 10.11.15-MariaDB-log
-- Phiên bản PHP: 8.2.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db47043`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_ai_model`
--

CREATE TABLE `tbl_ai_model` (
  `ModelId` int(11) NOT NULL COMMENT 'ID model',
  `TenModel` varchar(255) NOT NULL COMMENT 'Tên model: GPT-4o, Claude 3.5, Gemini Pro...',
  `MucDich` varchar(50) DEFAULT 'chat' COMMENT 'Mục đích: chat, canh_bao, phan_tich_chi_tieu, goi_y_tiet_kiem',
  `Provider` varchar(100) DEFAULT NULL COMMENT 'Nhà cung cấp: OpenAI / Anthropic / OpenRouter / Google',
  `ApiUrl` varchar(500) DEFAULT NULL COMMENT 'Endpoint API của model',
  `ApiKey` varchar(500) DEFAULT NULL COMMENT 'API Key (khuyến nghị mã hóa AES trước khi lưu)',
  `TrangThai` tinyint(4) DEFAULT 1 COMMENT '1=Đang dùng, 0=Đã tắt',
  `NgayTao` datetime DEFAULT current_timestamp() COMMENT 'Ngày thêm model vào hệ thống'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Cấu hình và quản lý các model AI được sử dụng trong hệ thống';

--
-- Đang đổ dữ liệu cho bảng `tbl_ai_model`
--


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_audit_log`
--

CREATE TABLE `tbl_audit_log` (
  `Id` int(11) NOT NULL,
  `NguoiDungId` int(11) DEFAULT NULL,
  `TenBang` varchar(100) NOT NULL,
  `BanGhiId` int(11) DEFAULT NULL,
  `HanhDong` varchar(20) NOT NULL,
  `DuLieuCu` text DEFAULT NULL,
  `DuLieuMoi` text DEFAULT NULL,
  `ThoiGian` datetime DEFAULT current_timestamp(),
  `IpAddress` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_audit_log`
--

INSERT INTO `tbl_audit_log` (`Id`, `NguoiDungId`, `TenBang`, `BanGhiId`, `HanhDong`, `DuLieuCu`, `DuLieuMoi`, `ThoiGian`, `IpAddress`) VALUES
(1, 1, 'tbl_giaodich', 1, 'INSERT', NULL, '{\"GiaoDichId\":1,\"SoTien\":15000000,\"LoaiGiaoDich\":1,\"MoTa\":\"Luong thang 4/2025\"}', '2025-04-01 09:00:00', '192.168.1.10'),
(2, 1, 'tbl_ngansach', 1, 'UPDATE', '{\"SoTienDaChi\":800000,\"PhanTramDaDung\":26.7}', '{\"SoTienDaChi\":1200000,\"PhanTramDaDung\":40.0}', '2025-04-20 23:59:00', '192.168.1.10'),
(3, 2, 'tbl_muctieu', 3, 'UPDATE', '{\"TrangThai\":1,\"SoTienHienTai\":0}', '{\"TrangThai\":1,\"SoTienHienTai\":5000000}', '2025-03-15 10:00:00', '192.168.1.21'),
(4, 13, 'tbl_giaodich', 7, 'INSERT', NULL, '{\"GiaoDichId\":7,\"SoTien\":16000000,\"LoaiGiaoDich\":1,\"MoTa\":\"Luong thang 4/2025\"}', '2025-04-05 09:00:00', '192.168.1.30'),
(5, 14, 'tbl_ngansach', 9, 'UPDATE', '{\"SoTienDaChi\":500000,\"PhanTramDaDung\":16.7}', '{\"SoTienDaChi\":1500000,\"PhanTramDaDung\":50.0}', '2025-04-07 10:00:00', '192.168.1.31'),
(6, 15, 'tbl_muctieu', 9, 'UPDATE', '{\"TrangThai\":1,\"SoTienHienTai\":5000000}', '{\"TrangThai\":2,\"SoTienHienTai\":15000000}', '2025-04-08 15:00:00', '192.168.1.32'),
(7, 16, 'tbl_ngansach', 11, 'UPDATE', '{\"SoTienDaChi\":1800000,\"PhanTramDaDung\":90}', '{\"SoTienDaChi\":2200000,\"PhanTramDaDung\":110.0}', '2025-04-09 09:00:00', '192.168.1.33'),
(8, 17, 'tbl_taikhoan', 12, 'UPDATE', '{\"SoDu\":48000000}', '{\"SoDu\":51000000}', '2025-04-10 09:00:00', '192.168.1.34'),
(9, 18, 'tbl_giaodich', 13, 'INSERT', NULL, '{\"GiaoDichId\":13,\"SoTien\":180000,\"LoaiGiaoDich\":2,\"MoTa\":\"BBQ gia dinh\"}', '2025-04-11 19:00:00', '192.168.1.35'),
(10, 20, 'tbl_muctieu', 13, 'UPDATE', '{\"TrangThai\":1,\"SoTienHienTai\":7000000}', '{\"TrangThai\":1,\"SoTienHienTai\":10000000}', '2025-04-12 21:00:00', '192.168.1.36'),
(11, 21, 'tbl_giaodich', 15, 'INSERT', NULL, '{\"GiaoDichId\":15,\"SoTien\":1200000,\"LoaiGiaoDich\":2,\"MoTa\":\"Hoc phi Python\"}', '2025-04-13 08:00:00', '192.168.1.37'),
(12, 22, 'tbl_caidat', NULL, 'UPDATE', '{\"CheDoToi\":0}', '{\"CheDoToi\":1}', '2025-04-14 20:00:00', '192.168.1.38'),
(13, 13, 'tbl_nguoidung', 13, 'UPDATE', '{\"SoDienThoai\":null}', '{\"SoDienThoai\":\"0934567890\"}', '2025-04-15 09:00:00', '192.168.1.30'),
(14, 12, 'tbl_taikhoan', 17, 'INSERT', NULL, '{\"TaiKhoanId\":17,\"TenTaiKhoan\":\"TPBank\",\"SoDu\":12500000}', '2025-04-01 08:00:00', '127.0.0.1'),
(15, 12, 'tbl_giaodich', 17, 'INSERT', NULL, '{\"GiaoDichId\":17,\"SoTien\":18000000,\"LoaiGiaoDich\":1,\"MoTa\":\"Luong thang 4/2025\"}', '2025-04-05 08:00:00', '127.0.0.1'),
(10001, 12, 'tbl_giaodich', NULL, 'INSERT', NULL, NULL, '2026-05-05 17:22:34', NULL),
(10002, 12, 'tbl_giaodich', 5007, 'UPDATE', '{\"GiaoDichId\":5007,\"SoTien\":50000.00,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":3006,\"TenDanhMuc\":\"\\u0110\\u1EB7t h\\u00E0ng online\",\"LoaiDanhMucId\":2,\"TenLoaiDanhMuc\":\"Chi ti\\u00EAu\",\"TaiKhoanNguonId\":18,\"TenTaiKhoanNguon\":\"V\\u00ED ti\\u1EC1n m\\u1EB7t\",\"TaiKhoanDichId\":null,\"TenTaiKhoanDich\":null,\"NgayGiaoDich\":\"2026-05-10T00:00:00\",\"GhiChu\":\"Mua tai nghe \\u1EDF Shoppee\",\"NguoiDungId\":12,\"DoTinCayAI\":null,\"TepDinhKem\":\"b969bdba-838a-42ad-b1dd-ef13103771cb.png\",\"TrangThai\":1,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":false,\"MaGiaoDichNgoai\":null}', '{\"SoTien\":150000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":3006,\"TaiKhoanNguonId\":18,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-10T00:00:00\",\"GhiChu\":\"Mua tai nghe \\u1EDF Shoppee\",\"TepDinhKem\":\"b969bdba-838a-42ad-b1dd-ef13103771cb.png\",\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 10:46:58', NULL),
(10003, 12, 'tbl_giaodich', 5008, 'INSERT', NULL, '{\"SoTien\":50000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":3,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"\\u0110\\u1EA7u t\\u01B0 ch\\u1EE9ng kho\\u00E1n\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 13:02:23', NULL),
(10004, 12, 'tbl_giaodich', 5009, 'INSERT', NULL, '{\"SoTien\":100000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":6,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"\\u0111i grab \\u0111\\u1EBFn c\\u00F4ng ty\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 13:06:41', NULL),
(10005, 12, 'tbl_giaodich', 5010, 'INSERT', NULL, '{\"SoTien\":500000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":8,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"mua m\\u00E1y t\\u00EDnh cho con\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 13:16:49', NULL),
(10006, 12, 'tbl_giaodich', 5011, 'INSERT', NULL, '{\"SoTien\":100000,\"LoaiGiaoDich\":\"1\",\"DanhMucId\":1,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":null,\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 13:45:39', NULL),
(10007, 12, 'tbl_giaodich', 5012, 'INSERT', NULL, '{\"SoTien\":100000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":9,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"v\\u00E9 cocert\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 13:52:28', NULL),
(10008, 12, 'tbl_giaodich', 5013, 'INSERT', NULL, '{\"SoTien\":100000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":9,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"v\\u00E9 cocert\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 13:53:32', NULL),
(10009, 12, 'tbl_giaodich', 5014, 'INSERT', NULL, '{\"SoTien\":50000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":5,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"\\u0103n u\\u1ED1ng c\\u00F9ng b\\u1EA1n b\\u00E8\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 13:56:26', NULL),
(10010, 12, 'tbl_giaodich', 5015, 'INSERT', NULL, '{\"SoTien\":50000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":5,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"\\u0103n u\\u1ED1ng c\\u00F9ng b\\u1EA1n b\\u00E8 bu\\u1ED5i t\\u1ED1i\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 14:11:53', NULL),
(10011, 12, 'tbl_giaodich', 5019, 'INSERT', NULL, '{\"SoTien\":11000,\"LoaiGiaoDich\":\"1\",\"DanhMucId\":2,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"Th\\u01B0\\u1EDFng vi\\u1EBFt b\\u00E0i \",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 16:25:38', NULL),
(10012, 12, 'tbl_giaodich', 5020, 'INSERT', NULL, '{\"SoTien\":22000,\"LoaiGiaoDich\":\"1\",\"DanhMucId\":3,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"L\\u00E3i \\u0111\\u1EA7u t\\u01B0 c\\u1ED5 phi\\u1EBFu\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 16:30:51', NULL),
(10013, 12, 'tbl_giaodich', 5021, 'INSERT', NULL, '{\"SoTien\":22000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":10,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"kh\\u00E1m r\\u0103ng\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 16:41:55', NULL),
(10014, 12, 'tbl_giaodich', 5022, 'INSERT', NULL, '{\"SoTien\":11000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":12,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"u\\u1ED1ng cafe\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 16:54:17', NULL),
(10015, 12, 'tbl_giaodich', 5023, 'INSERT', NULL, '{\"SoTien\":50000,\"LoaiGiaoDich\":\"1\",\"DanhMucId\":4,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"nh\\u1EB7t \\u0111\\u01B0\\u1EE3c\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 16:55:34', NULL),
(10016, 12, 'tbl_taikhoan', 2003, 'INSERT', NULL, '{\"TenTaiKhoan\":\"V\\u00ED zalopay\",\"LoaiTaiKhoan\":\"V\\u00ED \\u0111i\\u1EC7n t\\u1EED\",\"SoDuBanDau\":10000000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"T\\u00E0i kho\\u1EA3n t\\u00EDch l\\u0169y\"}', '2026-05-11 17:24:54', NULL),
(10017, 12, 'tbl_taikhoan', 2001, 'DELETE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', NULL, '2026-05-11 17:39:13', NULL),
(10018, 12, 'tbl_taikhoan', 2001, 'DELETE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', NULL, '2026-05-11 17:53:09', NULL),
(10019, 12, 'tbl_taikhoan', 2001, 'DELETE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', NULL, '2026-05-11 17:53:30', NULL),
(10020, 12, 'tbl_taikhoan', 2001, 'DELETE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', NULL, '2026-05-11 18:09:24', NULL),
(10021, 12, 'tbl_taikhoan', 2001, 'DELETE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', NULL, '2026-05-11 18:12:46', NULL),
(10022, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":6100000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 18:35:38', NULL),
(10023, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":5139000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 18:36:20', NULL),
(10024, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":5139000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 18:40:20', NULL),
(10025, 12, 'tbl_taikhoan', 2001, 'DELETE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', NULL, '2026-05-11 18:43:51', NULL),
(10026, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":5600000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 18:45:17', NULL),
(10027, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":6139000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 18:47:40', NULL),
(10028, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":6039000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 18:56:16', NULL),
(10029, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":6039000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 19:00:43', NULL),
(10030, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":5039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T11:55:35.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":6039000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 19:02:55', NULL),
(10031, 12, 'tbl_taikhoan', 2001, 'UPDATE', '{\"TaiKhoanId\":2001,\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDu\":6039000.00,\"MoTa\":\"VND\",\"NguoiDungId\":12,\"Icon\":null,\"LaMacDinh\":true,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0.00,\"NgayCapNhatSoDu\":\"2026-05-11T14:02:55.0000000\"}', '{\"TenTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"LoaiTaiKhoan\":\"Ti\\u1EC1n m\\u1EB7t\",\"SoDuBanDau\":6539000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"VND\"}', '2026-05-11 20:52:32', NULL),
(10032, 12, 'tbl_taikhoan', 2004, 'INSERT', NULL, '{\"TenTaiKhoan\":\"MBBank\",\"LoaiTaiKhoan\":\"T\\u00E0i kho\\u1EA3n ng\\u00E2n h\\u00E0ng\",\"SoDuBanDau\":500000,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0,\"MoTa\":\"qu\\u1EF9 \\u0111en\"}', '2026-05-11 21:30:47', NULL),
(10033, 12, 'tbl_taikhoan', 2004, 'UPDATE', '{\"TaiKhoanId\":2004,\"TenTaiKhoan\":\"MBBank\",\"LoaiTaiKhoan\":\"T\\u00E0i kho\\u1EA3n ng\\u00E2n h\\u00E0ng\",\"SoDu\":500000.00,\"SoDuBanDau\":null,\"TienTe\":null,\"MauSac\":null,\"Icon\":null,\"NguoiDungId\":12,\"LaMacDinh\":true,\"TenNganHang\":\"\",\"SoTaiKhoan\":\"\",\"HanMucTinDung\":0.00,\"NgayCapNhatSoDu\":\"2026-05-11T21:30:46\"}', '{\"TenTaiKhoan\":\"MBBank\",\"LoaiTaiKhoan\":\"T\\u00E0i kho\\u1EA3n ng\\u00E2n h\\u00E0ng\",\"SoDuBanDau\":600000,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"MauSac\":\"#3F51B5\",\"Icon\":\"bank\"}', '2026-05-11 22:15:32', NULL),
(10034, 12, 'tbl_taikhoan', 2004, 'UPDATE', '{\"TaiKhoanId\":2004,\"TenTaiKhoan\":\"MBBank\",\"LoaiTaiKhoan\":\"T\\u00E0i kho\\u1EA3n ng\\u00E2n h\\u00E0ng\",\"SoDu\":600000.00,\"SoDuBanDau\":600000.00,\"TienTe\":null,\"MauSac\":\"#3F51B5\",\"Icon\":\"bank\",\"NguoiDungId\":12,\"LaMacDinh\":true,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"NgayCapNhatSoDu\":\"2026-05-11T22:15:32\"}', '{\"TenTaiKhoan\":\"MBBank\",\"LoaiTaiKhoan\":\"T\\u00E0i kho\\u1EA3n ng\\u00E2n h\\u00E0ng\",\"SoDuBanDau\":600000,\"TenNganHang\":null,\"SoTaiKhoan\":null,\"HanMucTinDung\":null,\"MauSac\":\"#4CAF50\",\"Icon\":\"bank\"}', '2026-05-11 22:15:52', NULL),
(10035, 12, 'tbl_giaodich', 5024, 'INSERT', NULL, '{\"SoTien\":50000,\"LoaiGiaoDich\":\"1\",\"DanhMucId\":1,\"TaiKhoanNguonId\":2004,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:00:00\",\"GhiChu\":\"l\\u01B0\\u01A1ng partime trong ng\\u00E0y\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 22:18:20', NULL),
(10036, 12, 'tbl_giaodich', 5025, 'INSERT', NULL, '{\"SoTien\":22000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":9,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T22:25:36\",\"GhiChu\":\"Xem xi\\u1EBFc h\\u1ED9i ch\\u1EE3\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 22:25:43', NULL),
(10037, 12, 'tbl_ngansach', 6003, 'INSERT', NULL, '{\"DanhMucId\":8,\"HanMuc\":2000000,\"Thang\":5,\"Nam\":2026}', '2026-05-11 23:04:43', NULL),
(10038, 12, 'tbl_giaodich', 5026, 'INSERT', NULL, '{\"SoTien\":20000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":6,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T23:40:08\",\"GhiChu\":\"\\u0110i Grab\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 23:40:15', NULL),
(10039, 12, 'tbl_giaodich', 5027, 'INSERT', NULL, '{\"SoTien\":22222,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":6,\"TaiKhoanNguonId\":2004,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T23:51:20\",\"GhiChu\":\"\\u0111i xe \\u00F4m t\\u1EEB nh\\u00E0 v\\u1EC1 c\\u00F4ng ty\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 23:51:28', NULL),
(10040, 12, 'tbl_giaodich', 5028, 'INSERT', NULL, '{\"SoTien\":112000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":6,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T23:54:55\",\"GhiChu\":\"\\u0110i xe taxi v\\u1EC1 c\\u00F4ng ty\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-11 23:55:02', NULL),
(10041, 12, 'tbl_giaodich', 5029, 'INSERT', NULL, '{\"SoTien\":10000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":5,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:04:44\",\"GhiChu\":\"Mua k\\u1EB9o cho em \",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-12 00:04:52', NULL),
(10042, 12, 'tbl_giaodich', 5030, 'INSERT', NULL, '{\"SoTien\":100000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":5,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:10:37\",\"GhiChu\":\"\\u0102n u\\u1ED1ng c\\u00F9ng gia \\u0111\\u00ECnh\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null}', '2026-05-12 00:10:45', NULL),
(10043, 12, 'tbl_giaodich', 5031, 'INSERT', NULL, '{\"SoTien\":50000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":9,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T00:53:30\",\"GhiChu\":\"Ti\\u1EC1n v\\u00E9 c\\u00F4ng vi\\u00EAn n\\u01B0\\u1EDBc\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null,\"XacNhanTaoNganSach\":null}', '2026-05-12 00:53:38', NULL),
(10044, 12, 'tbl_ngansach', 6005, 'INSERT', NULL, '{\"NganSachId\":6005,\"NguoiDungId\":12,\"DanhMucId\":10,\"SoTienToiDa\":0,\"Thang\":5,\"Nam\":2026,\"SoTienDaChi\":0,\"PhanTramDaDung\":0,\"TrangThai\":1,\"DanhMuc\":null,\"NguoiDung\":null,\"TblTheodoiNgansaches\":[]}', '2026-05-12 01:07:12', NULL),
(10045, 12, 'tbl_ngansach', 6005, 'UPDATE', '{\"SoTienDaChiTruoc\":0}', '{\"SoTienDaChiSau\":100000,\"SoTienGiaoDich\":100000,\"LaThemMoi\":true}', '2026-05-12 01:07:13', NULL),
(10046, 12, 'tbl_giaodich', 5032, 'INSERT', NULL, '{\"SoTien\":100000,\"LoaiGiaoDich\":\"2\",\"DanhMucId\":10,\"TaiKhoanNguonId\":2001,\"TaiKhoanDichId\":null,\"NgayGiaoDich\":\"2026-05-11T01:07:03\",\"GhiChu\":\"Kh\\u00E1m r\\u0103ng nha khoa\",\"TepDinhKem\":null,\"TrangThai\":1,\"HienThi\":null,\"NguonTao\":null,\"ViTri\":null,\"TienTe\":null,\"TyGiaQuyDoi\":null,\"LaTuDong\":null,\"DoTinCay\":null,\"MaGiaoDichNgoai\":null,\"XacNhanTaoNganSach\":null}', '2026-05-12 01:07:19', NULL),
(10047, 12, 'tbl_ngansach', 6001, 'UPDATE_HANMUC', '3000000.00', '4000000', '2026-05-12 08:50:39', NULL),
(10048, 12, 'tbl_ngansach', 6001, 'UPDATE_HANMUC', '3000000.00', '4000000', '2026-05-12 08:52:02', NULL),
(10049, 12, 'tbl_ngansach', 6001, 'UPDATE_HANMUC', '3000000.00', '4000000', '2026-05-12 08:58:45', NULL),
(10050, 12, 'tbl_ngansach', 6001, 'UPDATE_HANMUC', '4000000.00', '4000000', '2026-05-12 09:01:47', NULL),
(10051, 12, 'tbl_ngansach', 6001, 'UPDATE_HANMUC', '4000000.00', '5000000', '2026-05-12 09:04:37', NULL),
(10052, 12, 'tbl_ngansach', 6006, 'INSERT', NULL, '{\"DanhMucId\":7,\"HanMuc\":5500000,\"Thang\":5,\"Nam\":2026}', '2026-05-12 12:35:32', NULL),
(10053, 12, 'tbl_ngansach', 6006, 'UPDATE_HANMUC', '5500000.00', '6000000', '2026-05-12 12:37:28', NULL),
(10054, 12, 'tbl_ngansach', 6006, 'DELETE', '{\"NganSachId\":6006,\"DanhMucId\":7,\"TenDanhMuc\":\"Nh\\u00E0 \\u1EDF\",\"HanMuc\":6000000.00,\"DaDung\":0.00,\"Thang\":5,\"Nam\":2026,\"Icon\":\"housing.png\",\"MauSac\":\"#795548\"}', NULL, '2026-05-12 12:37:49', NULL),
(10055, 12, 'tbl_ngansach', 6006, 'DELETE', '{\"NganSachId\":6006,\"DanhMucId\":7,\"TenDanhMuc\":\"Nh\\u00E0 \\u1EDF\",\"HanMuc\":6000000.00,\"DaDung\":0.00,\"Thang\":5,\"Nam\":2026,\"Icon\":\"housing.png\",\"MauSac\":\"#795548\"}', NULL, '2026-05-12 12:44:33', NULL),
(10056, 12, 'tbl_ngansach', 6006, 'DELETE', '{\"NganSachId\":6006,\"DanhMucId\":7,\"TenDanhMuc\":\"Nh\\u00E0 \\u1EDF\",\"HanMuc\":6000000.00,\"DaDung\":0.00,\"Thang\":5,\"Nam\":2026,\"Icon\":\"housing.png\",\"MauSac\":\"#795548\"}', NULL, '2026-05-12 12:51:14', NULL),
(10057, 12, 'tbl_ngansach', 6006, 'DELETE', '{\"NganSachId\":6006,\"DanhMucId\":7,\"TenDanhMuc\":\"Nh\\u00E0 \\u1EDF\",\"HanMuc\":6000000.00,\"DaDung\":0.00,\"Thang\":5,\"Nam\":2026,\"Icon\":\"housing.png\",\"MauSac\":\"#795548\"}', NULL, '2026-05-12 12:57:23', NULL),
(10058, 12, 'tbl_danhmuc', 3007, 'INSERT', NULL, '{\"TenDanhMuc\":\"\\u0111\\u1EA7u t\\u01B0 c\\u1ED5 phi\\u1EBFu\",\"MauSac\":\"#4f46e5\",\"LoaiDanhMuc\":\"CHI\",\"LoaiDanhMucId\":0,\"ChaId\":null,\"Icon\":null,\"CapDo\":null,\"DuongDan\":null}', '2026-05-12 14:04:55', NULL),
(10059, 12, 'tbl_danhmuc', 3008, 'INSERT', NULL, '{\"TenDanhMuc\":\"\\u0111\\u1EA7u t\\u01B0 c\\u1ED5 phi\\u1EBFu \",\"MauSac\":\"#4f46e5\",\"LoaiDanhMuc\":\"THU\",\"LoaiDanhMucId\":0,\"ChaId\":null,\"Icon\":\"ebca7a94-981e-4b01-b526-2b8f30c98731.png\",\"CapDo\":null,\"DuongDan\":null}', '2026-05-12 14:06:24', NULL),
(10060, 12, 'tbl_muctieu', 7002, 'INSERT', NULL, '{\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":10000000,\"SoTienHienTai\":0,\"NgayBatDau\":\"2026-05-12T08:07:25.263Z\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":null,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', '2026-05-12 15:07:27', NULL),
(10061, 12, 'tbl_donggop_muctieu', 8002, 'INSERT', NULL, '{\"SoTien\":50000,\"NgayDongGop\":\"2026-05-12T00:00:00\",\"GhiChu\":null}', '2026-05-12 15:37:13', NULL),
(10062, 12, 'tbl_donggop_muctieu', 8003, 'INSERT', NULL, '{\"SoTien\":50000,\"NgayDongGop\":\"2026-05-12T00:00:00\",\"GhiChu\":null}', '2026-05-12 15:38:13', NULL),
(10063, 12, 'tbl_donggop_muctieu', 8004, 'INSERT', NULL, '{\"SoTien\":50000,\"NgayDongGop\":\"2026-05-12T00:00:00\",\"GhiChu\":null}', '2026-05-12 15:38:41', NULL),
(10064, 12, 'tbl_muctieu', 7002, 'UPDATE', '{\"MucTieuId\":7002,\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":10000000.00,\"SoTienHienTai\":0.00,\"NgayBatDau\":\"2026-05-12T08:07:25\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":1,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', '{\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":31000000,\"SoTienHienTai\":0,\"NgayBatDau\":\"2026-05-12T08:07:25\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":null,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', '2026-05-12 15:47:07', NULL),
(10065, 12, 'tbl_muctieu', 7002, 'UPDATE', '{\"MucTieuId\":7002,\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":10000000.00,\"SoTienHienTai\":0.00,\"NgayBatDau\":\"2026-05-12T08:07:25\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":1,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', '{\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":30000000,\"SoTienHienTai\":0,\"NgayBatDau\":\"2026-05-12T08:07:25\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":null,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', '2026-05-12 15:53:29', NULL),
(10066, 12, 'tbl_donggop_muctieu', 8005, 'INSERT', NULL, '{\"SoTien\":50000,\"NgayDongGop\":\"2026-05-12T00:00:00\",\"GhiChu\":null}', '2026-05-12 15:54:01', NULL),
(10067, 12, 'tbl_donggop_muctieu', 8006, 'INSERT', NULL, '{\"SoTien\":250000,\"NgayDongGop\":\"2026-05-12T00:00:00\",\"GhiChu\":null}', '2026-05-12 15:58:57', NULL),
(10068, 12, 'tbl_muctieu', 7002, 'HIDE', '{\"MucTieuId\":7002,\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":30000000.00,\"SoTienHienTai\":250000.00,\"NgayBatDau\":\"2026-05-12T08:07:25\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":1,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', NULL, '2026-05-12 15:59:18', NULL),
(10069, 12, 'tbl_muctieu', 7002, 'HIDE', '{\"MucTieuId\":7002,\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":30000000.00,\"SoTienHienTai\":250000.00,\"NgayBatDau\":\"2026-05-12T08:07:25\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":1,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', NULL, '2026-05-12 16:03:10', NULL),
(10070, 12, 'tbl_muctieu', 7002, 'HIDE', '{\"MucTieuId\":7002,\"TenMucTieu\":\"mua xe m\\u00E1y m\\u1EDBi \",\"SoTienMucTieu\":30000000.00,\"SoTienHienTai\":250000.00,\"NgayBatDau\":\"2026-05-12T08:07:25\",\"NgayKetThuc\":\"2026-07-12T00:00:00\",\"Icon\":null,\"MauSac\":\"#ef4444\",\"TaiKhoanId\":31,\"TrangThai\":1,\"Anh\":\"c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg\"}', NULL, '2026-05-12 16:06:18', NULL),
(10071, 12, 'tbl_nguoidung', 12, 'CHANGE_PASSWORD', NULL, '{\"ThoiGian\":\"2026-05-12T16:10:40.273412\"}', '2026-05-12 16:10:40', NULL),
(10072, 12, 'tbl_nguoidung', 12, 'CHANGE_PASSWORD', NULL, '{\"ThoiGian\":\"2026-05-12T16:23:59.8457388\"}', '2026-05-12 16:23:59', NULL),
(10073, 1, 'tbl_giaodich', 5033, 'INSERT', NULL, '{\"GiaoDichId\":5033,\"SoTien\":4500000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":12,\"TaiKhoanId\":2,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Ti\\u1EC1n thu\\u00EA nh\\u00E0 [DinhKy_Id_1]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:12', 'SYSTEM'),
(10074, 2, 'tbl_giaodich', 5034, 'INSERT', NULL, '{\"GiaoDichId\":5034,\"SoTien\":2000000.00,\"LoaiGiaoDich\":1,\"DanhMucId\":1,\"TaiKhoanId\":3,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"L\\u01B0\\u01A1ng c\\u1ED9ng t\\u00E1c vi\\u00EAn [DinhKy_Id_3]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:17', 'SYSTEM'),
(10075, 13, 'tbl_giaodich', 5035, 'INSERT', NULL, '{\"GiaoDichId\":5035,\"SoTien\":350000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":12,\"TaiKhoanId\":8,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Ti\\u1EC1n \\u0111i\\u1EC7n [DinhKy_Id_7]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:22', 'SYSTEM'),
(10076, 13, 'tbl_giaodich', 5036, 'INSERT', NULL, '{\"GiaoDichId\":5036,\"SoTien\":5000000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":7,\"TaiKhoanId\":8,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Ti\\u1EC1n thu\\u00EA nh\\u00E0 [DinhKy_Id_8]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:27', 'SYSTEM'),
(10077, 14, 'tbl_giaodich', 5037, 'INSERT', NULL, '{\"GiaoDichId\":5037,\"SoTien\":3500000.00,\"LoaiGiaoDich\":1,\"DanhMucId\":1,\"TaiKhoanId\":9,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"L\\u01B0\\u01A1ng part-time [DinhKy_Id_9]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:33', 'SYSTEM'),
(10078, 16, 'tbl_giaodich', 5038, 'INSERT', NULL, '{\"GiaoDichId\":5038,\"SoTien\":1200000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":12,\"TaiKhoanId\":11,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Ph\\u00ED b\\u1EA3o hi\\u1EC3m nh\\u00E2n th\\u1ECD [DinhKy_Id_11]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:44', 'SYSTEM'),
(10079, 17, 'tbl_giaodich', 5039, 'INSERT', NULL, '{\"GiaoDichId\":5039,\"SoTien\":625000.00,\"LoaiGiaoDich\":1,\"DanhMucId\":1,\"TaiKhoanId\":12,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"L\\u00E3i ti\\u1EBFt ki\\u1EC7m [DinhKy_Id_12]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:48', 'SYSTEM'),
(10080, 18, 'tbl_giaodich', 5040, 'INSERT', NULL, '{\"GiaoDichId\":5040,\"SoTien\":200000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":6,\"TaiKhoanId\":13,\"NgayGiaoDich\":\"2025-04-28T00:00:00\",\"MoTa\":\"X\\u0103ng xe tu\\u1EA7n [DinhKy_Id_13]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:53', 'SYSTEM'),
(10081, 20, 'tbl_giaodich', 5041, 'INSERT', NULL, '{\"GiaoDichId\":5041,\"SoTien\":500000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":10,\"TaiKhoanId\":14,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Ph\\u00F2ng kh\\u00E1m \\u0111\\u1ECBnh k\\u1EF3 [DinhKy_Id_14]\",\"NguonTao\":\"system\"}', '2026-05-13 03:56:58', 'SYSTEM'),
(10082, 21, 'tbl_giaodich', 5042, 'INSERT', NULL, '{\"GiaoDichId\":5042,\"SoTien\":59000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":9,\"TaiKhoanId\":15,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Spotify Premium [DinhKy_Id_15]\",\"NguonTao\":\"system\"}', '2026-05-13 03:57:02', 'SYSTEM'),
(10083, 22, 'tbl_giaodich', 5043, 'INSERT', NULL, '{\"GiaoDichId\":5043,\"SoTien\":280000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":12,\"TaiKhoanId\":16,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Internet \\u002B truy\\u1EC1n h\\u00ECnh [DinhKy_Id_16]\",\"NguonTao\":\"system\"}', '2026-05-13 03:57:07', 'SYSTEM'),
(10084, 12, 'tbl_giaodich', 5044, 'INSERT', NULL, '{\"GiaoDichId\":5044,\"SoTien\":350000.00,\"LoaiGiaoDich\":2,\"DanhMucId\":12,\"TaiKhoanId\":17,\"NgayGiaoDich\":\"2025-05-01T00:00:00\",\"MoTa\":\"Ti\\u1EC1n \\u0111i\\u1EC7n [DinhKy_Id_17]\",\"NguonTao\":\"system\"}', '2026-05-13 03:57:12', 'SYSTEM');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_caidat`
--

CREATE TABLE `tbl_caidat` (
  `CaiDatId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `NgonNgu` varchar(10) DEFAULT 'vi',
  `TienTe` varchar(10) DEFAULT 'VND',
  `CheDoToi` bit(1) DEFAULT b'0',
  `DinhDangNgay` varchar(20) DEFAULT 'dd/MM/yyyy',
  `NhanThongBao` bit(1) DEFAULT b'1',
  `ThongBaoJson` text DEFAULT NULL COMMENT 'JSON chứa cài đặt thông báo chi tiết'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_caidat`
--

INSERT INTO `tbl_caidat` (`CaiDatId`, `NguoiDungId`, `NgonNgu`, `TienTe`, `CheDoToi`, `DinhDangNgay`, `NhanThongBao`, `ThongBaoJson`) VALUES
(1, 1, 'vi', 'VND', b'0', 'dd/MM/yyyy', b'1', NULL),
(2, 2, 'vi', 'VND', b'1', 'dd/MM/yyyy', b'1', NULL),
(3, 3, 'en', 'USD', b'0', 'MM/dd/yyyy', b'0', NULL),
(4, 13, 'vi', 'VND', b'0', 'dd/MM/yyyy', b'1', NULL),
(5, 14, 'vi', 'VND', b'1', 'dd/MM/yyyy', b'1', NULL),
(6, 15, 'vi', 'VND', b'0', 'dd/MM/yyyy', b'0', NULL),
(7, 16, 'vi', 'VND', b'0', 'dd/MM/yyyy', b'1', NULL),
(8, 17, 'vi', 'VND', b'1', 'dd/MM/yyyy', b'1', NULL),
(9, 18, 'vi', 'VND', b'0', 'dd/MM/yyyy', b'1', NULL),
(10, 20, 'en', 'USD', b'0', 'MM/dd/yyyy', b'1', NULL),
(11, 21, 'vi', 'VND', b'0', 'dd/MM/yyyy', b'0', NULL),
(12, 22, 'vi', 'VND', b'1', 'dd/MM/yyyy', b'1', NULL),
(13, 19, 'en', 'USD', b'0', 'MM/dd/yyyy', b'0', NULL),
(14, 12, 'vi', 'VND', b'0', 'dd/MM/yyyy', b'1', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_cauhinh_hethong`
--

CREATE TABLE `tbl_cauhinh_hethong` (
  `CauHinhId` int(11) NOT NULL,
  `TenThamSo` varchar(100) NOT NULL,
  `GiaTri` varchar(255) NOT NULL,
  `MoTa` varchar(255) DEFAULT NULL,
  `KieuDuLieu` varchar(50) DEFAULT 'string'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_cauhinh_hethong`
--

INSERT INTO `tbl_cauhinh_hethong` (`CauHinhId`, `TenThamSo`, `GiaTri`, `MoTa`, `KieuDuLieu`) VALUES
(1, 'Max_Upload_Size_MB', '10', 'Dung lượng file tối đa cho phép tải lên', 'int'),
(2, 'AI_Confidence_Threshold', '0.8', 'Độ tin cậy tối thiểu để AI tự động phân loại', 'float'),
(3, 'Maintenance_Mode', 'false', 'Chế độ bảo trì hệ thống', 'bool'),
(4, 'Default_Currency', 'VND', 'Đơn vị tiền tệ mặc định', 'string');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_chat_ai`
--

CREATE TABLE `tbl_chat_ai` (
  `ChatId` int(11) NOT NULL COMMENT 'ID cuộc hội thoại',
  `NguoiDungId` int(11) NOT NULL COMMENT 'FK → tbl_nguoidung',
  `CuocHoiThoaiId` varchar(36) DEFAULT NULL COMMENT 'UUID nhóm các câu hỏi trong cùng 1 cuộc hội thoại',
  `TieuDe` varchar(255) DEFAULT NULL COMMENT 'Tóm tắt nội dung cuộc hội thoại (tự động generate từ câu hỏi đầu)',
  `VaiTro` varchar(20) DEFAULT 'user' COMMENT 'Vai trò gửi tin: user=Người dùng, assistant=AI',
  `ThuTu` int(11) DEFAULT 1 COMMENT 'Thứ tự tin nhắn trong cuộc hội thoại',
  `CauHoi` text NOT NULL COMMENT 'Nội dung câu hỏi của người dùng',
  `TraLoi` text DEFAULT NULL COMMENT 'Nội dung phản hồi từ AI',
  `ModelAI` varchar(100) DEFAULT NULL COMMENT 'Tên model AI đã xử lý câu hỏi này',
  `SoToken` int(11) DEFAULT 0 COMMENT 'Tổng số token đã tiêu thụ (input + output)',
  `ChiPhi` decimal(18,4) DEFAULT 0.0000 COMMENT 'Chi phí API call tính bằng USD',
  `ThoiGian` datetime DEFAULT current_timestamp() COMMENT 'Thời điểm thực hiện chat',
  `TrangThai` tinyint(4) DEFAULT 1 COMMENT '1=Thành công, 0=Lỗi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lịch sử toàn bộ hội thoại giữa người dùng và AI chatbot tài chính';

--
-- Đang đổ dữ liệu cho bảng `tbl_chat_ai`
--

INSERT INTO `tbl_chat_ai` (`ChatId`, `NguoiDungId`, `CuocHoiThoaiId`, `TieuDe`, `VaiTro`, `ThuTu`, `CauHoi`, `TraLoi`, `ModelAI`, `SoToken`, `ChiPhi`, `ThoiGian`, `TrangThai`) VALUES
(1, 12, '0c54694a-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'cho tôi kế hoạch tiết kiệm 20 triệu tháng này', '##TIEUDE## Kế hoạch tiết kiệm 20 triệu/tháng\n###SUBTIEUDE### Phân tích và giải pháp\n-ITEM~ Tăng thu nhập thêm 12 triệu vía làm thêm, freelance, bán hàng.\n-ITEM~ Cắt chi phí không cần thiết: giảm ăn uống ngoài, di chuyển bằng xe đạp.\n-ITEM~ Sử dụng phần của số dư tài khoản hiện tại (79,3 triệu) để hoàn thành mục tiêu nếu không thể tăng thu nhập đủ.\n-ITEM~ Theo dõi chi tiêu hàng ngày qua ứng dụng, đặt mục tiêu tiết kiệm 667k/ngày.\n-ITEM~ Đặt mục tiêu tự động chuyển khoản vào tiết kiệm mỗi khi nhận lương.', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-11 03:54:18', 1),
(2, 12, '0c546bb3-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top 3 thu nhập tháng này', 'Không thể truy vấn dữ liệu: Xử lý truy vấn thất bại: Invalid JSON format: \',\' is invalid after a property name. Expected a \':\'. LineNumber: 0 | BytePositionInLine: 176.', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-11 03:55:15', 1),
(3, 12, '0c546c6c-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top 3 thu nhập tháng này', 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-11 04:02:52', 1),
(4, 12, '0c546ce1-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top 3 thu nhập tháng này', 'Tìm thấy 2 giao dịch. Mới nhất: Lương', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-11 04:06:29', 1),
(5, 12, '0c546d5a-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top 3 chi tiêu tháng này', 'Tìm thấy 3 giao dịch. Mới nhất: Tiền thuê nhà tháng 4', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-12 02:21:58', 1),
(6, 12, '0c546db8-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'Với thu nhập hiện tại, tôi nên đầu tư gì để sinh lời?', 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-12 14:42:35', 1),
(7, 12, '0c546e1e-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top 3 chi tiêu', 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-12 21:40:29', 1),
(8, 12, '0c546e79-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top 3 giao dịch', 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-12 21:56:45', 1),
(9, 12, '0c546ecd-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top giao dịch tháng này', 'Tìm thấy 96 giao dịch. Mới nhất: Lương tháng 4/2026', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-12 22:03:59', 1),
(10, 12, '0c546f24-4e9a-11f1-90a5-00155dd7791b', NULL, 'user', 1, 'top giao dịch tháng này', 'Không có dữ liệu nào phù hợp với yêu cầu của bạn.', 'NVIDIA-Nemotron-3', NULL, NULL, '2026-05-12 22:33:56', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_chitiet_giaodich`
--

CREATE TABLE `tbl_chitiet_giaodich` (
  `Id` int(11) NOT NULL,
  `GiaoDichId` int(11) NOT NULL,
  `DanhMucId` int(11) NOT NULL,
  `SoTien` decimal(18,2) NOT NULL,
  `MoTa` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_chitiet_giaodich`
--

INSERT INTO `tbl_chitiet_giaodich` (`Id`, `GiaoDichId`, `DanhMucId`, `SoTien`, `MoTa`) VALUES
(1, 2, 5, 80000.00, 'Thực phẩm'),
(2, 2, 8, 25000.00, 'Sản phẩm vệ sinh'),
(3, 2, 9, 15000.00, 'Đồ chơi nhỏ'),
(7, 8, 5, 150000.00, 'Phần cơm'),
(8, 8, 5, 100000.00, 'Nước uống'),
(9, 11, 8, 800000.00, 'Quần jeans'),
(10, 11, 8, 700000.00, 'Áo thun'),
(11, 13, 5, 120000.00, 'Thịt nướng'),
(12, 13, 5, 60000.00, 'Rau củ'),
(13, 14, 9, 150000.00, 'Vé xem phim'),
(14, 14, 9, 80000.00, 'Bắp rang + nước'),
(15, 15, 11, 1200000.00, 'Học phí khoá Python 3 tháng'),
(16, 16, 7, 4500000.00, 'Tiền thuê nhà chính'),
(17, 19, 6, 250000.00, 'Đổ xăng'),
(18, 19, 6, 70000.00, 'Gửi xe'),
(19, 21, 9, 250000.00, 'Vé xem phim'),
(20, 21, 9, 200000.00, 'Bắp rang và nước'),
(21, 43, 5, 135000.00, 'Cơm gà + nước'),
(22, 50, 5, 280000.00, 'Thịt nướng'),
(23, 50, 5, 170000.00, 'Rau + lẩu'),
(5001, 4001, 5, 50000.00, NULL),
(5002, 4002, 6, 30000.00, NULL),
(5003, 4003, 1, 8000000.00, NULL),
(5004, 4004, 5, 120000.00, NULL),
(5601, 4601, 5, 60000.00, NULL),
(5602, 4602, 6, 40000.00, NULL),
(5603, 4603, 1, 7500000.00, NULL),
(5604, 4604, 5, 150000.00, NULL),
(5701, 4701, 5, 70000.00, NULL),
(5702, 4702, 6, 50000.00, NULL),
(5703, 4703, 1, 8000000.00, NULL),
(5704, 4704, 5, 200000.00, NULL),
(5801, 4801, 5, 90000.00, NULL),
(5802, 4802, 6, 60000.00, NULL),
(5803, 4803, 1, 8200000.00, NULL),
(5804, 4804, 5, 180000.00, NULL),
(5901, 4901, 5, 100000.00, NULL),
(5902, 4902, 6, 70000.00, NULL),
(5903, 4903, 1, 8300000.00, NULL),
(5904, 4904, 5, 220000.00, NULL),
(6001, 5001, 5, 85000.00, NULL),
(6002, 5002, 6, 50000.00, NULL),
(6003, 5003, 1, 8400000.00, NULL),
(6004, 5004, 5, 190000.00, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_danhmuc`
--

CREATE TABLE `tbl_danhmuc` (
  `DanhMucId` int(11) NOT NULL,
  `TenDanhMuc` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `MoTa` varchar(500) DEFAULT NULL COMMENT 'Mô tả danh mục này bao gồm những loại chi tiêu/thu nhập nào',
  `LoaiDanhMucId` int(11) NOT NULL,
  `DanhMucChaId` int(11) DEFAULT NULL,
  `NguoiDungId` int(11) DEFAULT NULL,
  `Icon` varchar(100) DEFAULT NULL,
  `MauSac` varchar(50) DEFAULT NULL,
  `ThuTu` int(11) DEFAULT 0,
  `TrangThai` tinyint(4) DEFAULT 1,
  `CapDo` tinyint(4) DEFAULT 1 COMMENT 'Cấp trong cây: 1=Gốc, 2=Con, 3=Cháu',
  `DuongDan` varchar(500) DEFAULT NULL COMMENT 'Đường dẫn phân cấp VD: /1/5/28/ (dùng cho truy vấn cây)',
  `DaXoa` bit(1) DEFAULT b'0' COMMENT 'Soft delete: 1=Đã xóa, 0=Đang hiển thị'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_danhmuc`
--

INSERT INTO `tbl_danhmuc` (`DanhMucId`, `TenDanhMuc`, `MoTa`, `LoaiDanhMucId`, `DanhMucChaId`, `NguoiDungId`, `Icon`, `MauSac`, `ThuTu`, `TrangThai`, `CapDo`, `DuongDan`, `DaXoa`) VALUES
(1, 'Lương', 'Lương cơ bản, phụ cấp, thưởng lương', 1, NULL, NULL, 'salary.png', '#4CAF50', 0, 1, 1, NULL, b'0'),
(2, 'Thưởng', 'Thưởng hiệu suất, thưởng lễ, thưởng dự án', 1, NULL, NULL, 'bonus.png', '#8BC34A', 0, 1, 1, NULL, b'0'),
(3, 'Đầu tư', 'Lợi nhuận từ chứng khoán, quỹ, tiết kiệm', 1, NULL, NULL, 'investment.png', '#009688', 0, 1, 1, NULL, b'0'),
(4, 'Thu nhập khác', 'Các khoản thu nhập không thường xuyên khác', 1, NULL, NULL, 'other-income.png', '#607D8B', 0, 1, 1, NULL, b'0'),
(5, 'Ăn uống', 'Ăn uống tại nhà hàng, quán ăn, mua thực phẩm', 2, NULL, NULL, 'food.png', '#F44336', 0, 1, 1, NULL, b'0'),
(6, 'Di chuyển', 'Xăng xe, Grab, taxi, xe buýt, gửi xe', 2, NULL, NULL, 'transport.png', '#FF9800', 0, 1, 1, NULL, b'0'),
(7, 'Nhà ở', 'Tiền thuê nhà, điện, nước, internet', 2, NULL, NULL, 'housing.png', '#795548', 0, 1, 1, NULL, b'0'),
(8, 'Mua sắm', 'Quần áo, giày dép, phụ kiện, đồ dùng cá nhân', 2, NULL, NULL, 'shopping.png', '#E91E63', 0, 1, 1, NULL, b'0'),
(9, 'Giải trí', 'Xem phim, du lịch, game, streaming, sự kiện', 2, NULL, NULL, 'entertainment.png', '#9C27B0', 0, 1, 1, NULL, b'0'),
(10, 'Sức khoẻ', 'Khám bệnh, thuốc, bảo hiểm y tế, gym', 2, NULL, NULL, 'health.png', '#F44336', 0, 1, 1, NULL, b'0'),
(11, 'Giáo dục', 'Học phí, sách vở, khóa học online/offline', 2, NULL, NULL, 'education.png', '#3F51B5', 0, 1, 1, NULL, b'0'),
(12, 'Hoá đơn', 'Hóa đơn điện, nước, internet, điện thoại', 2, NULL, NULL, 'bill.png', '#FF5722', 0, 1, 1, NULL, b'0'),
(13, 'Chi tiêu khác', 'Các khoản chi tiêu không thuộc danh mục nào', 2, NULL, NULL, 'other-income.png', '#9E9E9E', 0, 1, 1, NULL, b'0'),
(27, 'Cho vay bạn bè', NULL, 1, NULL, 1, 'loan-out.png', '#00BCD4', 0, 1, 1, NULL, b'0'),
(28, 'Cà phê', NULL, 2, 5, 2, 'coffee.png', '#795548', 0, 1, 1, NULL, b'0'),
(29, 'Thú cưng', NULL, 2, NULL, 3, 'pet.png', '#FF9800', 0, 1, 1, NULL, b'0'),
(30, 'Freelance', NULL, 1, NULL, 13, 'freelance.png', '#00ACC1', 0, 1, 1, NULL, b'0'),
(31, 'Cổ tức', NULL, 1, NULL, 14, 'dividend.png', '#43A047', 0, 1, 1, NULL, b'0'),
(32, 'Tiền lì xì', NULL, 1, NULL, 15, 'lucky.png', '#FB8C00', 0, 1, 1, NULL, b'0'),
(33, 'Thể thao', NULL, 2, NULL, 16, 'sport.png', '#1E88E5', 0, 1, 1, NULL, b'0'),
(34, 'Mỹ phẩm', NULL, 2, NULL, 17, 'cosmetic.png', '#EC407A', 0, 1, 1, NULL, b'0'),
(35, 'Đồ điện tử', NULL, 2, NULL, 18, 'electronic.png', '#5E35B1', 0, 1, 1, NULL, b'0'),
(36, 'Du lịch', NULL, 2, NULL, 20, 'travel.png', '#00897B', 0, 1, 1, NULL, b'0'),
(37, 'Từ thiện', NULL, 2, NULL, 21, 'charity.png', '#E53935', 0, 1, 1, NULL, b'0'),
(38, 'Bảo hiểm', NULL, 2, NULL, 22, 'insurance.png', '#6D4C41', 0, 1, 1, NULL, b'0'),
(39, 'Đặt hàng online', NULL, 2, 8, 13, 'online-shop.png', '#7E57C2', 0, 1, 1, NULL, b'0'),
(3004, 'Cà phê', NULL, 2, 5, 12, 'coffee.png', '#795548', 0, 1, 1, NULL, b'0'),
(3005, 'Freelance', NULL, 1, NULL, 12, 'freelance.png', '#00ACC1', 0, 1, 1, NULL, b'0'),
(3006, 'Đặt hàng online', NULL, 2, 8, 12, 'online-shop.png', '#7E57C2', 0, 1, 1, NULL, b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_da_gui_thongbao`
--

CREATE TABLE `tbl_da_gui_thongbao` (
  `DaGuiId` int(11) NOT NULL,
  `NguoiDungId` int(11) DEFAULT NULL,
  `LoaiThongBao` varchar(50) DEFAULT NULL,
  `ThamChieuId` int(11) DEFAULT NULL,
  `ThoiGianGui` datetime DEFAULT NULL,
  `DaDoc` bit(1) DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_donggop_muctieu`
--

CREATE TABLE `tbl_donggop_muctieu` (
  `Id` int(11) NOT NULL,
  `MucTieuId` int(11) NOT NULL,
  `SoTien` decimal(18,2) NOT NULL,
  `NgayDongGop` datetime DEFAULT current_timestamp(),
  `GhiChu` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_donggop_muctieu`
--

INSERT INTO `tbl_donggop_muctieu` (`Id`, `MucTieuId`, `SoTien`, `NgayDongGop`, `GhiChu`) VALUES
(1, 1, 4000000.00, '2025-02-01 09:00:00', 'Góp tháng 2'),
(2, 1, 4000000.00, '2025-03-01 09:00:00', 'Góp tháng 3'),
(3, 3, 5000000.00, '2025-03-15 10:00:00', 'Tiết kiệm từ lương tháng 3'),
(7, 7, 2000000.00, '2025-01-10 09:00:00', 'Tiết kiệm tháng 1'),
(8, 7, 3000000.00, '2025-02-10 09:00:00', 'Tiết kiệm tháng 2'),
(9, 8, 2000000.00, '2025-02-05 10:00:00', 'Đóng góp quỹ tháng 2'),
(10, 8, 3000000.00, '2025-03-05 10:00:00', 'Đóng góp quỹ tháng 3'),
(11, 9, 5000000.00, '2025-01-20 09:00:00', 'Để dành từ lương tháng 1'),
(12, 9, 10000000.00, '2025-03-20 09:00:00', 'Thưởng dự án tháng 3'),
(13, 10, 1500000.00, '2025-03-01 10:00:00', 'Trả nợ đợt 1'),
(14, 10, 1500000.00, '2025-04-01 10:00:00', 'Trả nợ đợt 2'),
(15, 11, 5000000.00, '2025-01-31 09:00:00', 'Tiết kiệm tháng 1'),
(16, 12, 5000000.00, '2025-02-28 09:00:00', 'Đóng góp quỹ du học tháng 2'),
(17, 17, 3000000.00, '2025-04-10 09:00:00', 'Trích từ lương tháng 4'),
(18, 18, 2000000.00, '2025-04-15 09:00:00', 'Bổ sung quỹ dự phòng'),
(19, 19, 3000000.00, '2026-04-01 10:00:00', 'Đóng góp tháng 4 - Quỹ Nhật Bản'),
(20, 20, 2000000.00, '2026-04-01 10:05:00', 'Đóng góp tháng 4 - Mua xe'),
(21, 21, 3000000.00, '2026-04-01 10:10:00', 'Đóng góp tháng 4 - Quỹ khẩn cấp'),
(8001, 7001, 2000000.00, '2026-05-05 17:22:34', NULL),
(8002, 7002, 50000.00, '2026-05-12 00:00:00', NULL),
(8003, 7002, 50000.00, '2026-05-12 00:00:00', NULL),
(8004, 7002, 50000.00, '2026-05-12 00:00:00', NULL),
(8005, 7002, 50000.00, '2026-05-12 00:00:00', NULL),
(8006, 7002, 250000.00, '2026-05-12 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_dudoan`
--

CREATE TABLE `tbl_dudoan` (
  `DuDoanId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `Thang` int(11) NOT NULL,
  `Nam` int(11) NOT NULL,
  `DuDoanChiTieu` decimal(18,2) DEFAULT NULL,
  `DuDoanThuNhap` decimal(18,2) DEFAULT NULL,
  `DoChinhXac` float DEFAULT NULL,
  `NgayDuDoan` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_dudoan`
--

INSERT INTO `tbl_dudoan` (`DuDoanId`, `NguoiDungId`, `Thang`, `Nam`, `DuDoanChiTieu`, `DuDoanThuNhap`, `DoChinhXac`, `NgayDuDoan`) VALUES
(1, 1, 5, 2025, 12000000.00, 18000000.00, 0.87, '2025-04-01 06:00:00'),
(2, 2, 5, 2025, 10500000.00, 12000000.00, 0.82, '2025-04-01 06:00:00'),
(3, 3, 5, 2025, 7500000.00, 8000000.00, 0.75, '2025-04-01 06:00:00'),
(4, 13, 5, 2025, 10000000.00, 16000000.00, 0.83, '2025-04-01 06:00:00'),
(5, 14, 5, 2025, 8200000.00, 10000000.00, 0.79, '2025-04-01 06:00:00'),
(6, 15, 5, 2025, 12500000.00, 20000000.00, 0.88, '2025-04-01 06:00:00'),
(7, 16, 5, 2025, 13500000.00, 15000000.00, 0.72, '2025-04-01 06:00:00'),
(8, 17, 5, 2025, 6800000.00, 10000000.00, 0.85, '2025-04-01 06:00:00'),
(9, 18, 5, 2025, 5600000.00, 8000000.00, 0.78, '2025-04-01 06:00:00'),
(10, 20, 5, 2025, 10500000.00, 25000000.00, 0.9, '2025-04-01 06:00:00'),
(11, 21, 5, 2025, 6200000.00, 9000000.00, 0.81, '2025-04-01 06:00:00'),
(12, 22, 5, 2025, 17000000.00, 30000000.00, 0.86, '2025-04-01 06:00:00'),
(13, 13, 5, 2025, 9800000.00, 16000000.00, 0.84, '2025-04-01 06:00:00'),
(14, 12, 5, 2025, 6500000.00, 18500000.00, 0.86, '2025-04-30 06:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_feature_flag`
--

CREATE TABLE `tbl_feature_flag` (
  `FeatureId` int(11) NOT NULL COMMENT 'ID tính năng',
  `TenFeature` varchar(255) NOT NULL COMMENT 'Tên tính năng (VD: EnableAIChat, EnableOCR)',
  `BatTat` bit(1) DEFAULT b'1' COMMENT '1=Bật, 0=Tắt',
  `MoTa` varchar(255) DEFAULT NULL COMMENT 'Mô tả mục đích của tính năng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Quản lý bật/tắt từng tính năng của hệ thống mà không cần deploy lại';

--
-- Đang đổ dữ liệu cho bảng `tbl_feature_flag`
--

INSERT INTO `tbl_feature_flag` (`FeatureId`, `TenFeature`, `BatTat`, `MoTa`) VALUES
(1, 'EnableAIChat', b'1', 'Tính năng chat với AI tư vấn tài chính'),
(2, 'EnableOCR', b'1', 'Tính năng nhận dạng hóa đơn bằng OCR'),
(3, 'EnableOpenBanking', b'0', 'Tính năng kết nối API ngân hàng tự động'),
(4, 'EnableAIForecast', b'1', 'Tính năng dự đoán chi tiêu bằng AI'),
(5, 'EnableDarkMode', b'1', 'Cho phép người dùng bật dark mode'),
(6, 'EnableExportPDF', b'1', 'Xuất báo cáo ra file PDF'),
(7, 'EnableMaintenanceMode', b'0', 'Chế độ bảo trì toàn hệ thống');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_giaodich`
--

CREATE TABLE `tbl_giaodich` (
  `GiaoDichId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `TaiKhoanId` int(11) NOT NULL,
  `TaiKhoanDichId` int(11) DEFAULT NULL,
  `DanhMucId` int(11) DEFAULT NULL,
  `TenGiaoDich` varchar(255) DEFAULT NULL COMMENT 'Tên ngắn gọn của giao dịch (VD: Lương tháng 5, Tiền nhà...)',
  `LoaiGiaoDich` tinyint(4) NOT NULL,
  `SoTien` decimal(18,2) NOT NULL,
  `TienTe` varchar(10) DEFAULT 'VND',
  `TyGiaQuyDoi` decimal(18,6) DEFAULT 1.000000,
  `NgayGiaoDich` datetime NOT NULL,
  `MoTa` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NguonDuLieu` tinyint(4) DEFAULT 0,
  `LaTuDong` bit(1) DEFAULT b'0',
  `DoTinCay` float DEFAULT 1,
  `ImportId` int(11) DEFAULT NULL,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `TrangThai` tinyint(4) DEFAULT 1 COMMENT '1=Thành công, 0=Lỗi, 2=Đang xử lý',
  `NguonTao` varchar(20) DEFAULT 'web' COMMENT 'Nguồn tạo: web / mobile / ai / import',
  `ViTri` varchar(255) DEFAULT NULL COMMENT 'Tọa độ GPS khi tạo giao dịch',
  `MaGiaoDichNgoai` varchar(255) DEFAULT NULL COMMENT 'Mã giao dịch đồng bộ từ ngân hàng ngoài'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_giaodich`
--

INSERT INTO `tbl_giaodich` (`GiaoDichId`, `NguoiDungId`, `TaiKhoanId`, `TaiKhoanDichId`, `DanhMucId`, `TenGiaoDich`, `LoaiGiaoDich`, `SoTien`, `TienTe`, `TyGiaQuyDoi`, `NgayGiaoDich`, `MoTa`, `NguonDuLieu`, `LaTuDong`, `DoTinCay`, `ImportId`, `NgayTao`, `TrangThai`, `NguonTao`, `ViTri`, `MaGiaoDichNgoai`) VALUES
(1, 1, 2, NULL, 1, 'Lương tháng 4/2025', 1, 15000000.00, 'VND', 1.000000, '2025-04-01 09:00:00', 'Lương tháng 4/2025', 0, b'0', 1, NULL, '2026-04-07 06:10:53', 1, 'web', NULL, NULL),
(2, 1, 2, NULL, 5, 'Ăn trưa nhà hàng Phở 24', 2, 120000.00, 'VND', 1.000000, '2025-04-02 12:30:00', 'Ăn trưa nhà hàng Phở 24', 0, b'0', 1, NULL, '2026-04-07 06:10:53', 1, 'web', NULL, NULL),
(7, 13, 8, NULL, 1, 'Lương tháng 4/2025', 1, 16000000.00, 'VND', 1.000000, '2025-04-05 09:00:00', 'Lương tháng 4/2025', 0, b'0', 1, NULL, '2025-04-05 09:00:00', 1, 'web', NULL, NULL),
(8, 13, 8, NULL, 5, 'Ăn trưa - Cơm văn phòng', 2, 250000.00, 'VND', 1.000000, '2025-04-06 12:00:00', 'Ăn trưa - Cơm văn phòng', 0, b'0', 1, NULL, '2025-04-06 12:00:00', 1, 'web', NULL, NULL),
(9, 14, 9, NULL, 6, 'Grab đi làm', 2, 85000.00, 'VND', 1.000000, '2025-04-07 08:30:00', 'Grab đi làm', 0, b'0', 1, NULL, '2025-04-07 08:30:00', 1, 'web', NULL, NULL),
(10, 15, 10, NULL, 3, 'Lợi nhuận đầu tư chứng khoán', 1, 5000000.00, 'VND', 1.000000, '2025-04-08 10:00:00', 'Lợi nhuận đầu tư chứng khoán', 0, b'0', 1, NULL, '2025-04-08 10:00:00', 1, 'web', NULL, NULL),
(11, 16, 11, NULL, 8, 'Mua sắm quần áo', 2, 1500000.00, 'VND', 1.000000, '2025-04-09 15:00:00', 'Mua sắm quần áo', 0, b'0', 1, NULL, '2025-04-09 15:00:00', 1, 'web', NULL, NULL),
(12, 17, 12, NULL, 2, 'Thưởng quý I/2025', 1, 3000000.00, 'VND', 1.000000, '2025-04-10 09:00:00', 'Thưởng quý I/2025', 0, b'0', 1, NULL, '2025-04-10 09:00:00', 1, 'web', NULL, NULL),
(13, 18, 13, NULL, 5, 'Tối - BBQ cùng gia đình', 2, 180000.00, 'VND', 1.000000, '2025-04-11 19:00:00', 'Tối - BBQ cùng gia đình', 0, b'0', 1, NULL, '2025-04-11 19:00:00', 1, 'web', NULL, NULL),
(14, 20, 14, NULL, 9, 'Xem phim + bắp rang', 2, 350000.00, 'VND', 1.000000, '2025-04-12 21:00:00', 'Xem phim + bắp rang', 0, b'0', 1, NULL, '2025-04-12 21:00:00', 1, 'web', NULL, NULL),
(15, 21, 15, NULL, 11, 'Học phí khoá Python online', 2, 1200000.00, 'VND', 1.000000, '2025-04-13 08:00:00', 'Học phí khoá Python online', 0, b'0', 1, NULL, '2025-04-13 08:00:00', 1, 'web', NULL, NULL),
(16, 22, 16, NULL, 7, 'Tiền thuê nhà tháng 4', 2, 4500000.00, 'VND', 1.000000, '2025-04-14 10:00:00', 'Tiền thuê nhà tháng 4', 0, b'0', 1, NULL, '2025-04-14 10:00:00', 1, 'web', NULL, NULL),
(17, 12, 17, NULL, 1, 'Lương tháng 4/2025', 1, 18000000.00, 'VND', 1.000000, '2025-04-05 08:00:00', 'Lương tháng 4/2025', 0, b'0', 1, NULL, '2025-04-05 08:00:00', 1, 'web', NULL, NULL),
(18, 12, 17, NULL, 5, 'Ăn trưa văn phòng', 2, 120000.00, 'VND', 1.000000, '2025-04-06 12:15:00', 'Ăn trưa văn phòng', 0, b'0', 1, NULL, '2025-04-06 12:15:00', 1, 'web', NULL, NULL),
(19, 12, 17, NULL, 6, 'Đổ xăng và gửi xe', 2, 320000.00, 'VND', 1.000000, '2025-04-07 08:10:00', 'Đổ xăng và gửi xe', 0, b'0', 1, NULL, '2025-04-07 08:10:00', 1, 'web', NULL, NULL),
(21, 12, 18, NULL, 9, 'Xem phim cuối tuần', 2, 450000.00, 'VND', 1.000000, '2025-04-12 20:00:00', 'Xem phim cuối tuần', 0, b'0', 1, NULL, '2025-04-12 20:00:00', 1, 'web', NULL, NULL),
(22, 12, 17, NULL, 3, 'Lãi đầu tư chứng chỉ quỹ', 1, 2500000.00, 'VND', 1.000000, '2025-04-18 09:30:00', 'Lãi đầu tư chứng chỉ quỹ', 0, b'0', 1, NULL, '2025-04-18 09:30:00', 1, 'web', NULL, NULL),
(23, 12, 31, NULL, 1, 'Lương tháng 4/2026', 1, 20000000.00, 'VND', 1.000000, '2026-04-01 08:00:00', 'Lương tháng 4/2026', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(24, 12, 31, NULL, 2, 'Thưởng dự án Q1/2026', 1, 3000000.00, 'VND', 1.000000, '2026-04-05 10:00:00', 'Thưởng dự án Q1/2026', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(25, 12, 31, NULL, 3, 'Lãi tiết kiệm tháng 4', 1, 500000.00, 'VND', 1.000000, '2026-04-15 09:00:00', 'Lãi tiết kiệm tháng 4', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(26, 12, 32, NULL, 3005, 'Viết bài freelance', 1, 1500000.00, 'VND', 1.000000, '2026-04-20 14:00:00', 'Viết bài freelance', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(27, 12, 31, NULL, 7, 'Tiền thuê nhà tháng 4', 2, 5500000.00, 'VND', 1.000000, '2026-04-01 08:00:00', 'Tiền thuê nhà tháng 4', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(28, 12, 31, NULL, 12, 'Hóa đơn điện tháng 4', 2, 850000.00, 'VND', 1.000000, '2026-04-05 10:00:00', 'Hóa đơn điện tháng 4', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(29, 12, 31, NULL, 12, 'Hóa đơn nước tháng 4', 2, 350000.00, 'VND', 1.000000, '2026-04-05 10:05:00', 'Hóa đơn nước tháng 4', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(30, 12, 31, NULL, 12, 'Internet FPT tháng 4', 2, 280000.00, 'VND', 1.000000, '2026-04-08 09:00:00', 'Internet FPT tháng 4', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(31, 12, 31, NULL, 6, 'Grab đi làm', 2, 350000.00, 'VND', 1.000000, '2026-04-03 08:30:00', 'Grab đi làm', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(32, 12, 31, NULL, 6, 'Grab đi làm', 2, 250000.00, 'VND', 1.000000, '2026-04-10 08:30:00', 'Grab đi làm', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(33, 12, 31, NULL, 6, 'Grab đi làm', 2, 280000.00, 'VND', 1.000000, '2026-04-17 08:30:00', 'Grab đi làm', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(34, 12, 31, NULL, 6, 'Xăng xe máy', 2, 400000.00, 'VND', 1.000000, '2026-04-07 20:00:00', 'Xăng xe máy', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(35, 12, 32, NULL, 5, 'Cơm trưa công ty', 2, 120000.00, 'VND', 1.000000, '2026-04-02 12:00:00', 'Cơm trưa công ty', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(36, 12, 32, NULL, 5, 'Cơm trưa công ty', 2, 150000.00, 'VND', 1.000000, '2026-04-03 12:00:00', 'Cơm trưa công ty', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(37, 12, 32, NULL, 5, 'Cà phê sáng', 2, 80000.00, 'VND', 1.000000, '2026-04-04 18:00:00', 'Cà phê sáng', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(38, 12, 32, NULL, 5, 'Cơm trưa công ty', 2, 200000.00, 'VND', 1.000000, '2026-04-06 12:00:00', 'Cơm trưa công ty', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(39, 12, 32, NULL, 5, 'Cơm gia đình cuối tuần', 2, 350000.00, 'VND', 1.000000, '2026-04-12 19:00:00', 'Cơm gia đình cuối tuần', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(40, 12, 32, NULL, 5, 'Mua thực phẩm tuần', 2, 450000.00, 'VND', 1.000000, '2026-04-15 12:00:00', 'Mua thực phẩm tuần', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(41, 12, 32, NULL, 5, 'Mua rau củ chợ', 2, 280000.00, 'VND', 1.000000, '2026-04-18 18:00:00', 'Mua rau củ chợ', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(42, 12, 32, NULL, 3004, 'Cà phê sáng', 2, 60000.00, 'VND', 1.000000, '2026-04-20 08:00:00', 'Cà phê sáng', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(43, 12, 31, NULL, 8, 'Quần áo mới', 2, 800000.00, 'VND', 1.000000, '2026-04-09 20:00:00', 'Quần áo mới', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(44, 12, 31, NULL, 3006, 'Mua sắm online - Shopee', 2, 350000.00, 'VND', 1.000000, '2026-04-14 15:00:00', 'Mua sắm online - Shopee', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(45, 12, 32, NULL, 9, 'Xem phim cuối tuần', 2, 250000.00, 'VND', 1.000000, '2026-04-06 21:00:00', 'Xem phim cuối tuần', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(46, 12, 32, NULL, 9, 'Netflix tháng 4', 2, 150000.00, 'VND', 1.000000, '2026-04-13 20:00:00', 'Netflix tháng 4', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(47, 12, 32, NULL, 9, 'Spotify Premium', 2, 180000.00, 'VND', 1.000000, '2026-04-19 22:00:00', 'Spotify Premium', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(48, 12, 31, NULL, 10, 'Thuốc bổ vitamin', 2, 150000.00, 'VND', 1.000000, '2026-04-04 07:00:00', 'Thuốc bổ vitamin', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(49, 12, 31, NULL, 10, 'Khám sức khỏe định kỳ', 2, 500000.00, 'VND', 1.000000, '2026-04-11 18:00:00', 'Khám sức khỏe định kỳ', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(50, 12, 31, NULL, 11, 'Học phí tiếng Anh online', 2, 900000.00, 'VND', 1.000000, '2026-04-01 10:00:00', 'Học phí tiếng Anh online', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(51, 12, 31, NULL, 11, 'Mua sách kỹ năng', 2, 350000.00, 'VND', 1.000000, '2026-04-16 20:00:00', 'Mua sách kỹ năng', 0, b'0', 1, NULL, '2026-04-18 05:14:58', 1, 'web', NULL, NULL),
(52, 12, 31, NULL, 1, 'Lương tháng 5/2025', 1, 20000000.00, 'VND', 1.000000, '2025-05-01 08:30:00', 'Lương tháng 5/2025', 0, b'0', 1, NULL, '2025-05-01 08:35:00', 1, 'web', NULL, NULL),
(53, 12, 31, NULL, 5, 'Cơm trưa công ty', 2, 135000.00, 'VND', 1.000000, '2025-05-01 12:15:00', 'Cơm trưa công ty', 0, b'0', 0.95, NULL, '2025-05-01 12:20:00', 1, 'web', NULL, NULL),
(54, 12, 31, NULL, 6, 'Xăng xe + Grab đi làm', 2, 380000.00, 'VND', 1.000000, '2025-05-02 08:20:00', 'Xăng xe + Grab đi làm', 0, b'0', 0.92, NULL, '2025-05-02 08:25:00', 1, 'web', NULL, NULL),
(55, 12, 31, NULL, 9, 'Xem phim Netflix + ăn vặt', 2, 220000.00, 'VND', 1.000000, '2025-05-02 20:30:00', 'Xem phim Netflix + ăn vặt', 0, b'0', 0.88, NULL, '2025-05-02 20:35:00', 1, 'web', NULL, NULL),
(56, 12, 31, NULL, 7, 'Tiền nhà tháng 5', 2, 5500000.00, 'VND', 1.000000, '2025-05-03 09:00:00', 'Tiền nhà tháng 5', 0, b'0', 1, NULL, '2025-05-03 09:05:00', 1, 'web', NULL, NULL),
(57, 12, 31, NULL, 12, 'Hóa đơn điện tháng 5', 2, 420000.00, 'VND', 1.000000, '2025-05-03 10:00:00', 'Hóa đơn điện tháng 5', 0, b'0', 0.97, NULL, '2025-05-03 10:05:00', 1, 'web', NULL, NULL),
(58, 12, 31, NULL, 8, 'Mua quần áo + giày', 2, 1250000.00, 'VND', 1.000000, '2025-05-04 14:40:00', 'Mua quần áo + giày', 0, b'0', 0.85, NULL, '2025-05-04 14:45:00', 1, 'web', NULL, NULL),
(59, 12, 31, NULL, 5, 'Ăn tối gia đình', 2, 450000.00, 'VND', 1.000000, '2025-05-04 19:00:00', 'Ăn tối gia đình', 0, b'0', 0.9, NULL, '2025-05-04 19:10:00', 1, 'web', NULL, NULL),
(60, 12, 31, NULL, 11, 'Học phí khóa học online', 2, 850000.00, 'VND', 1.000000, '2025-05-05 18:00:00', 'Học phí khóa học online', 0, b'0', 0.93, NULL, '2025-05-05 18:05:00', 1, 'web', NULL, NULL),
(4001, 12, 2001, NULL, 5, 'Ăn sáng', 2, 50000.00, 'VND', 1.000000, '2026-05-01 00:00:00', 'Ăn sáng', 0, b'0', 1, NULL, '2026-05-05 17:22:34', 1, 'web', NULL, NULL),
(4002, 12, 2001, NULL, 6, 'Gửi xe', 2, 30000.00, 'VND', 1.000000, '2026-05-02 00:00:00', 'Gửi xe', 0, b'0', 1, NULL, '2026-05-05 17:22:34', 1, 'web', NULL, NULL),
(4003, 12, 2002, NULL, 1, 'Lương', 1, 8000000.00, 'VND', 1.000000, '2026-05-03 00:00:00', 'Lương', 0, b'0', 1, NULL, '2026-05-05 17:22:34', 1, 'web', NULL, NULL),
(4004, 12, 2001, NULL, 5, 'Ăn tối', 2, 120000.00, 'VND', 1.000000, '2026-05-04 00:00:00', 'Ăn tối', 0, b'0', 1, NULL, '2026-05-05 17:22:34', 1, 'web', NULL, NULL),
(4005, 12, 2001, NULL, 6, 'Xăng xe', 2, 40000.00, 'VND', 1.000000, '2026-05-05 00:00:00', 'Xăng xe', 0, b'0', 1, NULL, '2026-05-05 17:22:34', NULL, NULL, NULL, NULL),
(4601, 12, 2001, NULL, 5, 'Ăn sáng', 2, 60000.00, 'VND', 1.000000, '2025-12-02 00:00:00', 'Ăn sáng', 0, b'0', 1, NULL, '2026-05-05 18:43:06', 1, 'web', NULL, NULL),
(4602, 12, 2001, NULL, 6, 'Đổ xăng', 2, 40000.00, 'VND', 1.000000, '2025-12-05 00:00:00', 'Đổ xăng', 0, b'0', 1, NULL, '2026-05-05 18:43:06', 1, 'web', NULL, NULL),
(4603, 12, 2002, NULL, 1, 'Nhận lương tháng 12', 1, 7500000.00, 'VND', 1.000000, '2025-12-10 00:00:00', 'Nhận lương tháng 12', 0, b'0', 1, NULL, '2026-05-05 18:43:06', 1, 'web', NULL, NULL),
(4604, 12, 2001, NULL, 5, 'Ăn tối', 2, 150000.00, 'VND', 1.000000, '2025-12-20 00:00:00', 'Ăn tối', 0, b'0', 1, NULL, '2026-05-05 18:43:06', 1, 'web', NULL, NULL),
(4701, 12, 2001, NULL, 5, 'Cà phê buổi sáng', 2, 70000.00, 'VND', 1.000000, '2026-01-03 00:00:00', 'Cà phê buổi sáng', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4702, 12, 2001, NULL, 6, 'Gửi xe', 2, 50000.00, 'VND', 1.000000, '2026-01-06 00:00:00', 'Gửi xe', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4703, 12, 2002, NULL, 1, 'Nhận lương tháng 1', 1, 8000000.00, 'VND', 1.000000, '2026-01-10 00:00:00', 'Nhận lương tháng 1', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4704, 12, 2001, NULL, 5, 'Ăn uống cùng bạn', 2, 200000.00, 'VND', 1.000000, '2026-01-25 00:00:00', 'Ăn uống cùng bạn', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4801, 12, 2001, NULL, 5, 'Ăn sáng', 2, 90000.00, 'VND', 1.000000, '2026-02-02 00:00:00', 'Ăn sáng', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4802, 12, 2001, NULL, 6, 'Đổ xăng', 2, 60000.00, 'VND', 1.000000, '2026-02-08 00:00:00', 'Đổ xăng', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4803, 12, 2002, NULL, 1, 'Nhận lương tháng 2', 1, 8200000.00, 'VND', 1.000000, '2026-02-10 00:00:00', 'Nhận lương tháng 2', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4804, 12, 2001, NULL, 5, 'Ăn tối', 2, 180000.00, 'VND', 1.000000, '2026-02-18 00:00:00', 'Ăn tối', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4901, 12, 2001, NULL, 5, 'Ăn sáng', 2, 100000.00, 'VND', 1.000000, '2026-03-01 00:00:00', 'Ăn sáng', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4902, 12, 2001, NULL, 6, 'Gửi xe', 2, 70000.00, 'VND', 1.000000, '2026-03-07 00:00:00', 'Gửi xe', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4903, 12, 2002, NULL, 1, 'Nhận lương tháng 3', 1, 8300000.00, 'VND', 1.000000, '2026-03-10 00:00:00', 'Nhận lương tháng 3', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(4904, 12, 2001, NULL, 5, 'Ăn uống', 2, 220000.00, 'VND', 1.000000, '2026-03-22 00:00:00', 'Ăn uống', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(5001, 12, 2001, NULL, 5, 'Ăn sáng', 2, 85000.00, 'VND', 1.000000, '2026-04-02 00:00:00', 'Ăn sáng', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(5002, 12, 2001, NULL, 6, 'Đổ xăng', 2, 50000.00, 'VND', 1.000000, '2026-04-06 00:00:00', 'Đổ xăng', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(5003, 12, 2002, NULL, 1, 'Nhận lương tháng 4', 1, 8400000.00, 'VND', 1.000000, '2026-04-10 00:00:00', 'Nhận lương tháng 4', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(5004, 12, 2001, NULL, 5, 'Ăn tối', 2, 190000.00, 'VND', 1.000000, '2026-04-25 00:00:00', 'Ăn tối', 0, b'0', 1, NULL, '2026-05-05 18:46:41', 1, 'web', NULL, NULL),
(5005, 12, 2001, NULL, 5, 'Ăn uống cùng bạn bè', 2, 11000.00, NULL, NULL, '2026-05-09 00:00:00', 'Ăn uống cùng bạn bè', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5006, 12, 18, NULL, 3, 'Lãi đầu tư MOMO', 1, 22000.00, NULL, NULL, '2026-05-09 00:00:00', 'Lãi đầu tư MOMO', 0, NULL, NULL, 20, '2026-05-09 20:36:44', 1, 'web', NULL, NULL),
(5007, 12, 18, NULL, 3006, 'Mua tai nghe ở Shoppee', 2, 150000.00, NULL, NULL, '2026-05-10 00:00:00', 'Mua tai nghe ở Shoppee', 0, NULL, NULL, 24, '2026-05-11 04:19:02', 1, NULL, NULL, NULL),
(5008, 12, 2001, NULL, 3, 'Đầu tư chứng khoán', 2, 50000.00, 'VND', 1.000000, '2026-05-11 00:00:00', 'Đầu tư chứng khoán', 0, b'0', 1, NULL, '2026-05-11 13:02:22', 1, 'web', NULL, NULL),
(5009, 12, 2001, NULL, 6, 'đi grab đến công ty', 2, 100000.00, 'VND', 1.000000, '2026-05-11 00:00:00', 'đi grab đến công ty', 0, b'0', 1, NULL, '2026-05-11 13:06:40', 1, 'web', NULL, NULL),
(5010, 12, 2001, NULL, 8, 'mua máy tính cho con', 2, 500000.00, 'VND', 1.000000, '2026-05-11 13:16:48', 'mua máy tính cho con', 0, b'0', 1, NULL, '2026-05-11 13:16:48', 1, 'web', NULL, NULL),
(5011, 12, 2001, NULL, 1, 'Lương', 1, 100000.00, 'VND', 1.000000, '2026-05-11 13:45:38', NULL, 0, b'0', 1, NULL, '2026-05-11 13:45:38', 1, 'web', NULL, NULL),
(5012, 12, 2001, NULL, 9, 'vé cocert', 2, 100000.00, 'VND', 1.000000, '2026-05-11 13:52:27', 'vé cocert', 0, b'0', 1, NULL, '2026-05-11 13:52:27', 1, 'web', NULL, NULL),
(5013, 12, 2001, NULL, 9, 'vé cocert', 2, 100000.00, 'VND', 1.000000, '2026-05-11 13:53:31', 'vé cocert', 0, b'0', 1, NULL, '2026-05-11 13:53:31', 1, 'web', NULL, NULL),
(5014, 12, 2001, NULL, 5, 'ăn uống cùng bạn bè', 2, 50000.00, 'VND', 1.000000, '2026-05-11 13:56:25', 'ăn uống cùng bạn bè', 0, b'0', 1, NULL, '2026-05-11 13:56:25', 1, 'web', NULL, NULL),
(5015, 12, 2001, NULL, 5, 'ăn uống cùng bạn bè buổi tối', 2, 50000.00, 'VND', 1.000000, '2026-05-11 14:11:47', 'ăn uống cùng bạn bè buổi tối', 0, b'0', 1, NULL, '2026-05-11 14:11:47', 1, 'web', NULL, NULL),
(5016, 12, 2001, NULL, 3005, 'lương viết bài content', 1, 10000.00, 'VND', 1.000000, '2026-05-11 15:46:46', 'lương viết bài content', 0, b'0', 1, NULL, '2026-05-11 15:46:46', 1, 'web', NULL, NULL),
(5017, 12, 2001, NULL, 6, 'tiền xe du lịch', 2, 110000.00, 'VND', 1.000000, '2026-05-11 15:50:16', 'tiền xe du lịch', 0, b'0', 1, NULL, '2026-05-11 15:50:16', 1, 'web', NULL, NULL),
(5018, 12, 2001, NULL, 2, 'thưởng KPI ', 1, 50000.00, 'VND', 1.000000, '2026-05-11 15:56:30', 'thưởng KPI ', 0, b'0', 1, NULL, '2026-05-11 15:56:30', 1, 'web', NULL, NULL),
(5019, 12, 2001, NULL, 2, 'Thưởng viết bài ', 1, 11000.00, NULL, NULL, '2026-05-11 00:00:00', 'Thưởng viết bài ', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5020, 12, 2001, NULL, 3, 'Lãi đầu tư cổ phiếu', 1, 22000.00, NULL, NULL, '2026-05-11 00:00:00', 'Lãi đầu tư cổ phiếu', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5021, 12, 2001, NULL, 10, 'khám răng', 2, 22000.00, NULL, NULL, '2026-05-11 00:00:00', 'khám răng', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5022, 12, 2001, NULL, 12, 'uống cafe', 2, 11000.00, NULL, NULL, '2026-05-11 00:00:00', 'uống cafe', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5023, 12, 2001, NULL, 4, 'nhặt được', 1, 50000.00, NULL, NULL, '2026-05-11 00:00:00', 'nhặt được', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5024, 12, 2004, NULL, 1, 'lương partime trong ngày', 1, 50000.00, NULL, NULL, '2026-05-11 00:00:00', 'lương partime trong ngày', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5025, 12, 2001, NULL, 9, 'Xem xiếc hội chợ', 2, 22000.00, NULL, NULL, '2026-05-11 22:25:36', 'Xem xiếc hội chợ', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5026, 12, 2001, NULL, 6, 'Đi Grab', 2, 20000.00, NULL, NULL, '2026-05-11 23:40:08', 'Đi Grab', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5027, 12, 2004, NULL, 6, 'đi xe ôm từ nhà về công ty', 2, 22222.00, NULL, NULL, '2026-05-11 23:51:20', 'đi xe ôm từ nhà về công ty', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5028, 12, 2001, NULL, 6, 'Đi xe taxi về công ty', 2, 112000.00, NULL, NULL, '2026-05-11 23:54:55', 'Đi xe taxi về công ty', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5029, 12, 2001, NULL, 5, 'Mua kẹo cho em ', 2, 10000.00, NULL, NULL, '2026-05-11 00:04:44', 'Mua kẹo cho em ', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5030, 12, 2001, NULL, 5, 'Ăn uống cùng gia đình', 2, 100000.00, NULL, NULL, '2026-05-11 00:10:37', 'Ăn uống cùng gia đình', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5031, 12, 2001, NULL, 9, 'Tiền vé công viên nước', 2, 50000.00, NULL, NULL, '2026-05-11 00:53:30', 'Tiền vé công viên nước', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5032, 12, 2001, NULL, 10, 'Khám răng nha khoa', 2, 100000.00, NULL, NULL, '2026-05-11 01:07:03', 'Khám răng nha khoa', NULL, b'0', NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5033, 1, 2, NULL, 12, 'Tiền thuê nhà [DinhKy_Id_1]', 2, 4500000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Tiền thuê nhà [DinhKy_Id_1]', NULL, b'1', 1, NULL, '2026-05-13 03:56:08', 1, 'system', NULL, NULL),
(5034, 2, 3, NULL, 1, 'Lương cộng tác viên [DinhKy_Id_3]', 1, 2000000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Lương cộng tác viên [DinhKy_Id_3]', NULL, b'1', 1, NULL, '2026-05-13 03:56:15', 1, 'system', NULL, NULL),
(5035, 13, 8, NULL, 12, 'Tiền điện [DinhKy_Id_7]', 2, 350000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Tiền điện [DinhKy_Id_7]', NULL, b'1', 1, NULL, '2026-05-13 03:56:19', 1, 'system', NULL, NULL),
(5036, 13, 8, NULL, 7, 'Tiền thuê nhà [DinhKy_Id_8]', 2, 5000000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Tiền thuê nhà [DinhKy_Id_8]', NULL, b'1', 1, NULL, '2026-05-13 03:56:24', 1, 'system', NULL, NULL),
(5037, 14, 9, NULL, 1, 'Lương part-time [DinhKy_Id_9]', 1, 3500000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Lương part-time [DinhKy_Id_9]', NULL, b'1', 1, NULL, '2026-05-13 03:56:29', 1, 'system', NULL, NULL),
(5038, 16, 11, NULL, 12, 'Phí bảo hiểm nhân thọ [DinhKy_Id_11]', 2, 1200000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Phí bảo hiểm nhân thọ [DinhKy_Id_11]', NULL, b'1', 1, NULL, '2026-05-13 03:56:41', 1, 'system', NULL, NULL),
(5039, 17, 12, NULL, 1, 'Lãi tiết kiệm [DinhKy_Id_12]', 1, 625000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Lãi tiết kiệm [DinhKy_Id_12]', NULL, b'1', 1, NULL, '2026-05-13 03:56:45', 1, 'system', NULL, NULL),
(5040, 18, 13, NULL, 6, 'Xăng xe tuần [DinhKy_Id_13]', 2, 200000.00, 'VND', 1.000000, '2025-04-28 00:00:00', 'Xăng xe tuần [DinhKy_Id_13]', NULL, b'1', 1, NULL, '2026-05-13 03:56:50', 1, 'system', NULL, NULL),
(5041, 20, 14, NULL, 10, 'Phòng khám định kỳ [DinhKy_Id_14]', 2, 500000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Phòng khám định kỳ [DinhKy_Id_14]', NULL, b'1', 1, NULL, '2026-05-13 03:56:55', 1, 'system', NULL, NULL),
(5042, 21, 15, NULL, 9, 'Spotify Premium [DinhKy_Id_15]', 2, 59000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Spotify Premium [DinhKy_Id_15]', NULL, b'1', 1, NULL, '2026-05-13 03:56:59', 1, 'system', NULL, NULL),
(5043, 22, 16, NULL, 12, 'Internet + truyền hình [DinhKy_Id_16]', 2, 280000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Internet + truyền hình [DinhKy_Id_16]', NULL, b'1', 1, NULL, '2026-05-13 03:57:04', 1, 'system', NULL, NULL),
(5044, 12, 17, NULL, 12, 'Tiền điện [DinhKy_Id_17]', 2, 350000.00, 'VND', 1.000000, '2025-05-01 00:00:00', 'Tiền điện [DinhKy_Id_17]', NULL, b'1', 1, NULL, '2026-05-13 03:57:09', 1, 'system', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_giaodich_dinhky`
--

CREATE TABLE `tbl_giaodich_dinhky` (
  `Id` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `TaiKhoanId` int(11) NOT NULL,
  `DanhMucId` int(11) DEFAULT NULL,
  `TenGiaoDich` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `MoTa` varchar(500) DEFAULT NULL COMMENT 'Ghi chú chi tiết về giao dịch định kỳ này',
  `SoLanDaThucHien` int(11) DEFAULT 0 COMMENT 'Đếm số lần đã tự động tạo giao dịch',
  `LanThucHienCuoi` datetime DEFAULT NULL COMMENT 'Thời điểm lần cuối cùng đã tạo giao dịch thành công',
  `LoaiGiaoDich` tinyint(4) NOT NULL,
  `SoTien` decimal(18,2) NOT NULL,
  `ChuKy` varchar(20) NOT NULL,
  `NgayBatDau` datetime NOT NULL,
  `NgayKetThuc` datetime DEFAULT NULL,
  `LanTiepTheo` datetime DEFAULT NULL,
  `TrangThai` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_giaodich_dinhky`
--

INSERT INTO `tbl_giaodich_dinhky` (`Id`, `NguoiDungId`, `TaiKhoanId`, `DanhMucId`, `TenGiaoDich`, `MoTa`, `SoLanDaThucHien`, `LanThucHienCuoi`, `LoaiGiaoDich`, `SoTien`, `ChuKy`, `NgayBatDau`, `NgayKetThuc`, `LanTiepTheo`, `TrangThai`) VALUES
(1, 1, 2, 12, 'Tiền thuê nhà', NULL, 0, NULL, 2, 4500000.00, 'monthly', '2024-01-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(2, 1, 2, 11, 'Học phí tiếng Anh', NULL, 0, NULL, 2, 800000.00, 'monthly', '2025-01-01 00:00:00', '2025-12-01 00:00:00', '2025-05-01 00:00:00', 1),
(3, 2, 3, 1, 'Lương cộng tác viên', NULL, 0, NULL, 1, 2000000.00, 'monthly', '2024-06-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(7, 13, 8, 12, 'Tiền điện', NULL, 0, NULL, 2, 350000.00, 'monthly', '2025-01-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(8, 13, 8, 7, 'Tiền thuê nhà', NULL, 0, NULL, 2, 5000000.00, 'monthly', '2025-01-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(9, 14, 9, 1, 'Lương part-time', NULL, 0, NULL, 1, 3500000.00, 'monthly', '2025-02-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(10, 15, 10, 11, 'Học phí đại học', NULL, 0, NULL, 2, 4000000.00, 'monthly', '2025-01-01 00:00:00', '2025-12-01 00:00:00', '2025-05-01 00:00:00', 1),
(11, 16, 11, 12, 'Phí bảo hiểm nhân thọ', NULL, 0, NULL, 2, 1200000.00, 'monthly', '2024-06-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(12, 17, 12, 1, 'Lãi tiết kiệm', NULL, 0, NULL, 1, 625000.00, 'monthly', '2025-01-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(13, 18, 13, 6, 'Xăng xe tuần', NULL, 0, NULL, 2, 200000.00, 'weekly', '2025-01-06 00:00:00', NULL, '2025-04-28 00:00:00', 1),
(14, 20, 14, 10, 'Phòng khám định kỳ', NULL, 0, NULL, 2, 500000.00, 'monthly', '2025-01-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(15, 21, 15, 9, 'Spotify Premium', NULL, 0, NULL, 2, 59000.00, 'monthly', '2025-01-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(16, 22, 16, 12, 'Internet + truyền hình', NULL, 0, NULL, 2, 280000.00, 'monthly', '2025-01-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(17, 12, 17, 12, 'Tiền điện', NULL, 0, NULL, 2, 350000.00, 'monthly', '2025-04-01 00:00:00', NULL, '2025-05-01 00:00:00', 1),
(18, 12, 17, 11, 'Học phí tiếng Anh', NULL, 0, NULL, 2, 900000.00, 'monthly', '2025-04-01 00:00:00', '2025-12-01 00:00:00', '2025-05-01 00:00:00', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_giaodich_tep`
--

CREATE TABLE `tbl_giaodich_tep` (
  `Id` int(11) NOT NULL,
  `GiaoDichId` int(11) NOT NULL,
  `TepId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_giaodich_tep`
--

INSERT INTO `tbl_giaodich_tep` (`Id`, `GiaoDichId`, `TepId`) VALUES
(1, 2, 3),
(2, 1, 2),
(3, 2, 1),
(4, 5006, 4),
(5, 5006, 5),
(6, 5007, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_goiy_ai`
--

CREATE TABLE `tbl_goiy_ai` (
  `GoiYId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `LoaiGoiY` tinyint(4) DEFAULT 1,
  `NoiDung` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `DaDoc` bit(1) DEFAULT b'0',
  `TrangThai` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_goiy_ai`
--

INSERT INTO `tbl_goiy_ai` (`GoiYId`, `NguoiDungId`, `LoaiGoiY`, `NoiDung`, `NgayTao`, `DaDoc`, `TrangThai`) VALUES
(1, 1, 2, 'Chi tiêu ăn uống tháng 3 tăng 15% so với tháng 2. Hãy xem lại ngân sách danh mục này.', '2025-04-01 06:00:00', b'0', 1),
(2, 2, 2, 'Bạn đã vượt ngân sách mua sắm 5%. Cân nhắc giảm chi tiêu trong những ngày còn lại.', '2025-04-20 08:00:00', b'1', 1),
(3, 3, 1, 'Tỉ lệ tiết kiệm của bạn chỉ đạt 10%. Thử đặt mục tiêu tiết kiệm ít nhất 20% thu nhập.', '2025-04-01 06:00:00', b'0', 1),
(4, 13, 2, 'Chi phí ăn uống của bạn chiếm 32% thu nhập. Nên giữ dưới 20% để có đủ tiết kiệm.', '2025-04-06 06:00:00', b'0', 1),
(5, 14, 1, 'Bạn có thể tiết kiệm thêm 500.000 VND/tháng nếu giảm chi phí di chuyển bằng việc đi xe máy thay Grab.', '2025-04-07 06:00:00', b'0', 1),
(6, 15, 3, 'Chúc mừng! Mục tiêu Du lịch Phú Quốc đã hoàn thành. Hãy đặt mục tiêu mới cho số tiền tích lũy.', '2025-04-08 06:00:00', b'1', 1),
(7, 16, 2, 'Ngân sách giáo dục đã vượt. Hãy xem lại các khóa học và ưu tiên những khóa thiết thực nhất.', '2025-04-09 06:00:00', b'0', 1),
(8, 17, 1, 'Tỉ lệ tiết kiệm của bạn là 35%. Hãy chuyển tiền tiết kiệm sang tài khoản riêng để tránh chi tiêu.', '2025-04-10 06:00:00', b'1', 1),
(9, 18, 2, 'Chi phí ăn uống tăng 20% do ăn ngoài nhiều. Thử nấu ăn tại nhà để tiết kiệm hơn.', '2025-04-11 06:00:00', b'0', 1),
(10, 20, 1, 'Thu nhập từ đầu tư tăng 15% tháng qua. Hãy tái đầu tư để tối ưu hóa lợi nhuận.', '2025-04-12 06:00:00', b'0', 1),
(11, 21, 3, 'Mục tiêu Sửa xe ô tô đã hoàn thành. Bạn còn 2 tháng để đạt mục tiêu tiếp theo.', '2025-04-13 06:00:00', b'0', 1),
(12, 22, 2, 'Chi phí giải trí tăng 40% so với trung bình 3 tháng trước. Hãy thiết lập ngân sách chặt hơn.', '2025-04-14 06:00:00', b'0', 1),
(13, 13, 1, 'Nếu duy trì mức tiết kiệm hiện tại, bạn sẽ đạt mục tiêu Học tiếng Nhật sau 10 tháng.', '2025-04-15 06:00:00', b'0', 1),
(14, 12, 1, 'Thu nhập tháng này khá tốt. Bạn có thể tăng mức tiết kiệm thêm 10% để sớm đạt mục tiêu mua laptop.', '2025-04-22 06:00:00', b'0', 1),
(15, 12, 2, 'Chi tiêu giải trí đang tăng nhanh. Hãy cân nhắc giới hạn 1.500.000 VND mỗi tháng.', '2025-04-23 06:00:00', b'0', 1),
(16, 12, 2, 'Chi tiêu ăn uống của bạn đang tăng. Hãy cân nhắc nấu ăn tại nhà 2-3 bữa mỗi tuần để tiết kiệm.', '2026-04-18 05:14:58', b'0', 1),
(17, 12, 1, 'Bạn có thể tăng mức tiết kiệm thêm 10% nếu giảm chi phí giải trí hàng tuần.', '2026-04-18 05:14:58', b'0', 1),
(18, 12, 3, 'Chúc mừng! Bạn đã đạt 30% mục tiêu du lịch Nhật Bản. Hãy tiếp tục duy trì!', '2026-04-18 05:14:58', b'0', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_hanhvi_nguoidung`
--

CREATE TABLE `tbl_hanhvi_nguoidung` (
  `Id` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `HanhDong` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `DoiTuong` varchar(100) DEFAULT NULL,
  `ThoiGian` datetime DEFAULT current_timestamp(),
  `IpAddress` varchar(50) DEFAULT NULL,
  `ChiTietThayDoi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_hanhvi_nguoidung`
--

INSERT INTO `tbl_hanhvi_nguoidung` (`Id`, `NguoiDungId`, `HanhDong`, `DoiTuong`, `ThoiGian`, `IpAddress`, `ChiTietThayDoi`) VALUES
(11001, 12, 'Thêm giao dịch', NULL, '2026-05-05 17:22:34', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_import_chitiet`
--

CREATE TABLE `tbl_import_chitiet` (
  `Id` int(11) NOT NULL,
  `GiaoDichId` int(11) DEFAULT NULL,
  `ImportId` int(11) NOT NULL,
  `NgayGiaoDich` datetime DEFAULT NULL,
  `MoTa` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `SoTien` decimal(18,2) DEFAULT NULL,
  `DanhMucGoiY` int(11) DEFAULT NULL,
  `DoTinCay` float DEFAULT 0,
  `TrangThaiXuLy` tinyint(4) DEFAULT 0,
  `GhiChuLoi` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CapNhatLuc` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_import_chitiet`
--

INSERT INTO `tbl_import_chitiet` (`Id`, `GiaoDichId`, `ImportId`, `NgayGiaoDich`, `MoTa`, `SoTien`, `DanhMucGoiY`, `DoTinCay`, `TrangThaiXuLy`, `GhiChuLoi`, `CapNhatLuc`) VALUES
(1, NULL, 1, '2025-03-05 12:00:00', 'GRAB FOOD 050325', 85000.00, 5, 0.92, 1, NULL, '2026-04-08 10:50:57'),
(2, NULL, 1, '2025-03-10 18:30:00', 'CIRCLE K 101', 35000.00, 5, 0.75, 1, NULL, '2026-04-08 10:50:57'),
(3, NULL, 1, '2025-03-15 09:00:00', 'TK KHONG RO NGUON', 50000.00, NULL, 0, 3, 'Không xác định được danh mục', '2026-04-08 10:50:57'),
(4, NULL, 1, '2025-03-05 12:00:00', 'GRAB FOOD 050325', 85000.00, 5, 0.92, 1, NULL, '2026-04-08 10:50:57'),
(5, NULL, 1, '2025-03-10 18:30:00', 'CIRCLE K 101', 35000.00, 5, 0.75, 1, NULL, '2026-04-08 10:50:57'),
(6, NULL, 1, '2025-03-15 09:00:00', 'TK KHONG RO NGUON', 50000.00, NULL, 0, 3, 'Không xác định được danh mục', '2026-05-06 07:57:54'),
(7, NULL, 7, '2025-03-08 12:00:00', 'SHOPEE ORDER 080325', 250000.00, 8, 0.91, 1, NULL, '2026-04-18 02:07:08'),
(8, NULL, 7, '2025-03-12 09:00:00', 'GRAB FOOD 120325', 75000.00, 5, 0.95, 1, NULL, '2026-04-18 02:07:08'),
(9, NULL, 8, '2025-03-10 14:00:00', 'ZALOPAY COFFEE', 55000.00, 5, 0.8, 1, NULL, '2026-04-18 02:07:08'),
(10, NULL, 9, '2025-03-15 11:00:00', 'BIDV TRANSFER OUT', 2000000.00, NULL, 0, 3, 'Không xác định được danh mục', '2026-05-06 07:57:54'),
(11, NULL, 10, '2025-03-20 16:00:00', 'LAZADA PAYMENT 200325', 450000.00, 8, 0.88, 1, NULL, '2026-04-18 02:07:08'),
(12, NULL, 11, '2025-03-05 09:00:00', 'ATM WITHDRAWAL 050325', 500000.00, NULL, 0.5, 2, NULL, '2026-04-18 02:07:08'),
(13, NULL, 12, '2025-03-18 20:00:00', 'TIENMAT AN TOI', 95000.00, 5, 0.7, 1, NULL, '2026-04-18 02:07:08'),
(14, NULL, 13, '2025-03-22 10:00:00', 'MBBANK ONLINE TRANSFER', 5000000.00, NULL, 0, 3, 'Không xác định được danh mục', '2026-05-06 07:57:54'),
(15, NULL, 14, '2025-03-25 15:00:00', 'MOMO CGV CINEMA', 180000.00, 9, 0.93, 1, NULL, '2026-04-18 02:07:08'),
(16, NULL, 15, '2025-03-28 11:00:00', 'ACB BILL PAYMENT', 280000.00, 12, 0.85, 1, NULL, '2026-04-18 02:07:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_import_file`
--

CREATE TABLE `tbl_import_file` (
  `ImportId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `TaiKhoanId` int(11) NOT NULL,
  `TenFile` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NgayImport` datetime DEFAULT current_timestamp(),
  `TongDong` int(11) DEFAULT 0,
  `SoDongThanhCong` int(11) DEFAULT 0,
  `SoDongLoi` int(11) DEFAULT 0,
  `TrangThai` tinyint(4) DEFAULT 0,
  `LoaiNguon` varchar(50) DEFAULT 'file' COMMENT 'Nguồn import: file=Upload CSV, api=Kết nối API ngân hàng',
  `TongLoi` int(11) DEFAULT 0 COMMENT 'Tổng số lỗi phát sinh khi xử lý file'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_import_file`
--

INSERT INTO `tbl_import_file` (`ImportId`, `NguoiDungId`, `TaiKhoanId`, `TenFile`, `NgayImport`, `TongDong`, `SoDongThanhCong`, `SoDongLoi`, `TrangThai`, `LoaiNguon`, `TongLoi`) VALUES
(1, 1, 2, 'vcb_thang3_2025.csv', '2025-04-01 07:00:00', 45, 43, 2, 1, 'file', 0),
(2, 2, 3, 'momo_thang3_2025.csv', '2025-04-01 07:30:00', 20, 20, 0, 1, 'file', 0),
(3, 3, 3, 'spending_march.csv', '2025-04-02 08:00:00', 10, 7, 3, 1, 'file', 0),
(7, 13, 8, 'techcombank_thang3_2025.csv', '2025-04-05 07:30:00', 35, 34, 1, 1, 'file', 0),
(8, 14, 9, 'zalopay_thang3_2025.csv', '2025-04-07 07:00:00', 15, 15, 0, 1, 'file', 0),
(9, 15, 10, 'bidv_thang3_2025.csv', '2025-04-08 08:00:00', 50, 48, 2, 1, 'file', 0),
(10, 16, 11, 'vib_thang3_2025.csv', '2025-04-09 07:30:00', 30, 28, 2, 1, 'file', 0),
(11, 17, 12, 'agribank_thang3_2025.csv', '2025-04-10 08:00:00', 10, 10, 0, 1, 'file', 0),
(12, 18, 13, 'tienmat_thang3_2025.csv', '2025-04-11 07:00:00', 8, 7, 1, 1, 'file', 0),
(13, 20, 14, 'mbbank_thang3_2025.csv', '2025-04-12 08:30:00', 60, 58, 2, 1, 'file', 0),
(14, 21, 15, 'momo_thang3_2025.csv', '2025-04-13 07:00:00', 22, 21, 1, 1, 'file', 0),
(15, 22, 16, 'acb_thang3_2025.csv', '2025-04-14 08:00:00', 40, 38, 2, 1, 'file', 0),
(16, 13, 7, 'tienmat_thang4_2025.csv', '2025-04-15 07:30:00', 12, 12, 0, 1, 'file', 0),
(17, 12, 18, 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', '2026-05-09 20:36:45', 1, 1, NULL, 1, 'file', 0),
(18, 12, 18, 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', '2026-05-09 21:01:49', 1, 1, NULL, 1, 'file', 0),
(19, 12, 18, 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', '2026-05-09 21:11:04', 1, 1, NULL, 1, 'file', 0),
(20, 12, 18, 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', '2026-05-09 21:16:56', 1, 1, NULL, 1, 'file', 0),
(21, 12, 18, '27dc9fd1-8ecd-464a-8822-68abe2a7fc11.png', '2026-05-11 04:19:02', 1, 1, NULL, 1, 'file', 0),
(22, 12, 18, 'b969bdba-838a-42ad-b1dd-ef13103771cb.png', '2026-05-11 04:19:45', 1, 1, NULL, 1, 'file', 0),
(23, 12, 18, 'b969bdba-838a-42ad-b1dd-ef13103771cb.png', '2026-05-11 09:51:40', 1, 1, NULL, 1, 'file', 0),
(24, 12, 18, 'b969bdba-838a-42ad-b1dd-ef13103771cb.png', '2026-05-11 10:46:57', 1, 1, NULL, 1, 'file', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_ketnoi_nganhang`
--

CREATE TABLE `tbl_ketnoi_nganhang` (
  `KetNoiId` int(11) NOT NULL COMMENT 'ID kết nối',
  `NguoiDungId` int(11) NOT NULL COMMENT 'FK → tbl_nguoidung',
  `Provider` varchar(100) NOT NULL COMMENT 'Tên ngân hàng/ví: VCB / TCB / MOMO / ZALOPAY...',
  `AccessToken` text DEFAULT NULL COMMENT 'Access token từ API ngân hàng (nên mã hóa)',
  `RefreshToken` text DEFAULT NULL COMMENT 'Refresh token để làm mới access token',
  `HetHan` datetime DEFAULT NULL COMMENT 'Thời điểm access token hết hạn',
  `TrangThai` tinyint(4) DEFAULT 1 COMMENT '1=Đang kết nối, 0=Mất kết nối/Hủy',
  `NgayTao` datetime DEFAULT current_timestamp() COMMENT 'Ngày thiết lập kết nối'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lưu thông tin kết nối Open Banking với các ngân hàng và ví điện tử';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_lichsu_dangnhap`
--

CREATE TABLE `tbl_lichsu_dangnhap` (
  `Id` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `ThoiGian` datetime DEFAULT current_timestamp(),
  `IpAddress` varchar(50) DEFAULT NULL,
  `ThietBi` varchar(255) DEFAULT NULL,
  `KetQua` tinyint(4) DEFAULT 1,
  `HeDieuHanh` varchar(100) DEFAULT NULL COMMENT 'Hệ điều hành của thiết bị đăng nhập',
  `ViTri` varchar(255) DEFAULT NULL COMMENT 'Vị trí địa lý khi đăng nhập (thành phố/quốc gia)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_lichsu_dangnhap`
--

INSERT INTO `tbl_lichsu_dangnhap` (`Id`, `NguoiDungId`, `ThoiGian`, `IpAddress`, `ThietBi`, `KetQua`, `HeDieuHanh`, `ViTri`) VALUES
(7, 1, '2026-04-11 08:16:15', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(8, 1, '2026-04-11 08:38:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(9, 1, '2026-04-13 08:20:39', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(10, 1, '2026-04-13 09:01:32', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(11, 1, '2026-04-13 09:06:10', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(12, 1, '2026-04-13 16:37:16', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(13, 1, '2026-04-13 18:05:28', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(14, 1, '2026-04-13 18:05:57', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(15, 1, '2026-04-13 18:27:31', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(16, 1, '2026-04-13 18:27:44', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(17, 1, '2026-04-14 00:44:13', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(18, 11, '2026-04-14 02:00:23', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(19, 12, '2026-04-14 02:27:32', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(20, 12, '2026-04-14 02:29:46', '127.0.0.1', 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36 Edge/14.14263', 1, NULL, NULL),
(21, 12, '2026-04-14 15:57:15', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(22, 1, '2026-04-14 15:57:51', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(23, 12, '2026-04-14 15:59:09', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(24, 12, '2026-04-14 19:47:20', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(25, 12, '2026-04-14 19:48:10', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(26, 12, '2026-04-14 19:48:30', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(27, 12, '2026-04-14 19:49:02', '127.0.0.1', 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36 Edge/14.14263', 1, NULL, NULL),
(28, 12, '2026-04-14 19:51:16', '127.0.0.1', 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36 Edge/14.14263', 1, NULL, NULL),
(29, 12, '2026-04-15 18:17:18', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(30, 11, '2026-04-15 18:35:15', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(31, 12, '2026-04-16 12:15:01', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(32, 12, '2026-04-16 12:16:40', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(33, 12, '2026-04-16 12:19:30', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(34, 12, '2026-04-16 12:22:26', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(35, 12, '2026-04-16 12:24:57', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(36, 12, '2026-04-16 12:37:50', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(37, 12, '2026-04-16 14:00:39', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(38, 12, '2026-04-16 15:59:14', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(39, 12, '2026-04-16 18:05:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(40, 12, '2026-04-16 18:06:45', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(41, 12, '2026-04-17 09:44:07', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(42, 12, '2026-04-17 09:46:19', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(43, 12, '2026-04-17 09:50:22', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(44, 12, '2026-04-17 10:37:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(45, 12, '2026-04-17 10:38:52', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(46, 1, '2026-04-17 10:46:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(47, 1, '2026-04-17 10:52:21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(48, 1, '2026-04-17 13:52:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(49, 1, '2026-04-17 15:33:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(50, 1, '2026-04-17 16:42:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(51, 1, '2026-04-17 16:50:22', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(52, 1, '2026-04-17 22:10:43', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(53, 1, '2026-04-17 22:13:44', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(54, 1, '2026-04-17 23:34:17', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(55, 1, '2026-04-17 23:43:57', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(56, 1, '2026-04-17 23:51:42', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(57, 1, '2026-04-17 23:53:00', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(58, 1, '2026-04-18 00:12:56', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(59, 12, '2026-04-18 00:13:11', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(60, 12, '2026-04-18 01:05:37', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(61, 12, '2026-04-18 01:11:22', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(62, 12, '2026-04-18 01:13:48', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(68, 12, '2026-04-18 07:11:35', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(69, 1, '2026-04-18 07:12:44', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(70, 1, '2026-04-18 07:27:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(71, 1, '2026-04-18 07:29:54', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(72, 1, '2026-04-18 07:36:07', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(73, 12, '2026-04-18 07:39:50', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(74, 12, '2026-04-18 09:01:36', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(75, 12, '2026-04-18 09:04:54', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(76, 12, '2026-04-18 09:40:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/3.1.15 Chrome/142.0.7444.265 Electron/39.8.1 Safari/537.36', 1, NULL, NULL),
(77, 12, '2026-04-18 09:50:48', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(78, 12, '2026-04-18 10:52:25', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(79, 12, '2026-04-18 11:26:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(80, 12, '2026-04-18 12:33:57', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(81, 12, '2026-04-18 12:52:59', '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(82, 12, '2026-04-18 13:16:36', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(83, 12, '2026-04-18 14:21:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(84, 12, '2026-04-20 14:48:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(85, 12, '2026-04-20 16:12:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(86, 12, '2026-04-20 17:19:55', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(87, 12, '2026-04-20 17:46:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(88, 12, '2026-04-20 18:46:30', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(89, 12, '2026-04-22 12:07:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(90, 12, '2026-04-25 15:19:33', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(91, 1, '2026-05-05 00:34:04', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(92, 1, '2026-05-05 00:43:21', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(93, 1, '2026-05-05 01:41:21', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(94, 1, '2026-05-05 01:53:37', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(95, 12, '2026-05-05 01:54:56', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(96, 1, '2026-05-05 01:57:10', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(97, 1, '2026-05-05 02:36:38', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(98, 1, '2026-05-05 13:12:08', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(99, 1, '2026-05-05 15:37:42', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(100, 1, '2026-05-05 15:39:13', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(101, 1, '2026-05-05 15:42:23', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(102, 1, '2026-05-05 15:44:06', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(103, 1, '2026-05-05 15:56:17', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(104, 1, '2026-05-05 15:57:23', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(105, 1, '2026-05-05 16:13:45', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(106, 1, '2026-05-05 16:13:59', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(107, 1, '2026-05-05 17:29:16', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(108, 12, '2026-05-05 18:52:22', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(109, 12, '2026-05-05 18:53:53', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.118.1 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 1, NULL, NULL),
(110, 12, '2026-05-05 19:13:13', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(111, 1, '2026-05-05 19:42:30', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(112, 1, '2026-05-05 20:23:16', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(113, 1, '2026-05-05 21:25:12', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(114, 12, '2026-05-05 21:40:51', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(115, 12, '2026-05-05 22:40:48', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(116, 12, '2026-05-05 23:42:04', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(117, 12, '2026-05-06 00:44:35', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(118, 12, '2026-05-06 12:34:51', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(119, 12, '2026-05-06 13:36:15', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(120, 12, '2026-05-06 14:37:18', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(121, 12, '2026-05-06 16:07:52', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(122, 12, '2026-05-06 17:07:42', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(123, 12, '2026-05-06 19:16:40', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(124, 11, '2026-05-06 19:48:31', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(125, 12, '2026-05-06 19:49:04', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(126, 12, '2026-05-06 20:49:45', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(127, 12, '2026-05-06 20:49:49', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(128, 12, '2026-05-06 21:56:45', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(129, 12, '2026-05-06 22:56:45', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(130, 12, '2026-05-06 23:56:57', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(131, 12, '2026-05-07 00:57:39', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(132, 12, '2026-05-07 11:28:36', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(133, 12, '2026-05-07 13:07:25', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(134, 1, '2026-05-07 13:26:36', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(135, 1, '2026-05-07 15:11:55', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(136, 1, '2026-05-07 16:22:52', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(137, 1, '2026-05-07 18:36:08', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(138, 1, '2026-05-07 19:17:31', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(139, 1, '2026-05-07 20:19:58', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(140, 1, '2026-05-07 21:24:17', '192.168.1.7', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(141, 12, '2026-05-07 23:53:32', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(142, 12, '2026-05-08 00:06:08', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(143, 12, '2026-05-08 00:09:37', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(144, 12, '2026-05-08 01:13:43', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(145, 1, '2026-05-08 01:44:29', '192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(146, 1, '2026-05-08 11:38:25', '192.168.1.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(147, 1, '2026-05-08 13:38:10', '192.168.1.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(148, 12, '2026-05-08 13:45:19', '192.168.1.9', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(149, 1, '2026-05-08 13:57:07', '192.168.1.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(150, 1, '2026-05-08 20:58:38', '192.168.1.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(151, 1, '2026-05-08 20:59:04', '192.168.1.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(152, 1, '2026-05-08 21:35:06', '192.168.1.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(153, 12, '2026-05-08 21:35:20', '192.168.1.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(154, 12, '2026-05-08 21:59:14', '192.168.1.9', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(155, 12, '2026-05-09 19:13:45', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(156, 12, '2026-05-09 20:35:12', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(157, 12, '2026-05-09 22:04:57', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(158, 12, '2026-05-09 23:46:16', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(159, 12, '2026-05-10 00:16:04', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(160, 12, '2026-05-10 00:42:22', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(161, 12, '2026-05-10 00:43:01', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(162, 12, '2026-05-10 01:31:01', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(163, 1, '2026-05-10 01:33:38', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(164, 12, '2026-05-10 01:37:28', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(165, 12, '2026-05-10 01:51:14', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(166, 12, '2026-05-10 02:31:20', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(167, 12, '2026-05-10 03:31:25', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(168, 12, '2026-05-10 04:33:59', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(169, 12, '2026-05-10 12:18:52', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(170, 12, '2026-05-10 12:37:45', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(171, 12, '2026-05-10 13:41:24', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(172, 12, '2026-05-10 14:41:38', '192.168.1.8', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(173, 12, '2026-05-11 02:04:57', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(174, 12, '2026-05-11 03:05:38', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(175, 12, '2026-05-11 04:05:47', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(176, 12, '2026-05-11 09:18:44', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(177, 12, '2026-05-11 10:46:24', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(178, 12, '2026-05-11 11:46:01', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(179, 12, '2026-05-11 12:48:48', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(180, 12, '2026-05-11 13:50:37', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(181, 12, '2026-05-11 14:52:36', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(182, 12, '2026-05-11 15:56:01', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(183, 12, '2026-05-11 16:55:46', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(184, 12, '2026-05-11 18:08:12', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(185, 12, '2026-05-11 20:23:48', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(186, 12, '2026-05-11 21:29:29', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(187, 12, '2026-05-11 22:29:55', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(188, 12, '2026-05-11 22:45:00', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(189, 12, '2026-05-11 23:48:07', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(190, 12, '2026-05-12 00:52:24', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(191, 12, '2026-05-12 01:53:40', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(192, 12, '2026-05-12 02:55:31', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(193, 12, '2026-05-12 03:57:26', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(194, 12, '2026-05-12 04:57:38', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(195, 12, '2026-05-12 08:05:38', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(196, 12, '2026-05-12 09:08:17', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(197, 12, '2026-05-12 10:29:01', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(198, 12, '2026-05-12 11:34:07', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(199, 12, '2026-05-12 12:34:31', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(200, 12, '2026-05-12 13:35:24', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(201, 12, '2026-05-12 14:37:36', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(202, 12, '2026-05-12 15:37:24', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(203, 12, '2026-05-12 16:11:06', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(204, 12, '2026-05-12 16:11:53', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 0, NULL, NULL),
(205, 12, '2026-05-12 16:13:35', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(206, 12, '2026-05-12 16:24:25', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 0, NULL, NULL),
(207, 12, '2026-05-12 16:24:32', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(208, 1, '2026-05-12 16:24:53', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(209, 1, '2026-05-12 17:21:59', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(210, 12, '2026-05-12 18:21:40', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 0, NULL, NULL),
(211, 12, '2026-05-12 18:21:49', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(212, 11, '2026-05-12 18:37:00', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(213, 1, '2026-05-12 18:43:38', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(214, 1, '2026-05-12 18:48:47', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(215, 12, '2026-05-12 20:00:52', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(216, 1, '2026-05-12 20:26:01', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(217, 12, '2026-05-12 20:29:36', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(218, 12, '2026-05-12 21:29:24', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(219, 12, '2026-05-12 22:31:34', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(220, 12, '2026-05-13 00:31:32', '10.49.145.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, NULL, NULL),
(221, 12, '2026-05-13 01:34:01', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(222, 12, '2026-05-13 03:40:00', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(223, 12, '2026-05-13 04:46:25', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL),
(224, 12, '2026-05-13 13:56:48', '10.49.145.68', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_loai_danhmuc`
--

CREATE TABLE `tbl_loai_danhmuc` (
  `LoaiDanhMucId` int(11) NOT NULL,
  `TenLoai` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_loai_danhmuc`
--

INSERT INTO `tbl_loai_danhmuc` (`LoaiDanhMucId`, `TenLoai`) VALUES
(2, 'Chi tiêu'),
(1, 'Thu nhập');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_loai_taikhoan`
--

CREATE TABLE `tbl_loai_taikhoan` (
  `LoaiTaiKhoanId` int(11) NOT NULL,
  `TenLoai` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_loai_taikhoan`
--

INSERT INTO `tbl_loai_taikhoan` (`LoaiTaiKhoanId`, `TenLoai`) VALUES
(2, 'Tài khoản ngân hàng'),
(4, 'Thẻ tín dụng'),
(1, 'Tiền mặt'),
(5, 'Tiết kiệm'),
(3, 'Ví điện tử');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_muctieu`
--

CREATE TABLE `tbl_muctieu` (
  `MucTieuId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `TaiKhoanId` int(11) DEFAULT NULL,
  `TenMucTieu` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `MoTa` varchar(500) DEFAULT NULL COMMENT 'Mô tả chi tiết về mục tiêu tài chính',
  `UuTien` tinyint(4) DEFAULT 2 COMMENT 'Mức độ ưu tiên: 1=Cao, 2=Trung bình, 3=Thấp',
  `SoTienMucTieu` decimal(18,2) NOT NULL,
  `SoTienHienTai` decimal(18,2) DEFAULT 0.00,
  `NgayBatDau` datetime DEFAULT current_timestamp(),
  `NgayKetThuc` datetime DEFAULT NULL,
  `Icon` varchar(100) DEFAULT NULL,
  `MauSac` varchar(50) DEFAULT NULL,
  `TrangThai` tinyint(4) DEFAULT 1,
  `Anh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_muctieu`
--

INSERT INTO `tbl_muctieu` (`MucTieuId`, `NguoiDungId`, `TaiKhoanId`, `TenMucTieu`, `MoTa`, `UuTien`, `SoTienMucTieu`, `SoTienHienTai`, `NgayBatDau`, `NgayKetThuc`, `Icon`, `MauSac`, `TrangThai`, `Anh`) VALUES
(1, 1, 2, 'Mua laptop mới', NULL, 2, 20000000.00, 12000000.00, '2025-01-01 00:00:00', '2025-07-01 00:00:00', 'laptop', '#2196F3', 1, 'laptop.jpg'),
(2, 1, 2, 'Du lịch Đà Nẵng', NULL, 2, 10000000.00, 10000000.00, '2025-01-01 00:00:00', '2025-06-01 00:00:00', 'travel', '#4CAF50', 2, 'danang.jpg'),
(3, 2, 3, 'Quỹ khẩn cấp', NULL, 2, 30000000.00, 5000000.00, '2025-02-01 00:00:00', '2026-02-01 00:00:00', 'emergency', '#F44336', 1, 'emergency.jpg'),
(7, 13, 8, 'Mua xe máy mới', NULL, 2, 30000000.00, 5000000.00, '2025-01-01 00:00:00', '2025-12-31 00:00:00', 'motorbike', '#FF7043', 1, 'motorbike.jpg'),
(8, 14, 9, 'Quỹ khẩn cấp', NULL, 2, 20000000.00, 8000000.00, '2025-02-01 00:00:00', '2026-02-01 00:00:00', 'emergency', '#F44336', 1, 'emergency.jpg'),
(9, 15, 10, 'Du lịch Phú Quốc', NULL, 2, 15000000.00, 15000000.00, '2025-01-15 00:00:00', '2025-06-30 00:00:00', 'travel', '#4CAF50', 2, 'phuquoc.jpg'),
(10, 16, 11, 'Trả nợ thẻ tín dụng', NULL, 2, 10000000.00, 3000000.00, '2025-03-01 00:00:00', '2025-09-01 00:00:00', 'debt', '#795548', 1, 'debt.jpg'),
(11, 17, 12, 'Mua chung cư', NULL, 2, 1000000000.00, 50000000.00, '2025-01-01 00:00:00', '2030-01-01 00:00:00', 'house', '#1565C0', 1, 'house.jpg'),
(12, 18, 13, 'Học bổng du học', NULL, 2, 200000000.00, 20000000.00, '2025-04-01 00:00:00', '2027-04-01 00:00:00', 'study', '#6A1B9A', 1, 'study.jpg'),
(13, 20, 14, 'Laptop gaming', NULL, 2, 25000000.00, 10000000.00, '2025-02-01 00:00:00', '2025-08-01 00:00:00', 'laptop', '#0277BD', 1, 'laptop.jpg'),
(14, 21, 15, 'Sửa xe ô tô', NULL, 2, 8000000.00, 8000000.00, '2025-03-01 00:00:00', '2025-05-01 00:00:00', 'car', '#2E7D32', 2, 'car.jpg'),
(15, 22, 16, 'Tổ chức đám cưới', NULL, 2, 100000000.00, 15000000.00, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 'wedding', '#AD1457', 1, 'wedding.jpg'),
(16, 13, 7, 'Quỹ học tiếng Nhật', NULL, 2, 12000000.00, 2000000.00, '2025-04-01 00:00:00', '2026-04-01 00:00:00', 'language', '#00695C', 1, 'japan.jpg'),
(17, 12, 17, 'Mua laptop mới', NULL, 2, 25000000.00, 7000000.00, '2025-04-01 00:00:00', '2025-12-31 00:00:00', 'laptop', '#42A5F5', 1, 'laptop.jpg'),
(18, 12, 17, 'Quỹ khẩn cấp', NULL, 2, 30000000.00, 5000000.00, '2025-04-01 00:00:00', '2026-12-31 00:00:00', 'emergency', '#EF5350', 1, 'emergency.jpg'),
(19, 12, 32, 'Quỹ du lịch Nhật Bản 2027', NULL, 2, 50000000.00, 15000000.00, '2026-01-01 00:00:00', '2027-06-01 00:00:00', 'travel', '#E53935', 1, 'japan_trip.jpg'),
(20, 12, 32, 'Mua xe máy mới', NULL, 2, 35000000.00, 8000000.00, '2026-02-01 00:00:00', '2026-12-01 00:00:00', 'car', '#1E88E5', 1, 'motorbike.jpg'),
(21, 12, 32, 'Quỹ khẩn cấp', NULL, 2, 100000000.00, 25000000.00, '2026-01-01 00:00:00', '2028-01-01 00:00:00', 'emergency', '#FF9800', 1, 'emergency.jpg'),
(7001, 12, NULL, 'Mua laptop', NULL, 2, 20000000.00, 0.00, '2026-05-05 17:22:34', NULL, NULL, NULL, 1, 'laptop.jpg'),
(7002, 12, 31, 'mua xe máy mới ', NULL, 2, 30000000.00, 250000.00, '2026-05-12 08:07:25', '2026-07-12 00:00:00', NULL, '#ef4444', 0, 'c118f070-d01c-4b0e-b97e-e2f249ab0b26.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_ngansach`
--

CREATE TABLE `tbl_ngansach` (
  `NganSachId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `DanhMucId` int(11) NOT NULL,
  `SoTienToiDa` decimal(18,2) NOT NULL,
  `Thang` int(11) NOT NULL,
  `Nam` int(11) NOT NULL,
  `SoTienDaChi` decimal(18,2) DEFAULT 0.00,
  `PhanTramDaDung` float DEFAULT 0,
  `GhiChu` varchar(500) DEFAULT NULL COMMENT 'Ghi chú riêng cho ngân sách tháng này\r\n             (VD: Tháng này thắt chặt do có việc gia đình)',
  `CanhBaoPhanTram` float DEFAULT 80 COMMENT 'Ngưỡng phần trăm để gửi cảnh báo, mặc định 80%',
  `TrangThai` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_ngansach`
--

INSERT INTO `tbl_ngansach` (`NganSachId`, `NguoiDungId`, `DanhMucId`, `SoTienToiDa`, `Thang`, `Nam`, `SoTienDaChi`, `PhanTramDaDung`, `GhiChu`, `CanhBaoPhanTram`, `TrangThai`) VALUES
(1, 1, 5, 3000000.00, 4, 2025, 120000.00, 4, NULL, 80, 1),
(2, 1, 6, 1500000.00, 4, 2025, 900000.00, 60, NULL, 80, 1),
(3, 2, 8, 2000000.00, 4, 2025, 2100000.00, 105, NULL, 80, 1),
(7, 13, 5, 2500000.00, 4, 2025, 250000.00, 10, NULL, 80, 1),
(8, 13, 6, 1000000.00, 4, 2025, 425000.00, 42.5, NULL, 80, 1),
(9, 14, 8, 3000000.00, 4, 2025, 1500000.00, 50, NULL, 80, 1),
(10, 15, 9, 1500000.00, 4, 2025, 600000.00, 40, NULL, 80, 1),
(11, 16, 11, 2000000.00, 4, 2025, 2200000.00, 110, NULL, 80, 1),
(12, 17, 5, 4000000.00, 4, 2025, 1200000.00, 30, NULL, 80, 1),
(13, 18, 7, 5000000.00, 4, 2025, 4500000.00, 90, NULL, 80, 1),
(14, 20, 9, 2000000.00, 4, 2025, 350000.00, 17.5, NULL, 80, 1),
(15, 21, 6, 1200000.00, 4, 2025, 960000.00, 80, NULL, 80, 1),
(16, 22, 8, 2500000.00, 4, 2025, 1750000.00, 70, NULL, 80, 1),
(17, 12, 5, 3000000.00, 4, 2025, 120000.00, 4, NULL, 80, 1),
(18, 12, 6, 1200000.00, 4, 2025, 320000.00, 26.67, NULL, 80, 1),
(19, 12, 9, 1500000.00, 4, 2025, 450000.00, 30, NULL, 80, 1),
(20, 12, 5, 2000000.00, 4, 2026, 1905000.00, 95.25, NULL, 80, 1),
(21, 12, 6, 1500000.00, 4, 2026, 1330000.00, 88.67, NULL, 80, 1),
(22, 12, 7, 6000000.00, 4, 2026, 5500000.00, 91.67, NULL, 80, 1),
(23, 12, 8, 1000000.00, 4, 2026, 800000.00, 80, NULL, 80, 1),
(24, 12, 9, 800000.00, 4, 2026, 580000.00, 72.5, NULL, 80, 1),
(25, 12, 10, 800000.00, 4, 2026, 650000.00, 81.25, NULL, 80, 1),
(26, 12, 11, 1500000.00, 4, 2026, 1250000.00, 83.33, NULL, 80, 1),
(27, 12, 12, 1500000.00, 4, 2026, 1480000.00, 98.67, NULL, 80, 1),
(28, 12, 5, 4500000.00, 5, 2025, 585000.00, 13, NULL, 80, 1),
(29, 12, 6, 2000000.00, 5, 2025, 380000.00, 19, NULL, 80, 1),
(30, 12, 7, 5500000.00, 5, 2025, 5500000.00, 100, NULL, 80, 1),
(31, 12, 8, 3000000.00, 5, 2025, 1250000.00, 41.67, NULL, 80, 1),
(32, 12, 9, 1500000.00, 5, 2025, 220000.00, 14.67, NULL, 80, 1),
(6001, 12, 5, 5000000.00, 5, 2026, 391000.00, 7.82, NULL, 80, 1),
(6002, 12, 6, 1000000.00, 5, 2026, 434222.00, 43.42, NULL, 80, 1),
(6003, 12, 8, 2000000.00, 5, 2026, 500000.00, 25, NULL, 80, 1),
(6006, 12, 7, 6000000.00, 5, 2026, 0.00, 0, NULL, 80, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_nguoidung`
--

CREATE TABLE `tbl_nguoidung` (
  `NguoiDungId` int(11) NOT NULL,
  `HoTen` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `MatKhau` varchar(255) DEFAULT NULL,
  `AnhDaiDien` varchar(500) DEFAULT NULL,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `TrangThai` tinyint(4) DEFAULT 1,
  `EmailDaXacThuc` bit(1) DEFAULT b'0' COMMENT 'Email đã xác thực: 1=Đã xác thực, 0=Chưa',
  `SoDienThoaiDaXacThuc` bit(1) DEFAULT b'0' COMMENT 'SĐT đã xác thực: 1=Đã xác thực, 0=Chưa',
  `Dang2FA` bit(1) DEFAULT b'0' COMMENT 'Xác thực 2 lớp: 1=Đang bật, 0=Tắt',
  `LanDangNhapCuoi` datetime DEFAULT NULL COMMENT 'Thời điểm đăng nhập gần nhất',
  `DaXoa` bit(1) DEFAULT b'0' COMMENT 'Soft delete: 1=Đã xóa, 0=Còn hoạt động'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_nguoidung`
--

INSERT INTO `tbl_nguoidung` (`NguoiDungId`, `HoTen`, `Email`, `SoDienThoai`, `MatKhau`, `AnhDaiDien`, `NgayTao`, `TrangThai`, `EmailDaXacThuc`, `SoDienThoaiDaXacThuc`, `Dang2FA`, `LanDangNhapCuoi`, `DaXoa`) VALUES
(1, 'Nguyễn Văn An', 'an.nguyen@gmail.com', '0901234567', '$2a$12$UENmHEr60FmsAw2HMrcQzuObNF3con4GpFdr0QReVBs25oF/sWNOC', 'nam.jpg', '2024-01-10 08:00:00', 1, b'0', b'0', b'0', NULL, b'0'),
(2, 'Trần Thị Bình', 'binh.tran@gmail.com', '0912345678', '$2b$10$hashedpwd2', 'nam.jpg', '2024-02-15 09:30:00', 1, b'0', b'0', b'0', NULL, b'0'),
(3, 'Lê Minh Châu', 'chau.le@yahoo.com', '0923456789', '$2b$10$hashedpwd3', 'nam.jpg', '2024-03-20 10:00:00', 1, b'0', b'0', b'0', NULL, b'0'),
(11, 'Hoàng Anh Nguyễn', 'cucu42467@gmail.com', NULL, NULL, 'nam.jpg', '2026-04-13 18:46:15', 1, b'0', b'0', b'0', NULL, b'0'),
(12, 'Nguyễn Văn Bắc', 'nguyenanh00798@gmail.com', '0974083576', '$2a$11$uZlbjJ2qLEg4tcnYYoMjquAJENmrQZulvqx6rgY5f8lxNITDG2ncK', 'nam.jpg', '2026-04-13 19:27:27', 1, b'0', b'0', b'0', NULL, b'0'),
(13, 'Phạm Thị Dung', 'dung.pham@gmail.com', '0934567890', '$2b$10$hashedpwd13', 'nam.jpg', '2024-04-01 08:00:00', 1, b'0', b'0', b'0', NULL, b'0'),
(14, 'Hoàng Văn Em', 'em.hoang@gmail.com', '0945678901', '$2b$10$hashedpwd14', 'nam.jpg', '2024-04-05 09:00:00', 1, b'0', b'0', b'0', NULL, b'0'),
(15, 'Vũ Thị Phương', 'phuong.vu@yahoo.com', '0956789012', '$2b$10$hashedpwd15', 'nam.jpg', '2024-05-10 10:00:00', 1, b'0', b'0', b'0', NULL, b'0'),
(16, 'Đặng Minh Quân', 'quan.dang@gmail.com', '0967890123', '$2b$10$hashedpwd16', 'nam.jpg', '2024-06-15 11:00:00', 1, b'0', b'0', b'0', NULL, b'0'),
(17, 'Bùi Thị Hoa', 'hoa.bui@gmail.com', '0978901234', '$2b$10$hashedpwd17', 'nam.jpg', '2024-07-20 08:30:00', 1, b'0', b'0', b'0', NULL, b'0'),
(18, 'Ngô Văn Sơn', 'son.ngo@gmail.com', '0989012345', '$2b$10$hashedpwd18', 'nam.jpg', '2024-08-01 09:30:00', 1, b'0', b'0', b'0', NULL, b'0'),
(19, 'Trịnh Thị Mai', 'mai.trinh@gmail.com', '0990123456', '$2b$10$hashedpwd19', 'nam.jpg', '2024-09-05 10:30:00', 1, b'0', b'0', b'0', NULL, b'0'),
(20, 'Lý Văn Tuấn', 'tuan.ly@yahoo.com', '0901234568', '$2b$10$hashedpwd20', 'nam.jpg', '2024-10-10 11:30:00', 1, b'0', b'0', b'0', NULL, b'0'),
(21, 'Đinh Thị Lan', 'lan.dinh@gmail.com', '0912345679', '$2b$10$hashedpwd21', NULL, '2024-11-15 08:00:00', 1, b'0', b'0', b'0', NULL, b'0'),
(22, 'Phan Văn Khoa', 'khoa.phan@gmail.com', '0923456780', '$2b$10$hashedpwd22', NULL, '2024-12-20 09:00:00', 1, b'0', b'0', b'0', NULL, b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_nguoidung_social`
--

CREATE TABLE `tbl_nguoidung_social` (
  `Id` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `Provider` varchar(50) NOT NULL,
  `ProviderId` varchar(255) NOT NULL,
  `EmailSocial` varchar(255) DEFAULT NULL,
  `NgayLienKet` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_nguoidung_social`
--

INSERT INTO `tbl_nguoidung_social` (`Id`, `NguoiDungId`, `Provider`, `ProviderId`, `EmailSocial`, `NgayLienKet`) VALUES
(1, 11, 'GOOGLE', '102319566754250935858', 'cucu42467@gmail.com', '2026-04-13 18:46:22'),
(2, 12, 'GOOGLE', '104932622456233000059', 'nguyenanh00798@gmail.com', '2026-05-06 19:49:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_nguoidung_vaitro`
--

CREATE TABLE `tbl_nguoidung_vaitro` (
  `Id` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `VaiTroId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_nguoidung_vaitro`
--

INSERT INTO `tbl_nguoidung_vaitro` (`Id`, `NguoiDungId`, `VaiTroId`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(7, 1, 2),
(8, 11, 2),
(9, 12, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_nhacnho`
--

CREATE TABLE `tbl_nhacnho` (
  `NhacNhoId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `TieuDe` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NoiDung` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NgayNhac` datetime DEFAULT NULL,
  `LapLai` tinyint(4) DEFAULT 0,
  `ChuKy` varchar(20) DEFAULT 'none' COMMENT 'Chu kỳ lặp: none=Không lặp, daily=Hàng ngày,\r\n             weekly=Hàng tuần, monthly=Hàng tháng, yearly=Hàng năm',
  `LanNhacCuoi` datetime DEFAULT NULL COMMENT 'Thời điểm đã nhắc nhở gần nhất',
  `LanNhacTiep` datetime DEFAULT NULL COMMENT 'Thời điểm sẽ nhắc nhở tiếp theo',
  `TrangThai` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_nhacnho`
--

INSERT INTO `tbl_nhacnho` (`NhacNhoId`, `NguoiDungId`, `TieuDe`, `NoiDung`, `NgayNhac`, `LapLai`, `ChuKy`, `LanNhacCuoi`, `LanNhacTiep`, `TrangThai`) VALUES
(1, 1, 'Đóng tiền điện', 'Nhớ thanh toán hoá đơn điện tháng này', '2025-04-25 08:00:00', 3, 'monthly', NULL, '2025-05-25 08:00:00', 1),
(2, 2, 'Kiểm tra ngân sách', 'Xem lại chi tiêu trong tháng và điều chỉnh', '2025-04-28 09:00:00', 3, 'monthly', NULL, '2025-05-28 09:00:00', 1),
(3, 3, 'Nộp tiền thuê nhà', 'Chuyển khoản tiền thuê nhà cho chủ nhà', '2025-05-01 08:00:00', 3, 'monthly', NULL, '2025-06-01 08:00:00', 1),
(7, 13, 'Thanh toán thẻ tín dụng', 'Trả dư nợ thẻ tín dụng tháng này trước ngày 15', '2025-05-10 09:00:00', 3, 'monthly', NULL, '2025-06-10 09:00:00', 1),
(8, 14, 'Nộp tiền điện', 'Thanh toán hóa đơn tiền điện trước ngày 20', '2025-05-15 08:00:00', 3, 'monthly', NULL, '2025-06-15 08:00:00', 1),
(9, 15, 'Kiểm tra đầu tư', 'Xem lại danh mục chứng khoán và cân bằng lại', '2025-05-07 10:00:00', 4, 'yearly', NULL, '2026-05-07 10:00:00', 1),
(10, 16, 'Trả góp xe', 'Chuyển khoản tiền trả góp xe tháng này', '2025-05-05 08:00:00', 3, 'monthly', NULL, '2025-06-05 08:00:00', 1),
(11, 17, 'Đóng bảo hiểm', 'Đóng bảo hiểm sức khỏe định kỳ 6 tháng', '2025-06-01 09:00:00', 0, 'none', NULL, '2025-06-01 09:00:00', 1),
(12, 18, 'Mua thực phẩm', 'Đi chợ mua thực phẩm cuối tuần', '2025-05-03 07:00:00', 1, 'daily', NULL, '2025-05-04 07:00:00', 1),
(13, 20, 'Họp cổ đông', 'Tham dự họp đại hội cổ đông thường niên', '2025-05-20 14:00:00', 0, 'none', NULL, '2025-05-20 14:00:00', 1),
(14, 21, 'Gia hạn tài khoản', 'Gia hạn gói premium ứng dụng quản lý chi tiêu', '2025-05-01 08:00:00', 0, 'none', NULL, '2025-05-01 08:00:00', 1),
(15, 22, 'Lập kế hoạch tháng 5', 'Ngồi lại xem lại ngân sách và lập kế hoạch tháng tới', '2025-04-30 21:00:00', 3, 'monthly', NULL, '2025-05-30 21:00:00', 1),
(16, 13, 'Chuyển tiền tiết kiệm', 'Chuyển 2 triệu vào quỹ tiết kiệm học tiếng Nhật', '2025-05-01 10:00:00', 3, 'monthly', NULL, '2025-06-01 10:00:00', 1),
(17, 12, 'Thanh toán tiền điện', 'Nhớ thanh toán hoá đơn điện trước ngày 20 hàng tháng', '2025-05-18 08:00:00', 3, 'monthly', NULL, '2025-06-18 08:00:00', 1),
(18, 12, 'Chuyển tiền tiết kiệm', 'Chuyển 3 triệu vào mục tiêu mua laptop', '2025-05-05 09:00:00', 3, 'monthly', NULL, '2025-06-05 09:00:00', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_ocr_ketqua`
--

CREATE TABLE `tbl_ocr_ketqua` (
  `OcrId` int(11) NOT NULL COMMENT 'ID kết quả OCR',
  `TepId` int(11) NOT NULL COMMENT 'FK → tbl_tep_dinhkem (file ảnh/PDF gốc)',
  `NoiDungOCR` text DEFAULT NULL COMMENT 'Văn bản trích xuất được từ ảnh/PDF',
  `JsonRaw` longtext DEFAULT NULL COMMENT 'Dữ liệu JSON thô từ AI phân tích hóa đơn',
  `DoTinCay` float DEFAULT 0 COMMENT 'Độ chính xác OCR từ 0 đến 1',
  `NgayXuLy` datetime DEFAULT current_timestamp() COMMENT 'Thời điểm xử lý OCR'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lưu kết quả nhận dạng văn bản (OCR) từ hóa đơn và biên lai';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_otp`
--

CREATE TABLE `tbl_otp` (
  `otp_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `loai` varchar(20) DEFAULT 'EMAIL',
  `ngay_tao` datetime NOT NULL,
  `ngay_het_han` datetime NOT NULL,
  `so_lan_sai` int(11) DEFAULT 0,
  `da_su_dung` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_otp`
--

INSERT INTO `tbl_otp` (`otp_id`, `email`, `otp_code`, `loai`, `ngay_tao`, `ngay_het_han`, `so_lan_sai`, `da_su_dung`) VALUES
(1, 'cucu42467@gmail.com', '598666', 'EMAIL', '2026-04-17 17:43:37', '2026-04-17 17:48:37', 0, 0),
(2, 'cucu42467@gmail.com', '222842', 'EMAIL', '2026-04-17 17:59:52', '2026-04-17 18:04:52', 0, 1),
(3, 'cucu42467@gmail.com', '936268', 'EMAIL', '2026-04-17 18:03:07', '2026-04-17 18:08:07', 0, 1),
(4, 'cucu42467@gmail.com', '983697', 'EMAIL', '2026-05-06 12:43:01', '2026-05-06 12:48:01', 0, 0),
(5, 'nguyenanh00798@gmail.com', '918317', 'EMAIL', '2026-05-09 20:22:01', '2026-05-09 20:27:01', 0, 0),
(6, 'nguyenanh00798@gmail.com', '647035', 'EMAIL', '2026-05-09 20:22:07', '2026-05-09 20:27:07', 0, 0),
(7, 'nguyenanh00798@gmail.com', '649777', 'EMAIL', '2026-05-09 20:27:35', '2026-05-09 20:32:35', 0, 0),
(8, 'nguyenanh00798@gmail.com', '722426', 'EMAIL', '2026-05-09 20:31:11', '2026-05-09 20:36:11', 0, 0),
(9, 'nguyenanh00798@gmail.com', '987391', 'EMAIL', '2026-05-12 09:18:33', '2026-05-12 09:23:33', 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_phanhoi`
--

CREATE TABLE `tbl_phanhoi` (
  `PhanHoiId` int(11) NOT NULL COMMENT 'ID phản hồi',
  `NguoiDungId` int(11) NOT NULL COMMENT 'FK → tbl_nguoidung (người gửi phản hồi)',
  `TieuDe` varchar(255) NOT NULL COMMENT 'Tiêu đề phản hồi',
  `NoiDung` text NOT NULL COMMENT 'Nội dung chi tiết phản hồi/khiếu nại',
  `TrangThai` tinyint(4) DEFAULT 0 COMMENT '0=Chờ xử lý, 1=Đang xử lý, 2=Đã giải quyết, 3=Từ chối',
  `NgayTao` datetime DEFAULT current_timestamp() COMMENT 'Ngày người dùng gửi phản hồi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lưu phản hồi, góp ý, khiếu nại từ người dùng gửi đến hệ thống';

--
-- Đang đổ dữ liệu cho bảng `tbl_phanhoi`
--

INSERT INTO `tbl_phanhoi` (`PhanHoiId`, `NguoiDungId`, `TieuDe`, `NoiDung`, `TrangThai`, `NgayTao`) VALUES
(1, 12, 'Nhập gây mất thời gian', 'hãy nâng cấp hệ thống để tôi có thể dễ dàng nhập liệu 1 cách nhanh', 0, '2026-05-12 10:53:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_phanhoi_traloi`
--

CREATE TABLE `tbl_phanhoi_traloi` (
  `TraLoiId` int(11) NOT NULL COMMENT 'ID câu trả lời',
  `PhanHoiId` int(11) NOT NULL COMMENT 'FK → tbl_phanhoi',
  `NguoiGuiId` int(11) NOT NULL COMMENT 'FK → tbl_nguoidung (admin hoặc user trả lời)',
  `NoiDung` text NOT NULL COMMENT 'Nội dung câu trả lời',
  `NgayGui` datetime DEFAULT current_timestamp() COMMENT 'Ngày gửi câu trả lời',
  `DaDoc` tinyint(1) DEFAULT 0 COMMENT '0=Chưa đọc, 1=Đã đọc'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lưu lịch sử trả lời qua lại giữa admin và người dùng cho mỗi phản hồi';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_prompt_template`
--

CREATE TABLE `tbl_prompt_template` (
  `PromptId` int(11) NOT NULL COMMENT 'ID prompt',
  `TenPrompt` varchar(255) NOT NULL COMMENT 'Tên định danh prompt template',
  `NoiDung` text NOT NULL COMMENT 'Nội dung prompt (có thể chứa {placeholder})',
  `LoaiPrompt` varchar(50) DEFAULT NULL COMMENT 'Loại: chat / ocr / phanloai / dudoan / baocao',
  `TrangThai` tinyint(4) DEFAULT 1 COMMENT '1=Đang dùng, 0=Đã ẩn',
  `NgayTao` datetime DEFAULT current_timestamp() COMMENT 'Ngày tạo prompt'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lưu các mẫu prompt dùng để gọi AI cho từng tính năng trong hệ thống';

--
-- Đang đổ dữ liệu cho bảng `tbl_prompt_template`
--

INSERT INTO `tbl_prompt_template` (`PromptId`, `TenPrompt`, `NoiDung`, `LoaiPrompt`, `TrangThai`, `NgayTao`) VALUES
(1, 'PhanLoaiGiaoDich', 'Bạn là AI phân loại giao dịch tài chính. Dựa vào mô tả: \"{mo_ta}\", hãy xác định danh mục phù hợp nhất và trả về JSON: {\"danh_muc\": \"...\", \"do_tin_cay\": 0.0}', 'phanloai', 1, '2026-05-09 16:21:55'),
(2, 'TuVanChiTieu', 'Bạn là chuyên gia tài chính cá nhân. Người dùng có thu nhập {thu_nhap} VND/tháng, chi tiêu {chi_tieu} VND/tháng. Hãy đưa ra 3 gợi ý tiết kiệm cụ thể.', 'chat', 1, '2026-05-09 16:21:55'),
(3, 'PhanTichHoaDon', 'Phân tích hình ảnh hóa đơn và trả về JSON gồm: tên_cua_hang, ngay_giao_dich, tong_tien, danh_sach_san_pham.', 'ocr', 1, '2026-05-09 16:21:55'),
(4, 'DuDoanChiTieu', 'Dựa vào lịch sử chi tiêu 3 tháng gần nhất: {lich_su}, hãy dự đoán chi tiêu tháng tới theo từng danh mục. Trả về JSON.', 'dudoan', 1, '2026-05-09 16:21:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_quyen`
--

CREATE TABLE `tbl_quyen` (
  `QuyenId` int(11) NOT NULL COMMENT 'ID quyền',
  `TenQuyen` varchar(255) NOT NULL COMMENT 'Mã quyền (VD: QuanLyNguoiDung, XemBaoCao)',
  `MoTa` varchar(255) DEFAULT NULL COMMENT 'Mô tả ý nghĩa quyền'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Danh sách quyền chi tiết trong hệ thống phân quyền RBAC';

--
-- Đang đổ dữ liệu cho bảng `tbl_quyen`
--

INSERT INTO `tbl_quyen` (`QuyenId`, `TenQuyen`, `MoTa`) VALUES
(1, 'QuanLyNguoiDung', 'Xem, thêm, sửa, xóa người dùng'),
(2, 'QuanLyAI', 'Cấu hình model AI và prompt template'),
(3, 'QuanLyBaoCao', 'Xem báo cáo toàn hệ thống'),
(4, 'QuanLyCauHinh', 'Chỉnh sửa cấu hình hệ thống'),
(5, 'QuanLyPhanhoi', 'Xử lý phản hồi và khiếu nại'),
(6, 'XemDashboard', 'Xem dashboard cá nhân'),
(7, 'QuanLyGiaoDich', 'Thêm, sửa, xóa giao dịch cá nhân'),
(8, 'QuanLyNganSach', 'Thiết lập và theo dõi ngân sách'),
(9, 'QuanLyMucTieu', 'Tạo và quản lý mục tiêu tiết kiệm'),
(10, 'SuDungChatAI', 'Sử dụng tính năng chat với AI');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_reset_token`
--

CREATE TABLE `tbl_reset_token` (
  `reset_token_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `nguoi_dung_id` int(11) NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ngay_het_han` datetime NOT NULL,
  `da_su_dung` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_reset_token`
--

INSERT INTO `tbl_reset_token` (`reset_token_id`, `email`, `reset_token`, `nguoi_dung_id`, `ngay_tao`, `ngay_het_han`, `da_su_dung`) VALUES
(1, 'cucu42467@gmail.com', '34264fbd0d2d4a13a82bf54a802f52e18e5c7a4c207b430d97e8af45e7bd30f6', 11, '2026-04-17 18:00:21', '2026-04-17 18:30:21', 0),
(2, 'cucu42467@gmail.com', '3d8c943b651240e9b7593926abd3d2f8c4935e14d0b5419d8cd473040aecfafd', 11, '2026-04-17 18:03:30', '2026-04-17 18:33:30', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_taikhoan`
--

CREATE TABLE `tbl_taikhoan` (
  `TaiKhoanId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `LoaiTaiKhoanId` int(11) NOT NULL,
  `TenTaiKhoan` varchar(255) NOT NULL,
  `SoDu` decimal(18,2) DEFAULT 0.00,
  `SoDuBanDau` decimal(18,2) DEFAULT 0.00,
  `TienTe` varchar(10) DEFAULT 'VND',
  `MauSac` varchar(50) DEFAULT NULL,
  `Icon` varchar(100) DEFAULT NULL,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `TrangThai` tinyint(4) DEFAULT 1,
  `TenNganHang` varchar(255) DEFAULT NULL COMMENT 'Tên ngân hàng liên kết (VD: Vietcombank)',
  `SoTaiKhoan` varchar(50) DEFAULT NULL COMMENT 'Số tài khoản ngân hàng',
  `HanMucTinDung` decimal(18,2) DEFAULT NULL COMMENT 'Hạn mức tín dụng (dành cho thẻ tín dụng)',
  `MoTa` varchar(500) DEFAULT NULL COMMENT 'Ghi chú về tài khoản (VD: tài khoản lương, quỹ đen...)',
  `LaMacDinh` bit(1) DEFAULT b'0' COMMENT 'Tài khoản mặc định khi tạo giao dịch: 1=Có, 0=Không',
  `NgayCapNhatSoDu` datetime DEFAULT NULL COMMENT 'Lần cuối cập nhật số dư tài khoản'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_taikhoan`
--

INSERT INTO `tbl_taikhoan` (`TaiKhoanId`, `NguoiDungId`, `LoaiTaiKhoanId`, `TenTaiKhoan`, `SoDu`, `SoDuBanDau`, `TienTe`, `MauSac`, `Icon`, `NgayTao`, `TrangThai`, `TenNganHang`, `SoTaiKhoan`, `HanMucTinDung`, `MoTa`, `LaMacDinh`, `NgayCapNhatSoDu`) VALUES
(1, 1, 1, 'Ví tiền mặt', 2500000.00, 2000000.00, 'VND', '#4CAF50', 'wallet', '2024-01-10 08:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(2, 1, 2, 'Vietcombank', 15000000.00, 10000000.00, 'VND', '#1565C0', 'bank', '2024-01-10 08:05:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(3, 2, 3, 'MoMo', 3200000.00, 3000000.00, 'VND', '#E91E63', 'momo', '2024-02-15 09:30:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(7, 13, 1, 'Ví tiền mặt', 1500000.00, 1000000.00, 'VND', '#4CAF50', 'wallet', '2024-04-01 08:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(8, 13, 2, 'Techcombank', 8000000.00, 5000000.00, 'VND', '#EF5350', 'bank', '2024-04-01 08:05:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(9, 14, 3, 'ZaloPay', 2200000.00, 2000000.00, 'VND', '#1E88E5', 'zalopay', '2024-04-05 09:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(10, 15, 2, 'BIDV', 12000000.00, 10000000.00, 'VND', '#0D47A1', 'bank', '2024-05-10 10:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(11, 16, 4, 'Thẻ tín dụng VIB', 20000000.00, 0.00, 'VND', '#7B1FA2', 'credit', '2024-06-15 11:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(12, 17, 5, 'Tiết kiệm Agribank', 50000000.00, 50000000.00, 'VND', '#2E7D32', 'saving', '2024-07-20 08:30:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(13, 18, 1, 'Tiền mặt', 3000000.00, 3000000.00, 'VND', '#FF8F00', 'wallet', '2024-08-01 09:30:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(14, 20, 2, 'MB Bank', 18000000.00, 15000000.00, 'VND', '#283593', 'bank', '2024-10-10 11:30:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(15, 21, 3, 'MoMo', 4500000.00, 4000000.00, 'VND', '#E91E63', 'momo', '2024-11-15 08:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(16, 22, 2, 'ACB', 25000000.00, 20000000.00, 'VND', '#F57F17', 'bank', '2024-12-20 09:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(17, 12, 2, 'TPBank', 12500000.00, 10000000.00, 'VND', '#7E57C2', 'bank', '2025-04-01 08:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(18, 12, 1, 'Ví tiền mặt', 1800000.00, 1500000.00, 'VND', '#66BB6A', 'wallet', '2025-04-01 08:05:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(31, 12, 2, 'TPBank Chính', 45250000.00, 0.00, 'VND', '#1E88E5', 'bank.png', '2026-04-01 00:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(32, 12, 1, 'Ví Momo', 5000000.00, 0.00, 'VND', '#A50064', 'wallet.png', '2026-04-01 00:00:00', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(2001, 12, 1, 'Tiền mặt', 6125000.00, 0.00, 'VND', NULL, NULL, '2026-05-05 17:22:34', 1, '', '', NULL, NULL, b'1', '2026-05-11 20:07:19'),
(2002, 12, 2, 'VCB', 10000000.00, 0.00, 'VND', NULL, NULL, '2026-05-05 17:22:34', 1, NULL, NULL, NULL, NULL, b'0', NULL),
(2003, 12, 3, 'Ví zalopay', 10000000.00, NULL, NULL, NULL, NULL, NULL, 1, '', '', NULL, NULL, b'0', '2026-05-11 17:24:53'),
(2004, 12, 2, 'MBBank', 627778.00, 600000.00, NULL, '#4CAF50', 'bank', NULL, 1, NULL, NULL, NULL, NULL, b'0', '2026-05-11 18:51:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_tep_dinhkem`
--

CREATE TABLE `tbl_tep_dinhkem` (
  `TepId` int(11) NOT NULL,
  `TenFile` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `DuongDan` varchar(500) NOT NULL,
  `LoaiFile` varchar(50) DEFAULT NULL,
  `KichThuoc` int(11) DEFAULT NULL,
  `NgayTao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_tep_dinhkem`
--

INSERT INTO `tbl_tep_dinhkem` (`TepId`, `TenFile`, `DuongDan`, `LoaiFile`, `KichThuoc`, `NgayTao`) VALUES
(1, 'hoadon_dien_thang4.jpg', '/uploads/2025/04/hoadon_dien_thang4.jpg', 'image/jpeg', 245760, '2025-04-05 10:00:00'),
(2, 'receipt_shopee.pdf', '/uploads/2025/04/receipt_shopee.pdf', 'application/pdf', 102400, '2025-04-10 14:30:00'),
(3, 'bill_grab_food.png', '/uploads/2025/04/bill_grab_food.png', 'image/png', 81920, '2025-04-12 12:45:00'),
(4, 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', NULL, NULL, '2026-05-09 20:36:46'),
(5, 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', 'bf0abcd0-8553-48b7-a68b-184b4d99d7d6.png', NULL, NULL, '2026-05-09 21:01:50'),
(6, '27dc9fd1-8ecd-464a-8822-68abe2a7fc11.png', '27dc9fd1-8ecd-464a-8822-68abe2a7fc11.png', NULL, NULL, '2026-05-11 04:19:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_theodoi_ngansach`
--

CREATE TABLE `tbl_theodoi_ngansach` (
  `Id` int(11) NOT NULL,
  `NganSachId` int(11) NOT NULL,
  `SoTienDaChi` decimal(18,2) DEFAULT NULL,
  `PhanTramDaDung` float DEFAULT NULL,
  `NgayCapNhat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_theodoi_ngansach`
--

INSERT INTO `tbl_theodoi_ngansach` (`Id`, `NganSachId`, `SoTienDaChi`, `PhanTramDaDung`, `NgayCapNhat`) VALUES
(1, 1, 800000.00, 26.7, '2025-04-10 23:59:00'),
(2, 1, 1200000.00, 40, '2025-04-20 23:59:00'),
(3, 2, 900000.00, 60, '2025-04-20 23:59:00'),
(4, 1, 800000.00, 26.7, '2025-04-10 23:59:00'),
(5, 1, 1200000.00, 40, '2025-04-20 23:59:00'),
(6, 2, 900000.00, 60, '2025-04-20 23:59:00'),
(7, 7, 400000.00, 16, '2025-04-10 23:59:00'),
(8, 7, 800000.00, 32, '2025-04-20 23:59:00'),
(9, 8, 425000.00, 42.5, '2025-04-20 23:59:00'),
(10, 9, 750000.00, 25, '2025-04-10 23:59:00'),
(11, 9, 1500000.00, 50, '2025-04-20 23:59:00'),
(12, 10, 600000.00, 40, '2025-04-20 23:59:00'),
(13, 11, 1800000.00, 90, '2025-04-10 23:59:00'),
(14, 11, 2200000.00, 110, '2025-04-20 23:59:00'),
(15, 12, 600000.00, 15, '2025-04-10 23:59:00'),
(16, 13, 2500000.00, 50, '2025-04-20 23:59:00'),
(17, 17, 450000.00, 15, '2025-04-10 23:59:00'),
(18, 17, 850000.00, 28.33, '2025-04-20 23:59:00'),
(19, 18, 320000.00, 26.67, '2025-04-20 23:59:00'),
(20, 19, 450000.00, 30, '2025-04-20 23:59:00'),
(21, 1, 120000.00, 4, '2026-05-11 20:49:13'),
(22, 2, 900000.00, 60, '2026-05-11 20:49:13'),
(23, 3, 2100000.00, 105, '2026-05-11 20:49:13'),
(24, 7, 250000.00, 10, '2026-05-11 20:49:13'),
(25, 8, 425000.00, 42.5, '2026-05-11 20:49:13'),
(26, 9, 1500000.00, 50, '2026-05-11 20:49:13'),
(27, 10, 600000.00, 40, '2026-05-11 20:49:13'),
(28, 11, 2200000.00, 110, '2026-05-11 20:49:13'),
(29, 12, 1200000.00, 30, '2026-05-11 20:49:13'),
(30, 13, 4500000.00, 90, '2026-05-11 20:49:13'),
(31, 14, 350000.00, 17.5, '2026-05-11 20:49:13'),
(32, 15, 960000.00, 80, '2026-05-11 20:49:13'),
(33, 16, 1750000.00, 70, '2026-05-11 20:49:13'),
(34, 17, 120000.00, 4, '2026-05-11 20:49:13'),
(35, 18, 320000.00, 26.67, '2026-05-11 20:49:13'),
(36, 19, 450000.00, 30, '2026-05-11 20:49:13'),
(37, 20, 1905000.00, 95.25, '2026-05-11 20:49:13'),
(38, 21, 1330000.00, 88.67, '2026-05-11 20:49:13'),
(39, 22, 5500000.00, 91.67, '2026-05-11 20:49:13'),
(40, 23, 800000.00, 80, '2026-05-11 20:49:13'),
(41, 24, 580000.00, 72.5, '2026-05-11 20:49:13'),
(42, 25, 650000.00, 81.25, '2026-05-11 20:49:13'),
(43, 26, 1250000.00, 83.33, '2026-05-11 20:49:13'),
(44, 27, 1480000.00, 98.67, '2026-05-11 20:49:13'),
(45, 28, 585000.00, 13, '2026-05-11 20:49:13'),
(46, 29, 380000.00, 19, '2026-05-11 20:49:13'),
(47, 30, 5500000.00, 100, '2026-05-11 20:49:13'),
(48, 31, 1250000.00, 41.67, '2026-05-11 20:49:13'),
(49, 32, 220000.00, 14.67, '2026-05-11 20:49:13'),
(50, 6001, 391000.00, 13.03, '2026-05-11 20:49:13'),
(51, 6002, 434222.00, 43.42, '2026-05-11 20:49:13'),
(52, 6003, 500000.00, 25, '2026-05-11 20:49:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_thongbao`
--

CREATE TABLE `tbl_thongbao` (
  `ThongBaoId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `TieuDe` varchar(255) NOT NULL,
  `NoiDung` varchar(1000) DEFAULT NULL,
  `LoaiThongBao` tinyint(4) DEFAULT 1,
  `LoaiDoiTuong` varchar(50) DEFAULT NULL COMMENT 'Loại đối tượng liên quan: giaodich, ngansach, muctieu, taikhoan',
  `DoiTuongId` int(11) DEFAULT NULL COMMENT 'ID của đối tượng liên quan để điều hướng',
  `DuongDanDieuHuong` varchar(500) DEFAULT NULL COMMENT 'Đường dẫn điều hướng khi bấm vào thông báo\r\n             (VD: /giaodich/5007, /ngansach/6001)',
  `NgayTao` datetime DEFAULT current_timestamp(),
  `DaDoc` bit(1) DEFAULT b'0',
  `NgayHetHan` datetime DEFAULT NULL COMMENT 'Thông báo tự ẩn sau ngày này, NULL = không hết hạn'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_thongbao`
--

INSERT INTO `tbl_thongbao` (`ThongBaoId`, `NguoiDungId`, `TieuDe`, `NoiDung`, `LoaiThongBao`, `LoaiDoiTuong`, `DoiTuongId`, `DuongDanDieuHuong`, `NgayTao`, `DaDoc`, `NgayHetHan`) VALUES
(1, 1, 'Chào mừng trở lại!', 'Bạn đã đăng nhập thành công lúc 08:00 ngày 01/04/2025.', 1, 'giaodich', 1, '/giaodich/1', '2025-04-01 08:00:00', b'1', NULL),
(2, 2, 'Vượt ngân sách mua sắm', 'Chi tiêu mua sắm của bạn đã vượt giới hạn đặt ra tháng này.', 4, NULL, NULL, NULL, '2025-04-20 10:00:00', b'0', NULL),
(3, 3, 'Gợi ý từ AI', 'Tỉ lệ tiết kiệm tháng 3 là 10%. Xem chi tiết phân tích.', 2, NULL, NULL, NULL, '2025-04-01 06:05:00', b'0', NULL),
(4, 13, 'Chào mừng tới hệ thống!', 'Tài khoản của bạn đã được kích hoạt thành công.', 1, 'giaodich', 7, '/giaodich/7', '2025-04-05 08:00:00', b'1', NULL),
(5, 14, 'Vượt ngân sách di chuyển', 'Chi tiêu di chuyển của bạn đã vượt 80% hạn mức tháng này.', 4, NULL, NULL, NULL, '2025-04-07 10:00:00', b'0', NULL),
(6, 15, 'Mục tiêu hoàn thành!', 'Chúc mừng! Bạn đã đạt mục tiêu Du lịch Phú Quốc.', 2, NULL, NULL, NULL, '2025-04-08 15:00:00', b'0', NULL),
(7, 16, 'Vượt ngân sách giáo dục', 'Chi tiêu học phí đã vượt mức cho phép 10%.', 4, NULL, NULL, NULL, '2025-04-09 09:00:00', b'0', NULL),
(8, 17, 'Gợi ý từ AI', 'Tỉ lệ tiết kiệm tháng 3 của bạn đạt 35%. Rất tốt!', 2, NULL, NULL, NULL, '2025-04-10 06:00:00', b'1', NULL),
(9, 18, 'Nhắc nhở giao dịch định kỳ', 'Tiền thuê nhà tháng 5 sẽ đến hạn trong 3 ngày.', 3, NULL, NULL, NULL, '2025-04-28 08:00:00', b'0', NULL),
(10, 20, 'Số dư thấp', 'Số dư tài khoản MB Bank của bạn còn dưới 1.000.000 VND.', 4, NULL, NULL, NULL, '2025-04-11 07:00:00', b'0', NULL),
(11, 21, 'Gợi ý từ AI', 'Chi tiêu giải trí tháng này tăng 20% so với tháng trước.', 2, NULL, NULL, NULL, '2025-04-12 06:00:00', b'0', NULL),
(12, 22, 'Nhắc nhở giao dịch định kỳ', 'Internet + truyền hình sẽ đến hạn thanh toán vào ngày 01/05.', 3, NULL, NULL, NULL, '2025-04-28 09:00:00', b'0', NULL),
(13, 13, 'Cập nhật ứng dụng', 'Phiên bản mới 2.1.0 đã sẵn sàng. Cập nhật để trải nghiệm tốt hơn.', 1, NULL, NULL, NULL, '2025-04-15 08:00:00', b'0', NULL),
(14, 12, 'Chào mừng trở lại!', 'Bạn đã đăng nhập thành công và hệ thống đã sẵn sàng.', 1, NULL, NULL, NULL, '2025-04-18 07:11:35', b'1', NULL),
(15, 12, 'Gợi ý tiết kiệm', 'Bạn vừa nhận lương. Hãy chuyển một phần vào mục tiêu mua laptop.', 2, NULL, NULL, NULL, '2025-04-18 08:00:00', b'0', NULL),
(9001, 12, 'Canh bao chi tieu', 'Ban da tieu nhieu hon muc', 1, NULL, NULL, NULL, '2026-05-05 17:22:34', b'0', NULL),
(9002, 2, 'Cảnh báo ngân sách', 'Bạn đã chi 105% ngân sách danh mục Mua sắm tháng 4.', 4, NULL, NULL, NULL, '2025-04-20 10:00:00', b'0', NULL),
(9003, 1, 'Cảnh báo số dư', 'Số dư ví tiền mặt còn dưới 500.000 VND.', 4, NULL, NULL, NULL, '2025-04-22 09:00:00', b'1', NULL),
(9004, 3, 'Nhắc nhở giao dịch', 'Giao dịch định kỳ Tiền thuê nhà sẽ đến hạn sau 3 ngày.', 3, NULL, NULL, NULL, '2025-04-28 08:00:00', b'0', NULL),
(9005, 16, 'Cảnh báo ngân sách', 'Bạn đã chi 110% ngân sách giáo dục tháng 4.', 4, NULL, NULL, NULL, '2025-04-09 09:00:00', b'0', NULL),
(9006, 18, 'Nhắc nhở giao dịch', 'Giao dịch định kỳ Tiền thuê nhà sẽ đến hạn sau 3 ngày.', 3, NULL, NULL, NULL, '2025-04-28 08:00:00', b'0', NULL),
(9007, 20, 'Cảnh báo số dư', 'Số dư tài khoản MB Bank còn dưới 1.000.000 VND.', 4, NULL, NULL, NULL, '2025-04-11 07:00:00', b'0', NULL),
(9008, 13, 'Cảnh báo ngân sách', 'Chi phí ăn uống tăng 25% so với tháng trước.', 4, NULL, NULL, NULL, '2025-04-06 10:00:00', b'1', NULL),
(9009, 15, 'Nhắc nhở giao dịch', 'Mục tiêu Du lịch Phú Quốc đã hoàn thành sớm 2 tháng.', 3, NULL, NULL, NULL, '2025-04-08 15:00:00', b'0', NULL),
(9010, 17, 'Cảnh báo ngân sách', 'Tỉ lệ tiết kiệm giảm xuống còn 15% so với mục tiêu 20%.', 4, NULL, NULL, NULL, '2025-04-10 09:00:00', b'0', NULL),
(9011, 21, 'Nhắc nhở giao dịch', 'Chi tiêu giải trí tăng mạnh, xem lại ngân sách.', 3, NULL, NULL, NULL, '2025-04-12 06:00:00', b'0', NULL),
(9012, 22, 'Cảnh báo số dư', 'Số dư tài khoản ACB dự liệu sẽ hết trước ngày trả nợ.', 4, NULL, NULL, NULL, '2025-04-13 08:00:00', b'0', NULL),
(9013, 14, 'Cảnh báo ngân sách', 'Tổng chi tháng này đã vượt 90% thu nhập dự kiến.', 4, NULL, NULL, NULL, '2025-04-07 11:00:00', b'1', NULL),
(9014, 16, 'Cảnh báo số dư', 'Thẻ tín dụng VIB sẽ đến hạn thanh toán vào ngày 25/04.', 4, NULL, NULL, NULL, '2025-04-22 08:00:00', b'0', NULL),
(9015, 12, 'Cảnh báo ngân sách', 'Chi tiêu ăn uống của bạn đã đạt 85% ngân sách tháng 4.', 4, NULL, NULL, NULL, '2025-04-21 09:00:00', b'0', NULL),
(9016, 12, 'Cảnh báo số dư', 'Số dư ví tiền mặt đang thấp hơn 2.000.000 VND.', 4, NULL, NULL, NULL, '2025-04-22 08:30:00', b'0', NULL),
(9017, 12, 'Cảnh báo ngân sách', 'Chi tiêu ăn uống đã đạt 70% ngân sách tháng 4.', 4, NULL, NULL, NULL, '2026-04-18 05:14:58', b'0', NULL),
(9018, 12, 'Nhắc nhở giao dịch', 'Sắp đến hạn đóng góp mục tiêu du lịch Nhật Bản.', 3, NULL, NULL, NULL, '2026-04-18 05:14:58', b'0', NULL),
(9019, 12, 'Cảnh báo số dư', 'Số dư tài khoản TPBank giảm xuống dưới mức an toàn.', 4, NULL, NULL, NULL, '2026-04-18 05:14:58', b'0', NULL),
(9064, 12, 'Ngân sách mới được tạo tự động', 'Hệ thống đã tạo ngân sách mặc định cho danh mục \"Sức khoẻ\" tháng 5/2026. Bạn có thể chỉnh sửa hạn mức tại trang Ngân sách.', 1, 'giaodich', 5029, '/giaodich/5029', '2026-05-12 01:07:11', b'0', NULL),
(9065, 1, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Tiền thuê nhà\" đã được tự động Chi 4,500,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5033, '/giaodich/5033', '2026-05-13 03:56:11', b'0', NULL),
(9066, 1, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Tiền thuê nhà\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5033, '/giaodich/5033', '2026-05-13 03:56:11', b'0', NULL),
(9067, 2, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Lương cộng tác viên\" đã được tự động Thu 2,000,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5034, '/giaodich/5034', '2026-05-13 03:56:16', b'0', NULL),
(9068, 2, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Lương cộng tác viên\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5034, '/giaodich/5034', '2026-05-13 03:56:17', b'0', NULL),
(9069, 13, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Tiền điện\" đã được tự động Chi 350,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5035, '/giaodich/5035', '2026-05-13 03:56:21', b'0', NULL),
(9070, 13, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Tiền điện\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5035, '/giaodich/5035', '2026-05-13 03:56:21', b'0', NULL),
(9071, 13, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Tiền thuê nhà\" đã được tự động Chi 5,000,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5035, '/giaodich/5035', '2026-05-13 03:56:25', b'0', NULL),
(9072, 13, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Tiền thuê nhà\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5035, '/giaodich/5035', '2026-05-13 03:56:26', b'0', NULL),
(9073, 14, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Lương part-time\" đã được tự động Thu 3,500,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5037, '/giaodich/5037', '2026-05-13 03:56:31', b'0', NULL),
(9074, 14, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Lương part-time\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5037, '/giaodich/5037', '2026-05-13 03:56:32', b'0', NULL),
(9075, 16, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Phí bảo hiểm nhân thọ\" đã được tự động Chi 1,200,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5038, '/giaodich/5038', '2026-05-13 03:56:42', b'0', NULL),
(9076, 16, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Phí bảo hiểm nhân thọ\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5038, '/giaodich/5038', '2026-05-13 03:56:43', b'0', NULL),
(9077, 17, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Lãi tiết kiệm\" đã được tự động Thu 625,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5039, '/giaodich/5039', '2026-05-13 03:56:47', b'0', NULL),
(9078, 17, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Lãi tiết kiệm\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5039, '/giaodich/5039', '2026-05-13 03:56:48', b'0', NULL),
(9079, 18, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Xăng xe tuần\" đã được tự động Chi 200,000 VND vào ngày 28/04/2025', 3, 'giaodich', 5040, '/giaodich/5040', '2026-05-13 03:56:51', b'0', NULL),
(9080, 18, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Xăng xe tuần\" sẽ tự động thực hiện vào ngày 28/05/2025', 3, 'giaodich', 5040, '/giaodich/5040', '2026-05-13 03:56:52', b'0', NULL),
(9081, 20, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Phòng khám định kỳ\" đã được tự động Chi 500,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5041, '/giaodich/5041', '2026-05-13 03:56:56', b'0', NULL),
(9082, 20, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Phòng khám định kỳ\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5041, '/giaodich/5041', '2026-05-13 03:56:57', b'0', NULL),
(9083, 21, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Spotify Premium\" đã được tự động Chi 59,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5042, '/giaodich/5042', '2026-05-13 03:57:01', b'0', NULL),
(9084, 21, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Spotify Premium\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5042, '/giaodich/5042', '2026-05-13 03:57:02', b'0', NULL),
(9085, 22, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Internet + truyền hình\" đã được tự động Chi 280,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5043, '/giaodich/5043', '2026-05-13 03:57:05', b'0', NULL),
(9086, 22, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Internet + truyền hình\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5043, '/giaodich/5043', '2026-05-13 03:57:06', b'0', NULL),
(9087, 12, 'Giao dịch định kỳ đã thực hiện', 'Giao dịch \"Tiền điện\" đã được tự động Chi 350,000 VND vào ngày 01/05/2025', 3, 'giaodich', 5044, '/giaodich/5044', '2026-05-13 03:57:10', b'0', NULL),
(9088, 12, 'Nhắc nhở giao dịch định kỳ sắp tới', 'Giao dịch \"Tiền điện\" sẽ tự động thực hiện vào ngày 01/06/2025', 3, 'giaodich', 5044, '/giaodich/5044', '2026-05-13 03:57:11', b'0', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_thongbao_hethong`
--

CREATE TABLE `tbl_thongbao_hethong` (
  `ThongBaoHeThongId` int(11) NOT NULL COMMENT 'ID thông báo hệ thống',
  `TieuDe` varchar(255) NOT NULL COMMENT 'Tiêu đề thông báo',
  `NoiDung` text DEFAULT NULL COMMENT 'Nội dung chi tiết thông báo',
  `Loai` varchar(50) DEFAULT 'system' COMMENT 'Loại: system / maintenance / update / promotion',
  `NguoiTao` int(11) DEFAULT NULL COMMENT 'FK → tbl_nguoidung (admin tạo thông báo)',
  `NgayGui` datetime DEFAULT current_timestamp() COMMENT 'Thời điểm gửi thông báo',
  `NgayHetHan` datetime DEFAULT NULL COMMENT 'Thông báo hết hiệu lực sau ngày này (NULL=vĩnh viễn)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Thông báo broadcast gửi tới toàn bộ người dùng hệ thống';

--
-- Đang đổ dữ liệu cho bảng `tbl_thongbao_hethong`
--

INSERT INTO `tbl_thongbao_hethong` (`ThongBaoHeThongId`, `TieuDe`, `NoiDung`, `Loai`, `NguoiTao`, `NgayGui`, `NgayHetHan`) VALUES
(1, 'Chào mừng đến với ứng dụng!', 'Cảm ơn bạn đã sử dụng ứng dụng quản lý chi tiêu. Hãy bắt đầu bằng cách thêm tài khoản và giao dịch đầu tiên.', 'system', 1, '2026-05-09 16:21:55', NULL),
(2, 'Tính năng AI Chat đã ra mắt', 'Bạn có thể hỏi AI về tình hình tài chính của mình. Hãy thử ngay tại menu AI Assistant!', 'update', 1, '2026-05-09 16:21:55', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_token`
--

CREATE TABLE `tbl_token` (
  `TokenId` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `AccessToken` text DEFAULT NULL,
  `RefreshToken` text DEFAULT NULL,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `NgayHetHan` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_token`
--

INSERT INTO `tbl_token` (`TokenId`, `NguoiDungId`, `AccessToken`, `RefreshToken`, `NgayTao`, `NgayHetHan`) VALUES
(143, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhbi5uZ3V5ZW5AZ21haWwuY29tIiwianRpIjoiYTRjNWZmZTUtODgzMC00NGI1LWIxYWItYTRlMjM3NWQ2MmE1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbImFkbWluIiwidXNlciJdLCJuYmYiOjE3NzgyNTA4NzksImV4cCI6MTc3ODI1NDUwOSwiaXNzIjoiQVBJX05EIiwiYXVkIjoiQXBwUXVhbkx5Q2hpVGlldSJ9.W9Fq1BEnG7lEYQ5K-UUL16_cyacTacQua4e6Hl6qTLU', 'cdQ4SXgsuIsbQLX9hV5Ed7fIHdviKYO8ZDY3UzUPBgqTfkVl6CoRfZzwxYz5gWdvJ/H+w3wRSAAT+ve/bkFyVg==', '2026-05-08 21:35:09', '2026-05-15 14:35:09'),
(163, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiZDUwOTg3OTItNWQzNi00ODIyLThlZGItOTZlNWQ5ZTFhMzYzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODM5ODg2OSwiZXhwIjoxNzc4NDAyNDk5LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.2QAH6x74kcShfw4U_JcuInXrn6fWRz0hx1wYhR8fz8I', 'J3gEjx732y8sZsEE9pBnUhCzn76MPFEHbfK9mJsfXp17oFV3KjshpqGnw67xSTaIFt09eK1sN40WJXxAv4iCBg==', '2026-05-10 14:41:39', '2026-05-17 07:41:39'),
(164, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiN2I3ZjM0NjctMzhjOC00YjlkLTg5YmEtM2YzMTY1ZDk3ZDFlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQzOTg2OSwiZXhwIjoxNzc4NDQzNDk5LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.lSyfeK_EOUVNnbWnYr8aO5eeP6mrH-6cu8kz29CTCB4', 'hrDRa8CI9zluVMc6YIor9zRpqH5wwHjZUS69nNfTbjJ2sQmwlGBdW4JZbLXDrih+LEhcqzrG9Z7BEMvkliXfbQ==', '2026-05-11 02:04:59', '2026-05-17 19:04:59'),
(165, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiZTNmYjYyNGQtMjBjMy00MGU2LWIxN2QtYmFiM2MyMWRjNzllIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ0MzUxMCwiZXhwIjoxNzc4NDQ3MTQwLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.rJeG_vtCKHzQnqfhMR2RLPRKpgt9u-6aVLy9VGoSNlk', 'LOFZXXZR20utGrIFpXiHAa/ZsTjIr8d0thRSefvVnQIlwMCIOaidG7VPEURa5zmrPb1qeBHMDvyhNTiftxAX5g==', '2026-05-11 03:05:40', '2026-05-17 20:05:40'),
(166, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiZGI0MGMzMzYtNzNhZi00MDg2LWI3MzAtY2ZhYjQ2ZTA4NTQ1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ0NzExOSwiZXhwIjoxNzc4NDUwNzQ5LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.MqLXeqJALJkzGldSGTQNduAVph3CoDs3Ua3vlrhbnFI', 'Bk2L2VuG/kfkefOis6J7VpDrlMDTdCdg4hr+A4Up3j97RugEyIgFxuLFVT7riyz4Fn44Gnu5ojD1lw95iOB1Ew==', '2026-05-11 04:05:49', '2026-05-17 21:05:49'),
(167, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYjg3MDU4OWEtY2FiNS00YjMyLTk5NzYtZDc3M2M0N2U5ZGQwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ2NTg5NiwiZXhwIjoxNzc4NDY5NTI2LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.VrRwiZcAn-rIzfgbEHKgt5zxlNytWVdjTfJ_dcQtpEo', 'pJauyKS92Ew4D6gqmGt5h73pQ6krLzhbAIfoyxzZErLyuvzgJSIU+lI+Z1G5k1ziItJKgXPBjtyEGH+9JIpK7w==', '2026-05-11 09:18:46', '2026-05-18 02:18:46'),
(169, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiMGRhYzE1ZmUtZjM1ZS00YmQxLThmMjgtZjRjZTA4MGQxOWQ5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ3NDczNywiZXhwIjoxNzc4NDc4MzY3LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.HGAf0v5vssPzlG7CMTchSHeDvXK6JP7oNsVwAO4bMKI', 'u96FtBq/EvivkzUj4ICu8xrgP5k0joNKtGnKpeUMnaf9M4mEfBQg4cwtSefoZ/5NSNu0rUQdCFOXDYMf0kTHMw==', '2026-05-11 11:46:07', '2026-05-18 04:46:07'),
(170, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYzJhZjVmMDMtMzcxOS00MGYzLTkyZGYtOTgwNjAwMWI0YzQ5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ3ODQ5OSwiZXhwIjoxNzc4NDgyMTI5LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.JfuSrsMaxNDJMT7QdliDE-ZS7zsDxr65mq5Y8dq42zw', 'KYZKnCfbam6GPuByQ64DvHvF0YsssAjTixAE+EeBuYpgwP6aPt0GM+4PBQYfJYGKIMkF2yLrC1sEtNyRv+L4pg==', '2026-05-11 12:48:49', '2026-05-18 05:48:49'),
(171, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNWRmMTA2NzktZjZjNy00ZGIxLTk5YjItZTBhZWZmOGEyYjM4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ4MjIwOSwiZXhwIjoxNzc4NDg1ODM5LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.q4VaN7xt3S373QFPCCna7wamk4ZxLjBQRu110aCZu4k', 'ChtBdZxF8tQIL8n3xN//jaRzWhROJGNWJJRjhiFn0SizaVE52SyM/vTf/lJnlQWMLnRO/0b69gCWnZX6ULWAJQ==', '2026-05-11 13:50:39', '2026-05-18 06:50:39'),
(172, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiOWY3MzY1MzUtMTUzYS00OWYxLWE5MzAtZjA5ZGVmMGI2YTgwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ4NTkyOCwiZXhwIjoxNzc4NDg5NTU4LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.gLKO_DIVPOlRPC1ZqcfOWPp2JydxZ-M-fvfx7VxF6PE', 'Gfvb2JL8avkZ4acJSi4F6uGLMIKAoXa4btcDaleubv0+yaHKP2nmqr/Wt7jzz7DMdwlE6l2gxiLAJu+hyvSLHA==', '2026-05-11 14:52:38', '2026-05-18 07:52:38'),
(173, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYWIwMjJhNDQtZmE5YS00ZWU2LWEyZjMtNzlkMzhkMjVhOTMzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ4OTczMywiZXhwIjoxNzc4NDkzMzYzLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.BPZNL876iai4UXjPlDafhU_u3oZZbGDhomUb48jrdMg', 'c7KvmOcM3+UQexNaCCoRQrE8U83Eds/UE5NVzWLMdrgXMOE7TJylBQX/39adGGz3vYdJqS0UwkFchQ8HPDW0tw==', '2026-05-11 15:56:03', '2026-05-18 08:56:03'),
(174, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNGZhYjQzZDEtYzE1Mi00OTg4LWIzOTMtZTczNDE5YjUxMDY2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ5MzMxOCwiZXhwIjoxNzc4NDk2OTQ4LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.BSMASFfhgv4mEovvjTpPZiUoQw50T__1VvsQGAOUdDo', 'cZTPChobB2cHFmQmw6j0X6eyk1J4uFXC9rmT/z6riOXjCb8Zp3vGq/42hUo6cTfMqnnQZsxzTdwcULSNG9S+oA==', '2026-05-11 16:55:48', '2026-05-18 09:55:48'),
(175, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiODkwOGIxYmItYjVhMy00MjM3LTk2M2EtNmIxNmM5NjY4Y2I5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODQ5NzY2NiwiZXhwIjoxNzc4NTAxMjk2LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.gRWHgSdKScsIpIaTE2n-eOGCXRKHezwUs139ntBEcnE', 'tGsGO4nJrj+LVHP9d3nMvYhJIDfxfRwcMu0O/bl+gJatY5PFOVVv+PjiPzELkwPzic3Lu+Yb6VgXFp/M84EeKQ==', '2026-05-11 18:08:16', '2026-05-18 11:08:16'),
(176, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYzE3ZWVmYjktYTFlYS00MTk2LWExOTYtNGM5YjQ1Yjk2OGFlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUwNTgwMCwiZXhwIjoxNzc4NTA5NDMwLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.XKxIa3QPgB0CQU_0cgjqnAe2Pzkl-tJngWbdMhD5IwA', 'MVH6/MD0jfqjcvr08HO7ChHq0BTkrPO4Pc4B9Pip1KmNxkqplmKsjvBbL34Ihxlm6ieamqsBIvK40nNGVmzrUA==', '2026-05-11 20:23:50', '2026-05-18 13:23:50'),
(177, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNzgzYTU3NmUtZGZlZS00OTFkLTg3ZDktYmJiNzhiN2JiNzVjIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUwOTc0MSwiZXhwIjoxNzc4NTEzMzcxLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.W9tdSeEX_DHr21VGgN6n-_690sQmcrVjKvKvfLVWWNk', 'ZjXZ+qTfxQmtlZpkl4zgOkEpFLSfhW+UEC6HEmkO7I3p/Sa71s/B7kaqyovujV/bh0qfM38xYJZFjiPFVMOFnA==', '2026-05-11 21:29:31', '2026-05-18 14:29:31'),
(179, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiOGIwZWQxOWYtZTJhZC00MDMyLTg1OGMtZWM3NDFiMGJlMGE5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUxNDI3MiwiZXhwIjoxNzc4NTE3OTAyLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.g1JbVLNdGpx8rMkva3DNDRf3MzXQ4Al9ssOFPxunyjQ', '6QUzyLvGwhvlfHQEeiCsHePwx9xoV9gQjqRVMw+4wUVXKnfdpCbQNzp7lqliArTZal7ZMg+xTMbxhpXDpy2qRA==', '2026-05-11 22:45:02', '2026-05-18 15:45:02'),
(180, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYWM0Zjg3MGUtYzIxYS00YjFhLTkwZDUtODlhMDJmM2I2OTkwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUxODA1OSwiZXhwIjoxNzc4NTIxNjg5LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.CMt4dPTS9e_obJEytXRo6D4ktWcd7DcLnTzOajqPhXs', '0ezvZpiOcN3tEirjuAGzgsiY46VhX5i3z9RMpqRsD3EWvkVx8FtsQ6uGCxSJCeLLe/VMLUzLRKchhkUM0pDlTQ==', '2026-05-11 23:48:09', '2026-05-18 16:48:09'),
(181, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiZjU1YzEyMGEtYTY2My00YjE5LThiMWEtOGQ3NjdhZGI4ZmQ0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUyMTkxNiwiZXhwIjoxNzc4NTI1NTQ2LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.MP6w2dnKTH1WVp84sAMxmC9pTqrR9cZaXEtMakL_7qg', 'vTcC6K3d1ya6DLiYJ+4IZMjQLt7ixI8WWClVastC5lvJAp+xb1I9LQ5tsVFhBhQ16bFac0grwoEn8EpqfZflBQ==', '2026-05-12 00:52:26', '2026-05-18 17:52:26'),
(182, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiM2QwMWJmMGEtYTkxMy00ZDA4LWEzY2EtY2MyMWM2YTIxODEzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUyNTU5MiwiZXhwIjoxNzc4NTI5MjIyLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.2_mYLLK9ChAoI0ThPj31HH6D0PgQQHZpV72URPblkzc', 'FX/xtQROtGQQiM/bmpQEOJu+EHgWnHDkkkohQRMkSNZbuGUdHlKGNxJhx7IV7Tu4MCXCYvMTL8VkbJ4DydIIWA==', '2026-05-12 01:53:42', '2026-05-18 18:53:42'),
(183, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiMTQ4M2M2NjMtNDI4Ni00ODY5LTg0NDEtM2U1MmQ3MzcwNGZjIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUyOTMwMiwiZXhwIjoxNzc4NTMyOTMyLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.j1ZRSMqrzWtAWVPJmweM0uNwUnnipmOjm83I4D26As8', 'pCAKd+8nDM2uUJfG0jTIndCIoYmsBRffbwnK7+9md7+G07F2+DcrqoAV4FQyZZiosqkjgVp57MQmhI/9pGx7Tg==', '2026-05-12 02:55:33', '2026-05-18 19:55:32'),
(184, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNGJhMjBiZWMtMTZmYS00MGUzLWI4YTAtZjY1N2U0MTI0YjUzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUzMzAyMSwiZXhwIjoxNzc4NTM2NjUxLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.fPLLJvF0TN4ZrZZw76nU75e81k4eJ1vtQWek6C0SPJs', 'rbz1FxD21ZAZw3x6LAcW6qvrtZw73dGnLwTKiYp1Zt9O4nWIkd8dCueQqQD3Y762l2MEjmFwmwDI19RmXEz9Vg==', '2026-05-12 03:57:31', '2026-05-18 20:57:31'),
(185, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNTQ2N2IxZDItMjBlNS00NThmLTgwOWUtNGFhMGZjMjA5NDIyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODUzNjYzMywiZXhwIjoxNzc4NTQwMjYzLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.UDJXjMsLU80tAblN9WGMCbSGLZVVpgog7IHl1zFaCyQ', 'QuH2tvV/J7tqATnQvQsnv8D40Z442dcHrvEmoJFkzA9PvJEY2slUWavJ6D2QJ//M2lJXfl9JE9MyMmfxSf3KIQ==', '2026-05-12 04:57:43', '2026-05-18 21:57:43'),
(186, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYWRjZTgzMjUtZTc4My00NTJkLTg2MzMtNDgzNDNjMzA4ZmYwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU0NzkxMCwiZXhwIjoxNzc4NTUxNTQwLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.fpp_Y5EIcGJ6eh23WDHvAZROh_9GVxCA7KLsd6fMVos', 'TdY4Qmf4hv3yNV0sR4L4iK724Gpzr4/72kAc2o9YkueAa4gTcOCaF9OC44+eFd0Oi+Gszp7KUWYvtZ1HIsjUeg==', '2026-05-12 08:05:40', '2026-05-19 01:05:40'),
(187, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiMTg4MWEzODktM2NjNS00NzdkLThiN2QtNTA1ZGE0MzBhMTI5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU1MTY3MSwiZXhwIjoxNzc4NTU1MzAxLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.Th66Q_D7EaRKQfnhRh2kt2JFhALnfnZdcfREbDfxuDA', 'vMNpjLEylmDF+iSk84eLM84YN4lNMBXRQzGoTu0xb4odG6znHko9g5hPmqOmkUPF4OQvvZDvtR6gKCvCqsNzMA==', '2026-05-12 09:08:21', '2026-05-19 02:08:21'),
(188, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiMTBkY2VkYTYtZDVmZi00N2FjLTg1N2UtNGI4MjJjNDE4ZTAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU1NjUxNywiZXhwIjoxNzc4NTYwMTQ3LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.26UQi3N98cAH8C1W98Sp8pzItpn748UYE9d7lzpidDA', 'vXPvwyKV0J7uZ5vydXtrlLl0+/B6fDw2roIV+5GuxUELYtUcZhu1IjF/LluzQ2hWrzXD+Jl9CnTBXBvNTOdi3g==', '2026-05-12 10:29:07', '2026-05-19 03:29:07'),
(189, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYjNhZjNmYjUtZDk4OC00OGI1LTllMGYtYjgzMmRiYTVhMzFmIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU2MDQyMywiZXhwIjoxNzc4NTY0MDUzLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.ti1PrREo3ia6uGXRxtQd9wRwoPwsaLXsh0Rc0ehBegY', '8sMC5ShkPR4hVUEOhX3wceg2uzb+bgAKJEUsgQaGRqPSzJNBtOn+OIGCC8hlCEk56lrori4dldwSznozdwXRqQ==', '2026-05-12 11:34:13', '2026-05-19 04:34:13'),
(190, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiMjkyMzZjZGUtZjFhZC00ODYyLTk1MWYtYTgzYWY4NmEwN2MzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU2NDA0NiwiZXhwIjoxNzc4NTY3Njc2LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.3tAXSAmun_Uqc5CRSwwm-bFg-ACt_FwMgPiKJ9xJwJo', '+hZoQXxhZfyXD/cVJV1AOWfjBuYWsutNXPJ2NXOv3fgmM1I9bNUetDz+C+wsdtUM+hjO1Nt12Ng3FvQGnNKwOg==', '2026-05-12 12:34:36', '2026-05-19 05:34:36'),
(191, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNmVmZWFkYmMtMTZkMS00NzZkLTk3ODAtOGY2MjlkMzgzNWYwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU2NzcwMCwiZXhwIjoxNzc4NTcxMzMwLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.v7JHQjK8z-SbV03tEP3FB_NmMecrfVpHnyQdjNfFeyc', '7fv322RWTnj+sIPfkCceBdTyID0YDGzEnLxOc1FFL3qUzQ4dMhymJ4EP7zoIBc2kQ3ZkijyflTS3pdmq3D+QNA==', '2026-05-12 13:35:30', '2026-05-19 06:35:30'),
(192, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYTE3YmZjMjAtN2ZiZS00OTA0LTkwNTQtY2FhN2YyMzM3YjQ1IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU3MTQzMSwiZXhwIjoxNzc4NTc1MDYxLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.SPp-juKi-gDulMJe4H1vE7MEHDoqfLYqpZxuOLPVyTc', 'Yqb4qwoFAOdc9tKwBbq7dizlVRDhXwu9zUNmpGdbPejdA/MkXf66YXbgqIAexQ9xrmWi2oR6rXMTp0hGQHMGzQ==', '2026-05-12 14:37:41', '2026-05-19 07:37:41'),
(197, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhbi5uZ3V5ZW5AZ21haWwuY29tIiwianRpIjoiOGRjYTAwZTQtNDA1Ni00ZTA3LWIxNjUtZmI5YmFlZmYyNGFhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbImFkbWluIiwidXNlciJdLCJuYmYiOjE3Nzg1Nzc4NjQsImV4cCI6MTc3ODU4MTQ5NCwiaXNzIjoiQVBJX05EIiwiYXVkIjoiQXBwUXVhbkx5Q2hpVGlldSJ9.dBky9ZThff1ew6jOM8D3GBio_5CX8zTbem9rX5E5IGs', 'X6BTRNd6KTiiXPecR+ufjxWNKLyFIdjdBTXpcWNk3WFDt4Z8lSiMJ7tmJp3Xr+/Cxs2XQNy1ddc2NfONYG61Xg==', '2026-05-12 16:24:54', '2026-05-19 09:24:54'),
(202, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhbi5uZ3V5ZW5AZ21haWwuY29tIiwianRpIjoiNTcxYmNiZWYtMzVhMy00ZTE2LTk4ZTMtMjM3NTYzODU5MTNkIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbImFkbWluIiwidXNlciJdLCJuYmYiOjE3Nzg1ODY1MDMsImV4cCI6MTc3ODU5MDEzMywiaXNzIjoiQVBJX05EIiwiYXVkIjoiQXBwUXVhbkx5Q2hpVGlldSJ9.3NgQ5ek3a0J65g4fOCY5s8B5mF5dxZIosAlEBJ_HYBQ', 'R0Ns1lZ2hQJRsf4ToXTXRTulH+eRno80BYhw68Kjq4vxLYeEZ9IkzyGuAKD9MjkXzIvoLCzvbbj8ssf2UXojbg==', '2026-05-12 18:48:53', '2026-05-19 11:48:53'),
(205, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiYzVmMjQxN2QtNzE0MC00Yzc5LWI0MTAtNjgyYTczYTMwZGZhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU5MjU1MSwiZXhwIjoxNzc4NTk2MTgxLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.9C93zqkEkFg27kU2yBsM4EbGdkTnctYJVOEzCWxX2b0', 'gz4H6VdKEmnVSxe4uhqiwNeGRCB82QtLJ0bYRxzxF2MsbX+YC/d5ZaV9HM1mw8QnJA4u2heJOYXS9CE5DP1q3A==', '2026-05-12 20:29:41', '2026-05-19 13:29:41'),
(206, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNGU4MDdhZWItN2M0ZC00MTVjLTlhYWUtNGM4YjgwOWM1NDUzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU5NjEzNywiZXhwIjoxNzc4NTk5NzY3LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.AknnHI6vQJKNzElUQprY9D227C7ACawGe-1CdHMvndk', 'DGVEzMbAHkxQZB2ln53LL0CXwKx6lVhHbpaTigI2OIRhc+NMzXHb/PMy/r3zllmx/5oMcRxLbp41Xh64nxJTAw==', '2026-05-12 21:29:27', '2026-05-19 14:29:27'),
(207, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNzRhZDhiMjItYjllZC00MWU0LTg1NzAtZDRjODYwYTFhZDgxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODU5OTg2OCwiZXhwIjoxNzc4NjAzNDk4LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.hj5nP_ASap4lZHkJz5YQWhQvsz4sWCSrsygVkHMdb8Q', 'qDADfDjTsBo8nqxqqm0AUQWdDrcL572O76y9wYuzebp2CycwjyUL1vanFWoFV/Fc6khct19ft62x96k/vWZ7sQ==', '2026-05-12 22:31:38', '2026-05-19 15:31:38'),
(208, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiZWRlNWRjZWUtNDYzMC00OTQ5LTk0YjgtMGUxMjY4NGRhYWU5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODYwNzA2NCwiZXhwIjoxNzc4NjEwNjk0LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.zzv8ICZJRwA5qAFIcw9UCnZKAp9GsCSzyfKiEYsCf9Q', 'O/ZsymNpoKIk+YlVxiZtlGaB8nXuZUBrd7Pqmk1eG5Qq6+UPt8Nbeljsy0E25Donj+kG8L9lVxY4krXi6LvZbQ==', '2026-05-13 00:31:34', '2026-05-19 17:31:34'),
(209, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiZDA3NDhjNzEtMGUxZC00YWUxLWI0YWYtNDk4N2JmNGE5YjcwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODYxMDgxMywiZXhwIjoxNzc4NjE0NDQzLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.AS_F2gOSIKDIeQTmAgwjhpixqXTLLHTLmORXPQq5zas', 'tmZSy9eI0V5vQF3f8r42tDGGPRkqG6qZ1x1jPVKrkChi1UynEpiK6w8swy7qu72tvJeanGAwWpMRXtL8+MRizw==', '2026-05-13 01:34:03', '2026-05-19 18:34:03'),
(210, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNWYyMThmZmYtOGJmMi00MTc3LTlmNWUtMDA3MzA3YzQ2MTYyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODYxODM3NiwiZXhwIjoxNzc4NjIyMDA2LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.f28jHbGvMWfLgEOZAW4lC902CcxNr3iEXcVc-BbIDl8', 'PCYFV2joZESSUiObZxWNuB0XrcrkEVYvRPUdi6tHOAvIimLib5hnJvxyeTfdEnIV70rDohWsZ6Uxf63mVpWDCg==', '2026-05-13 03:40:06', '2026-05-19 20:40:06'),
(211, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNmY2NWRiODQtMmEzZi00MDAyLWEzMWItZjY5ZWJmNjNiODA2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODYyMjM1NywiZXhwIjoxNzc4NjI1OTg3LCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.LMtylngcLBVcvO-ckQY1va2YM-TbtNwTWiF3B3adAuk', 'rxDYHjbdTXFoPaEdQ+eRiUezxxBEro6Yx8wKqblmhzYO3Ee2eu481aZfuwJk8+PZuUn83Q2741udAMBHII13bw==', '2026-05-13 04:46:27', '2026-05-19 21:46:27'),
(212, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoibmd1eWVuYW5oMDA3OThAZ21haWwuY29tIiwianRpIjoiNDI5NTNjNzAtMDIxYy00NmRkLTgyYTMtMzkyMThhMzU1Y2Y0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIm5iZiI6MTc3ODY1NTM4MCwiZXhwIjoxNzc4NjU5MDEwLCJpc3MiOiJBUElfTkQiLCJhdWQiOiJBcHBRdWFuTHlDaGlUaWV1In0.rZf8daapZL9bxWHIv6gtV1SlXsJrW96xYEb_KR5e_dE', 'giXRkEBt1wXGrLShfv6cry1PG8Kg5qZ14S4/nVnPCzJfM3vQftw/Mu3pfnNTFspcuTqwzNG/Ivl1sXvJqqYgKA==', '2026-05-13 13:56:50', '2026-05-20 06:56:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_tonghop_thang`
--

CREATE TABLE `tbl_tonghop_thang` (
  `Id` int(11) NOT NULL,
  `NguoiDungId` int(11) NOT NULL,
  `Thang` int(11) NOT NULL,
  `Nam` int(11) NOT NULL,
  `TongThu` decimal(18,2) DEFAULT 0.00,
  `TongChi` decimal(18,2) DEFAULT 0.00,
  `TietKiem` decimal(18,2) DEFAULT 0.00,
  `NgayCapNhat` datetime DEFAULT current_timestamp(),
  `TyLeTietKiem` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_tonghop_thang`
--

INSERT INTO `tbl_tonghop_thang` (`Id`, `NguoiDungId`, `Thang`, `Nam`, `TongThu`, `TongChi`, `TietKiem`, `NgayCapNhat`, `TyLeTietKiem`) VALUES
(1, 1, 4, 2025, 15000000.00, 120000.00, 14880000.00, '2026-05-11 21:55:06', 99.2),
(2, 12, 1, 2026, 8000000.00, 320000.00, 7680000.00, '2026-05-11 21:55:06', 96),
(3, 12, 2, 2026, 8200000.00, 330000.00, 7870000.00, '2026-05-11 21:55:06', 95.9756),
(4, 12, 3, 2026, 8300000.00, 390000.00, 7910000.00, '2026-05-11 21:55:06', 95.3012),
(5, 12, 4, 2025, 20500000.00, 890000.00, 19610000.00, '2026-05-11 21:55:06', 95.6585),
(6, 12, 4, 2026, 33400000.00, 13905000.00, 19495000.00, '2026-05-11 21:55:06', 58.3683),
(7, 12, 5, 2025, 20000000.00, 9205000.00, 10795000.00, '2026-05-11 21:55:06', 53.975),
(8, 12, 5, 2026, 8315000.00, 1890222.00, 6424778.00, '2026-05-11 21:55:06', 77.2673),
(9, 12, 12, 2025, 7500000.00, 250000.00, 7250000.00, '2026-05-11 21:55:06', 96.6667),
(10, 13, 4, 2025, 16000000.00, 250000.00, 15750000.00, '2026-05-11 21:55:06', 98.4375),
(11, 14, 4, 2025, 0.00, 85000.00, -85000.00, '2026-05-11 21:55:06', 0),
(12, 15, 4, 2025, 5000000.00, 0.00, 5000000.00, '2026-05-11 21:55:06', 100),
(13, 16, 4, 2025, 0.00, 1500000.00, -1500000.00, '2026-05-11 21:55:06', 0),
(14, 17, 4, 2025, 3000000.00, 0.00, 3000000.00, '2026-05-11 21:55:06', 100),
(15, 18, 4, 2025, 0.00, 180000.00, -180000.00, '2026-05-11 21:55:06', 0),
(16, 20, 4, 2025, 0.00, 350000.00, -350000.00, '2026-05-11 21:55:06', 0),
(17, 21, 4, 2025, 0.00, 1200000.00, -1200000.00, '2026-05-11 21:55:06', 0),
(18, 22, 4, 2025, 0.00, 4500000.00, -4500000.00, '2026-05-11 21:55:06', 0),
(32, 1, 5, 2025, 0.00, 4500000.00, -4500000.00, '2026-05-13 03:56:11', 0),
(33, 2, 5, 2025, 2000000.00, 0.00, 2000000.00, '2026-05-13 03:56:16', 100),
(34, 13, 5, 2025, 0.00, 350000.00, -350000.00, '2026-05-13 03:56:21', 0),
(35, 14, 5, 2025, 3500000.00, 0.00, 3500000.00, '2026-05-13 03:56:31', 100),
(36, 16, 5, 2025, 0.00, 1200000.00, -1200000.00, '2026-05-13 03:56:42', 0),
(37, 17, 5, 2025, 625000.00, 0.00, 625000.00, '2026-05-13 03:56:47', 100),
(38, 20, 5, 2025, 0.00, 500000.00, -500000.00, '2026-05-13 03:56:56', 0),
(39, 21, 5, 2025, 0.00, 59000.00, -59000.00, '2026-05-13 03:57:01', 0),
(40, 22, 5, 2025, 0.00, 280000.00, -280000.00, '2026-05-13 03:57:05', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_tu_khoa`
--

CREATE TABLE `tbl_tu_khoa` (
  `TuKhoaId` int(11) NOT NULL,
  `NguoiDungId` int(11) DEFAULT NULL,
  `TuKhoa` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `DanhMucId` int(11) NOT NULL,
  `DoUuTien` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_tu_khoa`
--

INSERT INTO `tbl_tu_khoa` (`TuKhoaId`, `NguoiDungId`, `TuKhoa`, `DanhMucId`, `DoUuTien`) VALUES
(1, NULL, 'GRAB FOOD', 5, 3),
(2, NULL, 'BAEMIN', 5, 3),
(3, NULL, 'GRAB CAR', 6, 3),
(7, NULL, 'SHOPEE', 8, 3),
(8, NULL, 'LAZADA', 8, 3),
(9, NULL, 'TIKI', 8, 3),
(10, NULL, 'CGV', 9, 3),
(11, NULL, 'NETFLIX', 9, 3),
(12, NULL, 'HIGHLANDS', 5, 2),
(13, NULL, 'THE COFFEE HOUSE', 5, 2),
(14, NULL, 'CIRCLE K', 5, 2),
(15, NULL, 'VINMART', 5, 3),
(16, NULL, 'GOJEK', 6, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_tygia`
--

CREATE TABLE `tbl_tygia` (
  `TyGiaId` int(11) NOT NULL,
  `TuTienTe` varchar(10) NOT NULL,
  `SangTienTe` varchar(10) NOT NULL,
  `TyGia` decimal(18,6) NOT NULL,
  `NgayCapNhat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_tygia`
--

INSERT INTO `tbl_tygia` (`TyGiaId`, `TuTienTe`, `SangTienTe`, `TyGia`, `NgayCapNhat`) VALUES
(1, 'USD', 'VND', 25400.000000, '2025-04-01 00:00:00'),
(2, 'EUR', 'VND', 27500.000000, '2025-04-01 00:00:00'),
(3, 'VND', 'USD', 0.000039, '2025-04-01 00:00:00'),
(7, 'JPY', 'VND', 169.500000, '2025-04-01 00:00:00'),
(8, 'VND', 'JPY', 0.005900, '2025-04-01 00:00:00'),
(9, 'CNY', 'VND', 3500.000000, '2025-04-01 00:00:00'),
(10, 'VND', 'CNY', 0.000286, '2025-04-01 00:00:00'),
(11, 'KRW', 'VND', 18.800000, '2025-04-01 00:00:00'),
(12, 'VND', 'KRW', 0.053200, '2025-04-01 00:00:00'),
(13, 'GBP', 'VND', 32000.000000, '2025-04-01 00:00:00'),
(14, 'VND', 'GBP', 0.000031, '2025-04-01 00:00:00'),
(15, 'AUD', 'VND', 16500.000000, '2025-04-01 00:00:00'),
(16, 'VND', 'AUD', 0.000061, '2025-04-01 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_vaitro`
--

CREATE TABLE `tbl_vaitro` (
  `VaiTroId` int(11) NOT NULL,
  `TenVaiTro` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_vaitro`
--

INSERT INTO `tbl_vaitro` (`VaiTroId`, `TenVaiTro`) VALUES
(1, 'admin'),
(3, 'moderator'),
(2, 'user');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_vaitro_quyen`
--

CREATE TABLE `tbl_vaitro_quyen` (
  `Id` int(11) NOT NULL COMMENT 'ID bản ghi',
  `VaiTroId` int(11) NOT NULL COMMENT 'FK → tbl_vaitro',
  `QuyenId` int(11) NOT NULL COMMENT 'FK → tbl_quyen'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng trung gian gán quyền cho vai trò (RBAC: role → permission)';

--
-- Đang đổ dữ liệu cho bảng `tbl_vaitro_quyen`
--

INSERT INTO `tbl_vaitro_quyen` (`Id`, `VaiTroId`, `QuyenId`) VALUES
(7, 1, 1),
(1, 1, 2),
(2, 1, 3),
(3, 1, 4),
(8, 1, 5),
(10, 1, 6),
(4, 1, 7),
(6, 1, 8),
(5, 1, 9),
(9, 1, 10),
(20, 2, 6),
(16, 2, 7),
(18, 2, 8),
(17, 2, 9),
(19, 2, 10);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `tbl_ai_model`
--
ALTER TABLE `tbl_ai_model`
  ADD PRIMARY KEY (`ModelId`);

--
-- Chỉ mục cho bảng `tbl_audit_log`
--
ALTER TABLE `tbl_audit_log`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `idx_al_TenBang_BanGhiId` (`TenBang`,`BanGhiId`),
  ADD KEY `idx_al_ThoiGian` (`ThoiGian`),
  ADD KEY `idx_al_NguoiDung_ThoiGian` (`NguoiDungId`,`ThoiGian`);

--
-- Chỉ mục cho bảng `tbl_caidat`
--
ALTER TABLE `tbl_caidat`
  ADD PRIMARY KEY (`CaiDatId`),
  ADD UNIQUE KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_cauhinh_hethong`
--
ALTER TABLE `tbl_cauhinh_hethong`
  ADD PRIMARY KEY (`CauHinhId`),
  ADD UNIQUE KEY `UK_TenThamSo` (`TenThamSo`);

--
-- Chỉ mục cho bảng `tbl_chat_ai`
--
ALTER TABLE `tbl_chat_ai`
  ADD PRIMARY KEY (`ChatId`),
  ADD KEY `idx_chat_NguoiDungId` (`NguoiDungId`),
  ADD KEY `idx_chat_CuocHoiThoaiId` (`CuocHoiThoaiId`);

--
-- Chỉ mục cho bảng `tbl_chitiet_giaodich`
--
ALTER TABLE `tbl_chitiet_giaodich`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `GiaoDichId` (`GiaoDichId`),
  ADD KEY `DanhMucId` (`DanhMucId`);

--
-- Chỉ mục cho bảng `tbl_danhmuc`
--
ALTER TABLE `tbl_danhmuc`
  ADD PRIMARY KEY (`DanhMucId`),
  ADD KEY `LoaiDanhMucId` (`LoaiDanhMucId`),
  ADD KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_da_gui_thongbao`
--
ALTER TABLE `tbl_da_gui_thongbao`
  ADD PRIMARY KEY (`DaGuiId`);

--
-- Chỉ mục cho bảng `tbl_donggop_muctieu`
--
ALTER TABLE `tbl_donggop_muctieu`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `MucTieuId` (`MucTieuId`);

--
-- Chỉ mục cho bảng `tbl_dudoan`
--
ALTER TABLE `tbl_dudoan`
  ADD PRIMARY KEY (`DuDoanId`),
  ADD KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_feature_flag`
--
ALTER TABLE `tbl_feature_flag`
  ADD PRIMARY KEY (`FeatureId`),
  ADD UNIQUE KEY `UK_TenFeature` (`TenFeature`);

--
-- Chỉ mục cho bảng `tbl_giaodich`
--
ALTER TABLE `tbl_giaodich`
  ADD PRIMARY KEY (`GiaoDichId`),
  ADD KEY `TaiKhoanId` (`TaiKhoanId`),
  ADD KEY `TaiKhoanDichId` (`TaiKhoanDichId`),
  ADD KEY `DanhMucId` (`DanhMucId`),
  ADD KEY `idx_gd_NgayGiaoDich` (`NgayGiaoDich`),
  ADD KEY `idx_gd_LoaiGiaoDich` (`LoaiGiaoDich`),
  ADD KEY `idx_gd_NguoiDung_Ngay` (`NguoiDungId`,`NgayGiaoDich`),
  ADD KEY `idx_gd_TenGiaoDich` (`TenGiaoDich`);

--
-- Chỉ mục cho bảng `tbl_giaodich_dinhky`
--
ALTER TABLE `tbl_giaodich_dinhky`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `TaiKhoanId` (`TaiKhoanId`),
  ADD KEY `DanhMucId` (`DanhMucId`),
  ADD KEY `idx_dk_LanTiepTheo` (`LanTiepTheo`),
  ADD KEY `idx_dk_NguoiDung_TrangThai` (`NguoiDungId`,`TrangThai`);

--
-- Chỉ mục cho bảng `tbl_giaodich_tep`
--
ALTER TABLE `tbl_giaodich_tep`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `GiaoDichId` (`GiaoDichId`),
  ADD KEY `TepId` (`TepId`);

--
-- Chỉ mục cho bảng `tbl_goiy_ai`
--
ALTER TABLE `tbl_goiy_ai`
  ADD PRIMARY KEY (`GoiYId`),
  ADD KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_hanhvi_nguoidung`
--
ALTER TABLE `tbl_hanhvi_nguoidung`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_import_chitiet`
--
ALTER TABLE `tbl_import_chitiet`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ImportId` (`ImportId`),
  ADD KEY `DanhMucGoiY` (`DanhMucGoiY`);

--
-- Chỉ mục cho bảng `tbl_import_file`
--
ALTER TABLE `tbl_import_file`
  ADD PRIMARY KEY (`ImportId`),
  ADD KEY `NguoiDungId` (`NguoiDungId`),
  ADD KEY `TaiKhoanId` (`TaiKhoanId`);

--
-- Chỉ mục cho bảng `tbl_ketnoi_nganhang`
--
ALTER TABLE `tbl_ketnoi_nganhang`
  ADD PRIMARY KEY (`KetNoiId`),
  ADD KEY `idx_ketnoi_NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_lichsu_dangnhap`
--
ALTER TABLE `tbl_lichsu_dangnhap`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_loai_danhmuc`
--
ALTER TABLE `tbl_loai_danhmuc`
  ADD PRIMARY KEY (`LoaiDanhMucId`),
  ADD UNIQUE KEY `TenLoai` (`TenLoai`);

--
-- Chỉ mục cho bảng `tbl_loai_taikhoan`
--
ALTER TABLE `tbl_loai_taikhoan`
  ADD PRIMARY KEY (`LoaiTaiKhoanId`),
  ADD UNIQUE KEY `TenLoai` (`TenLoai`);

--
-- Chỉ mục cho bảng `tbl_muctieu`
--
ALTER TABLE `tbl_muctieu`
  ADD PRIMARY KEY (`MucTieuId`),
  ADD KEY `NguoiDungId` (`NguoiDungId`),
  ADD KEY `TaiKhoanId` (`TaiKhoanId`);

--
-- Chỉ mục cho bảng `tbl_ngansach`
--
ALTER TABLE `tbl_ngansach`
  ADD PRIMARY KEY (`NganSachId`),
  ADD KEY `DanhMucId` (`DanhMucId`),
  ADD KEY `idx_ns_Thang_Nam` (`Thang`,`Nam`),
  ADD KEY `idx_ns_NguoiDung_Thang_Nam` (`NguoiDungId`,`Thang`,`Nam`);

--
-- Chỉ mục cho bảng `tbl_nguoidung`
--
ALTER TABLE `tbl_nguoidung`
  ADD PRIMARY KEY (`NguoiDungId`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Chỉ mục cho bảng `tbl_nguoidung_social`
--
ALTER TABLE `tbl_nguoidung_social`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `uq_social_provider` (`Provider`,`ProviderId`),
  ADD KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_nguoidung_vaitro`
--
ALTER TABLE `tbl_nguoidung_vaitro`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `NguoiDungId` (`NguoiDungId`),
  ADD KEY `VaiTroId` (`VaiTroId`);

--
-- Chỉ mục cho bảng `tbl_nhacnho`
--
ALTER TABLE `tbl_nhacnho`
  ADD PRIMARY KEY (`NhacNhoId`),
  ADD KEY `idx_nn_LanNhacTiep` (`LanNhacTiep`),
  ADD KEY `idx_nn_NguoiDung_TrangThai` (`NguoiDungId`,`TrangThai`);

--
-- Chỉ mục cho bảng `tbl_ocr_ketqua`
--
ALTER TABLE `tbl_ocr_ketqua`
  ADD PRIMARY KEY (`OcrId`),
  ADD KEY `idx_ocr_TepId` (`TepId`);

--
-- Chỉ mục cho bảng `tbl_otp`
--
ALTER TABLE `tbl_otp`
  ADD PRIMARY KEY (`otp_id`);

--
-- Chỉ mục cho bảng `tbl_phanhoi`
--
ALTER TABLE `tbl_phanhoi`
  ADD PRIMARY KEY (`PhanHoiId`),
  ADD KEY `idx_phanhoi_NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_phanhoi_traloi`
--
ALTER TABLE `tbl_phanhoi_traloi`
  ADD PRIMARY KEY (`TraLoiId`),
  ADD KEY `idx_phanhoi_traloi_PhanHoiId` (`PhanHoiId`),
  ADD KEY `idx_phanhoi_traloi_NguoiGuiId` (`NguoiGuiId`);

--
-- Chỉ mục cho bảng `tbl_prompt_template`
--
ALTER TABLE `tbl_prompt_template`
  ADD PRIMARY KEY (`PromptId`);

--
-- Chỉ mục cho bảng `tbl_quyen`
--
ALTER TABLE `tbl_quyen`
  ADD PRIMARY KEY (`QuyenId`),
  ADD UNIQUE KEY `UK_TenQuyen` (`TenQuyen`);

--
-- Chỉ mục cho bảng `tbl_reset_token`
--
ALTER TABLE `tbl_reset_token`
  ADD PRIMARY KEY (`reset_token_id`);

--
-- Chỉ mục cho bảng `tbl_taikhoan`
--
ALTER TABLE `tbl_taikhoan`
  ADD PRIMARY KEY (`TaiKhoanId`),
  ADD KEY `LoaiTaiKhoanId` (`LoaiTaiKhoanId`),
  ADD KEY `FK_TaiKhoan_NguoiDung` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_tep_dinhkem`
--
ALTER TABLE `tbl_tep_dinhkem`
  ADD PRIMARY KEY (`TepId`);

--
-- Chỉ mục cho bảng `tbl_theodoi_ngansach`
--
ALTER TABLE `tbl_theodoi_ngansach`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `NganSachId` (`NganSachId`);

--
-- Chỉ mục cho bảng `tbl_thongbao`
--
ALTER TABLE `tbl_thongbao`
  ADD PRIMARY KEY (`ThongBaoId`),
  ADD KEY `idx_tb_DaDoc` (`DaDoc`),
  ADD KEY `idx_tb_NguoiDung_DaDoc` (`NguoiDungId`,`DaDoc`),
  ADD KEY `idx_tb_NgayHetHan` (`NgayHetHan`);

--
-- Chỉ mục cho bảng `tbl_thongbao_hethong`
--
ALTER TABLE `tbl_thongbao_hethong`
  ADD PRIMARY KEY (`ThongBaoHeThongId`),
  ADD KEY `idx_thongbaohethong_NguoiTao` (`NguoiTao`);

--
-- Chỉ mục cho bảng `tbl_token`
--
ALTER TABLE `tbl_token`
  ADD PRIMARY KEY (`TokenId`),
  ADD KEY `NguoiDungId` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_tonghop_thang`
--
ALTER TABLE `tbl_tonghop_thang`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `uq_tonghop` (`NguoiDungId`,`Thang`,`Nam`);

--
-- Chỉ mục cho bảng `tbl_tu_khoa`
--
ALTER TABLE `tbl_tu_khoa`
  ADD PRIMARY KEY (`TuKhoaId`),
  ADD KEY `DanhMucId` (`DanhMucId`),
  ADD KEY `FK_TuKhoa_NguoiDung` (`NguoiDungId`);

--
-- Chỉ mục cho bảng `tbl_tygia`
--
ALTER TABLE `tbl_tygia`
  ADD PRIMARY KEY (`TyGiaId`);

--
-- Chỉ mục cho bảng `tbl_vaitro`
--
ALTER TABLE `tbl_vaitro`
  ADD PRIMARY KEY (`VaiTroId`),
  ADD UNIQUE KEY `TenVaiTro` (`TenVaiTro`);

--
-- Chỉ mục cho bảng `tbl_vaitro_quyen`
--
ALTER TABLE `tbl_vaitro_quyen`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UK_VaiTro_Quyen` (`VaiTroId`,`QuyenId`),
  ADD KEY `idx_QuyenId` (`QuyenId`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `tbl_ai_model`
--
ALTER TABLE `tbl_ai_model`
  MODIFY `ModelId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID model', AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tbl_audit_log`
--
ALTER TABLE `tbl_audit_log`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10085;

--
-- AUTO_INCREMENT cho bảng `tbl_caidat`
--
ALTER TABLE `tbl_caidat`
  MODIFY `CaiDatId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `tbl_cauhinh_hethong`
--
ALTER TABLE `tbl_cauhinh_hethong`
  MODIFY `CauHinhId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tbl_chat_ai`
--
ALTER TABLE `tbl_chat_ai`
  MODIFY `ChatId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID cuộc hội thoại', AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `tbl_chitiet_giaodich`
--
ALTER TABLE `tbl_chitiet_giaodich`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6005;

--
-- AUTO_INCREMENT cho bảng `tbl_danhmuc`
--
ALTER TABLE `tbl_danhmuc`
  MODIFY `DanhMucId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3009;

--
-- AUTO_INCREMENT cho bảng `tbl_da_gui_thongbao`
--
ALTER TABLE `tbl_da_gui_thongbao`
  MODIFY `DaGuiId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tbl_donggop_muctieu`
--
ALTER TABLE `tbl_donggop_muctieu`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8007;

--
-- AUTO_INCREMENT cho bảng `tbl_dudoan`
--
ALTER TABLE `tbl_dudoan`
  MODIFY `DuDoanId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `tbl_feature_flag`
--
ALTER TABLE `tbl_feature_flag`
  MODIFY `FeatureId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID tính năng', AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `tbl_giaodich`
--
ALTER TABLE `tbl_giaodich`
  MODIFY `GiaoDichId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5045;

--
-- AUTO_INCREMENT cho bảng `tbl_giaodich_dinhky`
--
ALTER TABLE `tbl_giaodich_dinhky`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `tbl_giaodich_tep`
--
ALTER TABLE `tbl_giaodich_tep`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `tbl_goiy_ai`
--
ALTER TABLE `tbl_goiy_ai`
  MODIFY `GoiYId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `tbl_hanhvi_nguoidung`
--
ALTER TABLE `tbl_hanhvi_nguoidung`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11002;

--
-- AUTO_INCREMENT cho bảng `tbl_import_chitiet`
--
ALTER TABLE `tbl_import_chitiet`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `tbl_import_file`
--
ALTER TABLE `tbl_import_file`
  MODIFY `ImportId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `tbl_ketnoi_nganhang`
--
ALTER TABLE `tbl_ketnoi_nganhang`
  MODIFY `KetNoiId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID kết nối';

--
-- AUTO_INCREMENT cho bảng `tbl_lichsu_dangnhap`
--
ALTER TABLE `tbl_lichsu_dangnhap`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT cho bảng `tbl_loai_danhmuc`
--
ALTER TABLE `tbl_loai_danhmuc`
  MODIFY `LoaiDanhMucId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `tbl_loai_taikhoan`
--
ALTER TABLE `tbl_loai_taikhoan`
  MODIFY `LoaiTaiKhoanId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `tbl_muctieu`
--
ALTER TABLE `tbl_muctieu`
  MODIFY `MucTieuId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7003;

--
-- AUTO_INCREMENT cho bảng `tbl_ngansach`
--
ALTER TABLE `tbl_ngansach`
  MODIFY `NganSachId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6007;

--
-- AUTO_INCREMENT cho bảng `tbl_nguoidung`
--
ALTER TABLE `tbl_nguoidung`
  MODIFY `NguoiDungId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1002;

--
-- AUTO_INCREMENT cho bảng `tbl_nguoidung_social`
--
ALTER TABLE `tbl_nguoidung_social`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `tbl_nguoidung_vaitro`
--
ALTER TABLE `tbl_nguoidung_vaitro`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `tbl_nhacnho`
--
ALTER TABLE `tbl_nhacnho`
  MODIFY `NhacNhoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `tbl_ocr_ketqua`
--
ALTER TABLE `tbl_ocr_ketqua`
  MODIFY `OcrId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID kết quả OCR';

--
-- AUTO_INCREMENT cho bảng `tbl_otp`
--
ALTER TABLE `tbl_otp`
  MODIFY `otp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `tbl_phanhoi`
--
ALTER TABLE `tbl_phanhoi`
  MODIFY `PhanHoiId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID phản hồi', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `tbl_phanhoi_traloi`
--
ALTER TABLE `tbl_phanhoi_traloi`
  MODIFY `TraLoiId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID câu trả lời';

--
-- AUTO_INCREMENT cho bảng `tbl_prompt_template`
--
ALTER TABLE `tbl_prompt_template`
  MODIFY `PromptId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID prompt', AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tbl_quyen`
--
ALTER TABLE `tbl_quyen`
  MODIFY `QuyenId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID quyền', AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `tbl_reset_token`
--
ALTER TABLE `tbl_reset_token`
  MODIFY `reset_token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `tbl_taikhoan`
--
ALTER TABLE `tbl_taikhoan`
  MODIFY `TaiKhoanId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2005;

--
-- AUTO_INCREMENT cho bảng `tbl_tep_dinhkem`
--
ALTER TABLE `tbl_tep_dinhkem`
  MODIFY `TepId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `tbl_theodoi_ngansach`
--
ALTER TABLE `tbl_theodoi_ngansach`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `tbl_thongbao`
--
ALTER TABLE `tbl_thongbao`
  MODIFY `ThongBaoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9089;

--
-- AUTO_INCREMENT cho bảng `tbl_thongbao_hethong`
--
ALTER TABLE `tbl_thongbao_hethong`
  MODIFY `ThongBaoHeThongId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID thông báo hệ thống', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `tbl_token`
--
ALTER TABLE `tbl_token`
  MODIFY `TokenId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

--
-- AUTO_INCREMENT cho bảng `tbl_tonghop_thang`
--
ALTER TABLE `tbl_tonghop_thang`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `tbl_tu_khoa`
--
ALTER TABLE `tbl_tu_khoa`
  MODIFY `TuKhoaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `tbl_tygia`
--
ALTER TABLE `tbl_tygia`
  MODIFY `TyGiaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `tbl_vaitro`
--
ALTER TABLE `tbl_vaitro`
  MODIFY `VaiTroId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `tbl_vaitro_quyen`
--
ALTER TABLE `tbl_vaitro_quyen`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID bản ghi', AUTO_INCREMENT=21;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `tbl_caidat`
--
ALTER TABLE `tbl_caidat`
  ADD CONSTRAINT `tbl_caidat_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_chat_ai`
--
ALTER TABLE `tbl_chat_ai`
  ADD CONSTRAINT `fk_chat_nguoidung` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tbl_chitiet_giaodich`
--
ALTER TABLE `tbl_chitiet_giaodich`
  ADD CONSTRAINT `tbl_chitiet_giaodich_ibfk_1` FOREIGN KEY (`GiaoDichId`) REFERENCES `tbl_giaodich` (`GiaoDichId`),
  ADD CONSTRAINT `tbl_chitiet_giaodich_ibfk_2` FOREIGN KEY (`DanhMucId`) REFERENCES `tbl_danhmuc` (`DanhMucId`);

--
-- Các ràng buộc cho bảng `tbl_danhmuc`
--
ALTER TABLE `tbl_danhmuc`
  ADD CONSTRAINT `tbl_danhmuc_ibfk_1` FOREIGN KEY (`LoaiDanhMucId`) REFERENCES `tbl_loai_danhmuc` (`LoaiDanhMucId`),
  ADD CONSTRAINT `tbl_danhmuc_ibfk_2` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_donggop_muctieu`
--
ALTER TABLE `tbl_donggop_muctieu`
  ADD CONSTRAINT `tbl_donggop_muctieu_ibfk_1` FOREIGN KEY (`MucTieuId`) REFERENCES `tbl_muctieu` (`MucTieuId`);

--
-- Các ràng buộc cho bảng `tbl_dudoan`
--
ALTER TABLE `tbl_dudoan`
  ADD CONSTRAINT `tbl_dudoan_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_giaodich`
--
ALTER TABLE `tbl_giaodich`
  ADD CONSTRAINT `tbl_giaodich_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_giaodich_ibfk_2` FOREIGN KEY (`TaiKhoanId`) REFERENCES `tbl_taikhoan` (`TaiKhoanId`),
  ADD CONSTRAINT `tbl_giaodich_ibfk_3` FOREIGN KEY (`TaiKhoanDichId`) REFERENCES `tbl_taikhoan` (`TaiKhoanId`),
  ADD CONSTRAINT `tbl_giaodich_ibfk_4` FOREIGN KEY (`DanhMucId`) REFERENCES `tbl_danhmuc` (`DanhMucId`);

--
-- Các ràng buộc cho bảng `tbl_giaodich_dinhky`
--
ALTER TABLE `tbl_giaodich_dinhky`
  ADD CONSTRAINT `tbl_giaodich_dinhky_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_giaodich_dinhky_ibfk_2` FOREIGN KEY (`TaiKhoanId`) REFERENCES `tbl_taikhoan` (`TaiKhoanId`),
  ADD CONSTRAINT `tbl_giaodich_dinhky_ibfk_3` FOREIGN KEY (`DanhMucId`) REFERENCES `tbl_danhmuc` (`DanhMucId`);

--
-- Các ràng buộc cho bảng `tbl_giaodich_tep`
--
ALTER TABLE `tbl_giaodich_tep`
  ADD CONSTRAINT `tbl_giaodich_tep_ibfk_1` FOREIGN KEY (`GiaoDichId`) REFERENCES `tbl_giaodich` (`GiaoDichId`),
  ADD CONSTRAINT `tbl_giaodich_tep_ibfk_2` FOREIGN KEY (`TepId`) REFERENCES `tbl_tep_dinhkem` (`TepId`);

--
-- Các ràng buộc cho bảng `tbl_goiy_ai`
--
ALTER TABLE `tbl_goiy_ai`
  ADD CONSTRAINT `tbl_goiy_ai_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_hanhvi_nguoidung`
--
ALTER TABLE `tbl_hanhvi_nguoidung`
  ADD CONSTRAINT `tbl_hanhvi_nguoidung_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_import_chitiet`
--
ALTER TABLE `tbl_import_chitiet`
  ADD CONSTRAINT `tbl_import_chitiet_ibfk_1` FOREIGN KEY (`ImportId`) REFERENCES `tbl_import_file` (`ImportId`),
  ADD CONSTRAINT `tbl_import_chitiet_ibfk_2` FOREIGN KEY (`DanhMucGoiY`) REFERENCES `tbl_danhmuc` (`DanhMucId`);

--
-- Các ràng buộc cho bảng `tbl_import_file`
--
ALTER TABLE `tbl_import_file`
  ADD CONSTRAINT `tbl_import_file_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_import_file_ibfk_2` FOREIGN KEY (`TaiKhoanId`) REFERENCES `tbl_taikhoan` (`TaiKhoanId`);

--
-- Các ràng buộc cho bảng `tbl_ketnoi_nganhang`
--
ALTER TABLE `tbl_ketnoi_nganhang`
  ADD CONSTRAINT `fk_ketnoi_nguoidung` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tbl_lichsu_dangnhap`
--
ALTER TABLE `tbl_lichsu_dangnhap`
  ADD CONSTRAINT `tbl_lichsu_dangnhap_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_muctieu`
--
ALTER TABLE `tbl_muctieu`
  ADD CONSTRAINT `tbl_muctieu_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_muctieu_ibfk_2` FOREIGN KEY (`TaiKhoanId`) REFERENCES `tbl_taikhoan` (`TaiKhoanId`);

--
-- Các ràng buộc cho bảng `tbl_ngansach`
--
ALTER TABLE `tbl_ngansach`
  ADD CONSTRAINT `FK_NganSach_NguoiDung` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_ngansach_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_ngansach_ibfk_2` FOREIGN KEY (`DanhMucId`) REFERENCES `tbl_danhmuc` (`DanhMucId`);

--
-- Các ràng buộc cho bảng `tbl_nguoidung_social`
--
ALTER TABLE `tbl_nguoidung_social`
  ADD CONSTRAINT `tbl_nguoidung_social_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_nguoidung_vaitro`
--
ALTER TABLE `tbl_nguoidung_vaitro`
  ADD CONSTRAINT `tbl_nguoidung_vaitro_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_nguoidung_vaitro_ibfk_2` FOREIGN KEY (`VaiTroId`) REFERENCES `tbl_vaitro` (`VaiTroId`);

--
-- Các ràng buộc cho bảng `tbl_nhacnho`
--
ALTER TABLE `tbl_nhacnho`
  ADD CONSTRAINT `tbl_nhacnho_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_ocr_ketqua`
--
ALTER TABLE `tbl_ocr_ketqua`
  ADD CONSTRAINT `fk_ocr_tep` FOREIGN KEY (`TepId`) REFERENCES `tbl_tep_dinhkem` (`TepId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tbl_phanhoi`
--
ALTER TABLE `tbl_phanhoi`
  ADD CONSTRAINT `fk_phanhoi_nguoidung` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tbl_phanhoi_traloi`
--
ALTER TABLE `tbl_phanhoi_traloi`
  ADD CONSTRAINT `fk_phanhoi_traloi_nguoidung` FOREIGN KEY (`NguoiGuiId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_phanhoi_traloi_phanhoi` FOREIGN KEY (`PhanHoiId`) REFERENCES `tbl_phanhoi` (`PhanHoiId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tbl_taikhoan`
--
ALTER TABLE `tbl_taikhoan`
  ADD CONSTRAINT `FK_TaiKhoan_NguoiDung` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_taikhoan_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_taikhoan_ibfk_2` FOREIGN KEY (`LoaiTaiKhoanId`) REFERENCES `tbl_loai_taikhoan` (`LoaiTaiKhoanId`);

--
-- Các ràng buộc cho bảng `tbl_theodoi_ngansach`
--
ALTER TABLE `tbl_theodoi_ngansach`
  ADD CONSTRAINT `tbl_theodoi_ngansach_ibfk_1` FOREIGN KEY (`NganSachId`) REFERENCES `tbl_ngansach` (`NganSachId`);

--
-- Các ràng buộc cho bảng `tbl_thongbao`
--
ALTER TABLE `tbl_thongbao`
  ADD CONSTRAINT `tbl_thongbao_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_thongbao_hethong`
--
ALTER TABLE `tbl_thongbao_hethong`
  ADD CONSTRAINT `fk_thongbaohethong_nguoidung` FOREIGN KEY (`NguoiTao`) REFERENCES `tbl_nguoidung` (`NguoiDungId`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `tbl_token`
--
ALTER TABLE `tbl_token`
  ADD CONSTRAINT `tbl_token_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_tonghop_thang`
--
ALTER TABLE `tbl_tonghop_thang`
  ADD CONSTRAINT `tbl_tonghop_thang_ibfk_1` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`);

--
-- Các ràng buộc cho bảng `tbl_tu_khoa`
--
ALTER TABLE `tbl_tu_khoa`
  ADD CONSTRAINT `FK_TuKhoa_NguoiDung` FOREIGN KEY (`NguoiDungId`) REFERENCES `tbl_nguoidung` (`NguoiDungId`),
  ADD CONSTRAINT `tbl_tu_khoa_ibfk_1` FOREIGN KEY (`DanhMucId`) REFERENCES `tbl_danhmuc` (`DanhMucId`);

--
-- Các ràng buộc cho bảng `tbl_vaitro_quyen`
--
ALTER TABLE `tbl_vaitro_quyen`
  ADD CONSTRAINT `fk_vaitroquyen_quyen` FOREIGN KEY (`QuyenId`) REFERENCES `tbl_quyen` (`QuyenId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vaitroquyen_vaitro` FOREIGN KEY (`VaiTroId`) REFERENCES `tbl_vaitro` (`VaiTroId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
