import { useState } from 'react'
import { toast } from 'sonner'
import { Calculator, Plus, Trash2 } from 'lucide-react'
import { Label } from '@renderer/components/shadcn/label'
import { Input } from '@renderer/components/shadcn/input'
import { Button } from '@renderer/components/shadcn/button'
import {
  mssPriority,
  type Results,
} from '@renderer/lib/models/mss-with-priority'
import { onlyNumbers } from '@renderer/utils/only-numbers'

interface FormProps {
  onCalculate: (results: Results) => void
}

export function MSSWithPriorityFormCalculator({ onCalculate }: FormProps) {
  const [arrivalRates, setArrivalRates] = useState<string[]>([''])
  const [serviceRate, setServiceRate] = useState('')
  const [servers, setServers] = useState('')

  const handleArrivalRateChange = (idx: number, value: string) => {
    const numeric = onlyNumbers(value)
    setArrivalRates((prev) => {
      const arr = [...prev]
      arr[idx] = numeric
      return arr
    })
  }

  const addClass = () => setArrivalRates((prev) => [...prev, ''])
  const removeClass = (idx: number) =>
    setArrivalRates((prev) => prev.filter((_, i) => i !== idx))

  const handleCalculate = () => {
    const lambdas = arrivalRates
      .map((val) => Number(val) || 0)
      .filter((x) => x > 0)
    const mu = Number(serviceRate)
    const s = Number(servers)
    if (lambdas.length === 0 || mu <= 0 || s < 1) {
      toast.error('Validation error', {
        description:
          'Please provide at least one arrival rate (>0), a service rate (>0), and at least 1 server.',
      })
      return
    }
    try {
      const results = mssPriority({
        arrivalRates: lambdas,
        serviceRate: mu,
        servers: s,
      })
      onCalculate(results)
      toast.success('Calculation successful', {
        description: 'The queueing metrics were successfully calculated!',
      })
    } catch (error) {
      console.log('Error in M/M/s with Priority:', error)
      toast.error('Calculation error', {
        description:
          'An error occurred while calculating the metrics. Please check the parameters.',
      })
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Calculator className="w-5 h-5 mr-3 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">
          M/M/s with Priority - Parameters
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Arrival rates per class */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label className="text-gray-200 font-medium">
            Arrival rates by class (λₖ) *
          </Label>
          <div className="flex flex-col gap-2 mt-2">
            {arrivalRates.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  step="0.1"
                  min="0"
                  value={val}
                  onChange={(e) => handleArrivalRateChange(idx, e.target.value)}
                  className="bg-slate-700 border-slate-500 text-white placeholder-gray-400"
                  placeholder={`Class ${idx + 1} arrival rate`}
                />
                {arrivalRates.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeClass(idx)}
                    className="hover:bg-red-800/40 active:bg-red-500/20 focus:bg-red-500/20 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={addClass}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 mt-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add class
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Enter the arrival rate for each class of priority.
          </p>
        </div>

        {/* μ */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="serviceRate" className="text-gray-200 font-medium">
            Service rate (μ) *
          </Label>
          <Input
            id="serviceRate"
            step="0.1"
            min="0"
            value={serviceRate}
            onChange={(e) => setServiceRate(onlyNumbers(e.target.value))}
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="e.g., 3.0"
          />
          <p className="text-xs text-gray-400 mt-1">
            Services per unit of time <b>per server</b>
          </p>
        </div>

        {/* s */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <Label htmlFor="servers" className="text-gray-200 font-medium">
            Number of servers (s) *
          </Label>
          <Input
            id="servers"
            step="1"
            min="1"
            value={servers}
            onChange={(e) => setServers(onlyNumbers(e.target.value))}
            className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 mt-2 focus:border-blue-400 focus:ring-blue-400"
            placeholder="e.g., 2"
          />
          <p className="text-xs text-gray-400 mt-1">
            Number of parallel servers in the system
          </p>
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 mt-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calculate Results
      </Button>
    </div>
  )
}
