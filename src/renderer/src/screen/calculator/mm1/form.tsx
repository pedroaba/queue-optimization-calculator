import { useState } from 'react'
import { toast } from 'sonner'
import { Calculator } from 'lucide-react'
import { Label } from '@renderer/components/shadcn/label'
import { Input } from '@renderer/components/shadcn/input'
import { Button } from '@renderer/components/shadcn/button'
import { mm1, type Parameters, type Results } from '@renderer/lib/models/mm1'
import { onlyNumbers } from '@renderer/utils/only-numbers'

interface FormProps {
  onCalculate: (results: Results) => void
}

export function MM1FormCalculator({ onCalculate }: FormProps) {
  const [parameters, setParameters] = useState<Parameters>({
    lambda: 0,
    mu: 0,
    T: 0,
    t: 0,
    n: 0,
    r: 0,
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
    if (parameters.lambda <= 0 || parameters.mu <= 0) {
      toast.error('Erro de validação', {
        description:
          'As taxas de chegada (λ) e atendimento (μ) devem ser maiores que zero.',
      })

      return
    }

    if (parameters.lambda >= parameters.mu) {
      toast.error('Erro de validação', {
        description:
          'A taxa de chegada (λ) deve ser menor que a taxa de atendimento (μ) para estabilidade do sistema.',
      })

      return
    }

    try {
      const results = mm1(parameters)
      onCalculate(results)
      toast.success('Cálculo realizado com sucesso', {
        description: 'Os resultados foram calculados com sucesso!',
      })
    } catch (error) {
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
          Parâmetros do Sistema
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Required Parameters */}
        <div className="space-y-4">
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
            <Label htmlFor="lambda" className="text-gray-200 font-medium">
              Taxa de chegada (λ) *
            </Label>
            <Input
              id="lambda"
              step="0.1"
              min="0"
              value={parameters.lambda || ''}
              onChange={(e) => handleInputChange('lambda', e.target.value)}
              className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ex: 2.5"
            />
            <p className="text-xs text-gray-400 mt-1">
              Chegadas por unidade de tempo
            </p>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
            <Label htmlFor="mu" className="text-gray-200 font-medium">
              Taxa de atendimento (μ) *
            </Label>
            <Input
              id="mu"
              step="0.1"
              min="0"
              value={parameters.mu || ''}
              onChange={(e) => handleInputChange('mu', e.target.value)}
              className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ex: 3.0"
            />
            <p className="text-xs text-gray-400 mt-1">
              Atendimentos por unidade de tempo
            </p>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
            <Label htmlFor="n" className="text-gray-200 font-medium">
              Número de clientes (n)
            </Label>
            <Input
              id="n"
              step="1"
              min="0"
              value={parameters.n || ''}
              onChange={(e) => handleInputChange('n', e.target.value)}
              className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ex: 5"
            />
            <p className="text-xs text-gray-400 mt-1">Para cálculo de P(n)</p>
          </div>
        </div>

        {/* Optional Parameters */}
        <div className="space-y-4">
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
            <Label htmlFor="T" className="text-gray-200 font-medium">
              Período de observação (T)
            </Label>
            <Input
              id="T"
              step="0.1"
              min="0"
              value={parameters.T || ''}
              onChange={(e) => handleInputChange('T', e.target.value)}
              className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ex: 8.0"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tempo total de observação
            </p>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
            <Label htmlFor="t" className="text-gray-200 font-medium">
              Tempo de espera (t)
            </Label>
            <Input
              id="t"
              step="0.1"
              min="0"
              value={parameters.t || ''}
              onChange={(e) => handleInputChange('t', e.target.value)}
              className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ex: 2.0"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tempo específico de espera
            </p>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
            <Label htmlFor="r" className="text-gray-200 font-medium">
              Valor r
            </Label>
            <Input
              id="r"
              step="0.1"
              min="0"
              value={parameters.r || ''}
              onChange={(e) => handleInputChange('r', e.target.value)}
              className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ex: 1.5"
            />
            <p className="text-xs text-gray-400 mt-1">
              Valor auxiliar para cálculos
            </p>
          </div>
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
