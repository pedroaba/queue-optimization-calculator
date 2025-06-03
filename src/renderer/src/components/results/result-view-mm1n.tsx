import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Badge } from '@renderer/components/shadcn/badge'
import { Progress } from '@renderer/components/shadcn/progress'

import { Users, Clock, TrendingUp, Activity, Target, Zap } from 'lucide-react'

type MM1NResult = {
  rho: number
  P0: number
  Pn_list: number[]
  L: number
  W: number
}

type ResultViewMM1NProps = {
  data: MM1NResult
}

export function ResultViewMM1N({ data }: ResultViewMM1NProps) {
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
        {/* Status do Sistema Redesenhado */}
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
          </CardContent>
        </Card>

        {/* Métricas Principais Redesenhadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-chart-1 to-chart-1/70 rounded-full"
                    style={{ width: `${Math.min(data.L * 1000, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-chart-1 font-medium">Baixo</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br hover:border-chart-2/50 transition-all duration-500 hover:shadow-2xl hover:shadow-chart-2/10">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Tempo no Sistema
                </CardTitle>
                <div className="text-3xl font-bold text-zinc-50 mt-2">
                  {data.W.toFixed(6)}
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
              <div className="mt-2 flex items-center gap-2">
                <Zap className="h-3 w-3 text-chart-2" />
                <span className="text-xs text-chart-2 font-medium">
                  Resposta Instantânea
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br hover:border-chart-4/50 transition-all duration-500 hover:shadow-2xl hover:shadow-chart-4/10">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-4/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Sistema Vazio
                </CardTitle>
                <div className="text-3xl font-bold text-zinc-50 mt-2">
                  {(data.P0 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-chart-4/20 to-chart-4/10 rounded-xl border border-chart-4/30 group-hover:scale-110 transition-transform duration-300 ml-2">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Probabilidade (P₀)
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-chart-4 to-chart-4/70 rounded-full"
                    style={{ width: `${data.P0 * 100}%` }}
                  />
                </div>
                <span className="text-xs text-chart-4 font-medium">Alto</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Melhorada */}
        <Card className="border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-50">
              Probabilidades Detalhadas
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Valores precisos para os primeiros 10 estados do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {data.Pn_list.map((prob, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-xl border border-zinc-600/30 hover:border-chart-1/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-1/10"
                >
                  <div className="text-center space-y-2">
                    <div className="text-lg font-bold text-zinc-50">
                      P{index}
                    </div>
                    <div className="text-sm font-semibold text-chart-1">
                      {(prob * 100).toFixed(2)}%
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {prob.toExponential(2)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
