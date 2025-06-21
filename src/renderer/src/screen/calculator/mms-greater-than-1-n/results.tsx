import { TrendingUp, Users, Clock, Calculator, Hash } from 'lucide-react'

import type { Results } from '@renderer/lib/models/mms-greater-than-1-n'

interface ResultsDisplayProps {
  results: Results | null
}

export function MMSGreaterThanOneNResultCalculator({
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
          Preencha todos os campos obrigatórios e clique em "Calcular
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
          Resultados do Sistema M/M/s/N (População Finita)
        </h2>
      </div>

      {/* Parâmetros usados */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-blue-300 text-sm mb-1">N</div>
          <div className="font-bold text-white">{results.N}</div>
          <div className="text-xs text-gray-400">Tamanho da população</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-green-300 text-sm mb-1">s</div>
          <div className="font-bold text-white">{results.s ?? '?'}</div>
          <div className="text-xs text-gray-400">Servidores</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-yellow-300 text-sm mb-1">
            λ individual
          </div>
          <div className="font-bold text-white">
            {formatNumber(results.lambdaIndividual)}
          </div>
          <div className="text-xs text-gray-400">
            Taxa de chegada por cliente
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-pink-300 text-sm mb-1">μ</div>
          <div className="font-bold text-white">{formatNumber(results.mu)}</div>
          <div className="text-xs text-gray-400">
            Taxa de serviço por servidor
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-5 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-300 font-medium">
                P₀ (Sistema vazio)
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {formatPercent(results.P0)}
            </div>
            <div className="text-xs text-blue-200">
              Probabilidade do sistema estar vazio
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-5 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-green-300 font-medium">
                ρ (Utilização)
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {formatPercent(results.rho)}
            </div>
            <div className="text-xs text-green-200">
              Utilização média dos servidores
            </div>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-600/20 to-fuchsia-800/20 rounded-xl p-5 border border-fuchsia-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-fuchsia-300 font-medium">
                λ efetiva
              </div>
              <div className="w-2 h-2 bg-fuchsia-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-fuchsia-400 mb-1">
              {formatNumber(results.lambdaEffective)}
            </div>
            <div className="text-xs text-fuchsia-200">
              Chegadas aceitas por unidade de tempo
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
      </div>

      {/* Fórmulas utilizadas */}
      <div className="mt-10">
        <div className="flex items-center mb-3">
          <Calculator className="w-5 h-5 mr-2 text-violet-400" />
          <h3 className="text-lg font-semibold text-violet-400">
            Fórmulas Utilizadas (M/M/s/N - População Finita)
          </h3>
        </div>
        <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-700/50 text-base">
          <ul className="space-y-3 text-white">
            <li>
              <b>N:</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Tamanho da população total (clientes possíveis)
              </pre>
            </li>
            <li>
              <b>
                Taxa de chegada individual (λ<sub>ind</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λ<sub>ind</sub> = 1 / (tempo médio entre chegadas)
              </pre>
            </li>
            <li>
              <b>
                Taxa de chegada efetiva para n clientes (λ<sub>n</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λ<sub>n</sub> = (N - n) · λ<sub>ind</sub>
              </pre>
            </li>
            <li>
              <b>
                Taxa de serviço total para n clientes (μ<sub>n</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                μ<sub>n</sub> = min(n, s) · μ
              </pre>
            </li>
            <li>
              <b>Probabilidade de ter n clientes (Pₙ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`P₀ = 1 / Σ [ Π (λᵢ / μᵢ) ] para i=1 até n, soma n=0 até N

Pₙ = [ Π (λᵢ / μᵢ) ] · P₀   para n = 1 até N
(usar λᵢ e μᵢ conforme acima)
`}
              </pre>
            </li>
            <li>
              <b>Probabilidade do sistema vazio (P₀):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Conforme acima, usando a soma de produtos para n=0 até N
              </pre>
            </li>
            <li>
              <b>Utilização média dos servidores (ρ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                ρ = (λ<sub>efetiva</sub>) / (s · μ)
              </pre>
            </li>
            <li>
              <b>
                Taxa efetiva de chegada (λ<sub>efetiva</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λ<sub>efetiva</sub> = Σ [λ<sub>n</sub> · Pₙ] para n=0 até N-1
              </pre>
            </li>
            <li>
              <b>Número médio de clientes no sistema (L):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                L = Σ [n · Pₙ] para n=0 até N
              </pre>
            </li>
            <li>
              <b>Número médio na fila (Lq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Lq = L - (1 - P₀)
              </pre>
            </li>
            <li>
              <b>Tempo médio no sistema (W):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                W = L / λ<sub>efetiva</sub>
              </pre>
            </li>
            <li>
              <b>Tempo médio na fila (Wq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Wq = Lq / λ<sub>efetiva</sub>
              </pre>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
