import { Toaster } from './components/shadcn/sonner'
import { AppRoutes } from './router'

export function App() {
  return (
    <>
      <AppRoutes />
      <Toaster richColors theme="dark" />
    </>
  )
}
