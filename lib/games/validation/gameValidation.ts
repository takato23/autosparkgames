// Esquemas de validación para configuración de juegos
export interface ValidationRule {
  field: string
  rule: (value: any) => boolean
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface ValidationSchema {
  [stepId: string]: ValidationRule[]
}

// Validadores comunes reutilizables
export const commonValidators = {
  required: (value: any) => value !== undefined && value !== null && value !== '',
  minLength: (min: number) => (value: string) => value && value.length >= min,
  maxLength: (max: number) => (value: string) => !value || value.length <= max,
  isNumber: (value: any) => !isNaN(Number(value)),
  minValue: (min: number) => (value: number) => Number(value) >= min,
  maxValue: (max: number) => (value: number) => Number(value) <= max,
  isArray: (value: any) => Array.isArray(value),
  minArrayLength: (min: number) => (value: any[]) => Array.isArray(value) && value.length >= min,
  maxArrayLength: (max: number) => (value: any[]) => Array.isArray(value) && value.length <= max,
  isEmail: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || ''),
  isUrl: (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }
}

// Esquemas de validación por tipo de juego
export const gameValidationSchemas: Record<string, ValidationSchema> = {
  trivia: {
    basic: [
      {
        field: 'name',
        rule: commonValidators.required,
        message: 'El nombre del juego es requerido',
        severity: 'error'
      },
      {
        field: 'name',
        rule: commonValidators.minLength(3),
        message: 'El nombre debe tener al menos 3 caracteres',
        severity: 'error'
      },
      {
        field: 'estimatedTime',
        rule: commonValidators.minValue(5),
        message: 'La duración mínima es 5 minutos',
        severity: 'error'
      },
      {
        field: 'maxPlayers',
        rule: commonValidators.minValue(2),
        message: 'Se necesitan al menos 2 jugadores',
        severity: 'error'
      }
    ],
    questions: [
      {
        field: 'questionCount',
        rule: commonValidators.minValue(3),
        message: 'Se necesitan al menos 3 preguntas',
        severity: 'error'
      },
      {
        field: 'questions',
        rule: commonValidators.minArrayLength(1),
        message: 'Debe agregar al menos una pregunta',
        severity: 'warning'
      }
    ],
    scoring: [
      {
        field: 'pointsPerQuestion',
        rule: commonValidators.minValue(1),
        message: 'Los puntos por pregunta deben ser al menos 1',
        severity: 'error'
      },
      {
        field: 'timePerQuestion',
        rule: commonValidators.minValue(5),
        message: 'El tiempo mínimo por pregunta es 5 segundos',
        severity: 'error'
      }
    ]
  },
  bingo: {
    basic: [
      {
        field: 'name',
        rule: commonValidators.required,
        message: 'El nombre del juego es requerido',
        severity: 'error'
      },
      {
        field: 'gridSize',
        rule: (value: string) => ['3x3', '4x4', '5x5'].includes(value),
        message: 'Selecciona un tamaño de cartón válido',
        severity: 'error'
      }
    ],
    cards: [
      {
        field: 'cardContent',
        rule: commonValidators.minArrayLength(9), // Mínimo para 3x3
        message: 'Se necesita suficiente contenido para llenar los cartones',
        severity: 'error'
      }
    ],
    rules: [
      {
        field: 'winPatterns',
        rule: commonValidators.minArrayLength(1),
        message: 'Debe seleccionar al menos un patrón de victoria',
        severity: 'error'
      }
    ]
  },
  pictionary: {
    basic: [
      {
        field: 'name',
        rule: commonValidators.required,
        message: 'El nombre del juego es requerido',
        severity: 'error'
      },
      {
        field: 'teamCount',
        rule: commonValidators.minValue(2),
        message: 'Se necesitan al menos 2 equipos',
        severity: 'error'
      }
    ],
    words: [
      {
        field: 'wordBank',
        rule: commonValidators.minArrayLength(10),
        message: 'Se necesitan al menos 10 palabras',
        severity: 'error'
      }
    ],
    settings: [
      {
        field: 'drawingTime',
        rule: commonValidators.minValue(30),
        message: 'El tiempo mínimo de dibujo es 30 segundos',
        severity: 'error'
      }
    ]
  },
  memory: {
    basic: [
      {
        field: 'name',
        rule: commonValidators.required,
        message: 'El nombre del juego es requerido',
        severity: 'error'
      },
      {
        field: 'difficulty',
        rule: (value: string) => ['easy', 'medium', 'hard'].includes(value),
        message: 'Selecciona un nivel de dificultad',
        severity: 'error'
      }
    ],
    pairs: [
      {
        field: 'cardPairs',
        rule: commonValidators.minArrayLength(6),
        message: 'Se necesitan al menos 6 pares de cartas',
        severity: 'error'
      }
    ]
  },
  race: {
    basic: [
      {
        field: 'name',
        rule: commonValidators.required,
        message: 'El nombre del juego es requerido',
        severity: 'error'
      },
      {
        field: 'raceType',
        rule: (value: string) => ['speed', 'accuracy', 'mixed'].includes(value),
        message: 'Selecciona un tipo de carrera',
        severity: 'error'
      }
    ],
    questions: [
      {
        field: 'questions',
        rule: commonValidators.minArrayLength(10),
        message: 'Se necesitan al menos 10 preguntas para una carrera',
        severity: 'error'
      }
    ],
    mechanics: [
      {
        field: 'speedBonus',
        rule: commonValidators.minValue(0),
        message: 'El bonus de velocidad debe ser positivo',
        severity: 'error'
      }
    ]
  },
  team: {
    basic: [
      {
        field: 'name',
        rule: commonValidators.required,
        message: 'El nombre del juego es requerido',
        severity: 'error'
      },
      {
        field: 'teamSize',
        rule: commonValidators.minValue(2),
        message: 'Los equipos deben tener al menos 2 miembros',
        severity: 'error'
      }
    ],
    challenges: [
      {
        field: 'challenges',
        rule: commonValidators.minArrayLength(3),
        message: 'Se necesitan al menos 3 desafíos',
        severity: 'error'
      }
    ],
    scoring: [
      {
        field: 'scoringSystem',
        rule: (value: string) => ['points', 'elimination', 'ranking'].includes(value),
        message: 'Selecciona un sistema de puntuación',
        severity: 'error'
      }
    ]
  }
}

// Función para validar un step específico
export function validateStep(
  gameType: string, 
  stepId: string, 
  data: Record<string, any>
): { isValid: boolean; errors: ValidationRule[] } {
  const schema = gameValidationSchemas[gameType]?.[stepId]
  if (!schema) return { isValid: true, errors: [] }

  const errors = schema.filter(rule => !rule.rule(data[rule.field]))
  const isValid = errors.length === 0

  return { isValid, errors }
}

// Función para validar todo el juego
export function validateGame(
  gameType: string, 
  data: Record<string, any>
): { isValid: boolean; stepErrors: Record<string, ValidationRule[]> } {
  const schema = gameValidationSchemas[gameType]
  if (!schema) return { isValid: true, stepErrors: {} }

  const stepErrors: Record<string, ValidationRule[]> = {}
  let hasErrors = false

  Object.entries(schema).forEach(([stepId, rules]) => {
    const errors = rules.filter(rule => !rule.rule(data[rule.field]))
    if (errors.length > 0) {
      stepErrors[stepId] = errors
      hasErrors = true
    }
  })

  return { isValid: !hasErrors, stepErrors }
}

// Función para obtener mensajes de ayuda por campo
export function getFieldHelp(gameType: string, stepId: string, field: string): string | null {
  const helpMessages: Record<string, Record<string, Record<string, string>>> = {
    trivia: {
      basic: {
        name: 'Elige un nombre atractivo que describa el tema de tu trivia',
        estimatedTime: 'Calcula aproximadamente 1-2 minutos por pregunta',
        maxPlayers: 'Considera la capacidad de tu sala y el nivel de interacción deseado'
      },
      questions: {
        questionCount: 'Entre 10-20 preguntas es ideal para mantener la atención',
        difficulty: 'Mezcla preguntas fáciles, medias y difíciles para mayor diversión'
      }
    },
    bingo: {
      basic: {
        gridSize: '3x3 es rápido, 5x5 es más desafiante y dura más tiempo',
        name: 'Incluye el tema o propósito del bingo en el nombre'
      }
    }
    // Más mensajes de ayuda...
  }

  return helpMessages[gameType]?.[stepId]?.[field] || null
}