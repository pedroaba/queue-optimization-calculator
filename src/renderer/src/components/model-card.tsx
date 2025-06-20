import { cn } from '@renderer/lib/shadcn'
import { Button } from './shadcn/button'
import { Calculator } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './shadcn/card'
import type { Model } from '@renderer/constants/models'
import { memo } from 'react'
import { getModelColor } from '@renderer/utils/model-ui'

import { Tooltip, TooltipContent, TooltipTrigger } from './shadcn/tooltip'
import { Badge } from './shadcn/badge'
import { tagMap } from '@renderer/constants/tag-map'

import { useNavigate } from 'react-router-dom'

type ModelCardProps = {
  model: Model
}

function ModelCardComp({ model }: ModelCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      key={model.id}
      className={cn(
        'bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer transform lg:hover:scale-105',
        'flex flex-col',
      )}
      //   onClick={() => model.available && handleModelClick(model.id)}
    >
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <div className={cn('rounded-lg', getModelColor(model.name))}>
            <Calculator className="size-6 text-white" />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <CardTitle className="text-white text-xl">{model.name}</CardTitle>
            {model.tags?.map((tag) => {
              return (
                <Badge key={tag} variant={tag as any}>
                  {tagMap[tag]}
                </Badge>
              )
            })}
          </div>
        </div>
        <CardDescription className="text-gray-300 text-sm leading-relaxed">
          <Tooltip>
            <TooltipTrigger>
              <p className="line-clamp-6 text-left">{model.preview}...</p>
            </TooltipTrigger>

            <TooltipContent className="max-w-96">
              {model.preview}
            </TooltipContent>
          </Tooltip>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-between items-start grow">
        <div className="space-y-3 grow"></div>
        <Button
          className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigate(`/calculator/${model.slug}`)
          }}
        >
          Abrir Calculadora
        </Button>
      </CardContent>
    </Card>
  )
}

export const ModelCard = memo(ModelCardComp)
