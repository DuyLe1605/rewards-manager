import React from 'react';
import { KeyRound, CheckCircle2, Laptop, Activity } from 'lucide-react';
import type { Stats } from '../types/license';

interface StatsCardsProps {
  stats: Stats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Tổng số Keys</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <KeyRound className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Đang hoạt động</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Đã gắn máy (HWID)</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{stats.bound}</p>
        </div>
        <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Laptop className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Tổng lượt Runs đã dùng</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats.totalRuns.toLocaleString('vi-VN')}</p>
        </div>
        <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Activity className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
