import Decimal from 'decimal.js'

/**
 * Parâmetros de entrada do modelo M/M/1
 */
export interface Parameters {
  lambda: number // Número de chegadas durante o período T
  mu: number // Número de atendimentos durante o período T
  T: number // Período de observação (ex: 1 hora)
  t: number // Tempo a ser analisado (ex: para calcular P(W > t))
  n: number // Número de clientes no sistema para calcular Pn
  r: number // Valor de corte para calcular P(N > r)
}

/**
 * Resultados do modelo M/M/1
 */
export interface Results {
  rho: number // Fator de utilização do sistema (λ / μ)
  L: number // Número médio de clientes no sistema
  Lq: number // Número médio de clientes na fila
  W: number // Tempo médio que um cliente passa no sistema
  Wq: number // Tempo médio que um cliente espera na fila
  Pn: number // Probabilidade de haver exatamente n clientes no sistema
  P0: number // Probabilidade de o sistema estar vazio (sem clientes)
  PgtR: number // Probabilidade de haver mais de r clientes no sistema
  PwGreaterThanT: number // Probabilidade de um cliente passar mais que t no sistema
  PwqGreaterThanT: number // Probabilidade de esperar mais que t na fila
  unstable?: boolean // Indica se o sistema está instável (λ ≥ μ)
}

/**
 * Calcula as métricas do modelo de fila M/M/1 com alta precisão
 */
export function mm1(params: Parameters): Results {
  const lambda = new Decimal(params.lambda) // taxa de chegada (λ)
  const mu = new Decimal(params.mu) // taxa de atendimento (μ)

  const rho = lambda.div(mu) // fator de utilização

  // Verifica se o sistema é instável (λ ≥ μ)
  if (lambda.gte(mu)) {
    return {
      rho: rho.toNumber(),
      L: Infinity,
      Lq: Infinity,
      W: Infinity,
      Wq: Infinity,
      Pn: 0,
      P0: 0,
      PgtR: 1,
      PwGreaterThanT: 1,
      PwqGreaterThanT: 1,
      unstable: true,
    }
  }

  const one = new Decimal(1)

  const P0 = one.sub(rho) // probabilidade do sistema estar vazio
  const Pn = P0.mul(rho.pow(params.n)) // probabilidade de ter exatamente n clientes
  const PgtR = rho.pow(params.r + 1) // probabilidade de ter mais de r clientes

  // P(W > t) = probabilidade de um cliente passar mais de t unidades de tempo no sistema
  const PwGreaterThanT = Decimal.exp(mu.neg().mul(P0).mul(params.t))

  // P(Wq > t) = probabilidade de um cliente esperar mais que t unidades de tempo na fila
  const PwqGreaterThanT = rho.mul(PwGreaterThanT)

  // Número médio de clientes no sistema
  const L = lambda.div(mu.sub(lambda))

  // Número médio de clientes na fila
  const Lq = lambda.pow(2).div(mu.mul(mu.sub(lambda)))

  // Tempo médio que um cliente passa no sistema
  const W = one.div(mu.sub(lambda)).mul(60)

  // Tempo médio que um cliente espera na fila
  const Wq = lambda.div(mu.mul(mu.sub(lambda))).mul(60)

  return {
    rho: rho.toNumber(),
    L: L.toNumber(),
    Lq: Lq.toNumber(),
    W: W.toNumber(),
    Wq: Wq.toNumber(),
    Pn: Pn.toNumber(),
    P0: P0.toNumber(),
    PgtR: PgtR.toNumber(),
    PwGreaterThanT: PwGreaterThanT.toNumber(),
    PwqGreaterThanT: PwqGreaterThanT.toNumber(),
  }
}
