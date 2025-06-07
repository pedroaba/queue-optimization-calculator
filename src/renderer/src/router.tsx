import { Router } from '../../lib/electron-router-dom'
import { Route } from 'react-router-dom'
import { HomeScreen } from './screen/home'
// import { ModelScreen } from './screen/model'
import { Calculator } from './screen/calculator'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<HomeScreen />} />
          {/* <Route path="/model/:id" element={<ModelScreen />} /> */}
          <Route path="/model/:id" element={<Calculator />} />
        </>
      }
    />
  )
}
