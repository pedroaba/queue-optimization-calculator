import 'katex/dist/katex.min.css'

import { Container } from '@renderer/components/container'
import { Copyright } from '@renderer/components/copyright'
import { Title } from '@renderer/components/title'
import { models } from '@renderer/constants/models'
import { marked } from 'marked'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { cn } from '@renderer/lib/shadcn'
import { Input } from '@renderer/components/shadcn/input'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@renderer/components/shadcn/form'
import { Button } from '@renderer/components/shadcn/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/shadcn/dialog'
import { ScrollArea } from '@renderer/components/shadcn/scroll-area'
import { ArrowLeft, Info } from 'lucide-react'
import { ResultViewMM1N } from '@renderer/components/results/result-view-mm1n'
import { ResultViewMM1 } from '@renderer/components/results/result-view-mm1'
import { ResultViewMMS } from '@renderer/components/results/result-view-mms'
import { toast } from 'sonner'
import { ResultViewMMSK } from '@renderer/components/results/result-view-mmsk'
import { ResultViewMM1K } from '@renderer/components/results/result-view-mm1k'
// import { loadPyodide } from 'pyodide'
// import { ipcRenderer } from 'electron'

export function ModelScreen() {
  const { id } = useParams()
  const [html, setHtml] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<any | null>(null)

  const pyodide = useRef<any>(null)

  const navigate = useNavigate()

  const model = useMemo(
    () => models.find((model) => model.id === Number(id)),
    [id],
  )
  const form = useForm()

  function handleBack() {
    navigate('/')
  }

  async function handleCalculate(data: any) {
    if (!model?.function) {
      return
    }

    const params = model.fields.reduce((params, field) => {
      return [...params, `${field.name}=${data[field.name]}`]
    }, [] as string[])

    startTransition(async () => {
      const result = await pyodide.current.runPython(
        `
${model.function}
result = None
try:
  result = func(${params.join(', ')})
except Exception as e:
  result = {
    'erro': str(e)
  }
result
      `.trim(),
      )

      const resultInJs = await result.toJs()
      setResult(resultInJs)

      console.log(JSON.stringify(resultInJs))

      if (
        resultInJs.erro &&
        !(resultInJs.erro === "name 'undefined' is not defined")
      ) {
        toast.error('Ocorreu um erro ao calcular o resultado', {
          description: resultInJs.erro,
        })
      }
    })
  }

  useEffect(() => {
    async function processContent() {
      if (model?.description) {
        // 1. Converte Markdown para HTML
        const html = await marked.parse(model.description)
        setHtml(html)
      }
    }

    processContent()
  }, [model])

  useEffect(() => {
    async function loadPyodide() {
      // @ts-ignore
      const pyodideInstance = await window.loadPyodide({
        indexURL: '/pyodide/',
      })

      pyodide.current = pyodideInstance
    }

    loadPyodide()
  }, [])

  return (
    <Container className="w-screen">
      <Button
        variant="secondary"
        className="flex-row-reverse mb-4 w-fit size-10"
        onClick={handleBack}
      >
        <ArrowLeft className="size-6" strokeWidth={2} />
      </Button>

      <div className="flex items-center justify-between">
        <Title className="flex items-baseline gap-2">{model?.name}</Title>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex-row-reverse">
              Descrição <Info className="size-4" strokeWidth={2} />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-zinc-200">
                Descrição do modelo
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[500px] max-h-[400px]">
              <div
                ref={contentRef}
                className={cn(
                  'prose prose-invert prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs mb-4',
                )}
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              />
            </ScrollArea>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-zinc-400 mt-4">
        Insira os valores para calcular as fórmulas
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCalculate)}
          id="model-form"
          className="grid grid-cols-2 gap-2 mt-2 mb-4"
        >
          {model?.fields.map((modelField) => (
            <FormField
              control={form.control}
              name={modelField.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{modelField.description}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </form>

        <Button
          form="model-form"
          isLoading={isPending}
          type="submit"
          onClick={handleCalculate}
        >
          Calcular
        </Button>
      </Form>

      {result && model?.slug === 'mm1' && !result.erro && (
        <ResultViewMM1 data={result} />
      )}
      {result && model?.slug === 'mm1n' && !result.erro && (
        <ResultViewMM1N data={result} />
      )}
      {result && model?.slug === 'mms>1' && !result.erro && (
        <ResultViewMMS data={result} />
      )}
      {result && model?.slug === 'mms>1k' && !result.erro && (
        <ResultViewMMSK data={result} K={form.getValues().K || 0} />
      )}
      {result && model?.slug === 'mm1k' && !result.erro && (
        <ResultViewMM1K data={result} K={form.getValues().K || 0} />
      )}

      <Copyright />
    </Container>
  )
}
