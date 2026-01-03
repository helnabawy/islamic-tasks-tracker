import { z } from 'zod'

// Task form validation schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  category: z.enum(['general', 'worship', 'study', 'work']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>

// Quran reminder validation schema
export const quranReminderSchema = z.object({
  surahNumber: z.string().min(1, 'Please select a surah'),
  startAyah: z.string().min(1, 'Start ayah is required').refine(
    (val) => {
      const num = parseInt(val)
      return !isNaN(num) && num > 0
    },
    { message: 'Start ayah must be a positive number' }
  ),
  endAyah: z.string().min(1, 'End ayah is required').refine(
    (val) => {
      const num = parseInt(val)
      return !isNaN(num) && num > 0
    },
    { message: 'End ayah must be a positive number' }
  ),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  reminderTime: z.string().optional(),
}).refine(
  (data) => {
    const start = parseInt(data.startAyah)
    const end = parseInt(data.endAyah)
    return end >= start
  },
  {
    message: 'End ayah must be greater than or equal to start ayah',
    path: ['endAyah'],
  }
)

export type QuranReminderFormData = z.infer<typeof quranReminderSchema>

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
