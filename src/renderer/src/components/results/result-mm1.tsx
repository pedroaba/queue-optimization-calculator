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

  // console.log(JSON.stringify(results))

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
        {'ro' in results && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">
                Utilização do Sistema (ρ)
              </span>
              <Badge
                className={`${getUtilizationColor(results.ro)} text-white`}
              >
                {getUtilizationStatus(results.ro)}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(results.ro)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUtilizationColor(results.ro)}`}
                style={{ width: `${Math.min(results.ro * 100, 100)}%` }}
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

          {'Pn' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade de n clientes (Pn)
                {'n' in results && <> (n={results.n})</>}
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.Pn)}
              </span>
            </div>
          )}

          {'P_mais_que_r' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade de mais que r clientes (P&gt;r)
                {'r' in results && <> (r={results.r})</>}
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.P_mais_que_r)}
              </span>
            </div>
          )}

          {'P_W_maior_t' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade do tempo no sistema maior que t (P(W&gt;t))
                {'t' in results && <> (t={results.t})</>}
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.P_W_maior_t)}
              </span>
            </div>
          )}

          {'P_Wq_maior_t' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade do tempo na fila maior que t (P(Wq&gt;t))
                {'t' in results && <> (t={results.t})</>}
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.P_Wq_maior_t)}
              </span>
            </div>
          )}

          {/* Você pode adicionar outros campos se desejar */}
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
            {/* ... */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
