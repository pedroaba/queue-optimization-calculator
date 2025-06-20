import Decimal from 'decimal.js'

/**
 * Parâmetros de entrada do modelo M/M/s/K
 */
export interface Parameters {
  lambda: number // Taxa de chegada (clientes por unidade de tempo)
  mu: number // Taxa de serviço por servidor (atendimentos por unidade de tempo)
  s: number // Número de servidores
  n: number // Valor para cálculo de Pn
  K: number // Capacidade máxima do sistema (clientes no sistema)
  t: number // Tempo para cálculo de P(W > t), P(Wq > t)
}

/**
 * Resultados do modelo M/M/s/K
 */
export interface Results {
  lambda: number // Taxa de chegada (λ)
  mu: number // Taxa de serviço por servidor (μ)
  s: number // Número de servidores (s)
  K: number // Capacidade máxima do sistema (K)
  t: number // Tempo para probabilidades (t)
  rho: number // Fator de utilização (ρ = λ / (s*μ))
  P0: number // Probabilidade do sistema vazio (nenhum cliente)
  Pn: number // Probabilidade de haver n clientes no sistema
  PK: number // Probabilidade do sistema cheio (n=K)
  lambdaEffective: number // Taxa efetiva de chegada (λ * (1 - PK))
  L: number // Número médio de clientes no sistema
  Lq: number // Número médio de clientes na fila
  W: number // Tempo médio no sistema
  Wq: number // Tempo médio de espera na fila
  P_W_greater_than_t: number // Probabilidade do tempo no sistema ser maior que t (P(W > t))
  P_Wq_greater_than_t: number // Probabilidade do tempo de espera na fila ser maior que t (P(Wq > t))
  P_Wq_equals_0: number // Probabilidade de não haver espera na fila (P(Wq = 0))
}

export function mmsk(params: Parameters): Results {
  const { lambda, mu, s, n, K, t } = params
  const λ = new Decimal(lambda)
  const μ = new Decimal(mu)
  const S = new Decimal(s)
  const N = new Decimal(n)
  const KDEC = new Decimal(K)
  const T = new Decimal(t)

  if (lambda <= 0)
    throw new Error('A taxa de chegada (lambda) deve ser maior que zero.')
  if (mu <= 0)
    throw new Error('A taxa de serviço (mu) deve ser maior que zero.')
  if (s < 1 || !Number.isInteger(s))
    throw new Error(
      'O número de servidores (s) deve ser inteiro e maior ou igual a 1.',
    )
  if (K < s)
    throw new Error(
      'A capacidade máxima K não pode ser menor que o número de servidores s.',
    )
  if (n < 0) throw new Error('O valor de n não pode ser negativo.')
  if (t < 0) throw new Error('O valor de t não pode ser negativo.')

  function factorial(val: Decimal | number): Decimal {
    let v = new Decimal(val)
    if (v.isNegative() || !v.isInteger())
      throw new Error('Valor inválido para fatorial.')
    let result = new Decimal(1)
    for (let i = new Decimal(2); i.lte(v); i = i.plus(1)) {
      result = result.mul(i)
    }
    return result
  }

  function calcRho(lambda: Decimal, mu: Decimal, s: Decimal): Decimal {
    return lambda.div(s.mul(mu))
  }

  function calcP0(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
  ): Decimal {
    let sum_n_less_than_S = new Decimal(0)
    for (let n = new Decimal(0); n.lt(s); n = n.plus(1)) {
      sum_n_less_than_S = sum_n_less_than_S.plus(
        lambda.div(mu).pow(n).div(factorial(n)),
      )
    }
    const term_S_part_1 = lambda.div(mu).pow(s).div(factorial(s))
    let sum_n_greater_than_S = new Decimal(0)
    for (let n = s.plus(1); n.lte(K); n = n.plus(1)) {
      sum_n_greater_than_S = sum_n_greater_than_S.plus(
        lambda.div(s.mul(mu)).pow(n.minus(s)),
      )
    }
    const denominator = sum_n_less_than_S.plus(
      term_S_part_1.mul(sum_n_greater_than_S),
    )
    if (denominator.isZero()) throw new Error('Denominador para P0 é zero.')
    return new Decimal(1).div(denominator)
  }

  function calcPn(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    n: Decimal,
    p0: Decimal,
  ): Decimal {
    if (n.lt(0)) return new Decimal(0)
    if (n.lte(s)) {
      return lambda.div(mu).pow(n).div(factorial(n)).mul(p0)
    } else if (s.lt(n) && n.lte(K)) {
      return lambda
        .div(mu)
        .pow(n)
        .div(factorial(s).mul(s.pow(n.minus(s))))
        .mul(p0)
    } else {
      return new Decimal(0)
    }
  }

  function calcPK(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    return calcPn(lambda, mu, s, K, K, p0)
  }

  function calcLambdaEffective(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    const pk = calcPK(lambda, mu, s, K, p0)
    return lambda.mul(new Decimal(1).minus(pk))
  }

  function calcLq(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    const rho = calcRho(lambda, mu, s)
    const main_num = p0.mul(lambda.div(mu).pow(s)).mul(rho)
    const main_den = factorial(s).mul(new Decimal(1).minus(rho).pow(2))
    if (main_den.isZero()) throw new Error('Denominador para Lq é zero.')
    const main_term = main_num.div(main_den)
    const KminusS = K.minus(s)
    const bracket = new Decimal(1)
      .minus(rho.pow(KminusS))
      .minus(KminusS.mul(rho.pow(KminusS)).mul(new Decimal(1).minus(rho)))
    return main_term.mul(bracket)
  }

  function calcWq(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    const lq = calcLq(lambda, mu, s, K, p0)
    const lambdaEff = calcLambdaEffective(lambda, mu, s, K, p0)
    if (lambdaEff.isZero()) return new Decimal(0)
    return lq.div(lambdaEff)
  }

  function calcL(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    const lq = calcLq(lambda, mu, s, K, p0)
    let sum_n_pn_less_than_s = new Decimal(0)
    let sum_pn_less_than_s = new Decimal(0)
    for (let n = new Decimal(0); n.lt(s); n = n.plus(1)) {
      const pn_val = calcPn(lambda, mu, s, K, n, p0)
      sum_n_pn_less_than_s = sum_n_pn_less_than_s.plus(n.mul(pn_val))
      sum_pn_less_than_s = sum_pn_less_than_s.plus(pn_val)
    }
    return sum_n_pn_less_than_s
      .plus(lq)
      .plus(s.mul(new Decimal(1).minus(sum_pn_less_than_s)))
  }

  function calcW(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    const l = calcL(lambda, mu, s, K, p0)
    const lambdaEff = calcLambdaEffective(lambda, mu, s, K, p0)
    if (lambdaEff.isZero()) return new Decimal(0)
    return l.div(lambdaEff)
  }

  function calcPWqEquals0(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    let sum_pn = new Decimal(0)
    for (let n = new Decimal(0); n.lt(s); n = n.plus(1)) {
      sum_pn = sum_pn.plus(calcPn(lambda, mu, s, K, n, p0))
    }
    return sum_pn
  }

  function calcPWGreaterThanT(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    t: Decimal,
    p0: Decimal,
  ): Decimal {
    const rho = calcRho(lambda, mu, s)
    const term1 = μ.mul(t).neg().exp()
    const numerator = p0.mul(lambda.div(mu).pow(s))
    const denominator = factorial(s).mul(new Decimal(1).minus(rho))
    if (denominator.isZero())
      throw new Error('Denominador interno de P(W > t) é zero.')
    const middle = numerator.div(denominator)
    const sMinus1MinusLambdaOverMu = s.minus(1).minus(lambda.div(mu))
    let last: Decimal
    if (sMinus1MinusLambdaOverMu.abs().lt(1e-9)) {
      last = μ.mul(t)
    } else {
      last = new Decimal(1)
        .minus(μ.mul(sMinus1MinusLambdaOverMu).mul(t).neg().exp())
        .div(sMinus1MinusLambdaOverMu)
    }
    return term1.mul(new Decimal(1).plus(middle.mul(last)))
  }

  function calcPWqGreaterThanT(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    t: Decimal,
    p0: Decimal,
  ): Decimal {
    const rho = calcRho(lambda, mu, s)
    const pwq0 = calcPWqEquals0(lambda, mu, s, K, p0)
    return new Decimal(1)
      .minus(pwq0)
      .mul(s.mul(mu).mul(new Decimal(1).minus(rho)).mul(t).neg().exp())
  }

  // --- Execução dos cálculos principais ---
  const p0 = calcP0(λ, μ, S, KDEC)
  const rho = calcRho(λ, μ, S)
  const pn = calcPn(λ, μ, S, KDEC, N, p0)
  const pk = calcPK(λ, μ, S, KDEC, p0)
  const lambdaEff = calcLambdaEffective(λ, μ, S, KDEC, p0)
  const lq = calcLq(λ, μ, S, KDEC, p0)
  const l = calcL(λ, μ, S, KDEC, p0)
  const wq = calcWq(λ, μ, S, KDEC, p0)
  const w = calcW(λ, μ, S, KDEC, p0)
  const pwq0 = calcPWqEquals0(λ, μ, S, KDEC, p0)
  const pW_greater_than_t = calcPWGreaterThanT(λ, μ, S, T, p0)
  const pWq_greater_than_t = calcPWqGreaterThanT(λ, μ, S, KDEC, T, p0)

  return {
    lambda: λ.toNumber(),
    mu: μ.toNumber(),
    s: S.toNumber(),
    K: KDEC.toNumber(),
    t: T.toNumber(),
    rho: rho.toNumber(),
    P0: p0.toNumber(),
    Pn: pn.toNumber(),
    PK: pk.toNumber(),
    lambdaEffective: lambdaEff.toNumber(),
    L: l.toNumber(),
    Lq: lq.toNumber(),
    W: w.toNumber(),
    Wq: wq.toNumber(),
    P_W_greater_than_t: pW_greater_than_t.toNumber(),
    P_Wq_greater_than_t: pWq_greater_than_t.toNumber(),
    P_Wq_equals_0: pwq0.toNumber(),
  }
}
