import { Card, CardContent } from '@renderer/components/shadcn/card'
import { AlertCircle, BarChart3 } from 'lucide-react'
import { ReactNode } from 'react'

type PendingResultCalcProps = {
  isReadyToCalculate?: boolean
  title?: string
  description?: string
  warningMessage?: string
  icon?: ReactNode
  children?: ReactNode
}

export function PendingResultCalc({
  isReadyToCalculate = false,
  title = 'Resultados aparecerão aqui',
  description = 'Preencha os campos obrigatórios e clique em "Calcular Resultados" para ver as métricas do sistema.',
  warningMessage = 'Preencha todos os campos obrigatórios para continuar',
  icon,
  children,
}: PendingResultCalcProps = {}) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
      <CardContent className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
          {icon ? icon : <BarChart3 className="h-8 w-8 text-blue-400" />}
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 max-w-md">{description}</p>

        {!isReadyToCalculate && (
          <div className="mt-6 flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{warningMessage}</span>
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  )
}
