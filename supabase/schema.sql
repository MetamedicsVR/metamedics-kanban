-- MetaMedics Kanban — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor

-- ─── Cards ────────────────────────────────────────────────────────────────────
create table if not exists cards (
  id          uuid        primary key default gen_random_uuid(),
  board       text        not null default 'product',
  column_id   text        not null default 'todo_define',
  title       text        not null default '',
  description text        not null default '',
  type        text        not null default 'task',
  priority    text        not null default 'medium',
  assignees   text[]      not null default '{}',
  size        text        not null default '',
  version     text        not null default '',
  module      text        not null default '',
  due_date    date,
  links       jsonb       not null default '[]',
  checklist   jsonb       not null default '[]',
  comments    jsonb       not null default '[]',
  archived    boolean     not null default false,
  archived_at timestamptz,
  position    integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Activity log ─────────────────────────────────────────────────────────────
create table if not exists activity_log (
  id          uuid        primary key default gen_random_uuid(),
  action      text        not null,
  card_id     uuid,
  card_title  text        not null default '',
  who         text        not null default '',
  from_column text,
  to_column   text,
  from_title  text,
  to_title    text,
  created_at  timestamptz not null default now()
);

-- ─── Real-time ────────────────────────────────────────────────────────────────
-- Enable real-time on both tables so all teammates see changes instantly
alter publication supabase_realtime add table cards;
alter publication supabase_realtime add table activity_log;

-- ─── Row Level Security (open access — no auth required) ──────────────────────
alter table cards enable row level security;
alter table activity_log enable row level security;

create policy "public_read_cards"   on cards         for select using (true);
create policy "public_insert_cards" on cards         for insert with check (true);
create policy "public_update_cards" on cards         for update using (true);
create policy "public_delete_cards" on cards         for delete using (true);

create policy "public_read_activity"   on activity_log for select using (true);
create policy "public_insert_activity" on activity_log for insert with check (true);

-- ─── Seed data (MetaMedics examples) ─────────────────────────────────────────
insert into cards (column_id, title, description, type, priority, assignees, size, version, module, due_date, links, checklist, comments) values
(
  'bugs',
  'Simulación de paro cardiorrespiratorio no carga en Safari',
  'Al abrir la simulación SIM-204 desde iPad (Safari 17), el canvas queda en negro tras la pantalla de carga. Reproducible en 3 de 3 intentos.',
  'bug', 'high',
  array['David'],
  'M', 'v4.1', 'Simulaciones', '2026-05-15',
  '[{"label":"Loom repro","url":"https://loom.com/..."}]',
  '[{"id":"c1","text":"Reproducir en iPad físico","done":true},{"id":"c2","text":"Aislar WebGL context","done":false},{"id":"c3","text":"PR de hotfix","done":false}]',
  ('[{"id":"cm1","author":"Beatriz","text":"Marta del Hospital Vall reportó lo mismo ayer. Urgente.","at":' || (extract(epoch from now() - interval '5 hours') * 1000)::bigint || '}]')::jsonb
),
(
  'todo_define',
  '¿Cómo medimos retención real de los residentes tras 6 meses?',
  'Tenemos pre/post inmediato, pero no sabemos cuánto retienen a medio plazo. Necesitamos definir métrica y vehículo (¿re-test? ¿simulación sorpresa?).',
  'feedback', 'medium',
  array['Beatriz','David'],
  '', '', 'Simulaciones', null, '[]', '[]', '[]'
),
(
  'defined',
  'Integrar resultados de simulación con el LMS via SCORM 2004',
  'Que la nota final del escenario se envíe al LMS del cliente. Spec adjunta en la doc de referencia.',
  'task', 'medium',
  array['Dev'],
  'XL', 'V5', 'LMS integration', null,
  '[{"label":"Spec SCORM","url":"https://docs.google.com/..."}]',
  '[{"id":"c4","text":"Diseño del payload","done":false},{"id":"c5","text":"Endpoint /lms/report","done":false}]',
  '[]'
),
(
  'in_progress',
  'Migrar gestión de sesiones a httpOnly cookies',
  'Localstorage de tokens es deuda técnica. Riesgo XSS bajo pero existe.',
  'tech_debt', 'medium',
  array['Dev'],
  'L', 'v4.2', 'Auth', null, '[]',
  '[{"id":"c6","text":"Audit de uso actual","done":true},{"id":"c7","text":"Backend: rotación","done":false}]',
  '[]'
),
(
  'review',
  'Onboarding: nuevo flujo de 3 pasos para instructores',
  'Reducir el onboarding de 7 a 3 pasos. Pendiente revisión de diseño y copy.',
  'improvement', 'medium',
  array['Beatriz','QA'],
  'L', 'v4.1', 'Onboarding', '2026-05-12',
  '[{"label":"Figma v3","url":"https://figma.com/..."}]',
  '[{"id":"c8","text":"Wireframes","done":true},{"id":"c9","text":"Hi-fi","done":true},{"id":"c10","text":"Copy en ES/EN","done":false}]',
  ('[{"id":"cm2","author":"David","text":"El paso 2 sigue pidiendo demasiados campos. ¿Movemos especialidad a \"más tarde\"?","at":' || (extract(epoch from now() - interval '20 hours') * 1000)::bigint || '}]')::jsonb
),
(
  'done',
  'Dashboard del instructor: filtro por cohorte',
  '',
  'task', 'low',
  array['David'],
  'S', 'v4.0', 'Dashboard', null, '[]', '[]', '[]'
);
