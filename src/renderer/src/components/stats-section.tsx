import { Clock } from 'lucide-react'

type StatsSectionProvider = {
  totalModels: number
}

export function StatsSection({ totalModels }: StatsSectionProvider) {
  return (
    <div className="bg-slate-900 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{totalModels}</div>
            <div className="text-slate-400">Modelos Disponíveis</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">∞</div>
            <div className="text-slate-400">Cálculos Possíveis</div>
          </div>
          {/* <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400">24/7</div>
          <div className="text-slate-400">Disponibilidade</div>
        </div> */}
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              <Clock className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-slate-400">Resultados Instantâneos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
