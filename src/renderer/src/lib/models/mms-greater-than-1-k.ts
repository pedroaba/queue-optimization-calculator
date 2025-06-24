import Decimal from 'decimal.js'

export interface Parameters {
  lambda: number
  mu: number
  s: number
  n: number
  K: number
  t: number
}

export interface Results {
  lambda: number
  mu: number
  s: number
  K: number
  t: number
  rho: number
  P0: number
  Pn: number
  PK: number
  lambdaEffective: number
  L: number
  Lq: number
  W: number
  Wq: number
  P_W_greater_than_t: number
  P_Wq_greater_than_t: number
  P_Wq_equals_0: number
  P_N_geq_s: number // NOVO campo adicionado
}

export function mmsk(params: Parameters): Results {
  const { lambda, mu, s, n, K, t } = params
  const λ = new Decimal(lambda)
  const μ = new Decimal(mu)
  const S = new Decimal(s)
  const N = new Decimal(n)
  const KDEC = new Decimal(K)
  const T = new Decimal(t)

  if (lambda <= 0) throw new Error('λ deve ser maior que zero')
  if (mu <= 0) throw new Error('μ deve ser maior que zero')
  if (S.toNumber() < 1 || !Number.isInteger(S.toNumber()))
    throw new Error('s inválido')
  if (K < s) throw new Error('K < s')
  if (n < 0) throw new Error('n inválido')
  if (t < 0) throw new Error('t inválido')

  function factorial(val: Decimal | number): Decimal {
    let v = new Decimal(val)
    if (v.isNegative() || !v.isInteger())
      throw new Error('Valor inválido para fatorial')
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
    const r = lambda.div(mu)
    let denominatorSum = new Decimal(0)
    for (let i = 0; i < s.toNumber(); i++) {
      denominatorSum = denominatorSum.plus(r.pow(i).div(factorial(i)))
    }
    const sFactorial = factorial(s)
    for (let i = s.toNumber(); i <= K.toNumber(); i++) {
      const n_dec = new Decimal(i)
      denominatorSum = denominatorSum.plus(
        r.pow(n_dec).div(sFactorial.mul(s.pow(n_dec.minus(s)))),
      )
    }
    if (denominatorSum.isZero()) throw new Error('Denominador P0 = 0')
    return new Decimal(1).div(denominatorSum)
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
    if (n.lt(s)) {
      return lambda.div(mu).pow(n).div(factorial(n)).mul(p0)
    } else if (n.lte(K)) {
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
    if (main_den.isZero()) throw new Error('Denominador Lq = 0')
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
    return lambdaEff.isZero() ? new Decimal(0) : lq.div(lambdaEff)
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
    for (let i = new Decimal(0); i.lt(s); i = i.plus(1)) {
      const pn_val = calcPn(lambda, mu, s, K, i, p0)
      sum_n_pn_less_than_s = sum_n_pn_less_than_s.plus(i.mul(pn_val))
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
    return lambdaEff.isZero() ? new Decimal(0) : l.div(lambdaEff)
  }

  function calcPWqEquals0(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    let sum_pn = new Decimal(0)
    for (let i = new Decimal(0); i.lt(s); i = i.plus(1)) {
      sum_pn = sum_pn.plus(calcPn(lambda, mu, s, K, i, p0))
    }
    return sum_pn
  }

  function calcP_N_geq_s(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
    p0: Decimal,
  ): Decimal {
    let sum = new Decimal(0)
    for (let i = s.toNumber(); i <= K.toNumber(); i++) {
      sum = sum.plus(calcPn(lambda, mu, s, K, new Decimal(i), p0))
    }
    return sum
  }

  function calcPWGreaterThanT(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    t: Decimal,
    p0: Decimal,
  ): Decimal {
    const rho = calcRho(lambda, mu, s)
    const term1 = mu.mul(t).neg().exp()
    const numerator = p0.mul(lambda.div(mu).pow(s))
    const denominator = factorial(s).mul(new Decimal(1).minus(rho))
    if (denominator.isZero()) throw new Error('Denominador P(W>t) = 0')
    const middle = numerator.div(denominator)
    const sMinus1MinusLambdaOverMu = s.minus(1).minus(lambda.div(mu))
    let last: Decimal
    if (sMinus1MinusLambdaOverMu.abs().lt(1e-9)) {
      last = mu.mul(t)
    } else {
      last = new Decimal(1)
        .minus(mu.mul(sMinus1MinusLambdaOverMu).mul(t).neg().exp())
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
  const pN_geq_s = calcP_N_geq_s(λ, μ, S, KDEC, p0)

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
    W: w.mul(60).toNumber(),
    Wq: wq.mul(60).toNumber(),
    P_W_greater_than_t: pW_greater_than_t.toNumber(),
    P_Wq_greater_than_t: pWq_greater_than_t.toNumber(),
    P_Wq_equals_0: pwq0.toNumber(),
    P_N_geq_s: pN_geq_s.toNumber(),
  }
}
