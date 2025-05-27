import { cn } from '@renderer/lib/shadcn'
import type { ComponentProps } from 'react'

type TitleProps = ComponentProps<'h1'>

export function Title({ className, ...props }: TitleProps) {
  return <h1 {...props} className={cn('text-4xl font-semibold', className)} />
}
