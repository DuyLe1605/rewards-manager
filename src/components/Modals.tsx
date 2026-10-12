import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCw, Check, Plus, Settings } from 'lucide-react';
import type { License } from '../types/license';

export function generateRandomKeyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) p1 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  return `REW-VIP-${p1}-${p2}`;
}

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Tạo Bản Quyền Mới
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
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
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên Khách hàng / Nick Zalo / Telegram:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="VD: A. Tuấn Zalo"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ghi chú (Giá tiền / Kênh bán):</label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="VD: 200k - Chuyển khoản VietQR"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Số Profile tối đa:</label>
              <input
                type="number"
                min={1}
                value={maxProfiles}
                onChange={(e) => setMaxProfiles(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Số thiết bị cho phép (Redeem Limit):</label>
              <input
                type="number"
                min={1}
                value={maxActivations}
                onChange={(e) => setMaxActivations(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tổng số lượt Runs:</label>
              <input
                type="number"
                min={1}
                value={totalRuns}
                onChange={(e) => setTotalRuns(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Thời hạn (tính từ ngày kích hoạt):</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={7}>7 Ngày (Dùng thử / Gói tuần)</option>
                <option value={14}>14 Ngày (2 Tuần)</option>
                <option value={30}>30 Ngày (1 Tháng)</option>
                <option value={60}>60 Ngày (2 Tháng)</option>
                <option value={90}>90 Ngày (3 Tháng)</option>
                <option value={365}>365 Ngày (1 Năm)</option>
                <option value={3650}>Vĩnh viễn (10 Năm)</option>
              </select>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Mã Key Code:</label>
                <button
                  type="button"
                  onClick={() => setKeyCode(generateRandomKeyCode())}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" /> Đổi mã ngẫu nhiên
                </button>
              </div>
              <input
                type="text"
                required
                value={keyCode}
                onChange={(e) => setKeyCode(e.target.value.toUpperCase())}
                className="w-full font-mono uppercase px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer">
              <Check className="w-3.5 h-3.5" /> Tạo Key Ngay
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" /> Gia Hạn & Cộng Thêm Runs
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
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
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">* Sẽ gia hạn cộng dồn vào ngày hết hạn hiện tại.</p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer">
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" /> Cài Đặt Kết Nối Supabase
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
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
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supabase Secret Key / Service Key:</label>
            <input
              type="password"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sb_secret_... hoặc service_role key"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              * Lấy trong Supabase: <strong>Project Settings &rarr; API Keys &rarr; Secret keys</strong> (bắt đầu bằng <code>sb_secret_...</code>). Key này cho phép Admin tạo/sửa/xóa mọi key.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
              Đóng
            </button>
            <button type="submit" className="px-4 py-2 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer">
              Lưu Cài Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


