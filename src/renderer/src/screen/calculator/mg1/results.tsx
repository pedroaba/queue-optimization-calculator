import { TrendingUp, Users, Clock, Calculator } from 'lucide-react'

import type { Results } from '@renderer/lib/models/mg1'

interface ResultsDisplayProps {
  results: Results | null
}

export function MG1ResultCalculator({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="text-center py-16">
        <Calculator className="w-20 h-20 mx-auto text-blue-400 mb-6 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-200 mb-3">
          Resultados aparecerão aqui
        </h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Preencha os campos obrigatórios (λ, μ, σ) e clique em "Calcular
          Resultados" para ver as métricas do sistema de filas.
        </p>
      </div>
    )
  }

  const formatNumber = (value: number, digits = 4) => {
    if (isNaN(value) || !isFinite(value)) return '∞'
    return value.toFixed(digits)
  }
  const formatPercent = (value: number, digits = 2) => {
    if (isNaN(value) || !isFinite(value)) return 'N/A'
    return (value * 100).toFixed(digits) + '%'
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
        <h2 className="text-xl font-semibold text-white">
          Resultados do Sistema M/G/1
        </h2>
      </div>

      {/* Parâmetros usados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-blue-300 text-sm mb-1">λ</div>
          <div className="font-bold text-white">
            {formatNumber(results.lambda)}
          </div>
          <div className="text-xs text-gray-400">Taxa de chegada</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-green-300 text-sm mb-1">μ</div>
          <div className="font-bold text-white">{formatNumber(results.mu)}</div>
          <div className="text-xs text-gray-400">Taxa de serviço</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-pink-300 text-sm mb-1">σ</div>
          <div className="font-bold text-white">
            {formatNumber(results.sigma)}
          </div>
          <div className="text-xs text-gray-400">
            Desvio padrão do tempo de serviço
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Utilização, P0 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-5 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-300 font-medium">
                ρ (Utilização)
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {formatNumber(results.rho)}
            </div>
            <div className="text-xs text-blue-200">
              {formatPercent(results.rho)} de ocupação
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-5 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-green-300 font-medium">
                P₀ (Sistema vazio)
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {formatPercent(results.P0)}
            </div>
            <div className="text-xs text-green-200">
              Probabilidade de nenhum cliente
            </div>
          </div>
        </div>

        {/* Métricas de Clientes */}
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
                L (Clientes no Sistema)
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(results.L)}
              </div>
              <div className="text-xs text-gray-400">
                Média total no sistema
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Lq (Clientes na Fila)
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(results.Lq)}
              </div>
              <div className="text-xs text-gray-400">
                Média aguardando serviço
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de Tempo */}
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
                W (Tempo no Sistema)
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.W)}
              </div>
              <div className="text-xs text-gray-400">Tempo médio total</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Wq (Tempo na Fila)
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.Wq)}
              </div>
              <div className="text-xs text-gray-400">Tempo médio de espera</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
