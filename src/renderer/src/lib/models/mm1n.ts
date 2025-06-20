import Decimal from 'decimal.js'

/**
 * Parâmetros de entrada do modelo M/M/1/N
 */
export interface Parameters {
  lambda: number // Taxa de chegada (clientes por unidade de tempo)
  mu: number // Taxa de serviço (atendimentos por unidade de tempo)
  N: number // Capacidade máxima do sistema (inclui o cliente sendo atendido)
}

/**
 * Resultados do modelo M/M/1/N
 */
export interface Results {
  rho: number // Fator de utilização (ρ = λ / μ)
  P0: number // Probabilidade de o sistema estar vazio
  PnList: number[] // Lista de probabilidades de haver n clientes no sistema (0 ≤ n ≤ N)
  P_block: number // Probabilidade de bloqueio (Pn[N])
  L: number // Número médio de clientes no sistema
  Lq: number // Número médio de clientes na fila (exclui quem está sendo atendido)
  lambdaEffective: number // Taxa efetiva de chegada (clientes realmente admitidos)
  W: number // Tempo médio no sistema
  Wq: number // Tempo médio de espera na fila
}

/**
 * Calcula o modelo de fila M/M/1/N com precisão decimal.js
 */
export function mm1n(params: Parameters): Results {
  const lambda = new Decimal(params.lambda)
  const mu = new Decimal(params.mu)
  const N = params.N

  const rho = lambda.div(mu)

  let P0: Decimal
  if (rho.equals(1)) {
    P0 = new Decimal(1).div(N + 1)
  } else {
    const numerator = new Decimal(1).sub(rho)
    const denominator = new Decimal(1).sub(rho.pow(N + 1))
    P0 = numerator.div(denominator)
  }

  // P(n) para n = 0 até N
  const PnList: Decimal[] = Array.from({ length: N + 1 }, (_, n) =>
    rho.pow(n).mul(P0),
  )

  // P_b = P(N) = última posição do array
  const P_block = PnList[N]

  // L = Σ(n * Pn)
  const L = PnList.reduce((acc, p, n) => acc.add(p.mul(n)), new Decimal(0))

  // λ efetivo = λ * (1 - Pn[N]) → chegadas que de fato entram no sistema
  const lambdaEffective = lambda.mul(new Decimal(1).sub(P_block))

  // W = L / λe
  const W = lambdaEffective.gt(0)
    ? L.div(lambdaEffective)
    : new Decimal(Infinity)

  // Lq = L - ρ * (1 - Pn[N])
  const Lq = L.sub(rho.mul(new Decimal(1).sub(P_block)))

  // Wq = Lq / λe
  const Wq = lambdaEffective.gt(0)
    ? Lq.div(lambdaEffective)
    : new Decimal(Infinity)

  return {
    rho: rho.toNumber(),
    P0: P0.toNumber(),
    PnList: PnList.map((p) => p.toNumber()),
    P_block: P_block.toNumber(),
    L: L.toNumber(),
    Lq: Lq.toNumber(),
    lambdaEffective: lambdaEffective.toNumber(),
    W: W.toNumber(),
    Wq: Wq.toNumber(),
  }
}
