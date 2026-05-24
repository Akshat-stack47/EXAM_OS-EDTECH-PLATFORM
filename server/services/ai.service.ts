import { db } from '@/lib/db'
import { ai } from '@/lib/ai'

const EXAM_FALLBACKS: Record<string, string> = {
  upsc: 'Focus on Polity (75+ questions), Modern History (50+), and Geography (45+). For CSAT, practice comprehension and reasoning daily.',
  ssc: 'Prioritize Quantitative Aptitude (35+ questions) and General Awareness (50+). Focus on current events from the last 6 months.',
  banking: 'Data Interpretation and Reasoning Ability carry the most weight. Practice speed calculations for 15 min daily.',
  neet: 'Biology (90 questions) is your highest-weight subject. Chemistry numericals need daily practice.',
  jee: 'Calculus and Mechanics in Physics carry ~40% weight. In Chemistry, focus on Physical and Organic sections.',
}

export const aiService = {
  async chat(userId: string, message: string, context?: { examType?: string }) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    try {
      const result = await ai.chat([
        { role: 'user', content: message },
      ], { userId, feature: 'mentor' })

      return {
        reply: result,
        context: context || null,
        timestamp: new Date().toISOString(),
      }
    } catch {
      const lower = message.toLowerCase()
      let reply: string

      if (context?.examType && EXAM_FALLBACKS[context.examType]) {
        reply = EXAM_FALLBACKS[context.examType]
      } else if (lower.includes('syllabus') || lower.includes('topics')) {
        reply = 'The syllabus depends on your exam type. Please specify UPSC, SSC, Banking, NEET, or JEE so I can give you the exact breakdown.'
      } else if (lower.includes('mock') || lower.includes('test') || lower.includes('practice')) {
        reply = 'I recommend taking at least 1 mock test per week and analyzing each wrong answer. Create an error log to track recurring mistakes.'
      } else if (lower.includes('time') || lower.includes('manage') || lower.includes('schedule')) {
        reply = 'A good study schedule allocates 6-8 hours daily with 50-min focus blocks and 10-min breaks. Revise for 2 hours every evening.'
      } else {
        reply = 'I\'m your ExamOS study assistant. I can help with syllabus queries, study planning, mock analysis, and exam strategies. What do you need help with?'
      }

      return {
        reply,
        context: context || null,
        timestamp: new Date().toISOString(),
      }
    }
  },
}
