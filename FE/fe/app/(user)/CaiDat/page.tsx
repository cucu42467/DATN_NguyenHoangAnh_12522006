"use client";

import Link from 'next/link';
import { ArrowLeft, Settings, ShieldCheck, Bell, CreditCard, Mail, Smartphone, AlertTriangle, Percent } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserSession } from '@/hooks/useUserSession';
import { useState, useEffect } from 'react';
import { layCaiDat, capNhatCaiDat, ThongBaoSettings, MAC_DINH_THONG_BAO, parseThongBaoSettings, serializeThongBaoSettings, CaiDatDto } from '@/services/caidat';

/* ========== SWITCH COMPONENT ========== */
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button 
    className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 data-[state=checked]:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    data-state={checked ? 'checked' : 'unchecked'}
    onClick={() => onCheckedChange(!checked)}
  >
    <span className="sr-only">Toggle</span>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${checked ? 'translate-x-6' : ''}`} />
  </button>
);

/* ========== SECTION COMPONENTS ========== */
function KenhNhanThongBao({ settings, onChange }: { settings: ThongBaoSettings; onChange: (s: ThongBaoSettings) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
        <Smartphone className="h-4 w-4" /> Kênh nhận thông báo
      </h3>
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">Thông báo trong app</span>
          </div>
          <Switch checked={settings.nhanQuaApp} onCheckedChange={(v) => onChange({ ...settings, nhanQuaApp: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">Nhận qua Email</span>
          </div>
          <Switch checked={settings.nhanQuaEmail} onCheckedChange={(v) => onChange({ ...settings, nhanQuaEmail: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">Push Notification (Mobile)</span>
          </div>
          <Switch checked={settings.nhanQuaPush} onCheckedChange={(v) => onChange({ ...settings, nhanQuaPush: v })} />
        </div>
      </div>
    </div>
  );
}

function LoaiThongBao({ settings, onChange }: { settings: ThongBaoSettings; onChange: (s: ThongBaoSettings) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" /> Loại thông báo
      </h3>
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Cảnh báo vượt ngân sách</span>
            <p className="text-xs text-zinc-500">Khi chi tiêu vượt mức đã đặt</p>
          </div>
          <Switch checked={settings.thongBaoVuotNganSach} onCheckedChange={(v) => onChange({ ...settings, thongBaoVuotNganSach: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Cảnh báo số dư thấp</span>
            <p className="text-xs text-zinc-500">Khi số dư tài khoản quá thấp</p>
          </div>
          <Switch checked={settings.thongBaoSoDuThap} onCheckedChange={(v) => onChange({ ...settings, thongBaoSoDuThap: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Thông báo giao dịch</span>
            <p className="text-xs text-zinc-500">Mỗi khi có giao dịch mới</p>
          </div>
          <Switch checked={settings.thongBaoGiaoDich} onCheckedChange={(v) => onChange({ ...settings, thongBaoGiaoDich: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Nhắc nhở lịch</span>
            <p className="text-xs text-zinc-500">Nhắc nhở các sự kiện đã đặt</p>
          </div>
          <Switch checked={settings.thongBaoNhacNho} onCheckedChange={(v) => onChange({ ...settings, thongBaoNhacNho: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Mục tiêu tiết kiệm</span>
            <p className="text-xs text-zinc-500">Cập nhật tiến độ mục tiêu</p>
          </div>
          <Switch checked={settings.thongBaoMucTieu} onCheckedChange={(v) => onChange({ ...settings, thongBaoMucTieu: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Gợi ý từ AI</span>
            <p className="text-xs text-zinc-500">Lời khuyên tài chính cá nhân</p>
          </div>
          <Switch checked={settings.thongBaoAi} onCheckedChange={(v) => onChange({ ...settings, thongBaoAi: v })} />
        </div>
      </div>
    </div>
  );
}

function CaiDatNangCao({ settings, onChange }: { settings: ThongBaoSettings; onChange: (s: ThongBaoSettings) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
        <Percent className="h-4 w-4" /> Cài đặt nâng cao
      </h3>
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Chỉ cảnh báo quan trọng</span>
            <p className="text-xs text-zinc-500">Giảm số lượng thông báo</p>
          </div>
          <Switch checked={settings.chiCanhBaoQuanTrong} onCheckedChange={(v) => onChange({ ...settings, chiCanhBaoQuanTrong: v })} />
        </div>
        
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <label className="text-sm mb-2 block">
            Ngưỡng cảnh báo vượt ngân sách: <strong>{settings.nguongVuotNganSach}%</strong>
          </label>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={settings.nguongVuotNganSach}
            onChange={(e) => onChange({ ...settings, nguongVuotNganSach: Number(e.target.value) })}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <label className="text-sm mb-2 block">
            Số dư tối thiểu cảnh báo: <strong>{settings.nguongSoDuThap.toLocaleString('vi-VN')}đ</strong>
          </label>
          <input
            type="range"
            min="100000"
            max="10000000"
            step="100000"
            value={settings.nguongSoDuThap}
            onChange={(e) => onChange({ ...settings, nguongSoDuThap: Number(e.target.value) })}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>100K</span>
            <span>10M</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== MAIN COMPONENT ========== */
export default function CaiDatPage() {
  const { user } = useUserSession();
  const [darkMode, setDarkMode] = useState(false);
  const [settings, setSettings] = useState<ThongBaoSettings>(MAC_DINH_THONG_BAO);
  const [caiDat, setCaiDat] = useState<CaiDatDto | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Đọc từ API khi load
  useEffect(() => {
    const fetchCaiDat = async () => {
      try {
        const data = await layCaiDat();
        if (data) {
          setCaiDat(data);
          setSettings(parseThongBaoSettings(data));
          setDarkMode(data.cheDoToi);
        }
      } catch (error) {
        console.error('Lỗi khi lấy cài đặt:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaiDat();
  }, []);

  // Lưu lên server
  const luuSettings = async () => {
    try {
      await capNhatCaiDat({
        cheDoToi: darkMode,
        nhanThongBao: true,
        thongBaoJson: serializeThongBaoSettings(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt:', error);
      alert('Lưu thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="fe-page-shell fe-page-shell-narrow flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="fe-page-shell fe-page-shell-narrow space-y-8">
        <Link href="/TrangChu" className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
          <ArrowLeft className="h-5 w-5" />
          Quay lại Trang chủ
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
          <div className="text-center space-y-4 border-b border-zinc-200 dark:border-zinc-700 pb-8">
            <Settings className="h-16 w-16 mx-auto text-zinc-500" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white">
              Cài đặt tài khoản
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Tùy chỉnh trải nghiệm của bạn
            </p>
          </div>

          <div className="space-y-6">
            {/* Tài khoản */}
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                Tài khoản: {user?.hoTen || 'User'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-1">Email</p>
                  <p className="font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-xl">
                    {user?.email || 'Chưa cập nhật'}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-1">Vai trò</p>
                  <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-xl font-semibold">
                    {user?.vaiTro?.[0] || 'User'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cài đặt thông báo */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-emerald-600" />
                Cài đặt thông báo
              </h2>
              
              {/* Desktop */}
              <div className="hidden md:block space-y-4">
                <KenhNhanThongBao settings={settings} onChange={setSettings} />
                <LoaiThongBao settings={settings} onChange={setSettings} />
                <CaiDatNangCao settings={settings} onChange={setSettings} />
              </div>
              
              {/* Mobile accordion */}
              <div className="md:hidden space-y-2">
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="w-full flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800"
                >
                  <span className="font-semibold">Mở rộng cài đặt thông báo</span>
                  <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {expanded && (
                  <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <KenhNhanThongBao settings={settings} onChange={setSettings} />
                    <LoaiThongBao settings={settings} onChange={setSettings} />
                    <CaiDatNangCao settings={settings} onChange={setSettings} />
                  </div>
                )}
              </div>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <h4 className="font-semibold">Chế độ tối</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Giao diện tối tự động</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
              <Link href="/TaiKhoan">
                <Button variant="secondary" size="lg" className="w-full">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Quản lý Tài khoản
                </Button>
              </Link>
              <Button 
                variant="success" 
                size="lg" 
                className="w-full"
                onClick={luuSettings}
              >
                {saved ? '✓ Đã lưu!' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
}
