export const COLUMNS = [
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

export const FLOW_COLUMNS = ['backlog', 'todo_define', 'defined', 'in_progress', 'review', 'done']

export const TYPES = {
  bug:         { label: 'Bug',           icon: '🐛', fg: 'text-rose-300',   bg: 'bg-rose-500/10',   bd: 'border-rose-500/20',   strip: '#f43f5e' },
  task:        { label: 'Tarea',         icon: '✅', fg: 'text-sky-300',    bg: 'bg-sky-500/10',    bd: 'border-sky-500/20',    strip: '#38bdf8' },
  feedback:    { label: 'Feedback',      icon: '💬', fg: 'text-violet-300', bg: 'bg-violet-500/10', bd: 'border-violet-500/20', strip: '#a78bfa' },
  improvement: { label: 'Mejora',        icon: '✨', fg: 'text-amber-300',  bg: 'bg-amber-500/10',  bd: 'border-amber-500/20',  strip: '#f59e0b' },
  tech_debt:   { label: 'Deuda técnica', icon: '⚙️', fg: 'text-zinc-300',  bg: 'bg-zinc-500/10',   bd: 'border-zinc-500/20',   strip: '#71717a' },
  prompt:      { label: 'Prompt',        icon: '🤖', fg: 'text-teal-300',   bg: 'bg-teal-500/10',   bd: 'border-teal-500/20',   strip: '#14b8a6' },
  design:      { label: 'Diseño (UX)',   icon: '🎨', fg: 'text-pink-300',   bg: 'bg-pink-500/10',   bd: 'border-pink-500/20',   strip: '#ec4899' },
}

export const PRIORITIES = {
  high:   { label: 'Alta',  dot: 'bg-red-500',    text: 'text-red-300',    bg: 'bg-red-500/10',    bd: 'border-red-500/30' },
  medium: { label: 'Media', dot: 'bg-orange-500', text: 'text-orange-300', bg: 'bg-orange-500/10', bd: 'border-orange-500/30' },
  low:    { label: 'Baja',  dot: 'bg-green-500',  text: 'text-green-300',  bg: 'bg-green-500/10',  bd: 'border-green-500/30' },
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export const ME_KEY = 'metamedics-me'
