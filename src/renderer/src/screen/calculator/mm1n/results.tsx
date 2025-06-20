import {
  ChartBar,
  TrendingUp,
  Clock,
  Users,
  Zap,
  Ban,
  BarChartIcon,
} from 'lucide-react'

import type { Results } from '@renderer/lib/models/mm1n'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ResultsDisplayProps {
  results: Results | null
}

export function MM1NResultCalculator({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="text-center py-16">
        <ChartBar className="w-20 h-20 mx-auto text-blue-400 mb-6 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-200 mb-3">
          Resultados aparecerão aqui
        </h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Preencha os campos obrigatórios (λ, μ e N) e clique em "Calcular
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

  const lastPn = results.PnList.at(-1) ?? 0

  return (
    <div>
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
        <h2 className="text-xl font-semibold text-white">
          Resultados do Sistema
        </h2>
      </div>

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              {formatPercentage(results.rho)} de ocupação
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-5 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-green-300 font-medium">P₀</div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {formatPercentage(results.P0)}
            </div>
            <div className="text-xs text-green-200">Sistema vazio</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-5 border border-purple-500/30 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-purple-300 font-medium">P(n=N)</div>
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {formatPercentage(lastPn)}
            </div>
            <div className="text-xs text-purple-200">
              Probabilidade de ocupação total
            </div>
          </div>
        </div>

        {/* Bloqueio e Chegadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="flex items-center mb-2">
              <Ban className="w-4 h-4 mr-2 text-red-400" />
              <div className="text-sm text-gray-300">P(Block)</div>
            </div>
            <div className="text-2xl font-bold text-red-400 mb-1">
              {formatPercentage(results.P_block)}
            </div>
            <div className="text-xs text-gray-400">
              Probabilidade de chegada ser rejeitada
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 mr-2 text-emerald-400" />
              <div className="text-sm text-gray-300">λ Efetivo</div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {formatNumber(results.lambdaEffective)}
            </div>
            <div className="text-xs text-gray-400">
              Chegadas aceitas por unidade de tempo
            </div>
          </div>
        </div>

        {/* Métricas de Cliente */}
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
              <div className="text-xs text-gray-400">Média total</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Clientes na Fila (Lq)
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(results.Lq)}
              </div>
              <div className="text-xs text-gray-400">Aguardando serviço</div>
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
                Tempo no Sistema (W)
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.W)}
              </div>
              <div className="text-xs text-gray-400">Média total</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-gray-300 mb-2">
                Tempo na Fila (Wq)
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {formatNumber(results.Wq)}
              </div>
              <div className="text-xs text-gray-400">Média de espera</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/40">
          <div className="flex items-center mb-4">
            <BarChartIcon className="w-5 h-5 mr-2 text-indigo-400" />
            <h3 className="text-lg font-semibold text-indigo-400">
              Distribuição de Probabilidade (Pn)
            </h3>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results.PnList.map((value, index, arr) => ({
                  n:
                    index === arr.length - 1
                      ? 'N (Bloqueio)'
                      : index.toString(),
                  prob: parseFloat((value * 100).toFixed(4)),
                  isBlock: index === arr.length - 1,
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="n" stroke="#cbd5e1" />
                <YAxis unit="%" stroke="#cbd5e1" />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(4)}%`}
                  labelFormatter={(label: string | number) =>
                    `Clientes: ${label}`
                  }
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#475569',
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar
                  dataKey="prob"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  label={{
                    position: 'top',
                    fill: '#cbd5e1',
                    fontSize: 12,

                    formatter: (value: number) => `${value.toFixed(2)}%`,
                    // className: 'rotate-[-90deg]',
                  }}
                >
                  {results.PnList.map((_, index, arr) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === arr.length - 1 ? '#f87171' : '#818cf8'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
