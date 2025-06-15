import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { TrendingUp, ChevronRight, AlertTriangle } from 'lucide-react'

interface MMSPrioridadeNaoPreemptivaResult {
  taxas_de_chegada_entrada: number[]
  taxa_de_servico_entrada: number
  num_servidores_entrada: number
  W_por_classe: number[]
  Wq_por_classe: number[]
  L_por_classe: number[]
  Lq_por_classe: number[]
}

interface ResultDisplayMMSPrioridadeNaoPreemptivaProps {
  results: MMSPrioridadeNaoPreemptivaResult
}

export function ResultDisplayMMSPrioridadeNaoPreemptiva({
  results,
}: ResultDisplayMMSPrioridadeNaoPreemptivaProps) {
  const formatNumber = (num: number | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A'
    if (!isFinite(num)) return '∞'
    return Number(num).toFixed(4)
  }

  const rhoTotal =
    results.taxas_de_chegada_entrada.reduce((sum, val) => sum + val, 0) /
    (results.num_servidores_entrada * results.taxa_de_servico_entrada)

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resultados M/M/s com Prioridade Não Preemptiva
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rhoTotal >= 1 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
            <span>
              O sistema está instável: a carga total excede a capacidade dos
              servidores (ρ ≥ 1).
            </span>
          </div>
        )}

        {/* Parâmetros de Entrada */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-700 border border-gray-600">
            <div className="text-sm text-gray-300 mb-1">
              Taxas de Chegada (λₖ)
            </div>
            <div className="text-white font-bold text-sm">
              {results.taxas_de_chegada_entrada.map((t, i) => (
                <div key={i}>
                  Classe {i + 1}: {formatNumber(t)}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-700 border border-gray-600">
            <div className="text-sm text-gray-300 mb-1">
              Taxa de Serviço (μ)
            </div>
            <div className="text-white font-bold text-lg">
              {formatNumber(results.taxa_de_servico_entrada)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-700 border border-gray-600">
            <div className="text-sm text-gray-300 mb-1">
              Nº de Servidores (s)
            </div>
            <div className="text-white font-bold text-lg">
              {results.num_servidores_entrada}
            </div>
          </div>
        </div>

        {/* Resultados por Classe */}
        <div className="space-y-4">
          {results.W_por_classe.map((w, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
            >
              <div className="flex items-center gap-2 text-white font-semibold">
                <ChevronRight className="h-4 w-4" />
                Classe {i + 1}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <span className="block text-white font-medium">
                    W (Tempo no sistema)
                  </span>
                  {formatNumber(w)}
                </div>
                <div>
                  <span className="block text-white font-medium">
                    Wq (Tempo na fila)
                  </span>
                  {formatNumber(results.Wq_por_classe[i])}
                </div>
                <div>
                  <span className="block text-white font-medium">
                    L (Nº no sistema)
                  </span>
                  {formatNumber(results.L_por_classe[i])}
                </div>
                <div>
                  <span className="block text-white font-medium">
                    Lq (Nº na fila)
                  </span>
                  {formatNumber(results.Lq_por_classe[i])}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fórmulas utilizadas */}
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Fórmulas Utilizadas</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>ρ = λ / (s × μ)</div>
            <div>Wq₀ = fator base modificado do M/M/s</div>
            <div>Fator de prioridade: 1 / ((1 - ρₖ₋₁)(1 - ρₖ))</div>
            <div>Wₖ = Wq₀ × fator prioridade + 1/μ</div>
            <div>Wqₖ = Wₖ - 1/μ</div>
            <div>Lₖ = λₖ × Wₖ</div>
            <div>Lqₖ = Lₖ - λₖ / μ</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
