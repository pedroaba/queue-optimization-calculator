import { cn } from '@renderer/lib/shadcn'
import type { ComponentProps } from 'react'

type FooterSectionProps = ComponentProps<'footer'>

export function FooterSection({
  className,
  children,
  ...props
}: FooterSectionProps) {
  return (
    <footer
      className={cn('border-t border-white/10 py-8', className)}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm flex items-center gap-2 justify-center">
        © 2025 - Todos os direitos reservados
        {children}
      </div>
    </footer>
  )
}
