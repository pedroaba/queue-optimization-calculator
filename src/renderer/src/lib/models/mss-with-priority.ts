import Decimal from 'decimal.js'

export interface Parameters {
  arrivalRates: number[] // Taxa de chegada para cada classe de prioridade (λ₁, λ₂, ...)
  serviceRate: number // Taxa de serviço (μ)
  servers: number // Nº de servidores (s)
}

export interface Results {
  arrivalRates: number[]
  serviceRate: number
  servers: number
  W_bar_aggregate: number[] // Tempo médio no sistema M/M/s padrão para cada classe
  W_by_class: number[] // Tempo médio no sistema para cada classe
  Wq_by_class: number[] // Tempo médio na fila para cada classe
  L_by_class: number[] // Nº médio de clientes no sistema por classe
  Lq_by_class: number[] // Nº médio de clientes na fila por classe
}

export function mssPriority(params: Parameters): Results {
  const lambdas = params.arrivalRates.map((x) => new Decimal(x))
  const mu = new Decimal(params.serviceRate)
  const s = new Decimal(params.servers)

  // Função para calcular o fator de utilização
  function rho(lambdaTot: Decimal, mu: Decimal, s: Decimal): Decimal {
    return lambdaTot.div(s.mul(mu))
  }

  // Função para calcular a probabilidade de haver fila (Erlang-C)
  function calcErlangCProb(
    lambdaTot: Decimal,
    mu: Decimal,
    s: Decimal,
  ): Decimal {
    if (s.isZero()) return new Decimal(1)
    const rhoVal = rho(lambdaTot, mu, s)
    if (rhoVal.gte(1)) return new Decimal(1)
    let sumTerm = new Decimal(0)
    for (let n = new Decimal(0); n.lt(s); n = n.plus(1)) {
      sumTerm = sumTerm.plus(s.mul(rhoVal).pow(n).div(factorial(n)))
    }
    const sTerm = s
      .mul(rhoVal)
      .pow(s)
      .div(factorial(s).mul(new Decimal(1).minus(rhoVal)))
    return sTerm.div(sumTerm.plus(sTerm))
  }

  // Função de fatorial com Decimal.js
  function factorial(x: Decimal): Decimal {
    let result = new Decimal(1)
    for (let i = new Decimal(2); i.lte(x); i = i.plus(1)) {
      result = result.mul(i)
    }
    return result
  }

  // Calculando para cada classe de prioridade
  const W_bar_aggregate: number[] = []
  const W_by_class: number[] = []
  const Wq_by_class: number[] = []
  const L_by_class: number[] = []
  const Lq_by_class: number[] = []
  const prev_W_values: Decimal[] = []

  for (let i = 0; i < lambdas.length; i++) {
    const effectiveLambda = lambdas
      .slice(0, i + 1)
      .reduce((a, b) => a.plus(b), new Decimal(0))
    // 1. Tempo médio no sistema padrão M/M/s com taxa λ₁+λ₂+...+λₖ
    const rhoTot = rho(effectiveLambda, mu, s)
    const Pq = calcErlangCProb(effectiveLambda, mu, s)
    let wq: Decimal
    let w: Decimal

    if (rhoTot.gte(1)) {
      wq = new Decimal(Infinity)
      w = new Decimal(Infinity)
    } else {
      wq = Pq.div(s.mul(mu).mul(new Decimal(1).minus(rhoTot)))
      w = wq.plus(new Decimal(1).div(mu))
    }

    W_bar_aggregate.push(w.toNumber())

    // 2. Subtrai os tempos das classes anteriores, ponderados pela sua participação
    let weightedPrevW = new Decimal(0)
    for (let j = 0; j < i; j++) {
      const p_j = lambdas[j].div(effectiveLambda)
      weightedPrevW = weightedPrevW.plus(p_j.mul(prev_W_values[j]))
    }

    const lambda_k = lambdas[i]
    const p_k = lambda_k.div(effectiveLambda)
    let W_k: Decimal
    if (p_k.isZero()) {
      W_k = new Decimal(Infinity)
    } else {
      W_k = w.minus(weightedPrevW).div(p_k)
    }

    prev_W_values.push(W_k)

    // Tempo médio na fila
    const Wq_k = Decimal.max(W_k.minus(new Decimal(1).div(mu)), new Decimal(0))
    // Nº médio de clientes no sistema
    const L_k = effectiveLambda.mul(W_k)
    // Nº médio de clientes na fila
    const Lq_k = Decimal.max(L_k.minus(effectiveLambda.div(mu)), new Decimal(0))

    W_by_class.push(W_k.toNumber())
    Wq_by_class.push(Wq_k.toNumber())
    L_by_class.push(L_k.toNumber())
    Lq_by_class.push(Lq_k.toNumber())
  }

  return {
    arrivalRates: params.arrivalRates,
    serviceRate: params.serviceRate,
    servers: params.servers,
    W_bar_aggregate,
    W_by_class,
    Wq_by_class,
    L_by_class,
    Lq_by_class,
  }
}
