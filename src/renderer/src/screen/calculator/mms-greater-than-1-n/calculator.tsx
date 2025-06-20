import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { MMSGreaterThanOneNFormCalculator } from './form'
import { MMSGreaterThanOneNResultCalculator } from './results'
import type { Results } from '@renderer/lib/models/mms-greater-than-1-n'
import { useNavigate } from 'react-router-dom'

export function MMSGreaterThanOneNCalculator() {
  const [results, setResults] = useState<Results | null>(null)
  const navigate = useNavigate()

  function handleCalculate(results: Results) {
    setResults(results)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8 p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <ArrowLeft
            className="w-6 h-6 mr-4 text-gray-400 cursor-pointer hover:text-white transition-colors"
            onClick={() => navigate('/')}
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Modelo M/M/S&gt;1/N
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Calculadora de Teoria das Filas
            </p>
          </div>
        </div>

        {/* Main Content - Vertical Layout */}
        <div className="space-y-6">
          {/* Parameters Section */}
          <div className="bg-slate-800/60 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 shadow-xl">
            <MMSGreaterThanOneNFormCalculator onCalculate={handleCalculate} />
          </div>

          {/* Results Section */}
          <div className="bg-slate-800/60 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 shadow-xl">
            <MMSGreaterThanOneNResultCalculator results={results} />
          </div>
        </div>
      </div>
    </div>
  )
}
