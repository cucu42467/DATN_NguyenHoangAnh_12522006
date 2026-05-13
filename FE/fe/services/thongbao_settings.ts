/**
 * Service quản lý cài đặt thông báo (lưu localStorage - không cần sửa CSDL)
 */
import { ThongBaoSettings, MAC_DINH } from '@/app/(user)/CaiDat/page';

const KEY = 'thongBaoSettings';

/* ========== LẤY CÀI ĐẶT ========== */
/** Đọc cài đặt từ localStorage */
export function layThongBaoSettings(): ThongBaoSettings {
  if (typeof window === 'undefined') return MAC_DINH;
  
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      return { ...MAC_DINH, ...JSON.parse(stored) };
    }
  } catch { /* ignore */ }
  return MAC_DINH;
}

/** Lưu cài đặt vào localStorage */
export function luuThongBaoSettings(settings: Partial<ThongBaoSettings>): void {
  if (typeof window === 'undefined') return;
  
  const hienTai = layThongBaoSettings();
  localStorage.setItem(KEY, JSON.stringify({ ...hienTai, ...settings }));
}

/* ========== KIỂM TRA ĐIỀU KIỆN ========== */
/** Kiểm tra xem có nên gửi thông báo không */
export function nenGuiThongBao(loai: 'vuotNganSach' | 'soDuThap' | 'giaoDich' | 'nhacNho' | 'mucTieu' | 'ai'): boolean {
  const settings = layThongBaoSettings();
  
  // Kiểm tra kênh nhận
  const coKenhNhan = settings.nhanQuaApp || settings.nhanQuaEmail || settings.nhanQuaPush;
  if (!coKenhNhan) return false;
  
  // Kiểm tra loại thông báo cụ thể
  switch (loai) {
    case 'vuotNganSach': return settings.thongBaoVuotNganSach;
    case 'soDuThap': return settings.thongBaoSoDuThap;
    case 'giaoDich': return settings.thongBaoGiaoDich;
    case 'nhacNho': return settings.thongBaoNhacNho;
    case 'mucTieu': return settings.thongBaoMucTieu;
    case 'ai': return settings.thongBaoAi;
    default: return true;
  }
}

/** Kiểm tra ngưỡng vượt ngân sách */
export function kiemTraNguongVuotNganSach(phanTramDaDung: number): boolean {
  const settings = layThongBaoSettings();
  return phanTramDaDung >= settings.nguongVuotNganSach;
}

/** Kiểm tra ngưỡng số dư thấp */
export function kiemTraNguongSoDuThap(soDuHienTai: number): boolean {
  const settings = layThongBaoSettings();
  return soDuHienTai <= settings.nguongSoDuThap;
}

/** Kiểm tra có phải cảnh báo quan trọng không (để lọc nếu bật chế độ chỉ cảnh báo quan trọng) */
export function laCanhBaoQuanTrong(phanTramVuot: number): boolean {
  const settings = layThongBaoSettings();
  if (!settings.chiCanhBaoQuanTrong) return true;
  return phanTramVuot >= 100; // >100% mới là quan trọng
}

/* ========== HỖ TRỢ EMAIL ========== */
/** Lấy email người dùng để gửi notification */
export async function layEmailNguoiDung(): Promise<string | null> {
  // Ưu tiên từ session
  try {
    const res = await fetch('/api/nguoidung/me');
    if (res.ok) {
      const data = await res.json();
      return data.email || null;
    }
  } catch { /* ignore */ }
  
  // Fallback: từ localStorage
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.email || null;
    } catch { /* ignore */ }
  }
  return null;
}

/** Tạo nội dung email thông báo */
export function taoNoiDungEmail(
  tieuDe: string,
  noiDung: string,
  loai: string
): { subject: string; html: string } {
  const icons: Record<string, string> = {
    vuotNganSach: '⚠️',
    soDuThap: '💸',
    giaoDich: '💳',
    nhacNho: '⏰',
    mucTieu: '🎯',
    ai: '🤖',
  };
  
  const icon = icons[loai] || '📢';
  
  return {
    subject: `${icon} ${tieuDe}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Quản Lý Chi Tiêu</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">${tieuDe}</h2>
          <p style="color: #666; font-size: 16px;">${noiDung}</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Email này được gửi tự động từ ứng dụng Quản Lý Chi Tiêu.<br>
            Để thay đổi cài đặt thông báo, vui lòng truy cập ứng dụng.
          </p>
        </div>
      </div>
    `,
  };
}
