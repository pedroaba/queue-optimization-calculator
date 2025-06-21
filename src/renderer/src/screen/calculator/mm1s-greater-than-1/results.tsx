import {
  TrendingUp,
  Users,
  Clock,
  Activity,
  Sigma,
  Timer,
  Zap,
  Calculator,
} from 'lucide-react'

import type { Results } from '@renderer/lib/models/mms-greater-than-1'

interface ResultsDisplayProps {
  results: Results | null
}

export function MMSGreaterThanOneResultCalculator({
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
          Preencha os campos obrigatórios (λ, μ e s) e clique em "Calcular
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
          Resultados do Sistema M/M/s
        </h2>
      </div>

      {/* Parâmetros usados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-blue-300 text-sm mb-1">
            <Zap className="w-4 h-4 mr-2" /> λ
          </div>
          <div className="font-bold text-white">
            {formatNumber(results.lambda)}
          </div>
          <div className="text-xs text-gray-400">Taxa de chegada</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-green-300 text-sm mb-1">
            <Activity className="w-4 h-4 mr-2" /> μ
          </div>
          <div className="font-bold text-white">{formatNumber(results.mu)}</div>
          <div className="text-xs text-gray-400">
            Taxa de serviço por servidor
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-purple-300 text-sm mb-1">
            <Users className="w-4 h-4 mr-2" /> s
          </div>
          <div className="font-bold text-white">{results.s ?? '?'}</div>
          <div className="text-xs text-gray-400">Servidores</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Utilização e P0 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-5 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-300 font-medium">
                ρ (Utilização)
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {formatNumber(results.ro)}
            </div>
            <div className="text-xs text-blue-200">
              {formatPercent(results.ro)} de ocupação
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

        {/* Probabilidade Pn */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center mb-2">
            <Sigma className="w-4 h-4 mr-2 text-purple-400" />
            <div className="text-sm text-gray-300">
              Pₙ (n clientes no sistema)
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {formatPercent(results.Pn)}
          </div>
          <div className="text-xs text-gray-400">
            Probabilidade de haver exatamente n clientes
          </div>
        </div>

        {/* Probabilidade tempo de espera */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="flex items-center mb-2">
              <Timer className="w-4 h-4 mr-2 text-cyan-400" />
              <div className="text-sm text-gray-300">P(W &gt; t)</div>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {formatPercent(results.P_more_than_r)}
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
              {formatPercent(results.P_W_greater_than_t)}
            </div>
            <div className="text-xs text-gray-400">
              Probabilidade do tempo de espera na fila ser maior que t
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="flex items-center mb-2">
              <Timer className="w-4 h-4 mr-2 text-green-400" />
              <div className="text-sm text-gray-300">P(Wq = 0)</div>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {formatPercent(results.P_W_equal_0)}
            </div>
            <div className="text-xs text-gray-400">
              Probabilidade de tempo de espera ser zero
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

      {/* Fórmulas utilizadas */}
      <div className="mt-10">
        <div className="flex items-center mb-3">
          <Calculator className="w-5 h-5 mr-2 text-violet-400" />
          <h3 className="text-lg font-semibold text-violet-400">
            Fórmulas Utilizadas (M/M/s)
          </h3>
        </div>
        <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-700/50 text-base">
          <ul className="space-y-3 text-white">
            <li>
              <b>Fator de Utilização (ρ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                ρ = λ / (s · μ)
              </pre>
            </li>
            <li>
              <b>Probabilidade do sistema vazio (P₀):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`P₀ = 1 /
  (
    Σ [ (λ/μ)^n / n! ] de n=0 até s-1
    +
    [ (λ/μ)^s / s! ] · [ 1 / (1 - ρ) ]
  )
`}
              </pre>
            </li>
            <li>
              <b>Probabilidade de haver n clientes (Pₙ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`Se n < s:
  Pₙ = [ (λ/μ)^n / n! ] · P₀

Se n ≥ s:
  Pₙ = [ (λ/μ)^n / (s! · s^{n-s}) ] · P₀
`}
              </pre>
            </li>
            <li>
              <b>Número médio de clientes no sistema (L):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                L = Lq + λ / μ
              </pre>
            </li>
            <li>
              <b>Número médio na fila (Lq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`Lq = [ (λ/μ)^s · ρ / (s! · (1 - ρ)^2) ] · P₀`}
              </pre>
            </li>
            <li>
              <b>Tempo médio no sistema (W):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                W = L / λ
              </pre>
            </li>
            <li>
              <b>Tempo médio na fila (Wq):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Wq = Lq / λ
              </pre>
            </li>
            <li>
              <b>
                Probabilidade do tempo na fila ser maior que t (P(Wq &gt; t)):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P(Wq &gt; t) = P_espera · e<sup>-μ(1-ρ)t</sup>
              </pre>
            </li>
            <li>
              <b>
                Probabilidade do tempo no sistema ser maior que t (P(W &gt; t)):
              </b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P(W &gt; t) = e<sup>-μ t</sup> · Σ [ (μ t)^k / k! ] para k = 0
                até s-1
              </pre>
            </li>
            <li>
              <b>Probabilidade de não esperar na fila (P(Wq = 0)):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P(Wq = 0) = 1 - P_espera
              </pre>
            </li>
            <li>
              <b>Probabilidade de esperar na fila (P_espera):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                P_espera = [ (λ/μ)^s / (s! (1 - ρ)) ] · P₀
              </pre>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
