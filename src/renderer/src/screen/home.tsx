import { ModelCardAHP } from '@renderer/components/ahp/card'
import { FooterSection } from '@renderer/components/footer-section'
import { ModelCard } from '@renderer/components/model-card'
import { Input } from '@renderer/components/shadcn/input'
import { TooltipProvider } from '@renderer/components/shadcn/tooltip'
import { models } from '@renderer/constants/models'
import { Network, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredModels = useMemo(() => {
    return models.filter(
      (model) =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.preview.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Modelos de <span className="text-cyan-400">Filas</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Explore e calcule diferentes modelos de teoria das filas com nossa
              interface intuitiva e moderna.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model) => (
              <ModelCard model={model} key={model.slug} />
            ))}

            {filteredModels.length === 0 && (
              <div className="text-center py-20 col-span-5">
                <Network className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Nenhum modelo encontrado
                </h3>
                <p className="text-gray-400">
                  Tente ajustar sua busca ou explore todos os modelos
                  disponíveis.
                </p>
              </div>
            )}

            <ModelCardAHP />
          </div>
        </div>

        {/* Stats Section */}
        {/* <StatsSection totalModels={models.length} /> */}

        {/* Footer */}
        <FooterSection />
      </div>
    </TooltipProvider>
  )
}
