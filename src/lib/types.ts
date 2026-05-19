import { z } from 'zod'

export const GradeScaleSchema = z.enum(['V', 'Font'])
export type GradeScale = z.infer<typeof GradeScaleSchema>

export const V_GRADES: { grade: string; score: number }[] = [
  { grade: 'V0',  score: 0  }, { grade: 'V1',  score: 1  }, { grade: 'V2',  score: 2  },
  { grade: 'V3',  score: 3  }, { grade: 'V4',  score: 4  }, { grade: 'V5',  score: 5  },
  { grade: 'V6',  score: 6  }, { grade: 'V7',  score: 7  }, { grade: 'V8',  score: 8  },
  { grade: 'V9',  score: 9  }, { grade: 'V10', score: 10 }, { grade: 'V11', score: 11 },
  { grade: 'V12', score: 12 }, { grade: 'V13', score: 13 }, { grade: 'V14', score: 14 },
  { grade: 'V15', score: 15 }, { grade: 'V16', score: 16 }, { grade: 'V17', score: 17 },
]

export const FONT_GRADES: { grade: string; score: number }[] = [
  { grade: '4',   score: 0  }, { grade: '5',   score: 1  }, { grade: '5+',  score: 2  },
  { grade: '6A',  score: 3  }, { grade: '6B',  score: 4  }, { grade: '6C',  score: 5  },
  { grade: '7A',  score: 6  }, { grade: '7A+', score: 7  }, { grade: '7B',  score: 8  },
  { grade: '7C',  score: 9  }, { grade: '7C+', score: 10 }, { grade: '8A',  score: 11 },
  { grade: '8A+', score: 12 }, { grade: '8B',  score: 13 }, { grade: '8B+', score: 14 },
  { grade: '8C',  score: 15 }, { grade: '8C+', score: 16 }, { grade: '9A',  score: 17 },
]

export const BoulderingSendSchema = z.object({
  userId:          z.string().uuid(),
  gymId:           z.string().min(1),
  scale:           GradeScaleSchema,
  grade:           z.string().min(1),
  score:           z.number().int().min(0).max(17),
  attempts:        z.number().int().min(1),
  photoUrl:        z.string().url().optional(),
  notes:           z.string().max(1000).optional(),
  sentAt:          z.string().datetime(),
  idempotencyKey:  z.string().uuid(),
})

export type BoulderingSend = z.infer<typeof BoulderingSendSchema>

export type SendRecord = {
  id: string
  userId: string
  gymId: string
  scale: GradeScale
  grade: string
  score: number
  attempts: number
  photoUrl?: string | null
  notes?: string | null
  sentAt: string
  createdAt: string
}

export type SendResult =
  | { status: 'success'; send: BoulderingSend & { id: string } }
  | { status: 'duplicate'; id: string }
