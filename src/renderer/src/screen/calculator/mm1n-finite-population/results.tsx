import {
  TrendingUp,
  Users,
  Clock,
  Calculator,
  Hash,
  AlertTriangle,
} from 'lucide-react'

import type { Results } from '@renderer/lib/models/mm1n-finite-population'

interface ResultsDisplayProps {
  results: Results | null
}

export function MM1NFinitePopulationResultCalculator({
  results,
}: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="text-center py-16">
        <Calculator className="w-20 h-20 mx-auto text-blue-400 mb-6 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-200 mb-3">
          Resultados aparecerão aqui
        </h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Preencha os campos obrigatórios (N, tempo médio entre falhas, tempo
          médio de conserto) e clique em "Calcular Resultados" para ver as
          métricas do sistema de filas.
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
    return value.toFixed(digits) + '%'
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
        <h2 className="text-xl font-semibold text-white">
          Resultados do Sistema M/M/1/N (População Finita)
        </h2>
      </div>

      {/* Parâmetros usados */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-blue-300 text-sm mb-1">N</div>
          <div className="font-bold text-white">{results.N}</div>
          <div className="text-xs text-gray-400">Total de unidades</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-green-300 text-sm mb-1">
            λ efetiva
          </div>
          <div className="font-bold text-white">
            {formatNumber(results.lambdaEffective)}
          </div>
          <div className="text-xs text-gray-400">
            Taxa efetiva de falhas atendidas
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-pink-300 text-sm mb-1">
            Tempo ocioso (%)
          </div>
          <div className="font-bold text-white">
            {formatPercent(results.idlePercentage)}
          </div>
          <div className="text-xs text-gray-400">
            Porcentagem do tempo ocioso
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-yellow-300 text-sm mb-1">
            P0
          </div>
          <div className="font-bold text-white">{formatNumber(results.P0)}</div>
          <div className="text-xs text-gray-400">
            Probabilidade de nenhuma unidade quebrada
          </div>
        </div>
      </div>

      {/* Novos cards: Utilização e prob. todas unidades quebradas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-violet-600/20 to-violet-800/20 rounded-xl p-5 border border-violet-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-violet-300 font-medium">
              Utilização do técnico
            </div>
            <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-violet-400 mb-1">
            {formatPercent(results.utilization)}
          </div>
          <div className="text-xs text-violet-200">
            Porcentagem do tempo ocupado
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-600/20 to-rose-800/20 rounded-xl p-5 border border-rose-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-rose-300 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Prob. todas unidades quebradas
            </div>
            <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-rose-400 mb-1">
            {formatPercent(results.allBrokenProbability)}
          </div>
          <div className="text-xs text-rose-200">
            Todas as unidades indisponíveis
          </div>
        </div>
      </div>

      {/* Custos por Hora */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-5 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-yellow-300 font-medium">
              Custo por hora - máquinas paradas
            </div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            R$ {formatNumber(results.stopMachineCostPerHour, 2)}
          </div>
          <div className="text-xs text-yellow-200">
            Total gasto por hora com máquinas paradas
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-5 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-blue-300 font-medium">
              Custo por hora - técnico
            </div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-1">
            R$ {formatNumber(results.technicianCostPerHour, 2)}
          </div>
          <div className="text-xs text-blue-200">
            Total gasto por hora com técnico em manutenção
          </div>
        </div>
        {/* <div className="bg-gradient-to-br col-span-2 from-green-600/20 to-green-800/20 rounded-xl p-5 border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-green-300 font-medium">
              Custo diário total
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-1">
            R$ {formatNumber(results.dailyCost, 2)}
          </div>
          <div className="text-xs text-green-200">
            Total gasto por dia (8 horas)
          </div>
        </div> */}
      </div>

      {/* Métricas das Unidades */}
      <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/40">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 mr-2 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400">
            Métricas das Unidades
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="text-sm text-gray-300 mb-2">
              L (Unidades quebradas)
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(results.L)}
            </div>
            <div className="text-xs text-gray-400">
              Média de unidades quebradas
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="text-sm text-gray-300 mb-2">
              Lq (Unidades na fila)
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(results.Lq)}
            </div>
            <div className="text-xs text-gray-400">
              Média aguardando conserto
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
            <div className="text-sm text-gray-300 mb-2">W (Tempo quebrada)</div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {formatNumber(results.W)}
            </div>
            <div className="text-xs text-gray-400">Tempo médio quebrada</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="text-sm text-gray-300 mb-2">
              Wq (Tempo de espera)
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {formatNumber(results.Wq)}
            </div>
            <div className="text-xs text-gray-400">
              Tempo médio aguardando conserto
            </div>
          </div>
        </div>
      </div>

      {/* Distribuição das probabilidades (Pn) */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30 mt-6">
        <div className="flex items-center mb-2">
          <Hash className="w-4 h-4 mr-2 text-purple-400" />
          <div className="text-sm text-gray-300">
            Distribuição das probabilidades (Pn)
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {results.PnList.map((p, idx) => (
            <span
              key={idx}
              className="bg-purple-900/30 text-purple-200 px-3 py-1 rounded-lg text-xs"
            >
              P({idx}) = {formatPercent(p)}
            </span>
          ))}
        </div>
      </div>

      {/* Fórmulas utilizadas */}
      <div className="mt-10">
        <div className="flex items-center mb-3">
          <Calculator className="w-5 h-5 mr-2 text-violet-400" />
          <h3 className="text-lg font-semibold text-violet-400">
            Fórmulas Utilizadas (M/M/1/N com População Finita)
          </h3>
        </div>
        <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-700/50 text-base">
          <ul className="space-y-3 text-white">
            <li>
              <b>N:</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Número total de unidades no sistema
              </pre>
            </li>
            <li>
              <b>Taxa de falha individual (λ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λ = 1 / (tempo médio entre falhas)
              </pre>
            </li>
            <li>
              <b>Taxa de conserto (μ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                μ = 1 / (tempo médio de conserto)
              </pre>
            </li>
            <li>
              <b>
                Taxa de chegada efetiva (λ<sub>n</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λₙ = (N - n) · λ
              </pre>
            </li>
            <li>
              <b>
                Taxa de serviço efetiva (μ<sub>n</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                μₙ = μ (se há unidade para consertar; 0 se não há)
              </pre>
            </li>
            <li>
              <b>Probabilidade de ter n unidades quebradas (Pₙ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`P₀ = 1 / Σ [Π ( (N-i)·λ / μ )] para i=1 até n; soma para n=0 até N

Pₙ = [Π ( (N-i+1)·λ / μ )] · P₀   para n = 1 até N`}
              </pre>
            </li>
            <li>
              <b>Utilização do técnico (ρ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                ρ = 1 - P₀
              </pre>
            </li>
            <li>
              <b>Probabilidade de todas as unidades estarem quebradas:</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P(n = N) = P<sub>all broken</sub>
              </pre>
            </li>
            <li>
              <b>Número médio de unidades quebradas (L):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                L = Σ [n · Pₙ] (n de 0 a N)
              </pre>
            </li>
            <li>
              <b>Número médio de unidades aguardando conserto (Lq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Lq = L - (1 - P₀)
              </pre>
            </li>
            <li>
              <b>Tempo médio quebrada (W):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                W = L / λ<sub>efetiva</sub>
              </pre>
            </li>
            <li>
              <b>Tempo médio aguardando conserto (Wq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Wq = Lq / λ<sub>efetiva</sub>
              </pre>
            </li>
            <li>
              <b>
                λ<sub>efetiva</sub> (taxa efetiva de falhas atendidas):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λ<sub>efetiva</sub> = Σ [λₙ · Pₙ] (n de 0 a N-1)
              </pre>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
