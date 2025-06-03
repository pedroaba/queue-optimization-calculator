import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Badge } from '@renderer/components/shadcn/badge'
import { Progress } from '@renderer/components/shadcn/progress'

import { Users, Clock, Activity, Target, Timer, BarChart } from 'lucide-react'

type MM1KResult = {
  Lq: number
  Wq: number
  L: number
  W: number
  P0: number
  rho: number
  lambda_bar: number
  ['P(n=K)']: number
  ['P(n>K)']: number
  pnList: number[]
}

type ResultViewMM1KProps = {
  data: MM1KResult
  K: number
}

export function ResultViewMM1K({ data, K }: ResultViewMM1KProps) {
  const getSystemStatus = (rho: number) => {
    if (rho < 0.3)
      return {
        status: 'Excelente',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
        description: 'Sistema operando com eficiência máxima',
      }
    if (rho < 0.7)
      return {
        status: 'Bom',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-500/10',
        textColor: 'text-amber-400',
        description: 'Sistema balanceado e estável',
      }
    if (rho < 0.9)
      return {
        status: 'Atenção',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-500/10',
        textColor: 'text-orange-400',
        description: 'Sistema sob pressão moderada',
      }
    return {
      status: 'Crítico',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      description: 'Sistema sobrecarregado',
    }
  }

  const systemStatus = getSystemStatus(data.rho)

  return (
    <div className="dark min-h-screen my-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Status do Sistema */}
        <Card className="relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-chart-1/5 to-transparent" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-chart-1/20 to-chart-1/10 rounded-xl border border-chart-1/30">
                  <Activity className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-zinc-50">
                    Status do Sistema
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Monitoramento em tempo real
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-zinc-50">
                  {(data.rho * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-zinc-400">Taxa de Utilização</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Badge
                  className={`bg-gradient-to-r ${systemStatus.color} text-white border-0 px-4 py-2 text-sm font-semibold`}
                >
                  {systemStatus.status}
                </Badge>
                <p className="text-zinc-300 font-medium">
                  {systemStatus.description}
                </p>
              </div>
              <div
                className={`p-4 rounded-xl ${systemStatus.bgColor} border border-current/20`}
              >
                <Target className={`h-8 w-8 ${systemStatus.textColor}`} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Utilização</span>
                <span className="text-zinc-300 font-medium">
                  {(data.rho * 100).toFixed(2)}%
                </span>
              </div>
              <Progress value={data.rho * 100} className="h-3 bg-zinc-800" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Taxa efetiva de chegada</span>
              <span className="text-zinc-300 font-medium">
                {data.lambda_bar.toFixed(4)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Métricas do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número Médio de Clientes no Sistema (L) */}
            <Card className="group relative overflow-hidden hover:border-chart-1/50 transition-all duration-500 hover:shadow-2xl hover:shadow-chart-1/10">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Clientes no Sistema
                  </CardTitle>
                  <div className="text-3xl font-bold text-zinc-50 mt-2">
                    {data.L.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-chart-1/20 to-chart-1/10 rounded-xl border border-chart-1/30 group-hover:scale-110 transition-transform duration-300 ml-2">
                  <Users className="h-6 w-6 text-chart-1" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  Valor Esperado (L)
                </p>
              </CardContent>
            </Card>

            {/* Tempo Médio no Sistema (W) */}
            <Card className="group relative overflow-hidden hover:border-chart-2/50 transition-all duration-500 hover:shadow-2xl hover:shadow-chart-2/10">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Tempo no Sistema
                  </CardTitle>
                  <div className="text-3xl font-bold text-zinc-50 mt-2">
                    {data.W.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-chart-2/20 to-chart-2/10 rounded-xl border border-chart-2/30 group-hover:scale-110 transition-transform duration-300 ml-2">
                  <Clock className="h-6 w-6 text-chart-2" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  Tempo Médio (W)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Métricas da Fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número Médio de Clientes na Fila (Lq) */}
            <Card className="group relative overflow-hidden hover:border-chart-3/50 transition-all duration-500 hover:shadow-2xl hover:shadow-chart-3/10">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Clientes na Fila
                  </CardTitle>
                  <div className="text-3xl font-bold text-zinc-50 mt-2">
                    {data.Lq.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-chart-3/20 to-chart-3/10 rounded-xl border border-chart-3/30 group-hover:scale-110 transition-transform duration-300 ml-2">
                  <Users className="h-6 w-6 text-chart-3" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  Valor Esperado (Lq)
                </p>
              </CardContent>
            </Card>

            {/* Tempo Médio na Fila (Wq) */}
            <Card className="group relative overflow-hidden hover:border-chart-4/50 transition-all duration-500 hover:shadow-2xl hover:shadow-chart-4/10">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-4/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Tempo na Fila
                  </CardTitle>
                  <div className="text-3xl font-bold text-zinc-50 mt-2">
                    {data.Wq.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-chart-4/20 to-chart-4/10 rounded-xl border border-chart-4/30 group-hover:scale-110 transition-transform duration-300 ml-2">
                  <Timer className="h-6 w-6 text-chart-4" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  Tempo Médio (Wq)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Probabilidades */}
        <Card className="border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-50">
              Probabilidades do Sistema
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Probabilidades de estados e eventos específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sistema Vazio (P0) */}
              <div className="p-4 rounded-xl border border-zinc-600/30 hover:border-chart-1/50 transition-all duration-300">
                <div className="text-sm font-medium text-zinc-400">
                  Sistema Vazio (P₀)
                </div>
                <div className="text-2xl font-bold text-zinc-50 mt-2">
                  {(data.P0 * 100).toFixed(2)}%
                </div>
              </div>
              {/* Probabilidade sistema cheio */}
              <div className="p-4 rounded-xl border border-zinc-600/30 hover:border-chart-2/50 transition-all duration-300">
                <div className="text-sm font-medium text-zinc-400">
                  Sistema Cheio (P(n={K}))
                </div>
                <div className="text-2xl font-bold text-zinc-50 mt-2">
                  {(data['P(n=K)'] * 100).toFixed(2)}%
                </div>
              </div>
              {/* Probabilidade de overflow */}
              <div className="p-4 rounded-xl border border-zinc-600/30 hover:border-chart-3/50 transition-all duration-300">
                <div className="text-sm font-medium text-zinc-400">
                  Overflow (P(n&gt;{K}))
                </div>
                <div className="text-2xl font-bold text-zinc-50 mt-2">
                  {(data['P(n>K)'] * 100).toFixed(4)}%
                </div>
              </div>
            </div>
            {/* Lista dinâmica de pnList */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-5 w-5 text-chart-1" />
                <span className="text-zinc-300 font-semibold">
                  Probabilidade para cada estado P(n):
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {data.pnList.map((value, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-zinc-800 p-3 flex flex-col items-center"
                  >
                    <div className="text-xs text-zinc-400">P(n={idx})</div>
                    <div className="text-lg font-bold text-zinc-50">
                      {(value * 100).toFixed(4)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
