import { useState } from 'react'
import { toast } from 'sonner'
import { Calculator } from 'lucide-react'
import { Label } from '@renderer/components/shadcn/label'
import { Input } from '@renderer/components/shadcn/input'
import { Button } from '@renderer/components/shadcn/button'
import {
  mmsnFinitePopulation, // seu modelo TypeScript acima!
  type Parameters,
  type Results,
} from '@renderer/lib/models/mms-greater-than-1-n'
import { onlyNumbers } from '@renderer/utils/only-numbers'

interface FormProps {
  onCalculate: (results: Results) => void
}

export function MMSGreaterThanOneNFormCalculator({ onCalculate }: FormProps) {
  const [parameters, setParameters] = useState<Parameters>({
    N: 0,
    s: 1,
    lambdaIndividual: 0,
    mu: 0,
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
      parameters.s < 1 ||
      parameters.lambdaIndividual <= 0 ||
      parameters.mu <= 0
    ) {
      toast.error('Erro de validação', {
        description:
          'Todos os parâmetros devem ser preenchidos corretamente: N, s, λ individual e μ > 0.',
      })
      return
    }
    try {
      const results = mmsnFinitePopulation(parameters)
      onCalculate(results)
      toast.success('Cálculo realizado com sucesso', {
        description: 'Os resultados foram calculados com sucesso!',
      })
    } catch (error) {
      console.error('Erro ao calcular:', error)
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
          Parâmetros do Sistema M/M/s/N (População Finita)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* N */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="N" className="text-gray-200 font-medium">
            Tamanho da população (N) *
          </Label>
          <Input
            id="N"
            step="1"
            min="1"
            value={parameters.N || ''}
            onChange={(e) => handleInputChange('N', e.target.value)}
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 10"
          />
          <p className="text-xs text-gray-400 mt-1">
            Quantidade total de clientes/unidades (em todo o sistema)
          </p>
        </div>

        {/* s */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="s" className="text-gray-200 font-medium">
            Número de servidores (s) *
          </Label>
          <Input
            id="s"
            step="1"
            min="1"
            value={parameters.s || ''}
            onChange={(e) => handleInputChange('s', e.target.value)}
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 2"
          />
          <p className="text-xs text-gray-400 mt-1">
            Servidores em paralelo no sistema
          </p>
        </div>

        {/* λ individual */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label
            htmlFor="lambdaIndividual"
            className="text-gray-200 font-medium"
          >
            Taxa de chegada individual (λ) *
          </Label>
          <Input
            id="lambdaIndividual"
            step="0.01"
            min="0"
            value={parameters.lambdaIndividual || ''}
            onChange={(e) =>
              handleInputChange('lambdaIndividual', e.target.value)
            }
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 0.1"
          />
          <p className="text-xs text-gray-400 mt-1">
            Taxa de chegada de cada cliente (quando fora do sistema)
          </p>
        </div>

        {/* μ */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="mu" className="text-gray-200 font-medium">
            Taxa de serviço (μ) *
          </Label>
          <Input
            id="mu"
            step="0.01"
            min="0"
            value={parameters.mu || ''}
            onChange={(e) => handleInputChange('mu', e.target.value)}
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 1.0"
          />
          <p className="text-xs text-gray-400 mt-1">
            Atendimentos por unidade de tempo <b>por servidor</b>
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
