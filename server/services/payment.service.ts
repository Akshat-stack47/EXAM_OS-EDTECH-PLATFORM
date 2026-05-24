import { db } from '@/lib/db'

const MOCK_PAYMENTS = [
  { id: '1', amount: 499, plan: 'Monthly Premium', status: 'active', nextBilling: new Date(Date.now() + 30 * 86400000).toISOString(), createdAt: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: '2', amount: 999, plan: 'Mock Test Pack (50 tests)', status: 'completed', createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: '3', amount: 1499, plan: 'Mentorship 1-on-1 (5 sessions)', status: 'completed', createdAt: new Date(Date.now() - 45 * 86400000).toISOString() },
  { id: '4', amount: 299, plan: 'Exam Cutoff Data Access', status: 'completed', createdAt: new Date(Date.now() - 90 * 86400000).toISOString() },
]

export const paymentService = {
  async list(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    return {
      payments: MOCK_PAYMENTS,
      totalSpent: MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0),
      activePlan: MOCK_PAYMENTS.find(p => p.status === 'active') || null,
    }
  },
}
