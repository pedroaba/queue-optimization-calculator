import { cn } from '@renderer/lib/shadcn'
import type { ComponentProps } from 'react'
import { ScrollArea, ScrollBar } from './shadcn/scroll-area'

type ContainerProps = ComponentProps<'div'>

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <ScrollArea className="h-screen max-h-screen">
      <div
        {...props}
        className={cn(
          'max-w-7xl min-h-screen mx-auto px-6 sm:px-8 lg:px-10 pt-6 bg-zinc-950 flex flex-col',
          className,
        )}
      >
        {children}
      </div>

      <ScrollBar className="bg-transparent" orientation="vertical" />
    </ScrollArea>
  )
}
