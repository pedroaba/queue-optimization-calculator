import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Badge } from '@renderer/components/shadcn/badge'
import { TrendingUp, Clock, Users, Activity } from 'lucide-react'

interface ResultsDisplayProps {
  results: any
  K?: number
}

export function ResultsDisplay({ results, K }: ResultsDisplayProps) {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A'
    return Number(num).toFixed(4)
  }

  // Aceita tanto "ro" quanto "rho"
  const rho = 'ro' in results ? results.ro : results.rho

  const getUtilizationColor = (rho: number) => {
    if (rho < 0.5) return 'bg-green-500'
    if (rho < 0.8) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getUtilizationStatus = (rho: number) => {
    if (rho < 0.5) return 'Baixa utilização'
    if (rho < 0.8) return 'Utilização moderada'
    return 'Alta utilização'
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resultados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Utilização do Sistema */}
        {typeof rho === 'number' && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">
                Utilização do Sistema (ρ)
              </span>
              <Badge className={`${getUtilizationColor(rho)} text-white`}>
                {getUtilizationStatus(rho)}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(rho)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUtilizationColor(rho)}`}
                style={{ width: `${Math.min(rho * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Principais métricas */}
        <div className="grid grid-cols-2 gap-4">
          {'L' in results && (
            <MetricBlock
              icon={<Users className="h-4 w-4 text-blue-400" />}
              label="Clientes no Sistema (L)"
              value={results.L}
            />
          )}
          {'W' in results && (
            <MetricBlock
              icon={<Activity className="h-4 w-4 text-green-400" />}
              label="Tempo no Sistema (W)"
              value={results.W}
            />
          )}
          {'Lq' in results && (
            <MetricBlock
              icon={<Users className="h-4 w-4 text-purple-400" />}
              label="Clientes na Fila (Lq)"
              value={results.Lq}
            />
          )}
          {'Wq' in results && (
            <MetricBlock
              icon={<Clock className="h-4 w-4 text-orange-400" />}
              label="Tempo na Fila (Wq)"
              value={results.Wq}
            />
          )}
        </div>

        {/* Resultados adicionais e probabilidades */}
        <div className="space-y-3">
          {'P0' in results && (
            <ResultLine
              label="Probabilidade do sistema vazio (P₀)"
              value={results.P0}
            />
          )}
          {'Pn' in results && (
            <ResultLine
              label="Probabilidade de n clientes (Pn)"
              value={results.Pn}
            />
          )}
          {'P_mais_que_r' in results && (
            <ResultLine
              label="Probabilidade de mais que r clientes (P>r)"
              value={results.P_mais_que_r}
            />
          )}
          {'P_W_maior_t' in results && (
            <ResultLine
              label="Probabilidade do tempo no sistema maior que t (P(W>t))"
              value={results.P_W_maior_t}
            />
          )}
          {'P_Wq_maior_t' in results && (
            <ResultLine
              label="Probabilidade do tempo na fila maior que t (P(Wq>t))"
              value={results.P_Wq_maior_t}
            />
          )}
          {'P_W_igual_0' in results && (
            <ResultLine
              label="Probabilidade do tempo na fila igual a 0 (P(Wq=0))"
              value={results.P_W_igual_0}
            />
          )}
        </div>

        {/* Fórmulas usadas */}
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Fórmulas Utilizadas</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>ρ = λ/(sμ)</div>
            <div>L = Lq + λ/μ</div>
            <div>Lq = ...</div>
            <div>W = L/λₑₓ</div>
            <div>Wq = Lq/λₑₓ</div>
            <div>P(n=K) = probabilidade do sistema cheio</div>
            <div>P(n&gt;K) = overflow</div>
            <div>P(0) = probabilidade do sistema vazio</div>
            <div>P(W&gt;t) = probabilidade de tempo de espera maior que t</div>
            <div>
              P(Wq&gt;t) = probabilidade de tempo de espera na fila maior que t
            </div>
            <div>P(Wq=0) = probabilidade de não esperar na fila</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="p-4 rounded-lg bg-white/10 border border-white/20">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-white/80">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">
        {Number(value).toFixed(4)}
      </div>
    </div>
  )
}

function ResultLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
      <span className="text-gray-300">{label}</span>
      <span className="text-white font-medium">
        {value === null || value === undefined || isNaN(value)
          ? 'N/A'
          : Number(value).toFixed(4)}
      </span>
    </div>
  )
}
