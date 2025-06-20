import Decimal from 'decimal.js'

export interface Parameters {
  N: number // População total
  s: number // Nº de servidores
  lambdaIndividual: number // Taxa de chegada individual
  mu: number // Taxa de serviço de cada servidor
}

export interface Results {
  rho: number // Utilização média dos servidores (ρ = λ / (s * μ))
  N: number
  s: number
  lambdaIndividual: number
  mu: number
  PnList: number[] // Probabilidade de n clientes no sistema (n=0..N)
  P0: number // Probabilidade do sistema vazio
  L: number // Número médio de clientes no sistema
  Lq: number // Número médio aguardando na fila
  lambdaEffective: number // Taxa efetiva de chegada (clientes atendidos)
  W: number // Tempo médio no sistema
  Wq: number // Tempo médio na fila
  idlePercentage: number // % tempo total ocioso (P0*100)
}

export function mmsnFinitePopulation(params: Parameters): Results {
  const { N, s, lambdaIndividual, mu } = params

  // Calcula a lista de probabilidades Pn (n = 0 ... N)
  const Pn: Decimal[] = []
  Pn[0] = new Decimal(1)
  for (let n = 1; n <= N; n++) {
    // λ(n-1) = (N - (n-1)) * λ_individual
    // μ(n) = min(n, s) * μ
    const lambda_n_1 = new Decimal(N - (n - 1)).mul(lambdaIndividual)
    const mu_n = Decimal.min(n, s).mul(mu)
    Pn[n] = Pn[n - 1].mul(lambda_n_1.div(mu_n))
  }
  // Normaliza para somar 1
  const sumPn = Pn.reduce((acc, v) => acc.plus(v), new Decimal(0))
  for (let n = 0; n <= N; n++) {
    Pn[n] = Pn[n].div(sumPn)
  }

  // Resultados
  const P0 = Pn[0]
  const PnList = Pn.map((v) => v.toNumber())

  // Número médio no sistema (L)
  let L = new Decimal(0)
  for (let n = 0; n <= N; n++) {
    L = L.plus(new Decimal(n).mul(Pn[n]))
  }

  // Número médio aguardando na fila (Lq)
  let Lq = new Decimal(0)
  for (let n = s + 1; n <= N; n++) {
    Lq = Lq.plus(new Decimal(n - s).mul(Pn[n]))
  }

  // Taxa efetiva de chegada (clientes realmente atendidos)
  let lambdaEffective = new Decimal(0)
  for (let n = 0; n <= N - 1; n++) {
    lambdaEffective = lambdaEffective.plus(
      new Decimal(N - n).mul(lambdaIndividual).mul(Pn[n]),
    )
  }

  // Tempo médio no sistema (W) e na fila (Wq)
  const W = lambdaEffective.gt(0)
    ? L.div(lambdaEffective)
    : new Decimal(Infinity)
  const Wq = lambdaEffective.gt(0)
    ? Lq.div(lambdaEffective)
    : new Decimal(Infinity)
  const idlePercentage = P0.mul(100)

  return {
    rho: lambdaEffective.div(s * mu).toNumber(), // Utilização média dos servidores
    N: new Decimal(N).toNumber(),
    s: new Decimal(s).toNumber(),
    lambdaIndividual: new Decimal(lambdaIndividual).toNumber(),
    mu: new Decimal(mu).toNumber(),
    PnList,
    P0: P0.toNumber(),
    L: L.toNumber(),
    Lq: Lq.toNumber(),
    lambdaEffective: lambdaEffective.toNumber(),
    W: W.toNumber(),
    Wq: Wq.toNumber(),
    idlePercentage: idlePercentage.toNumber(),
  }
}
