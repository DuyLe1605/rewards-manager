-- ==============================================================================
-- BẢNG VÀ LOGIC QUẢN LÝ BẢN QUYỀN (LICENSE & QUOTA) CHO REWARDS TOOL (V2)
-- Cập nhật hỗ trợ: Số lần nhập/kích hoạt (max_activations), danh sách máy (machine_ids)
-- ==============================================================================

-- 1. Bảng quản lý Licenses (Key)
create table if not exists public.licenses (
    id uuid default gen_random_uuid() primary key,
    key_code text unique not null,                  -- Mã key (VD: REW-VIP-8F2A-9K10)
    customer_name text,                             -- Tên khách hàng (Zalo, SĐT)
    customer_note text,                             -- Ghi chú (giá tiền, kênh bán)
    max_profiles int not null default 5,            -- Số profile tối đa cho phép chạy 1 lần
    total_runs int not null default 150,            -- Tổng số lượt runs của key
    used_runs int not null default 0,               -- Số lượt đã dùng (bấm chạy là trừ)
    duration_days int not null default 30,          -- Thời hạn (ngày) tính từ lúc kích hoạt lần đầu
    max_activations int not null default 1,         -- Số thiết bị/lần kích hoạt tối đa cho phép
    machine_ids text[] default '{}',                -- Danh sách Hardware ID các máy đã kích hoạt
    activated_at timestamp with time zone,          -- Thời điểm máy khách kích hoạt lần đầu
    expires_at timestamp with time zone,            -- Thời điểm hết hạn (activated_at + duration_days)
    machine_id text,                                -- Hardware ID máy kích hoạt đầu tiên (để tương thích ngược)
    status text not null default 'active',          -- 'active' (đang dùng) hoặc 'blocked' (bị khóa)
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Bổ sung cột nếu bảng đã tồn tại
alter table public.licenses add column if not exists max_activations int not null default 1;
alter table public.licenses add column if not exists machine_ids text[] default '{}';

-- Bật Row Level Security (RLS)
alter table public.licenses enable row level security;

-- 2. Bảng lưu lịch sử các lần bấm chạy (Usage Logs)
create table if not exists public.license_logs (
    id uuid default gen_random_uuid() primary key,
    key_code text references public.licenses(key_code) on delete cascade,
    machine_id text not null,
    runs_consumed int not null,                     -- Số runs bị trừ ở lần chạy này
    profiles_count int not null,                    -- Số profile được chọn chạy
    created_at timestamp with time zone default now()
);

alter table public.license_logs enable row level security;

-- Cho phép đọc/ghi công khai qua RPC
drop policy if exists \ Allow anon execute functions\ on public.licenses;
create policy \Allow anon execute functions\ on public.licenses for select using (true);

drop policy if exists \Allow anon select logs\ on public.license_logs;
create policy \Allow anon select logs\ on public.license_logs for select using (true);


-- ==============================================================================
-- HÀM 1: KIỂM TRA HOẶC KÍCH HOẠT KEY (check_or_activate_license)
-- ==============================================================================
create or replace function public.check_or_activate_license(
    p_key_code text,
    p_machine_id text
)
returns json
language plpgsql
security definer
as 
declare
    v_lic public.licenses%rowtype;
    v_now timestamp with time zone := now();
    v_devices_count int;
begin
    -- 1. Tìm key
    select * into v_lic from public.licenses where key_code = p_key_code;
    if not found then
        return json_build_object('valid', false, 'error', 'Mã bản quyền không tồn tại');
    end if;

    -- 2. Kiểm tra trạng thái khóa
    if v_lic.status = 'blocked' then
        return json_build_object('valid', false, 'error', 'Bản quyền này đã bị khóa');
    end if;

    -- 3. Kiểm tra số thiết bị kích hoạt (Redeem limit)
    if v_lic.machine_ids is null then
        v_lic.machine_ids := '{}';
    end if;

    -- Nếu máy này chưa nằm trong danh sách đã kích hoạt
    if not (p_machine_id = any(v_lic.machine_ids)) then
        v_devices_count := cardinality(v_lic.machine_ids);
        if v_devices_count >= v_lic.max_activations then
            return json_build_object(
                'valid', false, 
                'error', 'Key đã đạt giới hạn thiết bị kích hoạt (' || v_devices_count || '/' || v_lic.max_activations || ' máy). Liên hệ Admin để đổi máy hoặc nâng cấp!'
            );
        end if;

        -- Thêm máy mới vào danh sách và kích hoạt
        update public.licenses
        set 
            machine_ids = array_append(machine_ids, p_machine_id),
            machine_id = coalesce(machine_id, p_machine_id),
            activated_at = coalesce(activated_at, v_now),
            expires_at = coalesce(expires_at, v_now + (v_lic.duration_days || ' days')::interval),
            updated_at = v_now
        where id = v_lic.id
        returning * into v_lic;
    end if;

    -- 4. Kiểm tra hết hạn thời gian
    if v_lic.expires_at is not null and v_lic.expires_at < v_now then
        return json_build_object(
            'valid', false, 
            'error', 'Bản quyền đã hết hạn vào ngày ' || to_char(v_lic.expires_at, 'DD/MM/YYYY HH24:MI')
        );
    end if;

    -- 5. Kiểm tra hết số lượt runs
    if v_lic.used_runs >= v_lic.total_runs then
        return json_build_object(
            'valid', false, 
            'error', 'Bản quyền đã dùng hết số lượt chạy (' || v_lic.used_runs || '/' || v_lic.total_runs || ' runs)'
        );
    end if;

    -- Hợp lệ -> Trả về thông tin
    return json_build_object(
        'valid', true,
        'key_code', v_lic.key_code,
        'customer_name', v_lic.customer_name,
        'max_profiles', v_lic.max_profiles,
        'total_runs', v_lic.total_runs,
        'used_runs', v_lic.used_runs,
        'remaining_runs', (v_lic.total_runs - v_lic.used_runs),
        'max_activations', v_lic.max_activations,
        'activations_count', cardinality(v_lic.machine_ids),
        'expires_at', v_lic.expires_at,
        'activated_at', v_lic.activated_at
    );
end;
;


-- ==============================================================================
-- HÀM 2: TRỪ LƯỢT CHẠY ATOMIC (consume_license_runs)
-- ==============================================================================
create or replace function public.consume_license_runs(
    p_key_code text,
    p_machine_id text,
    p_runs_count int
)
returns json
language plpgsql
security definer
as 
declare
    v_lic public.licenses%rowtype;
    v_now timestamp with time zone := now();
begin
    select * into v_lic from public.licenses 
    where key_code = p_key_code 
    for update;

    if not found then
        return json_build_object('success', false, 'error', 'Mã bản quyền không tồn tại');
    end if;

    if v_lic.status = 'blocked' then
        return json_build_object('success', false, 'error', 'Bản quyền đã bị khóa');
    end if;

    -- Kiểm tra máy có trong danh sách được phép không
    if v_lic.machine_ids is null or not (p_machine_id = any(v_lic.machine_ids)) then
        return json_build_object('success', false, 'error', 'Máy tính này chưa được kích hoạt với mã bản quyền');
    end if;

    if v_lic.expires_at is not null and v_lic.expires_at < v_now then
        return json_build_object('success', false, 'error', 'Bản quyền đã hết hạn sử dụng');
    end if;

    if (v_lic.used_runs + p_runs_count) > v_lic.total_runs then
        return json_build_object(
            'success', false, 
            'error', 'Không đủ lượt chạy! Còn lại: ' || (v_lic.total_runs - v_lic.used_runs) || ' lượt, yêu cầu: ' || p_runs_count || ' lượt'
        );
    end if;

    -- Cập nhật trừ lượt
    update public.licenses
    set 
        used_runs = used_runs + p_runs_count,
        updated_at = v_now
    where id = v_lic.id;

    -- Ghi log lịch sử
    insert into public.license_logs (key_code, machine_id, runs_consumed, profiles_count)
    values (v_lic.key_code, p_machine_id, p_runs_count, p_runs_count);

    return json_build_object(
        'success', true,
        'used_runs', v_lic.used_runs + p_runs_count,
        'remaining_runs', (v_lic.total_runs - (v_lic.used_runs + p_runs_count))
    );
end;
;


-- ==============================================================================
-- HÀM 3: ADMIN RESET TOÀN BỘ MÁY (Đổi máy cho khách)
-- ==============================================================================
create or replace function public.admin_reset_machine_id(p_key_code text)
returns json
language plpgsql
security definer
as 
begin
    update public.licenses
    set machine_id = null, machine_ids = '{}', updated_at = now()
    where key_code = p_key_code;

    return json_build_object('success', true, 'message', 'Đã reset danh sách máy. Khách có thể kích hoạt lại trên máy mới.');
end;
;
