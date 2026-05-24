export const dynamic = 'force-dynamic'

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl">🔧</div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Under Maintenance
        </h1>
        <p className="mb-6 text-muted-foreground">
          ExamOS is currently undergoing scheduled maintenance.
          We&apos;ll be back shortly.
        </p>
        <div className="text-sm text-muted-foreground">
          Expected downtime: ~15 minutes
        </div>
      </div>
    </div>
  )
}
