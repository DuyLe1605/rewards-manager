import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCw, Check, Plus, Settings, Infinity } from 'lucide-react';
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

interface UnlimitedInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  defaultValue?: number;
}

const UnlimitedInput: React.FC<UnlimitedInputProps> = ({ label, value, onChange, min = 1, defaultValue = 10 }) => {
  const isUnlimited = value >= UNLIMITED;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <div
            className={`relative w-8 h-4 rounded-full transition-colors cursor-pointer ${isUnlimited ? 'bg-emerald-500' : 'bg-slate-700'}`}
            onClick={() => onChange(isUnlimited ? defaultValue : UNLIMITED)}
          >
            <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${isUnlimited ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className={`text-[11px] font-medium flex items-center gap-0.5 select-none ${isUnlimited ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Infinity className="w-3 h-3" /> Kh&#244;ng gi&#7899;i h&#7841;n
          </span>
        </label>
      </div>
      <input
        type="number"
        min={min}
        value={isUnlimited ? '' : value}
        disabled={isUnlimited}
        placeholder={isUnlimited ? '\u221e  Kh\u00f4ng gi\u1edbi h\u1ea1n' : ''}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
        className={`w-full px-3 py-2 text-xs rounded-lg border text-white focus:outline-none transition-colors ${
          isUnlimited
            ? 'bg-slate-950/50 border-emerald-500/30 text-emerald-400 placeholder-emerald-500/60 cursor-not-allowed'
            : 'bg-slate-950 border-slate-800 focus:border-emerald-500'
        }`}
      />
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> T&#7841;o B&#7843;n Quy&#7873;n M&#7899;i
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">&#x2715;</button>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">T&#234;n Kh&#225;ch h&#224;ng / Nick Zalo / Telegram:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="VD: A. Tu&#7845;n Zalo"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ghi ch&#250; (Gi&#225; ti&#7873;n / K&#234;nh b&#225;n):</label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="VD: 200k - Chuy&#7875;n kho&#7843;n VietQR"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <UnlimitedInput label="S&#7889; Profile t&#7889;i &#273;a:" value={maxProfiles} onChange={setMaxProfiles} min={1} defaultValue={5} />
            </div>
            <div>
              <UnlimitedInput label="S&#7889; thi&#7871;t b&#7883; (Redeem Limit):" value={maxActivations} onChange={setMaxActivations} min={1} defaultValue={1} />
            </div>
            <div className="col-span-2">
              <UnlimitedInput label="T&#7893;ng s&#7889; l&#432;&#7907;t Runs:" value={totalRuns} onChange={setTotalRuns} min={1} defaultValue={150} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Th&#7901;i h&#7841;n (t&#237;nh t&#7915; ng&#224;y k&#237;ch ho&#7841;t):</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={7}>7 Ng&#224;y (D&#249;ng th&#7917; / G&#243;i tu&#7847;n)</option>
                <option value={14}>14 Ng&#224;y (2 Tu&#7847;n)</option>
                <option value={30}>30 Ng&#224;y (1 Th&#225;ng)</option>
                <option value={60}>60 Ng&#224;y (2 Th&#225;ng)</option>
                <option value={90}>90 Ng&#224;y (3 Th&#225;ng)</option>
                <option value={365}>365 Ng&#224;y (1 N&#259;m)</option>
                <option value={3650}>V&#297;nh vi&#7877;n (10 N&#259;m)</option>
              </select>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">M&#227; Key Code:</label>
                <button
                  type="button"
                  onClick={() => setKeyCode(generateRandomKeyCode())}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" /> &#272;&#7893;i m&#227; ng&#7851;u nhi&#234;n
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
              H&#7911;y
            </button>
            <button type="submit" className="px-4 py-2 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer">
              <Check className="w-3.5 h-3.5" /> T&#7841;o Key Ngay
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
            <Plus className="w-4 h-4 text-emerald-400" /> Gia H&#7841;n &amp; C&#7897;ng Th&#234;m Runs
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">&#x2715;</button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(license, extraRuns, extraDays);
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">C&#7897;ng th&#234;m l&#432;&#7907;t Runs:</label>
            <input type="number" min={0} value={extraRuns} onChange={(e) => setExtraRuns(parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500" />
            <p className="text-[11px] text-slate-500 mt-1">* Nh&#7853;p 0 n&#7871;u kh&#244;ng mu&#7889;n c&#7897;ng th&#234;m runs.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">C&#7897;ng th&#234;m s&#7889; ng&#224;y h&#7871;t h&#7841;n:</label>
            <input type="number" min={0} value={extraDays} onChange={(e) => setExtraDays(parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500" />
            <p className="text-[11px] text-slate-500 mt-1">* S&#7889; gia h&#7841;n c&#7897;ng d&#7891;n v&#224;o ng&#224;y h&#7871;t h&#7841;n hi&#7879;n t&#7841;i.</p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">H&#7911;y</button>
            <button type="submit" className="px-4 py-2 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer">L&#432;u C&#7853;p Nh&#7853;t</button>
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
            <Settings className="w-4 h-4 text-emerald-400" /> C&#224;i &#272;&#7863;t K&#7871;t N&#7889;i Supabase
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">&#x2715;</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(url, key); }} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supabase Project URL:</label>
            <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supabase Secret Key / Service Key:</label>
            <input type="password" required value={key} onChange={(e) => setKey(e.target.value)} placeholder="sb_secret_... ho&#7863;c service_role key" className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500" />
            <p className="text-[11px] text-slate-400 mt-1.5">
              * L&#7845;y trong Supabase: <strong>Project Settings &rarr; API Keys &rarr; Secret keys</strong> (b&#7855;t &#273;&#7847;u b&#7857;ng <code>sb_secret_...</code>).
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">&#272;&#243;ng</button>
            <button type="submit" className="px-4 py-2 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer">L&#432;u C&#224;i &#272;&#7863;t</button>
          </div>
        </form>
      </div>
    </div>
  );
};