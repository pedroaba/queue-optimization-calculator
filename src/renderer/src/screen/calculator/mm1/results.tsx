import {
  ChartBar,
  TrendingUp,
  Clock,
  Users,
  AlertTriangle,
  Calculator,
} from 'lucide-react'

import type { Results } from '@renderer/lib/models/mm1'

interface ResultsDisplayProps {
  results: Results | null
}

export function MM1ResultCalculator({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="text-center py-16">
        <ChartBar className="w-20 h-20 mx-auto text-blue-400 mb-6 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-200 mb-3">
          Resultados aparecerão aqui
        </h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Preencha os campos obrigatórios (λ e μ) e clique em "Calcular
          Resultados" para ver as métricas do sistema de filas.
        </p>
      </div>
    )
  }

  const formatNumber = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '∞'
    return value.toFixed(4)
  }

  const formatPercentage = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return 'N/A'
    return (value * 100).toFixed(2) + '%'
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
        <h2 className="text-xl font-semibold text-white">
          Resultados do Sistema
        </h2>
      </div>

      <div className="space-y-6">
        {/* System Status Alert */}
        {results.unstable && (
          <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/40 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />
              <div className="text-red-400 font-semibold">
                ⚠️ Sistema Instável Detectado
              </div>
            </div>
            <div className="text-red-200 text-sm leading-relaxed">
              O fator de utilização (ρ ≥ 1) indica que o sistema não está em
              equilíbrio. A taxa de chegada deve ser menor que a taxa de
              atendimento para garantir estabilidade.
            </div>
          </div>
        )}

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-5 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-300 font-medium">
                Fator de Utilização (ρ)
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {formatNumber(results.rho)}
            </div>
            <div className="text-xs text-blue-200">
              {formatPercentage(results.rho)} de ocupação
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-5 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-green-300 font-medium">
                Sistema Vazio (P₀)
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {formatPercentage(results.P0)}
            </div>
            <div className="text-xs text-green-200">
              Probabilidade de 0 clientes
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-5 border border-purple-500/30 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-purple-300 font-medium">
                P(n clientes)
              </div>
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {formatPercentage(results.Pn)}
            </div>
            <div className="text-xs text-purple-200">
              Probabilidade de n clientes
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/40">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 mr-2 text-cyan-400" />
            <h3 className="text-lg font-semibold text-cyan-400">
              Métricas de Clientes
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Clientes no Sistema (L)
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(results.L)}
              </div>
              <div className="text-xs text-gray-400">Número médio total</div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Clientes na Fila (Lq)
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(results.Lq)}
              </div>
              <div className="text-xs text-gray-400">
                Aguardando atendimento
              </div>
            </div>
          </div>
        </div>

        {/* Time Metrics */}
        <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/40">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" />
            <h3 className="text-lg font-semibold text-yellow-400">
              Métricas de Tempo
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Tempo no Sistema (W)
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.W)}
              </div>
              <div className="text-xs text-gray-400">Tempo médio total</div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Tempo na Fila (Wq)
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.Wq)}
              </div>
              <div className="text-xs text-gray-400">Tempo médio de espera</div>
            </div>
          </div>
        </div>

        {/* Probability Metrics */}
        <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/40">
          <div className="flex items-center mb-4">
            <Calculator className="w-5 h-5 mr-2 text-orange-400" />
            <h3 className="text-lg font-semibold text-orange-400">
              Probabilidades Especiais
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                P(&gt; r clientes)
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {formatPercentage(results.PgtR)}
              </div>
              <div className="text-xs text-gray-400">Mais que r clientes</div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">P(W &gt; t)</div>
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {formatPercentage(results.PwGreaterThanT)}
              </div>
              <div className="text-xs text-gray-400">Tempo sistema &gt; t</div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30 sm:col-span-2 lg:col-span-1">
              <div className="text-sm text-gray-300 mb-2">P(Wq &gt; t)</div>
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {formatPercentage(results.PwqGreaterThanT)}
              </div>
              <div className="text-xs text-gray-400">Tempo fila &gt; t</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
