-- ═══════════════════════════════════════════════════════════════════════════
--  MetaMedics Kanban — 5 tarjetas de EJEMPLO para el tablero de Marketing
--  Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
--
--  Set curado y pequeño (5 tarjetas bien detalladas) para ver el formato.
--  Si prefieres el volcado completo (~22 tareas), usa marketing.sql en su lugar.
--  Requiere haber ejecutado antes la migración que añade la columna `board`
--  (está incluida abajo por si acaso). Es idempotente: no duplica.
-- ═══════════════════════════════════════════════════════════════════════════

alter table cards add column if not exists board text not null default 'product';

-- 1) POR DEFINIR · Estrategia · Newsletter ────────────────────────────────────
insert into cards (board, column_id, title, description, type, priority, assignees, size, version, module)
select 'marketing', 'mk_todo',
  'Definir cohorts y buyer persona de la newsletter',
  '<p>Antes de lanzar la newsletter necesitamos decidir a quién nos dirigimos. Jesús propone los cohorts iniciales y Bea define el buyer persona de cada uno.</p><p><strong>Cohorts candidatos:</strong></p><ul><li>Educación (universidades, FP): adoptar nuevas metodologías — aprendizaje por competencias y formación práctica.</li><li>Hospitales / farma / corporate: agresiones a sanitarios, salud mental, violencia de género.</li></ul><p>Objetivo de la newsletter: <strong>awareness</strong>. Contenido = noticias + tendencias que aporten valor real.</p>',
  'mk_strategy', 'high', array['Jesús','Bea'], 'M', 'Q3 2026', 'Newsletter'
where not exists (select 1 from cards where board = 'marketing' and title = 'Definir cohorts y buyer persona de la newsletter');

-- 2) PLANIFICADO · Contenido · Blog / SEO (con checklist y fecha) ──────────────
insert into cards (board, column_id, title, description, type, priority, assignees, size, version, module, due_date, checklist)
select 'marketing', 'mk_planned',
  'Plan de contenido de blog — 3 posts de julio',
  '<p>Definir y redactar los <strong>3 blogs del mes</strong> a partir del análisis de keywords del reporte mensual: dónde no posicionamos (priorizar) y keywords en crecimiento (potenciar).</p><p><strong>Ángulos SEO objetivo:</strong> simulación clínica con IA, formación FUNDAE hospitales, beca de innovación docente en sanidad.</p>',
  'mk_content', 'high', array['Jesús'], 'L', 'Q3 2026', 'Blog / SEO', date '2026-07-31',
  '[{"id":"b1","text":"Elegir 3 keywords del reporte mensual","done":true},{"id":"b2","text":"Redactar los borradores","done":false},{"id":"b3","text":"Revisión SEO + enlazado interno","done":false},{"id":"b4","text":"Publicar e indexar en Search Console","done":false}]'::jsonb
where not exists (select 1 from cards where board = 'marketing' and title = 'Plan de contenido de blog — 3 posts de julio');

-- 3) EN PRODUCCIÓN · Setup / Técnico · Tracking (prioridad alta) ───────────────
insert into cards (board, column_id, title, description, type, priority, assignees, size, version, module)
select 'marketing', 'mk_production',
  'Google Analytics no registra datos — investigar y arreglar',
  '<p>Analytics no está trackeando actualmente: no llegan datos de tráfico ni eventos. <strong>Bloquea todo el reporting</strong> (tráfico por segmento, comparativa por canal y atribución de leads).</p><p>Revisar la instalación del tag, el dominio en Vercel y el consentimiento de cookies. Confirmar en tiempo real que vuelven a entrar eventos antes de cerrar.</p>',
  'mk_setup', 'high', array['Jesús'], 'M', 'Q3 2026', 'Tracking'
where not exists (select 1 from cards where board = 'marketing' and title = 'Google Analytics no registra datos — investigar y arreglar');

-- 4) EN REVISIÓN · Contenido · Case Studies (con checklist y fecha) ────────────
insert into cards (board, column_id, title, description, type, priority, assignees, size, version, module, due_date, checklist)
select 'marketing', 'mk_review',
  'Case study UDIMA — borrador en revisión',
  '<p>Primer case study del trimestre. Formato: contexto del cliente, problema específico, solución aplicada, <strong>resultados con números</strong> y quote del champion. Versión web + PDF descargable.</p><p>Pendiente de revisión de Bea antes de publicar y distribuir (web, outbound, LinkedIn y demos).</p>',
  'mk_content', 'medium', array['Bea'], 'M', 'Q3 2026', 'Case Studies', date '2026-07-25',
  '[{"id":"cs1","text":"Recopilar datos y métricas del cliente","done":true},{"id":"cs2","text":"Redactar el borrador","done":true},{"id":"cs3","text":"Aprobar la quote con el champion","done":false},{"id":"cs4","text":"Maquetar versión web + PDF","done":false}]'::jsonb
where not exists (select 1 from cards where board = 'marketing' and title = 'Case study UDIMA — borrador en revisión');

-- 5) RECURRENTE · Contenido · LinkedIn ────────────────────────────────────────
insert into cards (board, column_id, title, description, type, priority, assignees, size, version, module)
select 'marketing', 'mk_recurrente',
  'Posts de LinkedIn founders — 2-3 por semana',
  '<p>David y Beatriz publican 2-3 posts/semana sobre <strong>el problema, no el producto</strong>: deterioro del razonamiento clínico post-IA, simulación sin presupuesto, cómo medir lo que antes era subjetivo.</p><p><strong>Regla de comunidad:</strong> aportar valor en 4 de cada 5 interacciones antes de mencionar MMVR. Nunca hype tecnológico.</p>',
  'mk_content', 'medium', array['David','Bea'], '', 'Q3 2026', 'LinkedIn'
where not exists (select 1 from cards where board = 'marketing' and title = 'Posts de LinkedIn founders — 2-3 por semana');
