import { trpc } from '@/lib/trpc'

export const useParentDashboard = () => {
  return trpc.parent.getDashboard.useQuery()
}
