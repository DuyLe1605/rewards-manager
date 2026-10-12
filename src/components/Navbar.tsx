import React from 'react';
import { ShieldCheck, Key, RefreshCw } from 'lucide-react';

interface NavbarProps {
  hasKey: boolean;
  loading: boolean;
  onOpenSettings: () => void;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ hasKey, loading, onOpenSettings, onRefresh }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-30 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
            Rewards Tool <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Admin Panel</span>
          </h1>
          <p className="text-xs text-slate-400">Hệ thống tạo & quản lý bản quyền khách hàng</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span className={hasKey ? 'text-emerald-400' : 'text-amber-400'}>
            {hasKey ? 'Đã kết nối API' : 'Cài đặt API Key'}
          </span>
        </button>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          title="Tải lại danh sách"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
