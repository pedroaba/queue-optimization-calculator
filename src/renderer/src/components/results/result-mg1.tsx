import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Badge } from '@renderer/components/shadcn/badge'
import { TrendingUp, Users, Activity, Clock, AlertTriangle } from 'lucide-react'

interface MG1Result {
  rho: number
  Lq?: number
  L?: number
  Wq?: number
  W?: number
  error?: string
}

interface ResultDisplayMG1Props {
  results: MG1Result
}

export function ResultDisplayMG1({ results }: ResultDisplayMG1Props) {
  const formatNumber = (num: number | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A'
    return Number(num).toFixed(4)
  }

  const getUtilizationColor = (rho: number) => {
    if (rho < 0.5) return 'bg-green-500'
    if (rho < 0.8) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getUtilizationStatus = (rho: number) => {
    if (rho < 0.5) return 'Baixa utilização'
    if (rho < 0.8) return 'Utilização moderada'
    return 'Alta utilização'
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resultados M/G/1
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alerta de sistema instável */}
        {'error' in results && results.error && (
          <div className="flex items-center gap-2 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20 text-yellow-300">
            <AlertTriangle className="h-5 w-5" />
            <span>{results.error}</span>
          </div>
        )}

        {/* Utilização do Sistema */}
        {'rho' in results && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">
                Utilização do Sistema (ρ)
              </span>
              <Badge
                className={`${getUtilizationColor(results.rho)} text-white`}
              >
                {getUtilizationStatus(results.rho)}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(results.rho)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUtilizationColor(results.rho)}`}
                style={{ width: `${Math.min(results.rho * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-4">
          {'L' in results && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  Número médio no sistema (L)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatNumber(results.L)}
              </div>
            </div>
          )}

          {'Lq' in results && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">
                  Número médio na fila (Lq)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatNumber(results.Lq)}
              </div>
            </div>
          )}

          {'W' in results && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Tempo médio no sistema (W)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatNumber(results.W)}
              </div>
            </div>
          )}

          {'Wq' in results && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">
                  Tempo médio na fila (Wq)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatNumber(results.Wq)}
              </div>
            </div>
          )}
        </div>

        {/* Fórmulas usadas */}
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Fórmulas Utilizadas</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>ρ = λ / μ</div>
            <div>Lq = (λ² × σ² + ρ²) / [2 × (1 - ρ)]</div>
            <div>L = Lq + ρ</div>
            <div>Wq = Lq / λ</div>
            <div>W = Wq + 1/μ</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
