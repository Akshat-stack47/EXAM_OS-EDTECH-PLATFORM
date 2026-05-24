import { Card, CardContent } from '@/components/ui/card'

interface ExamCardProps {
  title: string
  examType: string
  date: string
}

export const ExamCard = ({ title, examType, date }: ExamCardProps) => (
  <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
    <CardContent className="py-4">
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">Exam Type: {examType}</p>
      <p className="text-sm text-gray-500">Date: {date}</p>
    </CardContent>
  </Card>
)
