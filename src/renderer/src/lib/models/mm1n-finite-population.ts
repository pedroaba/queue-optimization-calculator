import Decimal from 'decimal.js'

export interface Parameters {
  N: number
  meanTimeToFailure: number
  meanRepairTime: number
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
}

export function mm1nFinitePopulation(params: Parameters): Results {
  const { N, meanTimeToFailure, meanRepairTime } = params
  const lambdaIndividual = new Decimal(1).div(meanTimeToFailure)
  const mu = new Decimal(1).div(meanRepairTime)

  const Pn: Decimal[] = Array(N + 1).fill(new Decimal(0))
  Pn[0] = new Decimal(1)
  for (let n = 1; n <= N; n++) {
    const lambda_n_minus_1 = new Decimal(N - (n - 1)).mul(lambdaIndividual)
    Pn[n] = Pn[n - 1].mul(lambda_n_minus_1.div(mu))
  }

  const sumPn = Pn.reduce((acc, p) => acc.plus(p), new Decimal(0))
  for (let n = 0; n <= N; n++) {
    Pn[n] = Pn[n].div(sumPn)
  }

  const P0 = Pn[0]
  const PnList = Pn.map((p) => p.toNumber())
  const allBrokenProbability = Pn[N].toNumber() // Prob. todas unidades quebradas

  let L = new Decimal(0)
  for (let n = 0; n <= N; n++) {
    L = L.plus(new Decimal(n).mul(Pn[n]))
  }

  let Lq = new Decimal(0)
  for (let n = 1; n <= N; n++) {
    Lq = Lq.plus(new Decimal(n - 1).mul(Pn[n]))
  }

  let lambdaEffective = new Decimal(0)
  for (let n = 0; n <= N; n++) {
    lambdaEffective = lambdaEffective.plus(
      new Decimal(N - n).mul(lambdaIndividual).mul(Pn[n]),
    )
  }

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
    allBrokenProbability, // Novo
  }
}
