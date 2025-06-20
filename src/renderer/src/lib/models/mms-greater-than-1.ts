import { factorial } from '@renderer/utils/factorial'
import Decimal from 'decimal.js'

/**
 * Parâmetros de entrada do modelo M/M/s (capacidade infinita)
 */
export interface Parameters {
  lambda: number // Taxa de chegada (clientes por unidade de tempo)
  mu: number // Taxa de serviço por servidor (atendimentos por unidade de tempo por servidor)
  s: number // Número de servidores (s > 1)
  n: number // Número de clientes para cálculo de Pn (probabilidade de haver n clientes)
  t: number // Valor de tempo para cálculo de probabilidades relacionadas a tempo de espera
}

/**
 * Resultados do modelo M/M/s (capacidade infinita)
 */
export interface Results {
  lambda: number // Taxa de chegada (λ)
  mu: number // Taxa de serviço por servidor (μ)
  ro: number // Fator de utilização (ρ = λ / (s * μ)), fração da capacidade total ocupada
  P0: number // Probabilidade do sistema estar vazio (nenhum cliente no sistema)
  Pn: number // Probabilidade de haver exatamente n clientes no sistema (Pn)
  P_more_than_r: number // Probabilidade do tempo de espera no sistema (W) ser maior que t: P(W > t)
  P_W_greater_than_t: number // Probabilidade do tempo de espera na fila (Wq) ser maior que t: P(Wq > t)
  P_W_equal_0: number // Probabilidade do tempo de espera na fila ser zero: P(Wq = 0)
  L: number // Número médio de clientes no sistema (L)
  Lq: number // Número médio de clientes na fila (Lq)
  W: number // Tempo médio de permanência no sistema (W)
  Wq: number // Tempo médio de espera na fila (Wq)
  s: number // Número de servidores (s)
}

/**
 * Modelo M/M/s (s > 1), capacidade infinita.
 * Calcula métricas principais do sistema.
 */
export function mmSInf(params: Parameters): Results {
  const { lambda, mu, s, n, t } = params

  // Decimals para precisão arbitrária
  const λ = new Decimal(lambda)
  const μ = new Decimal(mu)
  const S = new Decimal(s)
  const N = new Decimal(n)
  const T = new Decimal(t)

  function calculateRo(lambda: Decimal, mu: Decimal, s: Decimal): Decimal {
    if (s.mul(mu).isZero()) {
      throw new Error('s * mu não pode ser zero.')
    }

    return lambda.div(s.mul(mu))
  }

  function P0(lambda: Decimal, mu: Decimal, s: Decimal): Decimal {
    const ro = calculateRo(lambda, mu, s)
    if (lambda.gte(s.mul(mu))) {
      throw new Error('Sistema instável: λ >= s * μ')
    }

    let sum = new Decimal(0)
    for (let n = new Decimal(0); n.lt(s); n = n.plus(1)) {
      sum = sum.plus(lambda.div(mu).pow(n).div(factorial(n)))
    }

    const term2 = lambda
      .div(mu)
      .pow(s)
      .div(factorial(s))
      .mul(new Decimal(1).div(new Decimal(1).minus(ro)))

    const denominator = sum.plus(term2)
    if (denominator.isZero()) {
      throw new Error('Denominador para P0 é zero')
    }

    return new Decimal(1).div(denominator)
  }

  function Pn(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    n: Decimal,
    p0: Decimal,
  ): Decimal {
    if (n.lt(0)) return new Decimal(0)
    if (n.lte(s)) {
      return lambda.div(mu).pow(n).div(factorial(n)).mul(p0)
    }

    return lambda
      .div(mu)
      .pow(n)
      .div(factorial(s).mul(s.pow(n.minus(s))))
      .mul(p0)
  }

  function P_Wq_equals_0(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    p0: Decimal,
  ): Decimal {
    let sum = new Decimal(0)
    for (let n = new Decimal(0); n.lt(s); n = n.plus(1)) {
      sum = sum.plus(Pn(lambda, mu, s, n, p0))
    }

    return sum
  }

  function P_W_greater_than_t(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    t: Decimal,
    p0: Decimal,
  ): Decimal {
    const ro = calculateRo(lambda, mu, s)
    const term1 = mu.mul(t).neg().exp() // exp(-mu * t)
    const num = p0.mul(lambda.div(mu).pow(s))
    const denom = factorial(s).mul(new Decimal(1).minus(ro))
    if (denom.isZero()) {
      throw new Error('Denominador interno de P(W > t) é zero (rho=1).')
    }

    const fraction = num.div(denom)
    const sMinus1MinusLambdaOverMu = s.minus(1).minus(lambda.div(mu))
    let lastTerm: Decimal
    if (sMinus1MinusLambdaOverMu.abs().lt(1e-9)) {
      lastTerm = mu.mul(t)
    } else {
      lastTerm = new Decimal(1)
        .minus(mu.mul(sMinus1MinusLambdaOverMu).mul(t).neg().exp())
        .div(sMinus1MinusLambdaOverMu)
    }

    return term1.mul(new Decimal(1).plus(fraction.mul(lastTerm)))
  }

  function P_Wq_greater_than_t(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    t: Decimal,
    pwq0: Decimal,
  ): Decimal {
    const ro = calculateRo(lambda, mu, s)
    return new Decimal(1)
      .minus(pwq0)
      .mul(s.mul(mu).mul(new Decimal(1).minus(ro)).mul(t).neg().exp())
  }

  function Lq(lambda: Decimal, mu: Decimal, s: Decimal, p0: Decimal): Decimal {
    const ro = calculateRo(lambda, mu, s)
    const numerator = p0.mul(lambda.div(mu).pow(s)).mul(ro)
    const denom = factorial(s).mul(new Decimal(1).minus(ro).pow(2))
    if (denom.isZero()) {
      throw new Error('Denominador para Lq é zero (rho=1).')
    }

    return numerator.div(denom)
  }

  function Wq(lambda: Decimal, lq: Decimal): Decimal {
    if (lambda.isZero()) {
      return new Decimal(0)
    }

    return lq.div(lambda)
  }

  function LSystem(lambda: Decimal, mu: Decimal, lq: Decimal): Decimal {
    if (mu.isZero()) {
      throw new Error('mu não pode ser zero.')
    }

    return lq.plus(lambda.div(mu))
  }

  function WSystem(lambda: Decimal, l: Decimal): Decimal {
    if (lambda.isZero()) {
      return new Decimal(0)
    }

    return l.div(lambda)
  }

  // Cálculos principais
  const p0 = P0(λ, μ, S)
  const lq = Lq(λ, μ, S, p0)
  const ro = calculateRo(λ, μ, S)
  const l = LSystem(λ, μ, lq)
  const wq = Wq(λ, lq)
  const w = WSystem(λ, l)
  const pn = Pn(λ, μ, S, N, p0)
  const pwq0 = P_Wq_equals_0(λ, μ, S, p0)
  const pw_greater_n = P_W_greater_than_t(λ, μ, S, T, p0)
  const pwq_greater_n = P_Wq_greater_than_t(λ, μ, S, T, pwq0)

  return {
    lambda: λ.toNumber(), // Taxa de chegada (clientes/unidade de tempo)
    mu: μ.toNumber(), // Taxa de serviço por servidor (atendimentos/unidade de tempo/servidor)
    ro: ro.toNumber(), // Fator de utilização do sistema (ρ = λ/(sμ))
    P0: p0.toNumber(), // Probabilidade do sistema estar vazio
    Pn: pn.toNumber(), // Probabilidade de haver exatamente n clientes no sistema
    P_more_than_r: pw_greater_n.toNumber(), // Probabilidade do tempo no sistema ser maior que t: P(W > t)
    P_W_greater_than_t: pwq_greater_n.toNumber(), // Probabilidade do tempo de espera na fila ser maior que t: P(Wq > t)
    P_W_equal_0: pwq0.toNumber(), // Probabilidade do tempo de espera na fila ser zero: P(Wq = 0)
    L: l.toNumber(), // Número médio de clientes no sistema (L)
    Lq: lq.toNumber(), // Número médio de clientes na fila (Lq)
    W: w.toNumber(), // Tempo médio de permanência no sistema (W)
    Wq: wq.toNumber(), // Tempo médio de espera na fila (Wq)
    s: S.toNumber(), // Número de servidores (s)
  }
}
