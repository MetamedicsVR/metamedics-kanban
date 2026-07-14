// ═══════════════════════════════════════════════════════════════════════════
//  Tablero: PRODUCTO & DESARROLLO
// ═══════════════════════════════════════════════════════════════════════════
const PRODUCT_COLUMNS = [
  { id: 'backlog', title: 'Backlog', dot: '#52525b',
    info: 'Ideas y tareas futuras que aún no están listas para definirse. Un repositorio de trabajo pendiente sin fecha ni responsable asignado.' },
  { id: 'todo_define', title: 'Por definir', dot: '#71717a',
    info: 'Existe la idea o el problema, pero aún no sabemos bien qué hay que hacer ni cómo. Necesita discusión antes de poder trabajarse.' },
  { id: 'defined', title: 'Definido', dot: '#a78bfa',
    info: 'Tiene contexto suficiente, responsable asignado y estimación. Está listo para coger cuando haya capacidad.' },
  { id: 'in_progress', title: 'En progreso', dot: '#60a5fa',
    info: 'Alguien está trabajando activamente en ello ahora mismo. No debería haber más de 2-3 tarjetas por persona aquí a la vez.' },
  { id: 'review', title: 'En revisión', dot: '#f59e0b',
    info: 'El trabajo está hecho pero necesita validación: una segunda opinión, QA, aprobación de producto, o prueba real antes de cerrar.' },
  { id: 'done', title: 'Completado', dot: '#34d399',
    info: 'Revisado, aprobado y entregado. No requiere más acción. Se archiva automáticamente para mantener el histórico.' },
  { id: 'bugs', title: 'Bugs', dot: '#f43f5e', fixed: true,
    info: 'Columna fija para errores en producción o detectados en testing. No siguen el flujo normal, necesitan visibilidad propia y atención rápida.' },
]

const PRODUCT_TYPES = {
  bug:         { label: 'Bug',           icon: '🐛', fg: 'text-rose-300',   bg: 'bg-rose-500/10',   bd: 'border-rose-500/20',   strip: '#f43f5e' },
  task:        { label: 'Tarea',         icon: '✅', fg: 'text-sky-300',    bg: 'bg-sky-500/10',    bd: 'border-sky-500/20',    strip: '#38bdf8' },
  feedback:    { label: 'Feedback',      icon: '💬', fg: 'text-violet-300', bg: 'bg-violet-500/10', bd: 'border-violet-500/20', strip: '#a78bfa' },
  improvement: { label: 'Mejora',        icon: '✨', fg: 'text-amber-300',  bg: 'bg-amber-500/10',  bd: 'border-amber-500/20',  strip: '#f59e0b' },
  tech_debt:   { label: 'Deuda técnica', icon: '⚙️', fg: 'text-zinc-300',  bg: 'bg-zinc-500/10',   bd: 'border-zinc-500/20',   strip: '#71717a' },
  prompt:      { label: 'Prompt',        icon: '🤖', fg: 'text-teal-300',   bg: 'bg-teal-500/10',   bd: 'border-teal-500/20',   strip: '#14b8a6' },
  design:      { label: 'Diseño (UX)',   icon: '🎨', fg: 'text-pink-300',   bg: 'bg-pink-500/10',   bd: 'border-pink-500/20',   strip: '#ec4899' },
}

// ═══════════════════════════════════════════════════════════════════════════
//  Tablero: MARKETING
// ═══════════════════════════════════════════════════════════════════════════
const MARKETING_COLUMNS = [
  { id: 'mk_backlog', title: 'Ideas / Backlog', dot: '#52525b',
    info: 'Ideas, propuestas y temas futuros sin priorizar. Aún no tienen responsable ni fecha. Repositorio de todo lo que podría hacerse.' },
  { id: 'mk_todo', title: 'Por definir', dot: '#71717a',
    info: 'Temas que necesitan discusión o decisión antes de poder ejecutarse (ej: decidir cohorts, definir estrategia). Se debaten en la reunión semanal.' },
  { id: 'mk_planned', title: 'Planificado', dot: '#a78bfa',
    info: 'En el calendario editorial, con responsable y fecha asignados. Listo para empezar cuando llegue su turno.' },
  { id: 'mk_production', title: 'En producción', dot: '#60a5fa',
    info: 'Creándose activamente: escribiendo el blog, diseñando la pieza, montando la campaña o configurando la herramienta.' },
  { id: 'mk_review', title: 'En revisión', dot: '#f59e0b',
    info: 'El trabajo está hecho pero necesita revisión o aprobación antes de publicar: revisión de copy, validación de datos, visto bueno del responsable.' },
  { id: 'mk_published', title: 'Publicado', dot: '#34d399',
    info: 'Publicado, entregado o en marcha. No requiere más acción. Se archiva para mantener el histórico.' },
  { id: 'mk_recurrente', title: 'Recurrente', dot: '#14b8a6', fixed: true,
    info: 'Tareas continuas que no terminan: posts de LinkedIn semanales, newsletter mensual, reporte de keywords, community management, reunión semanal.' },
]

const MARKETING_TYPES = {
  mk_content:  { label: 'Contenido',        icon: '📝', fg: 'text-sky-300',     bg: 'bg-sky-500/10',     bd: 'border-sky-500/20',     strip: '#38bdf8' },
  mk_strategy: { label: 'Estrategia',       icon: '🧭', fg: 'text-violet-300',  bg: 'bg-violet-500/10',  bd: 'border-violet-500/20',  strip: '#a78bfa' },
  mk_data:     { label: 'Datos / Análisis', icon: '📊', fg: 'text-emerald-300', bg: 'bg-emerald-500/10', bd: 'border-emerald-500/20', strip: '#34d399' },
  mk_design:   { label: 'Diseño',           icon: '🎨', fg: 'text-pink-300',    bg: 'bg-pink-500/10',    bd: 'border-pink-500/20',    strip: '#ec4899' },
  mk_setup:    { label: 'Setup / Técnico',  icon: '⚙️', fg: 'text-amber-300',   bg: 'bg-amber-500/10',   bd: 'border-amber-500/20',   strip: '#f59e0b' },
  mk_coord:    { label: 'Coordinación',     icon: '🤝', fg: 'text-teal-300',    bg: 'bg-teal-500/10',    bd: 'border-teal-500/20',    strip: '#14b8a6' },
}

// ═══════════════════════════════════════════════════════════════════════════
//  Configuración por tablero
// ═══════════════════════════════════════════════════════════════════════════
export const BOARDS = {
  product: {
    id: 'product',
    label: 'Producto & Desarrollo',
    subtitle: 'Producto & Desarrollo · MetaMedics',
    columns: PRODUCT_COLUMNS,
    flow: ['backlog', 'todo_define', 'defined', 'in_progress', 'review', 'done'],
    types: PRODUCT_TYPES,
    defaultColumn: 'defined',
    defaultType: 'task',
    doneColumn: 'done',
    fixedColumn: 'bugs',
    fixedLabel: 'Bugs',
    fixedAccent: 'text-rose-300',
    areaLabel: 'Módulo / área',
    areaFilterLabel: 'Módulo',
    areaPlaceholder: 'Simulaciones, LMS…',
    periodLabel: 'Versión',
    periodFilterLabel: 'Versión',
    periodPlaceholder: 'V4, v4.1…',
    periodMono: true,
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    subtitle: 'Marketing · MetaMedics',
    columns: MARKETING_COLUMNS,
    flow: ['mk_backlog', 'mk_todo', 'mk_planned', 'mk_production', 'mk_review', 'mk_published'],
    types: MARKETING_TYPES,
    defaultColumn: 'mk_planned',
    defaultType: 'mk_content',
    doneColumn: 'mk_published',
    fixedColumn: 'mk_recurrente',
    fixedLabel: 'Recurrentes',
    fixedAccent: 'text-teal-300',
    areaLabel: 'Área / canal',
    areaFilterLabel: 'Área',
    areaPlaceholder: 'LinkedIn, Blog, Case Studies…',
    periodLabel: 'Periodo',
    periodFilterLabel: 'Periodo',
    periodPlaceholder: 'Q1 2026, Q2 2026…',
    periodMono: false,
  },
}

export const BOARD_LIST = [BOARDS.product, BOARDS.marketing]
export const getBoard = (id) => BOARDS[id] || BOARDS.product

// Búsquedas combinadas (todos los tableros): los chips y el log de actividad
// deben poder resolver cualquier id de tipo o columna sin conocer el tablero.
export const TYPES = { ...PRODUCT_TYPES, ...MARKETING_TYPES }
export const ALL_COLUMNS = [...PRODUCT_COLUMNS, ...MARKETING_COLUMNS]

// Compatibilidad con imports existentes
export const COLUMNS = PRODUCT_COLUMNS
export const FLOW_COLUMNS = BOARDS.product.flow

export const PRIORITIES = {
  high:   { label: 'Alta',  dot: 'bg-red-500',    text: 'text-red-300',    bg: 'bg-red-500/10',    bd: 'border-red-500/30' },
  medium: { label: 'Media', dot: 'bg-orange-500', text: 'text-orange-300', bg: 'bg-orange-500/10', bd: 'border-orange-500/30' },
  low:    { label: 'Baja',  dot: 'bg-green-500',  text: 'text-green-300',  bg: 'bg-green-500/10',  bd: 'border-green-500/30' },
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export const ME_KEY = 'metamedics-me'
export const BOARD_KEY = 'metamedics-board'
