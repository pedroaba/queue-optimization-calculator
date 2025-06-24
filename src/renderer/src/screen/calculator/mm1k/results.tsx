import {
  TrendingUp,
  Users,
  Clock,
  Activity,
  Timer,
  Zap,
  Calculator,
  SquareStack,
  Hash,
} from 'lucide-react'

import type { Results } from '@renderer/lib/models/mm1k'

interface ResultsDisplayProps {
  results: Results | null
}

export function MM1KResultCalculator({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="text-center py-16">
        <Calculator className="w-20 h-20 mx-auto text-blue-400 mb-6 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-200 mb-3">
          Resultados aparecerão aqui
        </h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Preencha os campos obrigatórios (λ, μ, K, t) e clique em "Calcular
          Resultados" para ver as métricas do sistema de filas.
        </p>
      </div>
    )
  }

  const formatNumber = (value: number, digits = 4) => {
    if (isNaN(value) || !isFinite(value)) return '∞'
    return value.toFixed(digits)
  }
  const formatPercent = (value: number | null | undefined, digits = 2) => {
    if (
      value === null ||
      value === undefined ||
      isNaN(value) ||
      !isFinite(value)
    )
      return 'N/A'
    return (value * 100).toFixed(digits) + '%'
  }

  // Pn mostrado para o maior n solicitado (como referência rápida)
  const lastN = results.pnList.length - 1
  const lastPn = results.pnList[lastN]

  // Caso queira mostrar P(n) para um valor específico (ex: n passado no formulário, supondo que esteja em results)
  // Exemplo: const pnForN = results.pnList[results.n ?? 0];

  return (
    <div>
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
        <h2 className="text-xl font-semibold text-white">
          Resultados do Sistema M/M/1/K
        </h2>
      </div>

      {/* Parâmetros usados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-blue-300 text-sm mb-1">
            <Zap className="w-4 h-4 mr-2" /> λ
          </div>
          <div className="font-bold text-white">
            {formatNumber(results.lambda ?? 0)}
          </div>
          <div className="text-xs text-gray-400">Taxa de chegada</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-green-300 text-sm mb-1">
            <Activity className="w-4 h-4 mr-2" /> μ
          </div>
          <div className="font-bold text-white">
            {formatNumber(results.mu ?? 0)}
          </div>
          <div className="text-xs text-gray-400">Taxa de serviço</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-indigo-300 text-sm mb-1">
            <SquareStack className="w-4 h-4 mr-2" /> K
          </div>
          <div className="font-bold text-white">{results.K ?? '?'}</div>
          <div className="text-xs text-gray-400">Capacidade máxima</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-pink-300 text-sm mb-1">
            <Timer className="w-4 h-4 mr-2" /> t
          </div>
          <div className="font-bold text-white">
            {results.t !== undefined ? formatNumber(results.t) : 'N/A'}
          </div>
          <div className="text-xs text-gray-400">Tempo para P(W&gt;t)</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Utilização, P0, PK, λEfetivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
          <div className="bg-gradient-to-br from-fuchsia-600/20 to-fuchsia-800/20 rounded-xl p-5 border border-fuchsia-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-fuchsia-300 font-medium">Pᴋ</div>
              <div className="w-2 h-2 bg-fuchsia-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-fuchsia-400 mb-1">
              {formatPercent(results.PK)}
            </div>
            <div className="text-xs text-fuchsia-200">
              Probabilidade de sistema cheio
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-xl p-5 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-emerald-300 font-medium">
                λ efetivo
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {formatNumber(results.lambdaEffective)}
            </div>
            <div className="text-xs text-emerald-200">
              Chegadas aceitas por unidade de tempo
            </div>
          </div>
        </div>

        {/* Probabilidade de overflow (n > K) */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center mb-2">
            <Hash className="w-4 h-4 mr-2 text-rose-400" />
            <div className="text-sm text-gray-300">
              P<sub>Overflow</sub> (n &gt; K)
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 mb-1">
            {formatPercent(results.POverflow)}
          </div>
          <div className="text-xs text-gray-400">
            Probabilidade de haver mais que K clientes (overflow)
          </div>
        </div>

        {/* Probabilidades de tempo de espera */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="flex items-center mb-2">
              <Timer className="w-4 h-4 mr-2 text-cyan-400" />
              <div className="text-sm text-gray-300">P(W &gt; t)</div>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {formatPercent(results.PWGreaterThanT)}
            </div>
            <div className="text-xs text-gray-400">
              Probabilidade do tempo no sistema ser maior que t
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="flex items-center mb-2">
              <Timer className="w-4 h-4 mr-2 text-yellow-400" />
              <div className="text-sm text-gray-300">P(Wq &gt; t)</div>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {formatPercent(results.PWqGreaterThanT)}
            </div>
            <div className="text-xs text-gray-400">
              Probabilidade do tempo de espera na fila ser maior que t
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
                W (Tempo no Sistema) em minutos
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.W)}
              </div>
              <div className="text-xs text-gray-400">Tempo médio total</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Wq (Tempo na Fila) em minutos
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.Wq)}
              </div>
              <div className="text-xs text-gray-400">Tempo médio de espera</div>
            </div>
          </div>
        </div>

        {/* Pn para o último n */}
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-5 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-purple-300 font-medium">
              Pₙ (n = {lastN})
            </div>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {formatPercent(lastPn)}
          </div>
          <div className="text-xs text-purple-200">
            Probabilidade de exatamente n = {lastN} clientes no sistema
          </div>
        </div>

        {/* Distribuição Pn */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30 mt-6">
          <div className="flex items-center mb-2">
            <Hash className="w-4 h-4 mr-2 text-purple-400" />
            <div className="text-sm text-gray-300">
              Pₙ (Distribuição de probabilidades)
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.pnList.map((p, idx) => (
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
            Fórmulas Utilizadas (M/M/1/K)
          </h3>
        </div>
        <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-700/50 text-base">
          <ul className="space-y-3 text-white">
            <li>
              <b>Fator de Utilização (ρ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                ρ = λ / μ
              </pre>
            </li>
            <li>
              <b>Probabilidade do sistema vazio (P₀):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`Se ρ ≠ 1:
  P₀ = [ (1 - ρ) / (1 - ρ^{K+1}) ]

Se ρ = 1:
  P₀ = 1 / (K + 1)
`}
              </pre>
            </li>
            <li>
              <b>Probabilidade de ter n clientes (Pₙ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`Se ρ ≠ 1:
  Pₙ = ρⁿ · P₀

Se ρ = 1:
  Pₙ = P₀
`}
              </pre>
            </li>
            <li>
              <b>Probabilidade do sistema cheio (Pᴋ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Pᴋ = ρᴷ · P₀
              </pre>
            </li>
            <li>
              <b>
                Taxa efetiva de chegada (λ<sub>efetivo</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λ<sub>efetivo</sub> = λ · (1 - Pᴋ)
              </pre>
            </li>
            <li>
              <b>Número médio de clientes no sistema (L):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`L = Σ [n · Pₙ],  para n = 0 até K
(ou fórmula fechada para L se desejar)`}
              </pre>
            </li>
            <li>
              <b>Número médio na fila (Lq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`Lq = L - (1 - P₀)`}
              </pre>
            </li>
            <li>
              <b>Tempo médio no sistema (W):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                W = L / λ<sub>efetivo</sub>
              </pre>
            </li>
            <li>
              <b>Tempo médio na fila (Wq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Wq = Lq / λ<sub>efetivo</sub>
              </pre>
            </li>
            <li>
              <b>
                Probabilidade de overflow (P<sub>Overflow</sub>):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P<sub>Overflow</sub> = Pᴋ
              </pre>
            </li>
            <li>
              <b>
                Probabilidade do tempo no sistema ser maior que t (P(W &gt; t)):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P(W &gt; t) ≈ e<sup>-μ(1-ρ)t</sup> &nbsp;&nbsp;(aproximação para
                K grande)
              </pre>
            </li>
            <li>
              <b>
                Probabilidade do tempo de espera na fila ser maior que t (P(Wq
                &gt; t)):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P(Wq &gt; t) ≈ e<sup>-μ(1-ρ)t</sup> &nbsp;&nbsp;(aproximação
                para K grande)
              </pre>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
