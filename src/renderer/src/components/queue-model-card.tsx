import type { Model } from '@renderer/constants/models'
import { Badge } from './shadcn/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './shadcn/card'
import { tagMap } from '@renderer/constants/tag-map'

import { NavLink } from 'react-router-dom'

type QueueModelCardProps = {
  model: Model
}

export function QueueModelCard({ model }: QueueModelCardProps) {
  return (
    <NavLink to={`/model/${model.id}`} className="w-full h-full">
      <Card className="rounded bg-zinc-900 border-0 transition-all duration-700 cursor-pointer hover:scale-105 h-full">
        <CardContent className="p-4 flex flex-col justify-between h-full gap-10">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-semibold text-zinc-200">
              {model.name}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {model.preview}
            </CardDescription>
          </CardHeader>

          <div className="flex items-center justify-end flex-wrap w-full">
            {model.tags?.map((tag) => (
              <Badge key={tag} variant={tag as keyof typeof tagMap}>
                {tagMap[tag]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </NavLink>
  )
}
