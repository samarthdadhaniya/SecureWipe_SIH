import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-8 pt-6 md:pb-10 md:pt-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">{title}</h1>
        {description && <p className="text-lg text-muted-foreground text-pretty">{description}</p>}
      </div>
      {children}
    </div>
  )
}
