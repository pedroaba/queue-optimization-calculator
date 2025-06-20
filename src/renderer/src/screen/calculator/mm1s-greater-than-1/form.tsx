import { useState } from 'react'
import { toast } from 'sonner'
import { Calculator } from 'lucide-react'
import { Label } from '@renderer/components/shadcn/label'
import { Input } from '@renderer/components/shadcn/input'
import { Button } from '@renderer/components/shadcn/button'
import {
  mmSInf,
  type Parameters,
  type Results,
} from '@renderer/lib/models/mms-greater-than-1'
import { onlyNumbers } from '@renderer/utils/only-numbers'

interface FormProps {
  onCalculate: (results: Results) => void
}

export function MMSGreaterThanOneFormCalculator({ onCalculate }: FormProps) {
  const [parameters, setParameters] = useState<Parameters>({
    lambda: 0,
    mu: 0,
    s: 1,
    n: 0,
    t: 0,
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
    if (parameters.lambda <= 0 || parameters.mu <= 0 || parameters.s < 1) {
      toast.error('Erro de validação', {
        description:
          'As taxas de chegada (λ), atendimento (μ) e o número de servidores (s) devem ser maiores que zero.',
      })
      return
    }
    try {
      const results = mmSInf(parameters)
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
          Parâmetros do Sistema M/M/s
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* λ */}
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

        {/* μ */}
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
            Atendimentos por unidade de tempo <b>por servidor</b>
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
            placeholder="Ex: 3"
          />
          <p className="text-xs text-gray-400 mt-1">
            Quantidade de servidores em paralelo
          </p>
        </div>

        {/* n */}
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
          <p className="text-xs text-gray-400 mt-1">
            Número de clientes para calcular a probabilidade de haver exatamente
            n no sistema
          </p>
        </div>

        {/* t */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="t" className="text-gray-200 font-medium">
            Tempo limite para probabilidades (t)
          </Label>
          <Input
            id="t"
            step="0.1"
            min="0"
            value={parameters.t || ''}
            onChange={(e) => handleInputChange('t', e.target.value)}
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="Ex: 1.0"
          />
          <p className="text-xs text-gray-400 mt-1">
            Valor de tempo para cálculos de probabilidade P(W &gt; t), P(Wq &gt;
            t)
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
