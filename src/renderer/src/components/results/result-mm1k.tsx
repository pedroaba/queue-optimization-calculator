import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Badge } from '@renderer/components/shadcn/badge'
import { TrendingUp, Clock, Users, Activity, BarChart } from 'lucide-react'

interface ResultsDisplayProps {
  results: any
  K: number
}

export function ResultsDisplay({ results, K }: ResultsDisplayProps) {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A'
    return Number(num).toFixed(4)
  }

  const getUtilizationColor = (ro: number) => {
    if (ro < 0.5) return 'bg-green-500'
    if (ro < 0.8) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getUtilizationStatus = (ro: number) => {
    if (ro < 0.5) return 'Baixa utilização'
    if (ro < 0.8) return 'Utilização moderada'
    return 'Alta utilização'
  }

  // O campo pode vir como "rho" ou "ro"
  const ro = 'ro' in results ? results.ro : results.rho

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resultados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Utilização do Sistema */}
        {typeof ro === 'number' && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">
                Utilização do Sistema (ρ)
              </span>
              <Badge className={`${getUtilizationColor(ro)} text-white`}>
                {getUtilizationStatus(ro)}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(ro)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUtilizationColor(ro)}`}
                style={{ width: `${Math.min(ro * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Principais métricas */}
        <div className="grid grid-cols-2 gap-4">
          {'L' in results && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  Clientes no Sistema (L)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                L = {formatNumber(results.L)}
              </div>
            </div>
          )}

          {'Lq' in results && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">
                  Clientes na Fila (Lq)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                Lq = {formatNumber(results.Lq)}
              </div>
            </div>
          )}

          {'W' in results && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Tempo no Sistema (W)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                W = {formatNumber(results.W)}
              </div>
            </div>
          )}

          {'Wq' in results && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">
                  Tempo na Fila (Wq)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                Wq = {formatNumber(results.Wq)}
              </div>
            </div>
          )}
        </div>

        {/* Resultados adicionais */}
        <div className="space-y-3">
          {'P0' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade do sistema vazio (P₀)
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.P0)}
              </span>
            </div>
          )}

          {/* Para modelos com capacidade máxima */}
          {'lambda_bar' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Taxa efetiva de chegada (λₑ)
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.lambda_bar)}
              </span>
            </div>
          )}

          {`P(n=K)` in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade do sistema cheio (P(n={K}))
              </span>
              <span className="text-white font-medium">
                {formatNumber(results[`P(n=K)`])}
              </span>
            </div>
          )}

          {`P(n>K)` in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade de overflow (P(n&gt;{K}))
              </span>
              <span className="text-white font-medium">
                {formatNumber(results[`P(n>K)`])}
              </span>
            </div>
          )}

          {'pnList' in results && Array.isArray(results.pnList) && (
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">
                  Probabilidade para cada estado P(n):
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {results.pnList.map((value: number, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-zinc-800 p-3 flex flex-col items-center"
                  >
                    <div className="text-xs text-zinc-400">P(n={idx})</div>
                    <div className="text-lg font-bold text-zinc-50">
                      {(value * 100).toFixed(4)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fórmulas usadas (opcional, pode personalizar) */}
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Fórmulas Utilizadas</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>ρ = λ/μ</div>
            <div>L = ρ/(1-ρ)</div>
            <div>Lq = ρ²/(1-ρ)</div>
            <div>W = 1/(μ-λ)</div>
            <div>Wq = λ/(μ(μ-λ))</div>
            <div>P₀ = 1-ρ</div>
            <div>P(n) = (ρ/μ) * (ρ/(1-ρ))^n</div>
            <div>
              P(n&gt;K) = (ρ/μ) * (ρ/(1-ρ))^K * Σ((ρ/μ)^k) / (1 - (ρ/μ)^K)
            </div>
            <div>λₑ = λ * (1 - (ρ/μ)^K)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
