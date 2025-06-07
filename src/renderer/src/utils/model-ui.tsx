import { Calculator, TrendingUp, Users } from 'lucide-react'

export function getModelIcon(modelName: string) {
  if (modelName.includes('s>1')) {
    return <Users className="h-5 w-5" />
  }

  if (modelName.includes('/K')) {
    return <TrendingUp className="h-5 w-5" />
  }

  return <Calculator className="h-5 w-5" />
}

export function getModelColor(modelName: string) {
  if (modelName.includes('s>1')) {
    return 'from-blue-500 to-cyan-500'
  }

  if (modelName.includes('/K')) {
    return 'from-purple-500 to-pink-500'
  }

  return 'from-green-500 to-emerald-500'
}
