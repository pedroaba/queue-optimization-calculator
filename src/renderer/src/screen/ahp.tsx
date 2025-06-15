import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@renderer/components/shadcn/card'
import { Button } from '@renderer/components/shadcn/button'
import { Input } from '@renderer/components/shadcn/input'
import { Plus, Trash2, BarChart3, ArrowLeft } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function createOnesMatrix(n: number): number[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 1)),
  )
}
function padMatrix(mat: number[][], target: number): number[][] {
  const m = mat.map((row) => [...row])
  while (m.length < target) m.push(Array(target).fill(1))
  m.forEach((row) => {
    while (row.length < target) row.push(1)
  })
  for (let i = 0; i < target; i++) m[i][i] = 1
  return m
}
function trimMatrix(mat: number[][], removeIdx: number): number[][] {
  return mat
    .filter((_, i) => i !== removeIdx)
    .map((row) => row.filter((_, j) => j !== removeIdx))
}

// --------- AHP ALGORITMO ---------
function ahpCalculate(weightsMatrix: number[][]) {
  const n = weightsMatrix.length
  // soma colunas
  const colSums = Array(n).fill(0)
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += weightsMatrix[i][j]
    }
  }
  // normalizar matriz
  const norm = weightsMatrix.map((row) =>
    row.map((v, j) => v / (colSums[j] || 1)),
  )
  // média das linhas: peso de cada critério/alternativa
  const weights = norm.map((row) => row.reduce((a, b) => a + b, 0) / n)
  return weights
}

// ---------- COMPONENTE PRINCIPAL -----------
export function AHPScreenDesign() {
  const [criteria, setCriteria] = useState(['Custo', 'Conforto'])
  const [alternatives, setAlternatives] = useState(['A', 'B'])
  const [critMatrix, setCritMatrix] = useState(createOnesMatrix(2))
  const [altMatrices, setAltMatrices] = useState([
    createOnesMatrix(2),
    createOnesMatrix(2),
  ])
  const [activeAltCriterionIdx, setActiveAltCriterionIdx] = useState(0)
  const [result, setResult] = useState<null | {
    criteriaWeights: number[]
    altWeights: number[][]
    globalScores: number[]
  }>(null)

  function addCriterion() {
    const next = [...criteria, 'Novo critério']
    setCriteria(next)
    setCritMatrix(padMatrix(critMatrix, next.length))
    setAltMatrices([...altMatrices, createOnesMatrix(alternatives.length)])
  }
  function removeCriterion(i: number) {
    if (criteria.length <= 2) return
    setCriteria(criteria.filter((_, idx) => idx !== i))
    setCritMatrix(trimMatrix(critMatrix, i))
    setAltMatrices(altMatrices.filter((_, idx) => idx !== i))
    setActiveAltCriterionIdx((idx) => (idx > 0 && idx === i ? idx - 1 : idx))
  }
  function addAlternative() {
    const next = [...alternatives, 'Nova alternativa']
    setAlternatives(next)
    setAltMatrices(altMatrices.map((m) => padMatrix(m, next.length)))
  }
  function removeAlternative(i: number) {
    if (alternatives.length <= 2) return
    setAlternatives(alternatives.filter((_, idx) => idx !== i))
    setAltMatrices(altMatrices.map((m) => trimMatrix(m, i)))
  }

  // ---- EDIÇÃO DE MATRIZ ----
  function setCritCell(row: number, col: number, value: number) {
    if (row === col) return
    const val = isNaN(value) || value < 1 ? 1 : value
    const m = critMatrix.map((r) => [...r])
    m[row][col] = val
    m[col][row] = parseFloat((1 / val).toFixed(5))
    setCritMatrix(m)
  }
  function setAltCell(matIdx: number, row: number, col: number, value: number) {
    if (row === col) return
    const val = isNaN(value) || value < 1 ? 1 : value
    const mats = altMatrices.map((m) => m.map((r) => [...r]))
    mats[matIdx][row][col] = val
    mats[matIdx][col][row] = parseFloat((1 / val).toFixed(5))
    setAltMatrices(mats)
  }

  // ---- CALCULAR ----
  function calcular() {
    // Validar entradas: nenhuma célula pode ser vazia ou zero
    if (
      critMatrix.some((row, i) =>
        row.some((v, j) => i < j && (isNaN(v) || v < 1 || v > 9)),
      )
    ) {
      alert(
        'Preencha corretamente todos os campos da matriz de critérios (1-9)',
      )
      return
    }
    if (
      altMatrices.some((mat) =>
        mat.some((row, i) =>
          row.some((v, j) => i < j && (isNaN(v) || v < 1 || v > 9)),
        ),
      )
    ) {
      alert(
        'Preencha corretamente todos os campos das matrizes de alternativas (1-9)',
      )
      return
    }

    // Cálculo AHP
    const criteriaWeights = ahpCalculate(critMatrix)
    const altWeights = altMatrices.map((mat) => ahpCalculate(mat))
    // Combinar pesos globais
    const globalScores = alternatives.map((_, aIdx) =>
      criteriaWeights.reduce(
        (acc, cW, cIdx) => acc + cW * (altWeights[cIdx][aIdx] || 0),
        0,
      ),
    )
    setResult({ criteriaWeights, altWeights, globalScores })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col p-0">
      {/* HEADER */}
      <div className="flex items-center gap-4 px-10 pt-10 pb-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          <NavLink
            to="/"
            className="w-full h-full flex items-center justify-center hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </NavLink>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Método AHP (Processo Analítico Hierárquico)
        </h1>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="flex flex-1 gap-6 w-full max-w-7xl mx-auto px-4 pb-8 items-stretch">
        {/* COLUNA ESQUERDA */}
        <div className="flex-1 max-w-md flex flex-col">
          <Card className="bg-[#162032] border border-[#222f43] rounded-2xl shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white font-semibold">
                <BarChart3 className="text-cyan-400 w-6 h-6" />
                Parâmetros do AHP
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Critérios */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-300 block mb-1">
                  Critérios
                </label>
                <div className="flex flex-col gap-2">
                  {criteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <Input
                        value={c}
                        onChange={(e) => {
                          const next = [...criteria]
                          next[i] = e.target.value
                          setCriteria(next)
                        }}
                        className="h-10 bg-[#1f2a3c] border border-[#25334a] text-white w-full"
                        placeholder="Ex: Custo"
                      />
                      {criteria.length > 2 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="opacity-60 group-hover:opacity-100 hover:bg-red-900/60"
                          onClick={() => removeCriterion(i)}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-cyan-400 font-semibold mt-1 hover:bg-cyan-900/10 hover:text-cyan-400"
                    onClick={addCriterion}
                  >
                    <Plus className="w-4 h-4" /> Adicionar critério
                  </Button>
                </div>
              </div>
              {/* Alternativas */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-300 block mb-1">
                  Alternativas
                </label>
                <div className="flex flex-col gap-2">
                  {alternatives.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <Input
                        value={a}
                        onChange={(e) => {
                          const next = [...alternatives]
                          next[i] = e.target.value
                          setAlternatives(next)
                        }}
                        className="h-10 bg-[#1f2a3c] border border-[#25334a] text-white w-full"
                        placeholder="Ex: Alternativa A"
                      />
                      {alternatives.length > 2 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="opacity-60 group-hover:opacity-100 hover:bg-red-900/60"
                          onClick={() => removeAlternative(i)}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-cyan-400 font-semibold mt-1 hover:bg-cyan-900/10 hover:text-cyan-400"
                    onClick={addAlternative}
                  >
                    <Plus className="w-4 h-4" /> Adicionar alternativa
                  </Button>
                </div>
              </div>
              {/* Matriz critérios */}
              <div className="mb-7">
                <label className="text-sm font-semibold text-gray-300 block mb-1">
                  Comparação par-a-par dos Critérios (escala 1-9)
                </label>
                <PairwiseTableEdit
                  labels={criteria}
                  matrix={critMatrix}
                  onEdit={setCritCell}
                />
                <span className="text-xs text-gray-400 mt-1 block">
                  1 = igual, 9 = extremamente mais importante.
                </span>
              </div>
              <Button
                className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 rounded-lg font-bold mt-auto"
                onClick={calcular}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Calcular Resultados
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* COLUNA DIREITA */}
        <div className="flex-1 w-full flex flex-col">
          <div className="flex gap-2 mb-4">
            {criteria.map((c, idx) => (
              <button
                key={c}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm
                  ${
                    activeAltCriterionIdx === idx
                      ? 'bg-blue-700 text-white shadow'
                      : 'bg-[#1f2a3c] text-cyan-300 hover:bg-blue-900/70'
                  }
                `}
                onClick={() => setActiveAltCriterionIdx(idx)}
                type="button"
              >
                {c}
              </button>
            ))}
          </div>
          <Card className="bg-[#162032] border border-[#222f43] rounded-2xl shadow-lg w-full mx-auto">
            <CardContent className="p-7">
              <label className="text-sm font-semibold text-gray-300 block mb-2">
                Comparação par-a-par das Alternativas (
                {criteria[activeAltCriterionIdx]})
              </label>
              <PairwiseTableEdit
                labels={alternatives}
                matrix={altMatrices[activeAltCriterionIdx]}
                onEdit={(row, col, value) =>
                  setAltCell(activeAltCriterionIdx, row, col, value)
                }
              />
              <span className="text-xs text-gray-400 mt-2 block text-center">
                Compare as alternativas de acordo com o critério selecionado.
              </span>
              {/* RESULTADO */}
              {result && (
                <div className="mt-7 p-5 bg-[#192235] rounded-lg border border-[#25334a] text-gray-200">
                  <h3 className="font-bold mb-2 text-lg text-cyan-300">
                    Resultados do AHP
                  </h3>
                  <div className="mb-3">
                    <span className="font-semibold">Pesos dos critérios:</span>
                    <ul className="ml-3 mt-1 text-sm">
                      {criteria.map((c, i) => (
                        <li key={c}>
                          {c}:{' '}
                          <span className="font-mono">
                            {(result.criteriaWeights[i] * 100).toFixed(2)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">
                      Pesos das alternativas em cada critério:
                    </span>
                    <ul className="ml-3 mt-1 text-sm">
                      {criteria.map((c, cIdx) => (
                        <li key={c}>
                          <span className="font-medium">{c}:</span>{' '}
                          {alternatives.map((a, aIdx) => (
                            <span key={a} className="mr-2">
                              {a}:{' '}
                              <span className="font-mono">
                                {(result.altWeights[cIdx][aIdx] * 100).toFixed(
                                  2,
                                )}
                                %
                              </span>
                            </span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Resultado global:</span>
                    <ul className="ml-3 mt-1 text-sm">
                      {alternatives.map((a, i) => (
                        <li key={a}>
                          {a}:{' '}
                          <span className="font-bold text-blue-400 font-mono">
                            {(result.globalScores[i] * 100).toFixed(2)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* FOOTER */}
      <footer className="text-gray-500 text-sm text-center border-t border-[#232d3a] px-8 py-4 mt-auto">
        © 2025 – Todos os direitos reservados • Método AHP
      </footer>
    </div>
  )
}

// ---------- MATRIZ DE INPUTS EDITÁVEL -------------
function PairwiseTableEdit({
  labels,
  matrix,
  onEdit,
}: {
  labels: string[]
  matrix: number[][]
  onEdit: (row: number, col: number, value: number) => void
}) {
  return (
    <div className="overflow-x-auto border w-full border-[#25334a] rounded-lg bg-[#192235]">
      <table className="w-full min-w-max">
        <thead>
          <tr>
            <th className="w-32" />
            {labels.map((l, i) => (
              <th
                key={i}
                className="text-center text-gray-300 font-medium py-1 px-2"
              >
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((row, r) => (
            <tr key={r} className={r % 2 === 0 ? 'bg-[#1d273b]/70' : ''}>
              <td className="text-gray-300 font-medium py-1 px-2">{row}</td>
              {labels.map((_, c) => (
                <td key={c} className="p-1">
                  <Input
                    type="number"
                    min={1}
                    max={9}
                    step={1}
                    value={matrix[r]?.[c] ?? ''}
                    className="h-8 text-center bg-[#1d273b] border border-[#25334a] text-gray-200 font-mono appearance-none"
                    readOnly={r === c}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (r !== c && val >= 1 && val <= 9) {
                        onEdit(r, c, val)
                      }
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
