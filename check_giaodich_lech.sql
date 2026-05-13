-- =============================================================================
-- Script kiểm tra sự lệch giữa TongChi và dữ liệu chi tiêu theo danh mục
-- =============================================================================

-- 1. SO SÁNH TỔNG CHI THEO THÁNG: tbl_tonghop_thang vs tbl_giaodich
-- -------------------------------------------------------------------
-- TongChi trong tbl_tonghop_thang nên bằng tổng SoTien các giao dịch LoaiGiaoDich=2

SELECT 
    th.NguoiDungId,
    th.Thang,
    th.Nam,
    th.TongChi AS TongChi_TongHop,
    COALESCE(SUM(gd.SoTien), 0) AS TongChi_TuGiaoDich,
    th.TongChi - COALESCE(SUM(gd.SoTien), 0) AS ChenhLech
FROM tbl_tonghop_thang th
LEFT JOIN tbl_giaodich gd 
    ON th.NguoiDungId = gd.NguoiDungId 
    AND MONTH(gd.NgayGiaoDich) = th.Thang 
    AND YEAR(gd.NgayGiaoDich) = th.Nam
    AND gd.LoaiGiaoDich = 2  -- Chi tiêu
GROUP BY th.NguoiDungId, th.Thang, th.Nam, th.TongChi
HAVING th.TongChi - COALESCE(SUM(gd.SoTien), 0) <> 0
ORDER BY ABS(th.TongChi - COALESCE(SUM(gd.SoTien), 0)) DESC;


-- 2. TÌM CÁC GIAO DỊCH CHI (LoaiGiaoDich=2) KHÔNG CÓ DANH MỤC HOẶC DANH MỤC SAI LOẠI
-- -------------------------------------------------------------------
-- Giao dịch chi phải có DanhMucId thuộc loại "Chi tiêu"

SELECT 
    gd.GiaoDichId,
    gd.NguoiDungId,
    gd.NgayGiaoDich,
    gd.SoTien,
    gd.LoaiGiaoDich,
    gd.DanhMucId,
    dm.TenDanhMuc,
    dm.LoaiDanhMucId,
    ldm.TenLoai AS LoaiDanhMuc
FROM tbl_giaodich gd
LEFT JOIN tbl_danhmuc dm ON gd.DanhMucId = dm.DanhMucId
LEFT JOIN tbl_loai_danhmuc ldm ON dm.LoaiDanhMucId = ldm.LoaiDanhMucId
WHERE gd.LoaiGiaoDich = 2  -- Loại Chi
  AND (gd.DanhMucId IS NULL  -- Không có danh mục
       OR ldm.TenLoai = 'Thu nhập')  -- Hoặc danh mục thuộc loại "Thu nhập" (SAI!)
ORDER BY gd.NgayGiaoDich DESC;


-- 3. TÌM GIAO DỊCH CHI CÓ TỔNG CHI TIẾT SPLIT KHÔNG KHỚP VỚI SoTien GỐC
-- -------------------------------------------------------------------
-- Kiểm tra các giao dịch có split nhưng tổng split không bằng SoTien

SELECT 
    gd.GiaoDichId,
    gd.NguoiDungId,
    gd.NgayGiaoDich,
    gd.SoTien AS SoTienGoc,
    COALESCE(SUM(ctgd.SoTien), 0) AS TongChiTiet,
    gd.SoTien - COALESCE(SUM(ctgd.SoTien), 0) AS ChenhLechSplit
FROM tbl_giaodich gd
LEFT JOIN tbl_chitiet_giaodich ctgd ON gd.GiaoDichId = ctgd.GiaoDichId
WHERE gd.LoaiGiaoDich = 2
GROUP BY gd.GiaoDichId, gd.NguoiDungId, gd.NgayGiaoDich, gd.SoTien
HAVING gd.SoTien <> COALESCE(SUM(ctgd.SoTien), 0)
ORDER BY ABS(gd.SoTien - COALESCE(SUM(ctgd.SoTien), 0)) DESC;


-- 4. SO SÁNH CHI THEO TỪNG DANH MỤC
-- -------------------------------------------------------------------
-- Trả về chi tiết từng danh mục để đối chiếu với biểu đồ

SELECT 
    th.NguoiDungId,
    th.Thang,
    th.Nam,
    dm.DanhMucId,
    dm.TenDanhMuc,
    COALESCE(SUM(gd.SoTien), 0) AS TongChi_TheoDanhMuc
FROM tbl_tonghop_thang th
CROSS JOIN tbl_danhmuc dm
LEFT JOIN tbl_loai_danhmuc ldm ON dm.LoaiDanhMucId = ldm.LoaiDanhMucId
LEFT JOIN tbl_giaodich gd 
    ON dm.DanhMucId = gd.DanhMucId
    AND th.NguoiDungId = gd.NguoiDungId
    AND MONTH(gd.NgayGiaoDich) = th.Thang
    AND YEAR(gd.NgayGiaoDich) = th.Nam
    AND gd.LoaiGiaoDich = 2
WHERE ldm.TenLoai = 'Chi tiêu'
GROUP BY th.NguoiDungId, th.Thang, th.Nam, dm.DanhMucId, dm.TenDanhMuc
HAVING COALESCE(SUM(gd.SoTien), 0) > 0
ORDER BY th.NguoiDungId, th.Thang, th.Nam, TongChi_TheoDanhMuc DESC;


-- 5. LIỆT KÊ TẤT CẢ GIAO DỊCH CHI TRONG THÁNG ĐỂ ĐỐI CHIẾU (thay đổi @Thang, @Nam, @NguoiDungId)
-- -------------------------------------------------------------------

SET @Thang = 5;
SET @Nam = 2026;
SET @NguoiDungId = 1;

SELECT 
    gd.GiaoDichId,
    gd.NgayGiaoDich,
    gd.SoTien,
    dm.TenDanhMuc,
    ldm.TenLoai AS LoaiDanhMuc,
    gd.MoTa,
    CASE 
        WHEN gd.DanhMucId IS NULL THEN '⚠️ KHÔNG CÓ DANH MỤC'
        WHEN ldm.TenLoai = 'Thu nhập' THEN '⚠️ SAI LOẠI DANH MỤC'
        ELSE '✅ OK'
    END AS TrangThai
FROM tbl_giaodich gd
LEFT JOIN tbl_danhmuc dm ON gd.DanhMucId = dm.DanhMucId
LEFT JOIN tbl_loai_danhmuc ldm ON dm.LoaiDanhMucId = ldm.LoaiDanhMucId
WHERE gd.NguoiDungId = @NguoiDungId
  AND MONTH(gd.NgayGiaoDich) = @Thang
  AND YEAR(gd.NgayGiaoDich) = @Nam
  AND gd.LoaiGiaoDich = 2
ORDER BY gd.NgayGiaoDich DESC;


-- 6. THỐNG KÊ TỔNG QUAN ĐỂ DEBUG
-- -------------------------------------------------------------------

-- Tổng chi từ giao dịch
SELECT 
    NguoiDungId,
    MONTH(NgayGiaoDich) AS Thang,
    YEAR(NgayGiaoDich) AS Nam,
    COUNT(*) AS SoGiaoDich,
    SUM(SoTien) AS TongChi
FROM tbl_giaodich
WHERE LoaiGiaoDich = 2
GROUP BY NguoiDungId, MONTH(NgayGiaoDich), YEAR(NgayGiaoDich)
ORDER BY Nam DESC, Thang DESC;

-- Tổng chi từ bảng tổng hợp
SELECT 
    NguoiDungId,
    Thang,
    Nam,
    TongChi
FROM tbl_tonghop_thang
ORDER BY Nam DESC, Thang DESC;

-- So sánh 2 bảng
SELECT 
    gd.NguoiDungId,
    gd.Thang,
    gd.Nam,
    gd.TongChi AS TongChi_TuGiaoDich,
    th.TongChi AS TongChi_TuTongHop,
    gd.TongChi - th.TongChi AS ChenhLech
FROM (
    SELECT NguoiDungId, MONTH(NgayGiaoDich) AS Thang, YEAR(NgayGiaoDich) AS Nam, SUM(SoTien) AS TongChi
    FROM tbl_giaodich
    WHERE LoaiGiaoDich = 2
    GROUP BY NguoiDungId, MONTH(NgayGiaoDich), YEAR(NgayGiaoDich)
) gd
LEFT JOIN tbl_tonghop_thang th 
    ON gd.NguoiDungId = th.NguoiDungId 
    AND gd.Thang = th.Thang 
    AND gd.Nam = th.Nam
ORDER BY ABS(gd.TongChi - th.TongChi) DESC;
