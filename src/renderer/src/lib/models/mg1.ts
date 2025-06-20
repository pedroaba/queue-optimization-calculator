import Decimal from 'decimal.js'

/**
 * Parâmetros de entrada do modelo M/G/1
 */
export interface Parameters {
  lambda: number // Taxa de chegada (λ)
  mu: number // Taxa de serviço (μ)
  sigma: number // Desvio padrão do tempo de serviço (σ)
}

/**
 * Resultados do modelo M/G/1
 */
export interface Results {
  rho: number // Fator de utilização (ρ)
  P0: number // Probabilidade do sistema vazio
  Lq: number // Número médio de clientes na fila
  Wq: number // Tempo médio de espera na fila
  L: number // Número médio de clientes no sistema
  W: number // Tempo médio no sistema
  lambda: number // Taxa de chegada (λ)
  mu: number // Taxa de serviço (μ)
  sigma: number // Desvio padrão do tempo de serviço (σ)
}

export function mg1(params: Parameters): Results {
  const { lambda, mu, sigma } = params
  const λ = new Decimal(lambda)
  const μ = new Decimal(mu)
  const σ = new Decimal(sigma)

  // Calcula a intensidade de tráfego (utilização do sistema): ρ = λ / μ
  const rho = μ.eq(0) ? new Decimal(Infinity) : λ.div(μ)

  // Calcula a probabilidade de o sistema estar vazio: P₀ = 1 - ρ
  const P0 = rho.gte(1) ? new Decimal(0) : new Decimal(1).minus(rho)

  // Número médio de clientes na fila (Lq): Lq = (λ²σ² + ρ²) / (2 * (1 - ρ))
  let Lq: Decimal
  if (rho.gte(1)) {
    Lq = new Decimal(Infinity)
  } else {
    const lambdaSq = λ.pow(2)
    const sigmaSq = σ.pow(2)
    const rhoSq = rho.pow(2)
    const numerator = lambdaSq.mul(sigmaSq).plus(rhoSq)
    const denominator = new Decimal(2).mul(new Decimal(1).minus(rho))
    Lq = denominator.eq(0) ? new Decimal(Infinity) : numerator.div(denominator)
  }

  // Tempo médio de espera na fila (Wq): Wq = Lq / λ
  const Wq = λ.eq(0) ? new Decimal(0) : Lq.div(λ)

  // Número médio de clientes no sistema (L): L = ρ + Lq
  const L = rho.plus(Lq)

  // Tempo médio no sistema (W): W = Wq + 1/μ
  const W = μ.eq(0) ? new Decimal(Infinity) : Wq.plus(new Decimal(1).div(μ))

  return {
    rho: rho.toNumber(),
    P0: P0.toNumber(),
    Lq: Lq.toNumber(),
    Wq: Wq.toNumber(),
    L: L.toNumber(),
    W: W.toNumber(),
    lambda: λ.toNumber(),
    mu: μ.toNumber(),
    sigma: σ.toNumber(),
  }
}
