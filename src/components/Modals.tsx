import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCw,
  Plus,
  Settings,
  Infinity,
  Users,
  Laptop,
  Activity,
  KeyRound,
  Clock,
  User,
  CreditCard,
  X,
  Check,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import type { License } from '../types/license';

export function generateRandomKeyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) p1 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  return `REW-VIP-${p1}-${p2}`;
}

const UNLIMITED = 999999;

interface LimitRowProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
  min?: number;
  defaultValue?: number;
}

const LimitRow: React.FC<LimitRowProps> = ({
  icon,
  label,
  sublabel,
  value,
  unit,
  onChange,
  min = 1,
  defaultValue = 10,
}) => {
  const isUnlimited = value >= UNLIMITED;

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isUnlimited
          ? 'bg-emerald-950/25 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
          : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700/80'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isUnlimited
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700/50'
            }`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{label}</span>
              {isUnlimited && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  VÔ HẠN
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{sublabel}</div>
          </div>
        </div>

        {/* Right: Input & Unlimited Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            {isUnlimited ? (
              <div className="w-24 px-2.5 py-1.5 text-xs font-bold text-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg select-none flex items-center justify-center gap-1">
                <Infinity className="w-3.5 h-3.5" /> Vô hạn
              </div>
            ) : (
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                <input
                  type="number"
                  min={min}
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
                  className="w-16 px-2.5 py-1.5 text-xs text-center font-bold text-white bg-transparent focus:outline-none"
                />
                <span className="pr-2 text-[10px] text-slate-400 font-medium select-none">
                  {unit}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onChange(isUnlimited ? defaultValue : UNLIMITED)}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
              isUnlimited
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm shadow-emerald-500/30 font-bold hover:bg-emerald-400'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-white hover:bg-slate-700'
            }`}
            title={isUnlimited ? 'Nhấn để đặt lại giới hạn số lượng' : 'Nhấn để cấp quyền không giới hạn'}
          >
            <Infinity className="w-3.5 h-3.5" />
            <span>{isUnlimited ? 'Đang vô hạn' : 'Vô hạn'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    key_code: string;
    customer_name: string;
    customer_note: string;
    max_profiles: number;
    total_runs: number;
    duration_days: number;
    max_activations: number;
  }) => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({ open, onClose, onSubmit }) => {
  const [keyCode, setKeyCode] = useState(generateRandomKeyCode());
  const [customerName, setCustomerName] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [maxProfiles, setMaxProfiles] = useState(5);
  const [totalRuns, setTotalRuns] = useState(150);
  const [durationDays, setDurationDays] = useState(30);
  const [maxActivations, setMaxActivations] = useState(1);

  useEffect(() => {
    if (open) {
      setKeyCode(generateRandomKeyCode());
      setCustomerName('');
      setCustomerNote('');
      setMaxProfiles(5);
      setTotalRuns(150);
      setDurationDays(30);
      setMaxActivations(1);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800/90 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-emerald-950/30 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Tạo Bản Quyền Mới</h3>
              <p className="text-[11px] text-slate-400">Cấp mã kích hoạt và cấu hình hạn mức cho khách hàng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              key_code: keyCode,
              customer_name: customerName,
              customer_note: customerNote,
              max_profiles: maxProfiles,
              total_runs: totalRuns,
              duration_days: durationDays,
              max_activations: maxActivations,
            });
          }}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Thông tin khách hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tên Khách hàng / Nick <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="VD: A. Tuấn Zalo"
                  className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ghi chú / Kênh bán
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="VD: 200k - VietQR"
                  className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Cấu hình hạn mức (Quotas) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cấu hình giới hạn sử dụng
              </span>
              <span className="text-[10px] text-slate-400">Nhập số hoặc chọn Vô hạn</span>
            </div>

            <div className="space-y-2">
              <LimitRow
                icon={<Users className="w-4 h-4" />}
                label="Số Profile tối đa"
                sublabel="Số lượng Profile tool được phép quản lý và chạy"
                value={maxProfiles}
                unit="profile"
                onChange={setMaxProfiles}
                min={1}
                defaultValue={5}
              />

              <LimitRow
                icon={<Laptop className="w-4 h-4" />}
                label="Số thiết bị kích hoạt"
                sublabel="Redeem Limit - Số máy tính tối đa được kích hoạt key"
                value={maxActivations}
                unit="máy"
                onChange={setMaxActivations}
                min={1}
                defaultValue={1}
              />

              <LimitRow
                icon={<Activity className="w-4 h-4" />}
                label="Tổng số lượt chạy (Runs)"
                sublabel="Số lượt bấm chạy tool (khấu trừ mỗi lần thực thi)"
                value={totalRuns}
                unit="runs"
                onChange={setTotalRuns}
                min={1}
                defaultValue={150}
              />
            </div>
          </div>

          {/* Thời hạn bản quyền */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Thời hạn hiệu lực (tính từ ngày kích hoạt)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                className="w-full pl-8.5 pr-8 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none transition-all"
              >
                <option value={7}>7 Ngày (Dùng thử / Gói tuần)</option>
                <option value={14}>14 Ngày (2 Tuần)</option>
                <option value={30}>30 Ngày (1 Tháng - Mặc định)</option>
                <option value={60}>60 Ngày (2 Tháng)</option>
                <option value={90}>90 Ngày (3 Tháng / Gói Quý)</option>
                <option value={180}>180 Ngày (6 Tháng / Nửa Năm)</option>
                <option value={365}>365 Ngày (1 Năm)</option>
                <option value={3650}>Vĩnh viễn (Trọn đời 10 Năm)</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Mã Key Code Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/25 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Mã Bản Quyền (License Key)
              </label>
              <button
                type="button"
                onClick={() => setKeyCode(generateRandomKeyCode())}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCw className="w-3 h-3" /> Đổi mã ngẫu nhiên
              </button>
            </div>
            <input
              type="text"
              required
              value={keyCode}
              onChange={(e) => setKeyCode(e.target.value.toUpperCase())}
              className="w-full font-mono uppercase px-3 py-2 text-sm rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold tracking-wider focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 selection:bg-emerald-500 selection:text-slate-950"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Tạo Key Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ExtendModalProps {
  license: License | null;
  onClose: () => void;
  onSubmit: (license: License, extraRuns: number, extraDays: number) => void;
}

export const ExtendModal: React.FC<ExtendModalProps> = ({ license, onClose, onSubmit }) => {
  const [extraRuns, setExtraRuns] = useState(50);
  const [extraDays, setExtraDays] = useState(30);

  if (!license) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl shadow-emerald-950/30 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            Gia Hạn &amp; Thêm Lượt Chạy
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(license, extraRuns, extraDays);
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cộng thêm lượt Runs:</label>
            <input
              type="number"
              min={0}
              value={extraRuns}
              onChange={(e) => setExtraRuns(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">* Nhập 0 nếu không muốn cộng thêm runs.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cộng thêm số ngày hết hạn:</label>
            <input
              type="number"
              min={0}
              value={extraDays}
              onChange={(e) => setExtraDays(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">* Số ngày sẽ được cộng dồn vào hạn dùng hiện tại.</p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer"
            >
              Lưu Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  open: boolean;
  initialUrl: string;
  initialKey: string;
  onClose: () => void;
  onSave: (url: string, key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, initialUrl, initialKey, onClose, onSave }) => {
  const [url, setUrl] = useState(initialUrl);
  const [key, setKey] = useState(initialKey);

  useEffect(() => {
    setUrl(initialUrl);
    setKey(initialKey);
  }, [initialUrl, initialKey, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-emerald-950/30 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings className="w-4 h-4" />
            </div>
            Cài Đặt Kết Nối Supabase
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(url, key);
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supabase Project URL:</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Supabase Secret Key / Service Key:
            </label>
            <input
              type="password"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sb_secret_... hoặc service_role key"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              * Lấy trong Supabase: <strong>Project Settings &rarr; API Keys &rarr; Secret keys</strong> (bắt đầu bằng <code>sb_secret_...</code>).
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer"
            >
              Lưu Cài Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
