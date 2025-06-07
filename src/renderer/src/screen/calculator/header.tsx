import { Button } from '@renderer/components/shadcn/button'
import { ArrowLeft } from 'lucide-react'

import { NavLink } from 'react-router-dom'

type HeaderProps = {
  modelName: string
}

export function Header({ modelName }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          // onClick={() => navigate('/')}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          <NavLink
            to="/"
            className="w-full h-full flex items-center justify-center hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </NavLink>
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-white">
            Modelo {modelName.replace(/Modelo\s+/g, '')}
          </h1>
          {/* <p className="text-gray-300 text-lg">
            Sistema de filas com chegadas Poisson e atendimento exponencial
          </p> */}
        </div>
      </div>

      {/* <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => setShowDescription(!showDescription)}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <Info className="h-4 w-4 mr-2" />
        {showDescription ? 'Ocultar' : 'Mostrar'} Descrição
      </Button>
    </div> */}
    </div>
  )
}
