import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Badge } from '@renderer/components/shadcn/badge'
import { TrendingUp, Clock, Users, Activity } from 'lucide-react'

interface ResultsDisplayProps {
  results: any
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const formatNumber = (num: number) => {
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

  // Pega tanto "ro" quanto "rho" como nome da prop
  const rho = 'ro' in results ? results.ro : results.rho

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
        {typeof rho === 'number' && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">
                Utilização do Sistema (ρ)
              </span>
              <Badge className={`${getUtilizationColor(rho)} text-white`}>
                {getUtilizationStatus(rho)}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(rho)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUtilizationColor(rho)}`}
                style={{ width: `${Math.min(rho * 100, 100)}%` }}
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

          {'Lq' in results && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">
                  Clientes na Fila (Lq)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                Lq = {formatNumber(results.Lq)}
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

          {'P_n_5' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade de 5 clientes (P(n=5))
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.P_n_5)}
              </span>
            </div>
          )}

          {'P_W_greater_3' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">P(W &gt; 3)</span>
              <span className="text-white font-medium">
                {formatNumber(results.P_W_greater_3)}
              </span>
            </div>
          )}

          {'P_Wq_greater_2' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">P(Wq &gt; 2)</span>
              <span className="text-white font-medium">
                {formatNumber(results.P_Wq_greater_2)}
              </span>
            </div>
          )}
        </div>

        {/* Fórmulas usadas (opcional) */}
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Fórmulas Utilizadas</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>ρ = λ/(sμ)</div>
            <div>L = Lq + λ/μ</div>
            <div>Lq = ...</div>
            <div>W = L/λ</div>
            <div>Wq = Lq/λ</div>
            <div>P0 = 1/[1 + ρ + ρ²/2 + ...]</div>
            <div>Pn = P0 * (ρ^n)</div>
            <div>P(W &gt; 3) = P0 * (ρ^n) * (3^n)</div>
            <div>P(Wq &gt; 2) = P0 * (ρ^n) * (2^n)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
