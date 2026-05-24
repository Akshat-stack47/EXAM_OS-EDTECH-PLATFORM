import { createTRPCRouter } from '@/server/trpc'
import { authRouter } from './auth'
import { studentRouter } from './student'
import { parentRouter } from './parent'
import { teacherRouter } from './teacher'
import { coordinatorRouter } from './coordinator'
import { examRouter } from './exam'
import { aiRouter } from './ai'
import { healthRouter } from './health'
import { whiteboardRouter } from './whiteboard'
import { paymentRouter } from './payment'
import { notificationRouter } from './notification'
import { searchRouter } from './search.router'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  student: studentRouter,
  parent: parentRouter,
  teacher: teacherRouter,
  coordinator: coordinatorRouter,
  exam: examRouter,
  ai: aiRouter,
  health: healthRouter,
  whiteboard: whiteboardRouter,
  payment: paymentRouter,
  notification: notificationRouter,
  search: searchRouter,
})

export type AppRouter = typeof appRouter
