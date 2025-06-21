import { useState } from 'react'
import { toast } from 'sonner'
import { Calculator } from 'lucide-react'
import { Label } from '@renderer/components/shadcn/label'
import { Input } from '@renderer/components/shadcn/input'
import { Button } from '@renderer/components/shadcn/button'
import {
  mm1nFinitePopulation, // Modelo M/M/1/N com população finita
  type Parameters,
  type Results,
} from '@renderer/lib/models/mm1n-finite-population'
import { onlyNumbers } from '@renderer/utils/only-numbers'

interface FormProps {
  onCalculate: (results: Results) => void
}

export function MM1NFinitePopulationFormCalculator({ onCalculate }: FormProps) {
  const [parameters, setParameters] = useState<Parameters>({
    N: 0,
    meanTimeToFailure: 0,
    meanRepairTime: 0,
    machineStopCostPerHour: 0, // novo campo
    technicianCostPerHour: 0, // novo campo
  })

  const handleInputChange = (field: keyof Parameters, value: string) => {
    const onlyNumber = onlyNumbers(value)
    const numValue = onlyNumber || 0
    setParameters((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  const handleCalculate = () => {
    if (
      parameters.N < 1 ||
      parameters.meanTimeToFailure <= 0 ||
      parameters.meanRepairTime <= 0
    ) {
      toast.error('Erro de validação', {
        description:
          'N deve ser maior ou igual a 1. Tempos médios devem ser maiores que zero.',
      })
      return
    }
    try {
      console.log('Calculando M/M/1/N com população finita:', parameters)
      const results = mm1nFinitePopulation(parameters)
      onCalculate(results)

      console.log('Resultados do cálculo:', results)
      toast.success('Cálculo realizado com sucesso', {
        description: 'Os resultados foram calculados com sucesso!',
      })
    } catch (error) {
      console.log('Erro ao calcular M/M/1/N com população finita:', error)
      toast.error('Erro no cálculo', {
        description:
          'Ocorreu um erro ao calcular as métricas. Verifique os parâmetros.',
      })
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Calculator className="w-5 h-5 mr-3 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">
          Parâmetros do Sistema M/M/1/N (População Finita)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* N */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="N" className="text-gray-200 font-medium">
            Número total de unidades (N) *
          </Label>
          <Input
            id="N"
            step="1"
            min="1"
            value={parameters.N || ''}
            onChange={(e) => handleInputChange('N', e.target.value)}
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 20"
          />
          <p className="text-xs text-gray-400 mt-1">
            Máquinas, equipamentos, etc. no sistema
          </p>
        </div>

        {/* Tempo médio entre falhas */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label
            htmlFor="meanTimeToFailure"
            className="text-gray-200 font-medium"
          >
            Tempo médio entre falhas (MTTF) *
          </Label>
          <Input
            id="meanTimeToFailure"
            step="0.01"
            min="0"
            value={parameters.meanTimeToFailure || ''}
            onChange={(e) =>
              handleInputChange('meanTimeToFailure', e.target.value)
            }
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 120"
          />
          <p className="text-xs text-gray-400 mt-1">
            Tempo médio até uma unidade falhar
          </p>
        </div>

        {/* Tempo médio de conserto */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="meanRepairTime" className="text-gray-200 font-medium">
            Tempo médio de conserto *
          </Label>
          <Input
            id="meanRepairTime"
            step="0.01"
            min="0"
            value={parameters.meanRepairTime || ''}
            onChange={(e) =>
              handleInputChange('meanRepairTime', e.target.value)
            }
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 5"
          />
          <p className="text-xs text-gray-400 mt-1">
            Tempo médio para reparar uma unidade
          </p>
        </div>

        {/* Custo por hora de máquina parada */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label
            htmlFor="machineStopCostPerHour"
            className="text-gray-200 font-medium"
          >
            Custo por hora de máquina parada *
          </Label>
          <Input
            id="machineStopCostPerHour"
            step="0.01"
            min="0"
            value={parameters.machineStopCostPerHour || ''}
            onChange={(e) =>
              handleInputChange('machineStopCostPerHour', e.target.value)
            }
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 30"
          />
          <p className="text-xs text-gray-400 mt-1">
            Valor em reais por hora que cada máquina parada custa
          </p>
        </div>

        {/* Custo por hora do técnico */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label
            htmlFor="technicianCostPerHour"
            className="text-gray-200 font-medium"
          >
            Custo por hora do técnico *
          </Label>
          <Input
            id="technicianCostPerHour"
            step="0.01"
            min="0"
            value={parameters.technicianCostPerHour || ''}
            onChange={(e) =>
              handleInputChange('technicianCostPerHour', e.target.value)
            }
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 10"
          />
          <p className="text-xs text-gray-400 mt-1">
            Valor em reais por hora trabalhada do técnico de manutenção
          </p>
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 mt-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calcular Resultados
      </Button>
    </div>
  )
}
