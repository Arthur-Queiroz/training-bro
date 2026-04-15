export const MUSCLE_GROUP_COLORS: Record<string, { solid: string; soft: string }> = {
  Peito:          { solid: '#E8612B', soft: 'rgba(232,97,43,0.10)' },
  Costas:         { solid: '#4A9FE5', soft: 'rgba(74,159,229,0.10)' },
  'Bíceps':       { solid: '#4A9FE5', soft: 'rgba(74,159,229,0.10)' },
  'Tríceps':      { solid: '#E8612B', soft: 'rgba(232,97,43,0.10)' },
  Ombro:          { solid: '#E5A93B', soft: 'rgba(229,169,59,0.10)' },
  Perna:          { solid: '#2EBD6B', soft: 'rgba(46,189,107,0.10)' },
  'Core/Abdômen': { solid: '#A78BFA', soft: 'rgba(167,139,250,0.10)' },
}

const DEFAULT_COLOR = { solid: '#E8612B', soft: 'rgba(232,97,43,0.10)' }

export function getWorkoutPrimaryColor(muscleGroups: string[]): { solid: string; soft: string } {
  const first = muscleGroups[0]
  return MUSCLE_GROUP_COLORS[first] ?? DEFAULT_COLOR
}
