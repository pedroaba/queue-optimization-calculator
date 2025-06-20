import Decimal from 'decimal.js'

/**
 * Parâmetros de entrada do modelo M/M/1/K
 */
export interface Parameters {
  lambda: number // Taxa de chegada (clientes por unidade de tempo)
  mu: number // Taxa de serviço (atendimentos por unidade de tempo)
  K: number // Capacidade máxima do sistema (clientes no sistema)
  n: number // Valor máximo de n para gerar a lista Pn[n]
  t: number // Valor de tempo para cálculos P(W > t) e P(Wq > t)
}

/**
 * Resultados do modelo M/M/1/K
 */
export interface Results {
  lambda: number // Taxa de chegada (λ)
  mu: number // Taxa de serviço (μ)
  K: number // Capacidade máxima do sistema (K)
  n: number // Número de clientes (n)
  t: number // Tempo para probabilidades (t)
  Lq: number // Número médio de clientes na fila
  Wq: number // Tempo médio de espera na fila
  L: number // Número médio de clientes no sistema
  W: number // Tempo médio no sistema
  P0: number // Probabilidade do sistema vazio
  rho: number // Fator de utilização (ρ)
  lambdaEffective: number // Taxa efetiva de chegada (λ_ex = λ * (1 - Pk))
  PK: number // Probabilidade do sistema cheio (P(n=K))
  POverflow: number // Probabilidade de overflow (n > K) — normalmente 0
  pnList: number[] // Lista de probabilidades P(n) para n = 0 até n (parâmetro)
  PWGreaterThanT: number // Probabilidade do tempo no sistema ser maior que t (P(W > t))
  PWqGreaterThanT: number // Probabilidade do tempo de espera na fila ser maior que t (P(Wq > t))
}

/**
 * Fatorial inteiro para uso em distribuição Erlang
 */
function factorialInt(x: number): number {
  let res = 1
  for (let i = 2; i <= x; i++) res *= i
  return res
}

/**
 * CDF da distribuição Erlang (k, mu): P(T <= t)
 * P(T > t) = 1 - soma_{i=0}^{k-1} ( (mu*t)^i / i! ) * exp(-mu*t )
 */
function erlangSurvival(k: number, mu: number, t: number): number {
  let sum = 0
  for (let i = 0; i < k; i++) {
    sum += Math.pow(mu * t, i) / factorialInt(i)
  }
  return sum > 0 ? Math.exp(-mu * t) * sum : 1 // Para k=0, retorna 1
}

export function mm1k(params: Parameters): Results {
  const { lambda, mu, K, n, t } = params
  const λ = new Decimal(lambda)
  const μ = new Decimal(mu)
  const s = new Decimal(1)
  const Kdec = new Decimal(K)

  if (lambda <= 0)
    throw new Error('A taxa de chegada (lambda) deve ser maior que zero.')
  if (mu <= 0)
    throw new Error('A taxa de serviço (mu) deve ser maior que zero.')
  if (K < 1)
    throw new Error(
      'A capacidade máxima (K) deve ser inteira e maior ou igual a 1.',
    )
  if (n < 0) throw new Error('O valor de n deve ser inteiro e não-negativo.')

  function factorial(x: Decimal | number): Decimal {
    let v = new Decimal(x)
    if (v.isNegative() || !v.isInteger())
      throw new Error('Valor inválido para fatorial.')
    let result = new Decimal(1)
    for (let i = new Decimal(2); i.lte(v); i = i.plus(1)) {
      result = result.mul(i)
    }
    return result
  }

  // Cálculo de P0 (probabilidade do sistema vazio)
  function calcP0(
    lambda: Decimal,
    mu: Decimal,
    s: Decimal,
    K: Decimal,
  ): Decimal {
    let sum1 = new Decimal(0)
    for (let nn = new Decimal(0); nn.lt(s); nn = nn.plus(1)) {
      sum1 = sum1.plus(lambda.div(mu).pow(nn).div(factorial(nn)))
    }
    let sum2 = new Decimal(0)
    for (let nn = s; nn.lte(K); nn = nn.plus(1)) {
      sum2 = sum2.plus(
        lambda
          .div(mu)
          .pow(nn)
          .div(factorial(s).mul(s.pow(nn.minus(s)))),
      )
    }
    return new Decimal(1).div(sum1.plus(sum2))
  }

  const p0 = calcP0(λ, μ, s, Kdec)

  function pn(nn: number): Decimal {
    const nnD = new Decimal(nn)
    if (nnD.lt(s)) {
      return λ.div(μ).pow(nnD).div(factorial(nnD)).mul(p0)
    } else {
      return λ
        .div(μ)
        .pow(nnD)
        .div(factorial(s).mul(s.pow(nnD.minus(s))))
        .mul(p0)
    }
  }

  // Lista de probabilidades P(n) para n = 0 até n
  const pnList: number[] = []
  for (let ni = 0; ni <= n; ni++) {
    pnList.push(pn(ni).toNumber())
  }
  const pk = pn(K)
  const pk1 = pn(K + 1) // normalmente zero, pois n > K não existe

  // Taxa efetiva de chegada (lambda_bar)
  const lambdaBar = λ.mul(new Decimal(1).minus(pk))

  // Número médio de clientes no sistema (L)
  let L = new Decimal(0)
  for (let j = 0; j <= K; j++) {
    L = L.plus(new Decimal(j).mul(pn(j)))
  }

  // Número médio de clientes na fila (Lq)
  let Lq = new Decimal(0)
  for (let j = 1; j <= K; j++) {
    Lq = Lq.plus(new Decimal(j - 1).mul(pn(j)))
  }

  // Tempo médio no sistema (W)
  const W = lambdaBar.gt(0) ? L.div(lambdaBar) : new Decimal(0)

  // Tempo médio de espera na fila (Wq)
  const Wq = lambdaBar.gt(0) ? Lq.div(lambdaBar) : new Decimal(0)

  // Utilização do sistema (rho)
  const rho = λ.div(s.mul(μ))

  // --------------- Cálculo de P(Wq > t) e P(W > t) ---------------

  let PWGreaterThanT = 0
  let PWqGreaterThanT = 0

  // Probabilidade do cliente ser admitido no sistema
  const probEnter = 1 - pk.toNumber()
  if (probEnter > 0) {
    for (let nNow = 0; nNow < K; nNow++) {
      const probThisN = pn(nNow).toNumber() / probEnter
      // Tempo de espera na fila: Erlang(nNow, mu), se nNow >= 1; 0 se nNow == 0
      const pWq = nNow === 0 ? 0 : erlangSurvival(nNow, mu, t)
      // Tempo total no sistema: Erlang(nNow+1, mu)
      const pW = erlangSurvival(nNow + 1, mu, t)
      PWqGreaterThanT += probThisN * pWq
      PWGreaterThanT += probThisN * pW
    }
  }

  return {
    lambda: λ.toNumber(),
    mu: μ.toNumber(),
    K: Kdec.toNumber(),
    n: Number(n),
    t: Number(t),
    Lq: Lq.toNumber(),
    Wq: Wq.toNumber(),
    L: L.toNumber(),
    W: W.toNumber(),
    P0: p0.toNumber(),
    rho: rho.toNumber(),
    lambdaEffective: lambdaBar.toNumber(),
    PK: pk.toNumber(),
    POverflow: pk1.toNumber(),
    pnList: pnList,
    PWGreaterThanT: PWGreaterThanT,
    PWqGreaterThanT: PWqGreaterThanT,
  }
}
