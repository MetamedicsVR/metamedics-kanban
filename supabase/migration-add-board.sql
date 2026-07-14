-- Migración necesaria para activar la pestaña de Marketing.
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run.
-- No crea tareas ni toca datos existentes: solo añade la columna de tablero.
-- Las tarjetas actuales quedan automáticamente como 'product'.

-- 1) Añadir la columna.
alter table cards add column if not exists board text not null default 'product';

-- 2) IMPORTANTE: forzar a la API (PostgREST) a recargar el esquema.
--    Sin esto, la API puede seguir sin "ver" la columna nueva y descartar
--    el valor 'board' al guardar, mandando las tarjetas de Marketing a Product.
notify pgrst, 'reload schema';

-- 3) Verificación (opcional): debería listar 'product' y, tras crear alguna
--    tarjeta de marketing, también 'marketing'.
--    select board, count(*) from cards group by board;
