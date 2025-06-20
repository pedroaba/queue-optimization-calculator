import { Router } from '../../lib/electron-router-dom'
import { Route } from 'react-router-dom'
import { HomeScreen } from './screen/home'
import { AHPScreenDesign } from './screen/ahp'
import { MM1Calculator } from './screen/calculator/mm1/calculator'
import { MM1NCalculator } from './screen/calculator/mm1n/calculator'
import { MMSGreaterThanOneCalculator } from './screen/calculator/mm1s-greater-than-1/calculator'
import { MMSGreaterThanOneKCalculator } from './screen/calculator/mms-greater-than-1-k/calculator'
import { MM1KCalculator } from './screen/calculator/mm1k/calculator'
import { MG1Calculator } from './screen/calculator/mg1/calculator'
import { MSSWithPriorityCalculator } from './screen/calculator/mss-with-priority/calculator'
import { MM1NFinitePopulationCalculator } from './screen/calculator/mm1n-finite-population/calculator'
import { MSSNonPreemptivePriorityCalculator } from './screen/calculator/mss-non-preemptive-priority/calculator'
import { MMSGreaterThanOneNCalculator } from './screen/calculator/mms-greater-than-1-n/calculator'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/ahp" element={<AHPScreenDesign />} />
          <Route path="/calculator/mm1" element={<MM1Calculator />} />
          <Route path="/calculator/mm1n" element={<MM1NCalculator />} />
          <Route
            path="/calculator/mms-greater-than-1"
            element={<MMSGreaterThanOneCalculator />}
          />
          <Route
            path="/calculator/mms-greater-than-1-k"
            element={<MMSGreaterThanOneKCalculator />}
          />
          <Route path="/calculator/mm1k" element={<MM1KCalculator />} />
          <Route path="/calculator/mg1" element={<MG1Calculator />} />
          <Route
            path="/calculator/mss-priority"
            element={<MSSWithPriorityCalculator />}
          />
          <Route
            path="/calculator/mm1n-finite-population"
            element={<MM1NFinitePopulationCalculator />}
          />
          <Route
            path="/calculator/mss-without-preemption"
            element={<MSSNonPreemptivePriorityCalculator />}
          />
          <Route
            path="/calculator/mms-greater-than-1-n"
            element={<MMSGreaterThanOneNCalculator />}
          />
        </>
      }
    />
  )
}
