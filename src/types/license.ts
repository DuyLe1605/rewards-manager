export interface License {
  id: string;
  key_code: string;
  customer_name: string | null;
  customer_note: string | null;
  max_profiles: number;
  total_runs: number;
  used_runs: number;
  duration_days: number;
  max_activations: number;
  machine_ids?: string[] | null;
  activated_at: string | null;
  expires_at: string | null;
  machine_id: string | null;
  status: 'active' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface Stats {
  total: number;
  active: number;
  bound: number;
  totalRuns: number;
}
