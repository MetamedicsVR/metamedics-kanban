-- Migración necesaria para activar la pestaña de Marketing.
-- Ejecutar UNA VEZ en: Supabase Dashboard → SQL Editor → Run.
-- No crea tareas ni toca datos existentes: solo añade la columna de tablero.
-- Las tarjetas actuales quedan automáticamente como 'product'.
alter table cards add column if not exists board text not null default 'product';
