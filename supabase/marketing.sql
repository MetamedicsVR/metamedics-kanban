-- ═══════════════════════════════════════════════════════════════════════════
--  MetaMedics Kanban — Migración: tablero de MARKETING
--  Ejecutar UNA VEZ en: Supabase Dashboard → SQL Editor → New query → Run
--  Es seguro: NO toca las tarjetas de Producto & Desarrollo existentes.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1) Añadir la columna de tablero. Las tarjetas actuales quedan como 'product'.
alter table cards add column if not exists board text not null default 'product';

-- 2) Semilla de tareas reales de Marketing (extraídas de las reuniones).
--    Solo se insertan si el tablero de marketing está vacío (evita duplicados).
do $$
begin
  if not exists (select 1 from cards where board = 'marketing') then

    insert into cards (board, column_id, title, description, type, priority, assignees, size, version, module) values

    -- ── Ideas / Backlog ──────────────────────────────────────────────────────
    ('marketing', 'mk_backlog', 'Mejorar portal G2',
     'Optimizar la ficha de MMVR en G2 y portales similares. Debatir pros y contras de invertir esfuerzo aquí.',
     'mk_content', 'low', array['Jesús'], 'S', 'Q4 2026', 'PR / Medios'),

    ('marketing', 'mk_backlog', 'Plan de eventos y congresos 2026',
     'Seleccionar máx. 5-6 eventos/año con objetivo, KPI y follow-up de 14 días. SESSEP, SEDEM, SEMES/SEEUE, jornadas RRHH sanitario, NLN, SIMO.',
     'mk_strategy', 'medium', array['David','Jesús'], 'M', 'Q4 2026', 'Eventos'),

    ('marketing', 'mk_backlog', 'Medical Expo — evaluar presencia',
     'Pospuesto a agosto. Decidir tipo de presencia y objetivos.',
     'mk_strategy', 'low', array['David'], 'S', 'Q3 2026', 'Eventos'),

    ('marketing', 'mk_backlog', 'Webinars: approach y objetivos',
     'Serie bimensual 30-45 min sobre el problema del ICP (no el producto). Retomar en septiembre, primero en octubre. Estrategia: mucha calidad, 2-3/año, guest speakers.',
     'mk_strategy', 'medium', array['Jesús','Bea'], 'M', 'Q4 2026', 'Webinars'),

    ('marketing', 'mk_backlog', 'Programa Early Adopters (10-15 docentes)',
     'Identificar profesores innovadores (empezar por UDIMA, VIU) como co-creadores. Acceso anticipado, co-creación de casos, feedback público.',
     'mk_strategy', 'low', array['Bea'], 'L', 'Q4 2026', 'PR / Medios'),

    -- ── Por definir ───────────────────────────────────────────────────────────
    ('marketing', 'mk_todo', 'Decidir qué case studies mantener y priorizar',
     'Bea decide qué casos actuales mantener y cuáles priorizar (existentes o nuevos) y recopila la info de cliente. Objetivo: 2/trimestre. Candidatos: UDIMA/VIU, Junta de Andalucía, Minnesota Cooperative.',
     'mk_strategy', 'high', array['Bea'], 'M', 'Q3 2026', 'Case Studies'),

    ('marketing', 'mk_todo', 'Informe: Vercel Analytics vs alternativas + Hotjar',
     'Ventajas/desventajas de Vercel Analytics vs otras opciones. ¿Cómo consiguen otras empresas datos sin cookies? ¿Necesitamos Hotjar u otra herramienta de comportamiento (flujo, atribución)?',
     'mk_data', 'high', array['Jesús'], 'M', 'Q3 2026', 'Tracking'),

    ('marketing', 'mk_todo', 'Newsletter: decidir cohorts + buyer persona',
     'Jesús define cohorts; Bea define a quién incluimos y su buyer persona. Ej: (1) educación (universidades, FP) — nuevas metodologías; (2) hospitales/farmas — agresiones a sanitarios, salud mental, violencia de género. Objetivo: awareness.',
     'mk_strategy', 'high', array['Jesús','Bea'], 'M', 'Q3 2026', 'Newsletter'),

    ('marketing', 'mk_todo', 'Estrategia YouTube — qué vídeos y cómo organizarlos',
     'Definir qué vídeos subir y cómo estructurarlos. La cuenta antigua ya fue eliminada; Jesús crea una nueva desde admin@ y sube los vídeos con títulos/descripciones acordes.',
     'mk_strategy', 'medium', array['Jesús'], 'M', 'Q3 2026', 'Video / YouTube'),

    -- ── Planificado ───────────────────────────────────────────────────────────
    ('marketing', 'mk_planned', 'Revisar sitemap e indexar páginas pendientes',
     'Revisar el sitemap e indexar todas las páginas pendientes en Search Console.',
     'mk_setup', 'high', array['Jesús'], 'S', 'Q3 2026', 'Web'),

    ('marketing', 'mk_planned', 'Plan de contenido: 3 blogs/mes',
     'Derivar 3 blogs/mes del análisis de keywords: dónde no posicionamos → priorizar; keywords en crecimiento → potenciar. Reporte mensual como fuente.',
     'mk_strategy', 'high', array['Jesús'], 'L', 'Q3 2026', 'Blog / SEO'),

    ('marketing', 'mk_planned', 'Rehacer Plan de Contenido de LinkedIn',
     'Rehacer el plan según la nueva estrategia. 2-3 posts/semana por founder sobre el problema, no el producto. Añadir el "por qué" de cada post y empresas de referencia.',
     'mk_strategy', 'medium', array['Jesús'], 'M', 'Q3 2026', 'LinkedIn'),

    ('marketing', 'mk_planned', 'Crear cuenta Hubspot para Jesús',
     'Plataforma elegida para newsletter/CRM: Hubspot. David crea la cuenta y da acceso a Jesús.',
     'mk_setup', 'medium', array['David'], 'XS', 'Q3 2026', 'Newsletter'),

    ('marketing', 'mk_planned', 'Crear UTMs + Excel de seguimiento de leads',
     'Jesús crea UTMs (o similar) para trackear el origen del lead + Excel de seguimiento (first name, last name, company, source). Bea hace el seguimiento de esos leads. Fuentes: web, LinkedIn, webinars, newsletter.',
     'mk_setup', 'high', array['Jesús','Bea'], 'M', 'Q3 2026', 'Tracking'),

    ('marketing', 'mk_planned', 'Crear cuenta YouTube desde admin@',
     'Crear la nueva cuenta de YouTube de MetaMedics desde admin@ (la anterior ya fue eliminada).',
     'mk_setup', 'medium', array['Jesús'], 'XS', 'Q3 2026', 'Video / YouTube'),

    -- ── En producción ─────────────────────────────────────────────────────────
    ('marketing', 'mk_production', 'Analytics no está trackeando — investigar y arreglar',
     'Google Analytics no está registrando datos actualmente. Bloquea todo el reporting. Prioridad alta.',
     'mk_setup', 'high', array['Jesús'], 'M', 'Q3 2026', 'Tracking'),

    ('marketing', 'mk_production', 'Ejecutar doc "página empresa" de LinkedIn',
     'Bea ejecuta el documento de Jesús para la página de empresa (quizás con cambios). Página MMVR: 1 post/semana con casos, resultados y eventos.',
     'mk_content', 'medium', array['Bea'], 'M', 'Q3 2026', 'LinkedIn'),

    ('marketing', 'mk_production', 'Revisar lead magnets actuales + feedback',
     'Bea revisa los lead magnets actuales y da feedback; Jesús aplica el feedback. Plan: 1 lead magnet/trimestre de alta calidad.',
     'mk_content', 'medium', array['Bea','Jesús'], 'M', 'Q3 2026', 'Lead Magnets'),

    ('marketing', 'mk_production', 'Actualizar doc de Estrategia de Marketing 2026',
     'Mantener actualizado el documento de referencia de estrategia (canales, priorización, KPIs).',
     'mk_content', 'low', array['Jesús'], 'S', 'Q3 2026', 'PR / Medios'),

    -- ── Recurrente ────────────────────────────────────────────────────────────
    ('marketing', 'mk_recurrente', 'Reunión semanal de Marketing — viernes 9:00',
     'Estructura: (1) análisis de datos del reporte bi-mensual, (2) profundizar en canales específicos y definir estrategia, (3) definir tasks con responsable y deadline + check de las anteriores. David pasa estructura, Jesús lidera.',
     'mk_coord', 'high', array['David','Jesús','Bea'], '', 'Q3 2026', 'Coordinación'),

    ('marketing', 'mk_recurrente', 'Posts LinkedIn founders — 2-3/semana',
     'David y Beatriz publican 2-3 posts/semana sobre el problema (deterioro del razonamiento clínico post-IA, simulación sin presupuesto, cómo medir lo subjetivo). Regla: aportar valor en 4 de cada 5 interacciones antes de mencionar MMVR.',
     'mk_content', 'medium', array['David','Bea'], '', 'Q3 2026', 'LinkedIn'),

    ('marketing', 'mk_recurrente', 'Reporte de estrategia bi-mensual (SEO/keywords)',
     'Reporte que mezcla datos internos (Search Console, Analytics, flujos) y de industria: ranking de keywords objetivo top 20-30 y variación, keywords perdidas/ganadas, keywords donde competidores posicionan y nosotros no, rendimiento de contenido, tráfico y leads por canal.',
     'mk_data', 'medium', array['Jesús'], '', 'Q3 2026', 'Blog / SEO'),

    ('marketing', 'mk_recurrente', 'Newsletter — calendario de contenido 360',
     'Contenido 360 coordinado con LinkedIn y blog. Noticias + tendencias que aporten valor. Awareness como objetivo, con puntos clave del calendario anual para reforzar el mensaje de venta. Debe ser atractivo para captar suscriptores.',
     'mk_content', 'medium', array['Jesús','Bea'], '', 'Q4 2026', 'Newsletter');

  end if;
end $$;
