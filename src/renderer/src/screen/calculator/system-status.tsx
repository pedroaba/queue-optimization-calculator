import { Badge } from '@renderer/components/shadcn/badge'
import { Card, CardContent } from '@renderer/components/shadcn/card'
import { AlertCircle, CheckCircle2, Target } from 'lucide-react'

type SystemStatusProps = {
  status: {
    status: string
    message: string
    color: string
  }
}

export function SystemStatus({ status: systemStatus }: SystemStatusProps) {
  return (
    <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {systemStatus.status === 'stable' ? (
              <CheckCircle2 className="size-6 text-green-400" />
            ) : systemStatus.status === 'unstable' ? (
              <AlertCircle className="size-6 text-red-400" />
            ) : (
              <Target className="size-6 text-gray-400" />
            )}
            <div>
              <h3 className="text-white font-semibold text-lg">
                Status do Sistema
              </h3>
              <p className="text-gray-300">{systemStatus.message}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`px-4 py-2 text-sm border-${systemStatus.color}-500/30 bg-${systemStatus.color}-500/10 text-${systemStatus.color}-400`}
          >
            {systemStatus.status === 'stable'
              ? 'Estável'
              : systemStatus.status === 'unstable'
                ? 'Instável'
                : 'Aguardando dados'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
