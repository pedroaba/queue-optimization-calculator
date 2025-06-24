import Decimal from 'decimal.js'

Decimal.set({ precision: 28 }) // aumenta a precisão global

export interface Parameters {
  N: number // População total
  s: number // Nº de servidores
  lambdaIndividual: number // Taxa de chegada individual (clientes/hora)
  mu: number // Taxa de serviço por servidor (clientes/hora)
}

export interface Results {
  rho: number // Utilização média dos servidores
  N: number
  s: number
  lambdaIndividual: number
  mu: number
  PnList: number[] // Pn para n=0..N
  P0: number // Probabilidade do sistema vazio
  L: number // Nº médio no sistema
  Lq: number // Nº médio aguardando na fila
  lambdaEffective: number // Taxa efetiva de chegada
  W: number // Tempo médio no sistema
  Wq: number // Tempo médio na fila
  idlePercentage: number // % tempo ocioso
}

export function mmsnFinitePopulation(params: Parameters): Results {
  const { N, s, lambdaIndividual, mu } = params

  const NDec = new Decimal(N)
  const S = new Decimal(s)
  const lambdaIndividualDec = new Decimal(lambdaIndividual)
  const muDec = new Decimal(mu)

  // 1) Calcular Pn (não normalizados)
  const Pn: Decimal[] = []
  Pn[0] = new Decimal(1)

  for (let n = 1; n <= N; n++) {
    const lambda_n_1 = NDec.sub(n - 1).mul(lambdaIndividualDec) // (N-(n-1))*λ_individual
    const mu_n = Decimal.min(n, S).mul(muDec) // min(n,s)*μ
    Pn[n] = Pn[n - 1].mul(lambda_n_1.div(mu_n))
  }

  // 2) Normalizar
  const sumPn = Pn.reduce((acc, v) => acc.plus(v), new Decimal(0))
  for (let n = 0; n <= N; n++) {
    Pn[n] = Pn[n].div(sumPn)
  }

  // 3) Estatísticas básicas
  const P0 = Pn[0]
  const PnList = Pn.map((v) => v.toNumber())

  let L = new Decimal(0)
  let Lq = new Decimal(0)
  for (let n = 0; n <= N; n++) {
    L = L.plus(new Decimal(n).mul(Pn[n]))
    if (n > s) {
      Lq = Lq.plus(new Decimal(n).sub(s).mul(Pn[n]))
    }
  }

  // 4) Taxa efetiva (λ_eff)
  let lambdaEffective = new Decimal(0)
  for (let n = 0; n <= N - 1; n++) {
    lambdaEffective = lambdaEffective.plus(
      NDec.sub(n).mul(lambdaIndividualDec).mul(Pn[n]),
    )
  }

  // 5) Tempos médios
  const W = lambdaEffective.gt(0) ? L.div(lambdaEffective) : new Decimal(0)
  const Wq = lambdaEffective.gt(0) ? Lq.div(lambdaEffective) : new Decimal(0)
  const idlePercentage = P0.mul(100)

  // 6) Utilização média
  const rho = lambdaEffective.div(S.mul(muDec))

  return {
    rho: rho.toNumber(),
    N: NDec.toNumber(),
    s: S.toNumber(),
    lambdaIndividual: lambdaIndividualDec.toNumber(),
    mu: muDec.toNumber(),
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
