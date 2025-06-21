import { TrendingUp, BarChart3, Calculator } from 'lucide-react'
import type { Results } from '@renderer/lib/models/mss-with-priority'

interface ResultsDisplayProps {
  results: Results | null
}

export function MSSWithPriorityResultCalculator({
  results,
}: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="text-center py-16">
        <Calculator className="w-20 h-20 mx-auto text-blue-400 mb-6 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-200 mb-3">
          Os resultados aparecerão aqui
        </h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Preencha todos os campos obrigatórios e clique em "Calcular
          Resultados" para ver as métricas de filas para cada classe de
          prioridade.
        </p>
      </div>
    )
  }

  const formatNumber = (value: number, digits = 4) => {
    if (isNaN(value) || !isFinite(value)) return '∞'
    return value.toFixed(digits)
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
        <h2 className="text-xl font-semibold text-white">
          M/M/s com Prioridade - Resultados
        </h2>
      </div>

      {/* Métricas agregadas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-blue-300 text-sm mb-1">
            Número de classes
          </div>
          <div className="font-bold text-white">
            {results.W_by_class.length}
          </div>
          <div className="text-xs text-gray-400">Níveis de prioridade</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-green-300 text-sm mb-1">μ</div>
          <div className="font-bold text-white">
            {formatNumber(results.serviceRate)}
          </div>
          <div className="text-xs text-gray-400">
            Taxa de serviço (por servidor)
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center text-indigo-300 text-sm mb-1">
            s
          </div>
          <div className="font-bold text-white">{results.servers}</div>
          <div className="text-xs text-gray-400">Número de servidores</div>
        </div>
      </div>

      {/* Métricas por classe de prioridade */}
      <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/40 mb-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-5 h-5 mr-2 text-pink-400" />
          <h3 className="text-lg font-semibold text-pink-400">
            Métricas por Classe de Prioridade
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Classe</th>
                <th className="px-4 py-2 text-left">Taxa de chegada (λₖ)</th>
                <th className="px-4 py-2 text-left">W (Tempo no sistema)</th>
                <th className="px-4 py-2 text-left">Wq (Tempo na fila)</th>
                <th className="px-4 py-2 text-left">L (No sistema)</th>
                <th className="px-4 py-2 text-left">Lq (Na fila)</th>
                <th className="px-4 py-2 text-left">W̄ (Agregado)</th>
              </tr>
            </thead>
            <tbody>
              {results.W_by_class.map((W, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-600/30 hover:bg-slate-900/30 transition"
                >
                  <td className="px-4 py-2 font-bold text-blue-300">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(results.arrivalRates[idx])}
                  </td>
                  <td className="px-4 py-2 text-yellow-300">
                    {formatNumber(W)}
                  </td>
                  <td className="px-4 py-2 text-orange-300">
                    {formatNumber(results.Wq_by_class[idx])}
                  </td>
                  <td className="px-4 py-2 text-cyan-300">
                    {formatNumber(results.L_by_class[idx])}
                  </td>
                  <td className="px-4 py-2 text-pink-300">
                    {formatNumber(results.Lq_by_class[idx])}
                  </td>
                  <td className="px-4 py-2 text-purple-400">
                    {formatNumber(results.W_bar_aggregate[idx])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Arrays brutos para referência/cópia */}
      <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600/40">
        <h4 className="font-bold text-gray-300 mb-2">Resultados brutos</h4>
        <pre className="overflow-x-auto text-xs text-gray-400">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>

      {/* Fórmulas utilizadas */}
      <div className="mt-10">
        <div className="flex items-center mb-3">
          <Calculator className="w-5 h-5 mr-2 text-violet-400" />
          <h3 className="text-lg font-semibold text-violet-400">
            Fórmulas Utilizadas (M/M/s com Prioridade)
          </h3>
        </div>
        <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-700/50 text-base">
          <ul className="space-y-3 text-white">
            <li>
              <b>Taxa de chegada da classe k (λₖ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                λₖ = taxa de chegada para a classe de prioridade k
              </pre>
            </li>
            <li>
              <b>Taxa de serviço (μ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                μ = taxa de atendimento por servidor
              </pre>
            </li>
            <li>
              <b>Número de servidores (s):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                s = quantidade de servidores no sistema
              </pre>
            </li>
            <li>
              <b>Tempo médio no sistema por classe (Wₖ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Wₖ = Tempo médio total no sistema para clientes da classe k
              </pre>
            </li>
            <li>
              <b>Tempo médio na fila por classe (Wqₖ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Wqₖ = Tempo médio aguardando na fila para classe k
              </pre>
            </li>
            <li>
              <b>Número médio no sistema por classe (Lₖ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Lₖ = λₖ · Wₖ
              </pre>
            </li>
            <li>
              <b>Número médio na fila por classe (Lqₖ):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                Lqₖ = λₖ · Wqₖ
              </pre>
            </li>
            <li>
              <b>Tempo médio ponderado (W̄):</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                W̄ₖ = Soma ponderada dos tempos médios, considerando todas as
                classes até k
              </pre>
            </li>
            <li>
              <b>Notas sobre cálculo de espera:</b>
              <pre className="bg-slate-800/60 rounded p-2 text-sm mt-1 overflow-x-auto">
                {`Para sistemas de prioridade, as classes mais prioritárias têm impacto direto sobre as classes inferiores.
Wq₁ (classe 1): igual ao M/M/s tradicional para λ₁
Para k > 1, 
Wqₖ = Wq₁ + (efeito acumulado das classes superiores)
O cálculo exato pode envolver fórmulas recursivas ou sistemas lineares de equações.
`}
              </pre>
            </li>
          </ul>
          <div className="text-sm text-gray-400 mt-6">
            <span className="font-bold text-gray-200">Nota:</span> O cálculo
            para cada classe pode variar conforme o tipo de prioridade
            (preemptiva ou não), mas a lógica de influência das classes
            superiores é mantida.
          </div>
        </div>
      </div>
    </div>
  )
}
