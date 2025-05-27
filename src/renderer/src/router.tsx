import { Router } from '../../lib/electron-router-dom'
import { Route } from 'react-router-dom'
import { HomeScreen } from './screen/home'
import { ModelScreen } from './screen/model'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/model/:id" element={<ModelScreen />} />
        </>
      }
    />
  )
}
