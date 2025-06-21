import { factorial } from '@renderer/utils/factorial'
import Decimal from 'decimal.js'

export interface Parameters {
  N: number
  meanTimeToFailure: number
  meanRepairTime: number
  machineStopCostPerHour: number // Novo campo
  technicianCostPerHour: number // Novo campo
}

export interface Results {
  N: number
  P0: number
  PnList: number[]
  L: number
  Lq: number
  lambdaEffective: number
  W: number
  Wq: number
  idlePercentage: number
  utilization: number // <-- NOVO: % do tempo ocupado
  allBrokenProbability: number // <-- NOVO: prob. todas unidades quebradas
  stopMachineCostPerHour: number // Novo campo
  technicianCostPerHour: number // Novo campo
}

export function mm1nFinitePopulation(params: Parameters): Results {
  const {
    N,
    meanTimeToFailure,
    meanRepairTime,
    machineStopCostPerHour,
    technicianCostPerHour,
  } = params
  const lambdaIndividual = new Decimal(1).div(meanTimeToFailure)
  const mu = new Decimal(1).div(meanRepairTime)

  const rho = lambdaIndividual.div(mu)
  if (rho.gte(1)) {
    throw new Error(
      'A taxa de chegada é maior ou igual à taxa de serviço, o sistema não é estável.',
    )
  }

  const Pn: Decimal[] = Array.from<Decimal>({ length: N + 1 }).fill(
    new Decimal(0),
  )
  for (let n = 0; n <= N; n++) {
    const firstTerm = factorial(N).div(factorial(N - n))
    const secondTerm = lambdaIndividual.div(mu).pow(n)

    Pn[n] = firstTerm.mul(secondTerm)
  }

  const sumPn = Pn.reduce((acc, p) => acc.plus(p), new Decimal(0))

  const P0 = new Decimal(1).div(sumPn)
  const PnList = Pn.map((p) => p.toNumber())
  const allBrokenProbability = Pn[N].toNumber() // Prob. todas unidades quebradas

  const Lq = new Decimal(N).minus(
    lambdaIndividual
      .plus(mu)
      .div(lambdaIndividual)
      .mul(new Decimal(1).minus(P0)),
  )

  const L = new Decimal(N).minus(
    mu.div(lambdaIndividual).mul(new Decimal(1).minus(P0)),
  )

  const lambdaEffective = lambdaIndividual.mul(new Decimal(N).minus(P0))

  const W =
    lambdaEffective.gt(0) && L.gt(0)
      ? L.div(lambdaEffective)
      : new Decimal(Infinity)
  const Wq =
    lambdaEffective.gt(0) && Lq.gte(0)
      ? Lq.div(lambdaEffective)
      : new Decimal(Infinity)
  const idlePercentage = P0.mul(100)
  const utilization = new Decimal(1).minus(P0).mul(100) // % do tempo ocupado
  const stopMachineCostPerHour = L.mul(machineStopCostPerHour)
  const costOfTechnician = L.minus(Lq).mul(technicianCostPerHour)

  return {
    N: new Decimal(N).toNumber(),
    P0: P0.toNumber(),
    PnList,
    L: L.toNumber(),
    Lq: Lq.toNumber(),
    lambdaEffective: lambdaEffective.toNumber(),
    W: W.toNumber(),
    Wq: Wq.toNumber(),
    idlePercentage: idlePercentage.toNumber(),
    utilization: utilization.toNumber(), // Novo
    allBrokenProbability, //
    stopMachineCostPerHour: stopMachineCostPerHour.toNumber(),
    technicianCostPerHour: costOfTechnician.toNumber(),
  }
}
