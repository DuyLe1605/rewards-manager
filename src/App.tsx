import React, { useState, useEffect, useMemo } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { LicenseTable } from './components/LicenseTable';
import { CreateModal, ExtendModal, SettingsModal } from './components/Modals';
import { getStoredConfig, saveStoredConfig, getSupabase } from './lib/supabase';
import type { License, Stats } from './types/license';

export function App() {
  const [config, setConfig] = useState(getStoredConfig());
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'blocked'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedExtend, setSelectedExtend] = useState<License | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLicenses = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setSettingsOpen(true);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLicenses((data as License[]) || []);
    } catch (err: any) {
      console.error(err);
      showToast('Lỗi tải dữ liệu: ' + (err.message || 'Kiểm tra Secret Key'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (config.key) {
      fetchLicenses();
    } else {
      setSettingsOpen(true);
    }
  }, []);

  const stats = useMemo<Stats>(() => {
    const now = new Date();
    let active = 0;
    let bound = 0;
    let totalRuns = 0;

    licenses.forEach((l) => {
      const isExpired = l.expires_at ? new Date(l.expires_at) < now : false;
      const isOutOfRuns = l.used_runs >= l.total_runs;
      if (l.status === 'active' && !isExpired && !isOutOfRuns) active++;
      if (l.machine_id) bound++;
      totalRuns += l.used_runs || 0;
    });

    return { total: licenses.length, active, bound, totalRuns };
  }, [licenses]);

  const filteredLicenses = useMemo(() => {
    const query = search.toLowerCase().trim();
    const now = new Date();

    return licenses.filter((l) => {
      const matchQuery =
        !query ||
        (l.key_code && l.key_code.toLowerCase().includes(query)) ||
        (l.customer_name && l.customer_name.toLowerCase().includes(query)) ||
        (l.machine_id && l.machine_id.toLowerCase().includes(query)) ||
        (l.customer_note && l.customer_note.toLowerCase().includes(query));

      if (!matchQuery) return false;

      const isExpired = l.expires_at ? new Date(l.expires_at) < now : false;
      if (statusFilter === 'active') return l.status === 'active' && !isExpired && l.used_runs < l.total_runs;
      if (statusFilter === 'expired') return isExpired || l.used_runs >= l.total_runs;
      if (statusFilter === 'blocked') return l.status === 'blocked';

      return true;
    });
  }, [licenses, search, statusFilter]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Đã sao chép: ' + text);
  };

  const handleCreate = async (data: any) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('licenses').insert([
        {
          ...data,
          used_runs: 0,
          status: 'active',
        },
      ]);

      if (error) throw error;
      setCreateOpen(false);
      showToast('Đã tạo key thành công: ' + data.key_code);
      handleCopy(data.key_code);
      fetchLicenses();
    } catch (err: any) {
      showToast('Lỗi tạo key: ' + err.message, 'error');
    }
  };

  const handleResetHwid = async (keyCode: string) => {
    if (!confirm(`Bạn có chắc muốn reset máy cho key ${keyCode}?\nKhách sẽ có thể kích hoạt trên máy mới.`)) return;

    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('licenses')
        .update({ machine_id: null, updated_at: new Date().toISOString() })
        .eq('key_code', keyCode);

      if (error) throw error;
      showToast('Đã reset máy thành công');
      fetchLicenses();
    } catch (err: any) {
      showToast('Lỗi reset: ' + err.message, 'error');
    }
  };

  const handleToggleBlock = async (license: License) => {
    const supabase = getSupabase();
    if (!supabase) return;

    const newStatus = license.status === 'blocked' ? 'active' : 'blocked';
    try {
      const { error } = await supabase
        .from('licenses')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', license.id);

      if (error) throw error;
      showToast(newStatus === 'blocked' ? 'Đã khóa key' : 'Đã mở khóa key');
      fetchLicenses();
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleExtend = async (license: License, extraRuns: number, extraDays: number) => {
    const supabase = getSupabase();
    if (!supabase) return;

    const newTotalRuns = (license.total_runs || 0) + extraRuns;
    let newExpiresAt = license.expires_at ? new Date(license.expires_at) : new Date();
    if (newExpiresAt < new Date()) newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + extraDays);

    try {
      const { error } = await supabase
        .from('licenses')
        .update({
          total_runs: newTotalRuns,
          expires_at: extraDays > 0 ? newExpiresAt.toISOString() : license.expires_at,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', license.id);

      if (error) throw error;
      setSelectedExtend(null);
      showToast('Đã cập nhật gia hạn thành công');
      fetchLicenses();
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleDelete = async (license: License) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn key ${license.key_code}?\nHành động này không thể hoàn tác.`)) return;

    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('licenses').delete().eq('id', license.id);
      if (error) throw error;
      showToast('Đã xóa key');
      fetchLicenses();
    } catch (err: any) {
      showToast('Lỗi xóa: ' + err.message, 'error');
    }
  };

  const handleSaveSettings = (url: string, key: string) => {
    saveStoredConfig(url, key);
    setConfig({ url, key });
    setSettingsOpen(false);
    showToast('Đã lưu cấu hình kết nối');
    fetchLicenses();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        hasKey={!!config.key}
        loading={loading}
        onOpenSettings={() => setSettingsOpen(true)}
        onRefresh={fetchLicenses}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <StatsCards stats={stats} />

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên khách, mã key, HWID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Hết hạn</option>
              <option value="blocked">Đã bị khóa</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setCreateOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Tạo Key Mới
            </button>
          </div>
        </div>

        <LicenseTable
          licenses={filteredLicenses}
          loading={loading}
          onCopy={handleCopy}
          onResetHwid={handleResetHwid}
          onOpenExtend={setSelectedExtend}
          onToggleBlock={handleToggleBlock}
          onDelete={handleDelete}
        />
      </main>

      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />
      <ExtendModal license={selectedExtend} onClose={() => setSelectedExtend(null)} onSubmit={handleExtend} />
      <SettingsModal
        open={settingsOpen}
        initialUrl={config.url}
        initialKey={config.key}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
