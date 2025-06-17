import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import {
  Users,
  Activity,
  BarChart,
  PauseCircle,
  Hourglass,
  Loader,
} from 'lucide-react'

interface ResultsDisplayProps {
  results: any
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A'
    return Number(num).toFixed(4)
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Loader className="h-5 w-5" />
          Resultados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Principais métricas */}
        <div className="grid grid-cols-2 gap-4">
          {'L' in results && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  Unidades Quebradas no Sistema (L)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                L = {formatNumber(results.L)}
              </div>
            </div>
          )}

          {'Lq' in results && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <PauseCircle className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">
                  Unidades Esperando por Conserto (Lq)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                Lq = {formatNumber(results.Lq)}
              </div>
            </div>
          )}

          {'W' in results && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Tempo Total de Inatividade (W)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                W = {formatNumber(results.W)} horas
              </div>
            </div>
          )}

          {'Wq' in results && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Hourglass className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Tempo de Espera até Conserto (Wq)
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                Wq = {formatNumber(results.Wq)} horas
              </div>
            </div>
          )}
        </div>

        {/* Resultados adicionais */}
        <div className="space-y-3">
          {'P0' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">
                Probabilidade do sistema vazio (P₀)
              </span>
              <span className="text-white font-medium">
                {formatNumber(results.P0)}
              </span>
            </div>
          )}

          {'lambdaEfetiva' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">Taxa efetiva de falhas (λₑ)</span>
              <span className="text-white font-medium">
                {formatNumber(results.lambdaEfetiva)} por hora
              </span>
            </div>
          )}

          {'tempoOcioso' in results && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-gray-300">Técnico ocioso (% do tempo)</span>
              <span className="text-white font-medium">
                {formatNumber(results.tempoOcioso)}%
              </span>
            </div>
          )}
        </div>

        {/* Probabilidades detalhadas */}
        {'Pn_list' in results && Array.isArray(results.Pn_list) && (
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">
                Probabilidade de n unidades quebradas:
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {results.Pn_list.map((prob: number, index: number) => (
                <div
                  key={index}
                  className="rounded-lg bg-zinc-800 p-3 flex flex-col items-center"
                >
                  <div className="text-xs text-zinc-400">P(n={index})</div>
                  <div className="text-lg font-bold text-zinc-50">
                    {(prob * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    {prob.toExponential(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fórmulas usadas */}
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Fórmulas Utilizadas</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>λᵢ = 1 / tempo entre falhas</div>
            <div>μ = 1 / tempo de conserto</div>
            <div>Pₙ = Pₙ₋₁ × [(N − n + 1) × λᵢ / μ]</div>
            <div>Pₙ = Pₙ / ΣPₙ para normalizar</div>
            <div>L = Σ(n × Pₙ)</div>
            <div>Lq = Σ((n − 1) × Pₙ), n &gt; 0</div>
            <div>λₑ = Σ((N − n) × λᵢ × Pₙ)</div>
            <div>W = L / λₑ</div>
            <div>Wq = Lq / λₑ</div>
            <div>Tempo ocioso = P₀ × 100%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
