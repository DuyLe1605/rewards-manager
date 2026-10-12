import React from 'react';
import { Copy, RotateCcw, CalendarPlus, Lock, Unlock, Trash2 } from 'lucide-react';
import type { License } from '../types/license';

interface LicenseTableProps {
  licenses: License[];
  loading: boolean;
  onCopy: (text: string) => void;
  onResetHwid: (key: string) => void;
  onOpenExtend: (license: License) => void;
  onToggleBlock: (license: License) => void;
  onDelete: (license: License) => void;
}

export const LicenseTable: React.FC<LicenseTableProps> = ({
  licenses,
  loading,
  onCopy,
  onResetHwid,
  onOpenExtend,
  onToggleBlock,
  onDelete,
}) => {
  const now = new Date();

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Mã Key</th>
              <th className="py-3.5 px-4">Khách hàng & Ghi chú</th>
              <th className="py-3.5 px-4">Giới hạn & Tiến độ Runs</th>
              <th className="py-3.5 px-4">Hạn sử dụng</th>
              <th className="py-3.5 px-4">Thiết bị (Redeem)</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  Đang tải danh sách...
                </td>
              </tr>
            ) : licenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  Không tìm thấy mã key nào
                </td>
              </tr>
            ) : (
              licenses.map((l) => {
                const isExpired = l.expires_at ? new Date(l.expires_at) < now : false;
                const isOutOfRuns = l.used_runs >= l.total_runs;
                const usagePercent =
                  l.total_runs > 0 ? Math.min(100, Math.round((l.used_runs / l.total_runs) * 100)) : 0;

                const expireDateStr = l.expires_at
                  ? new Date(l.expires_at).toLocaleDateString('vi-VN')
                  : `Chưa kích hoạt (${l.duration_days} ngày)`;

                return (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{l.key_code}</span>
                        <button
                          onClick={() => onCopy(l.key_code)}
                          className="text-slate-400 hover:text-emerald-400 p-1 cursor-pointer"
                          title="Sao chép"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{l.customer_name || 'Khách vãng lai'}</div>
                      <div className="text-[11px] text-slate-400">{l.customer_note || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-400">
                          Max: <strong className="text-white">{l.max_profiles} nick</strong>
                        </span>
                        <span className="text-slate-300 font-mono">
                          {l.used_runs} / {l.total_runs} runs
                        </span>
                      </div>
                      <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${usagePercent >= 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-300">{expireDateStr}</div>
                      <div className="text-[10px] text-slate-500">
                        {l.activated_at
                          ? 'Kích hoạt: ' + new Date(l.activated_at).toLocaleDateString('vi-VN')
                          : 'Chưa nhập máy'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 mb-1 text-xs">
                        <span className="text-slate-400 font-medium">Đã dùng:</span>
                        <span className="font-semibold text-purple-400">
                          {(Array.isArray(l.machine_ids) ? l.machine_ids.length : (l.machine_id ? 1 : 0))} / {l.max_activations || 1} máy
                        </span>
                      </div>
                      <div className="max-w-[130px] truncate text-[10px] font-mono text-slate-500" title={Array.isArray(l.machine_ids) && l.machine_ids.length > 0 ? l.machine_ids.join(', ') : (l.machine_id || 'Chưa kích hoạt')}>
                        {Array.isArray(l.machine_ids) && l.machine_ids.length > 0 
                          ? l.machine_ids[0].substring(0, 10) + (l.machine_ids.length > 1 ? ` (+${l.machine_ids.length - 1})` : '')
                          : (l.machine_id ? l.machine_id.substring(0, 10) + '...' : 'Chưa gắn máy')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {l.status === 'blocked' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          ĐÃ KHÓA
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          HẾT HẠN
                        </span>
                      ) : isOutOfRuns ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          HẾT RUNS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          HOẠT ĐỘNG
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onResetHwid(l.key_code)}
                          className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-400 transition-colors cursor-pointer"
                          title="Reset máy (cho khách đổi máy)"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenExtend(l)}
                          className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Cộng lượt / Gia hạn"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleBlock(l)}
                          className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                          title={l.status === 'blocked' ? 'Mở khóa' : 'Khóa key'}
                        >
                          {l.status === 'blocked' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onDelete(l)}
                          className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                          title="Xóa key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
