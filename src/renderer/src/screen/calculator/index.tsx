import { FooterSection } from '@renderer/components/footer-section'
import { ResultsDisplay } from '@renderer/components/results/result-mm1'
import { Button } from '@renderer/components/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/shadcn/card'
import { Input } from '@renderer/components/shadcn/input'
import { CalculatorIcon } from 'lucide-react'
import { useMemo, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Header } from './header'
import { PendingResultCalc } from './pending-result-calc'
import { usePyodide } from '@renderer/hooks/use-pyodide'

import { useParams } from 'react-router-dom'
import { models } from '@renderer/constants/models'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@renderer/components/shadcn/form'

import { onlyNumbers } from '@renderer/utils/only-numbers'
import { ResultsDisplay as ResultViewMM1K } from '@renderer/components/results/result-mm1k'
import { ResultsDisplay as ResultViewMM1N } from '@renderer/components/results/result-mm1n'
import { ResultsDisplay as ResultViewMMS } from '@renderer/components/results/result-mms'
import { ResultsDisplay as ResultViewMMSK } from '@renderer/components/results/result-mmsk'
import { ResultDisplayMG1 } from '@renderer/components/results/result-mg1'
import { ResultDisplayMMSPrioridade } from '@renderer/components/results/result-mms-with-priority'
import { ResultDisplayMMSPrioridadeNaoPreemptiva } from '@renderer/components/results/result-without-preemption'

export function Calculator() {
  const { id } = useParams()

  const [results, setResult] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  const pyodide = usePyodide()
  const form = useForm()

  const model = useMemo(() => {
    return models.find((model) => model.id === Number(id))
  }, [id])

  // Função de cálculo via Pyodide
  async function handleCalculate(data: any) {
    if (!model?.function) return

    const keys = Object.keys(data)
    let hasUnfilledFields = false
    for (const key of keys) {
      if (!data[key]) {
        toast.error('Preencha todos os campos', {
          description: `Preencha o campo "${key}"`,
        })
        hasUnfilledFields = true
      }
    }
    if (hasUnfilledFields) return

    // Converte listas string para number[] se necessário
    model.fields.forEach((field) => {
      const value = data[field.name]
      if (field.type === 'number[]') {
        try {
          data[field.name] = value
            .split(',')
            .map((v: string) => parseFloat(v.trim()))
            .filter((n: number) => !isNaN(n))
        } catch {
          data[field.name] = []
        }
      }
    })

    const params = model.fields.reduce((params, field) => {
      const value = data[field.name]
      if (field.type === 'number[]') {
        return [...params, `${field.name}=${JSON.stringify(value)}`]
      } else if (field.type === 'number') {
        return [...params, `${field.name}=${parseFloat(value)}`]
      } else {
        return [...params, `${field.name}=${JSON.stringify(value)}`]
      }
    }, [] as string[])

    startTransition(async () => {
      const result = await pyodide.runPython(
        `
${model.function}
result = None
try:
  result = func(${params.join(', ')})
except Exception as e:
  result = { 'erro': str(e) }
result
        `.trim(),
      )

      const resultInJs = await result.toJs()
      setResult(resultInJs)

      if (
        resultInJs.erro &&
        resultInJs.erro !== "name 'undefined' is not defined"
      ) {
        toast.error('Ocorreu um erro ao calcular o resultado', {
          description: resultInJs.erro,
        })
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="min-h-screen p-4 md:p-6 !pb-0">
        <div className="max-w-7xl mx-auto">
          <Header modelName={model?.name || ''} />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CalculatorIcon className="h-5 w-5" />
                    Parâmetros do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      id="form"
                      onSubmit={form.handleSubmit(handleCalculate)}
                    >
                      {model?.fields.map((modelField) => (
                        <FormField
                          key={modelField.name}
                          control={form.control}
                          name={modelField.name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">
                                {modelField.description}
                              </FormLabel>
                              <FormControl>
                                {modelField.type === 'number[]' ? (
                                  <Input
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-9"
                                    placeholder="Ex: 1.2, 2.5, 4"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    autoComplete="off"
                                  />
                                ) : (
                                  <Input
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-9"
                                    {...field}
                                    onChange={(e) => {
                                      const filtered = onlyNumbers(
                                        e.target.value,
                                      )
                                      field.onChange(filtered)
                                    }}
                                    inputMode="decimal"
                                    autoComplete="off"
                                  />
                                )}
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </form>
                  </Form>

                  <Button
                    form="form"
                    isLoading={isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-lg font-medium"
                    size="lg"
                  >
                    <CalculatorIcon className="size-4" />
                    Calcular Resultados
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {results ? (
                <>
                  {model?.slug === 'mm1' && (
                    <ResultsDisplay results={results} />
                  )}
                  {model?.slug === 'mm1k' && (
                    <ResultViewMM1K results={results} K={form.getValues().K} />
                  )}
                  {model?.slug === 'mm1n' && (
                    <ResultViewMM1N results={results} />
                  )}
                  {model?.slug === 'mms>1' && (
                    <ResultViewMMS results={results} />
                  )}
                  {model?.slug === 'mms>1k' && (
                    <ResultViewMMSK results={results} K={form.getValues().K} />
                  )}
                  {model?.slug === 'mg1' && (
                    <ResultDisplayMG1 results={results} />
                  )}
                  {model?.slug === 'mms-priority' && (
                    <ResultDisplayMMSPrioridade results={results} />
                  )}
                  {model?.slug === 'mss-without-preemption' && (
                    <ResultDisplayMMSPrioridadeNaoPreemptiva
                      results={results}
                    />
                  )}
                </>
              ) : (
                <PendingResultCalc isReadyToCalculate />
              )}
            </div>
          </div>
        </div>

        <FooterSection className="mt-16">
          <span>•</span>
          <span>{model?.name}</span>
        </FooterSection>
      </div>
    </div>
  )
}
