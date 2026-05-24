// hooks/useStudentProfile.ts
import { trpc } from '@/lib/trpc'

export const useStudentProfile = () => {
  return trpc.student.getDashboard.useQuery()
}
