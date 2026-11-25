-- MOVORA: Admin-Rollen und unveränderliches Audit Log (Prompt 11).
-- Status: NICHT angewendet. Erst nach Freigabe auf einem Testprojekt ausführen.
-- Rollen werden nie über die App vergeben. Die erste super_admin-Zuweisung
-- erfolgt manuell per SQL durch den Projektinhaber (mindestens zwei Personen).

create type public.admin_role as enum (
  'super_admin',
  'admin',
  'moderator',
  'data_operator',
  'support'
);

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.admin_role not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users (id) on delete set null
);

alter table public.user_roles enable row level security;

-- Security-Definer-Funktion, damit die RLS-Policies nicht rekursiv auf
-- user_roles zugreifen. Liefert die Rolle des aufrufenden Nutzers oder NULL.
create or replace function public.current_admin_role()
returns public.admin_role
language sql
stable
security definer
set search_path = ''
as $$
  select ur.role
  from public.user_roles as ur
  where ur.user_id = (select auth.uid());
$$;

revoke all on function public.current_admin_role() from public, anon;
grant execute on function public.current_admin_role() to authenticated;

create policy user_roles_select_own
  on public.user_roles
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy user_roles_select_admin
  on public.user_roles
  for select
  to authenticated
  using ((select public.current_admin_role()) in ('admin', 'super_admin'));

-- Keine Insert-, Update- oder Delete-Policies: Clients dürfen Rollen nicht ändern.
revoke insert, update, delete on public.user_roles from anon, authenticated;

create table public.audit_log (
  id bigint generated always as identity primary key,
  -- Bewusst ohne Fremdschlüssel auf auth.users: Das Log bleibt auch bei
  -- gelöschten Konten vollständig. Es werden nur IDs gespeichert.
  actor_id uuid,
  actor_role public.admin_role,
  action text not null check (char_length(action) between 1 and 100),
  target_type text not null check (char_length(target_type) between 1 and 100),
  target_id text not null check (char_length(target_id) between 1 and 200),
  reason text check (reason is null or char_length(reason) <= 2000),
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

-- Auch service_role und Owner können Einträge nicht ändern oder löschen.
create or replace function public.audit_log_block_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit_log ist unveränderlich';
end;
$$;

create trigger audit_log_no_update_delete
  before update or delete on public.audit_log
  for each row execute function public.audit_log_block_changes();

create trigger audit_log_no_truncate
  before truncate on public.audit_log
  for each statement execute function public.audit_log_block_changes();

create policy audit_log_select_admin
  on public.audit_log
  for select
  to authenticated
  using ((select public.current_admin_role()) in ('admin', 'super_admin'));

revoke insert, update, delete, truncate on public.audit_log from anon, authenticated;

-- Einziger Schreibweg: jede Admin-Rolle protokolliert ihre eigenen Aktionen.
-- Der Akteur wird aus der Session gelesen und nicht vom Aufrufer übergeben.
create or replace function public.write_audit_entry(
  p_action text,
  p_target_type text,
  p_target_id text,
  p_reason text,
  p_before jsonb,
  p_after jsonb
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_role public.admin_role := (select public.current_admin_role());
  v_id bigint;
begin
  if v_actor is null or v_role is null then
    raise exception 'Keine Berechtigung';
  end if;

  insert into public.audit_log (actor_id, actor_role, action, target_type, target_id, reason, before, after)
  values (v_actor, v_role, p_action, p_target_type, p_target_id, p_reason, p_before, p_after)
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.write_audit_entry(text, text, text, text, jsonb, jsonb) from public, anon;
grant execute on function public.write_audit_entry(text, text, text, text, jsonb, jsonb) to authenticated;
