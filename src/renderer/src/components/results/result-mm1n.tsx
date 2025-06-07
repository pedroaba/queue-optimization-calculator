import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Badge } from '@renderer/components/shadcn/badge'
import { TrendingUp, Users, Activity, BarChart } from 'lucide-react'

interface ResultsDisplayProps {
  results: any
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
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

  // A chave pode vir como "ro" ou "rho"
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
        </div>

        {/* Probabilidades detalhadas para os estados */}
        {'Pn_list' in results && Array.isArray(results.Pn_list) && (
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">
                Probabilidade para cada estado P(n):
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {results.Pn_list.map((prob: number, index: number) => (
                <div
                  key={index}
                  className="rounded-lg bg-zinc-800 p-3 flex flex-col items-center"
                >
                  <div className="text-xs text-zinc-400">P(n={index})</div>
                  <div className="text-lg font-bold text-zinc-50">
                    {(prob * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    {prob.toExponential(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fórmulas usadas (opcional) */}
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Fórmulas Utilizadas</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>ρ = λ/μ</div>
            <div>
              P₀ = (1-ρ)/(1-ρ^(N+1)) para ρ ≠ 1; P₀ = 1/(N+1) para ρ = 1
            </div>
            <div>Pₙ = ρⁿ × P₀</div>
            <div>L = Σ(n × Pₙ)</div>
            <div>W = L / λₑ</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
