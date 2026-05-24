import { StudentLayoutShell } from './student-layout-shell.client'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentLayoutShell>{children}</StudentLayoutShell>
}
