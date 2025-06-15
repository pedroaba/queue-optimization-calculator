import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { useNavigate } from 'react-router-dom' // ou useNavigate, conforme seu router
import { BarChart3 } from 'lucide-react'

export function ModelCardAHP() {
  const navigate = useNavigate()
  return (
    <Card
      className="cursor-pointer transition hover:scale-[1.03] bg-white/5 border-white/10"
      onClick={() => navigate('/ahp')}
    >
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <BarChart3 className="w-7 h-7 text-cyan-400" />
        <CardTitle className="text-white text-lg font-bold">AHP</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 text-sm">
        Processo Analítico Hierárquico
        <br />
        <span className="text-gray-400">
          Compare alternativas com múltiplos critérios.
        </span>
      </CardContent>
    </Card>
  )
}
