import Decimal from 'decimal.js'

export interface Parameters {
  arrivalRates: number[] // λₖ: arrival rates per priority class
  serviceRate: number // μ: service rate
  servers: number // s: number of servers
}

export interface Results {
  arrivalRates: number[]
  serviceRate: number
  servers: number
  WByClass: number[] // Mean time in system per class (Wₖ)
  WqByClass: number[] // Mean queue time per class (Wqₖ)
  LByClass: number[] // Mean number in system per class (Lₖ)
  LqByClass: number[] // Mean number in queue per class (Lqₖ)
}

export function mssNonPreemptivePriority(params: Parameters): Results {
  const arrivalRates = params.arrivalRates.map((x) => new Decimal(x))
  const mu = new Decimal(params.serviceRate)
  const s = new Decimal(params.servers)

  function decimalFactorial(n: Decimal): Decimal {
    let result = new Decimal(1)
    for (let i = new Decimal(2); i.lte(n); i = i.plus(1)) {
      result = result.mul(i)
    }
    return result
  }

  function calcWk(
    k: number,
    lambdas: Decimal[],
    mu: Decimal,
    s: Decimal,
  ): Decimal {
    if (s.isZero()) return new Decimal(Infinity)

    const lambdaTotal = lambdas.reduce(
      (acc, cur) => acc.plus(cur),
      new Decimal(0),
    )
    const rho = lambdaTotal.div(s.mul(mu))
    if (rho.gte(1)) return new Decimal(Infinity)

    const r = lambdaTotal.div(mu)
    let sumFactor = new Decimal(0)
    for (let j = new Decimal(0); j.lt(s); j = j.plus(1)) {
      sumFactor = sumFactor.plus(r.pow(j).div(decimalFactorial(j)))
    }

    let p0Inv: Decimal
    try {
      p0Inv = decimalFactorial(s)
        .mul(s.mul(mu).minus(lambdaTotal))
        .div(r.pow(s))
        .mul(sumFactor)
        .plus(s.mul(mu))
    } catch {
      return new Decimal(Infinity)
    }
    if (p0Inv.isZero()) return new Decimal(Infinity)

    const wq0 = new Decimal(1).div(p0Inv)

    const kIdx = k - 1
    const sumLambdaKMinus1 = lambdas
      .slice(0, kIdx)
      .reduce((a, b) => a.plus(b), new Decimal(0))
    const sumLambdaK = lambdas
      .slice(0, kIdx + 1)
      .reduce((a, b) => a.plus(b), new Decimal(0))
    const rhoKMinus1 = sumLambdaKMinus1.div(s.mul(mu))
    const rhoK = sumLambdaK.div(s.mul(mu))
    if (
      new Decimal(1).minus(rhoKMinus1).isZero() ||
      new Decimal(1).minus(rhoK).isZero()
    )
      return new Decimal(Infinity)

    const priorityFactor = new Decimal(1).div(
      new Decimal(1).minus(rhoKMinus1).mul(new Decimal(1).minus(rhoK)),
    )
    const wqK = wq0.mul(priorityFactor)
    return wqK.plus(new Decimal(1).div(mu))
  }

  function meanQueueTime(wk: Decimal, mu: Decimal): Decimal {
    return Decimal.max(new Decimal(0), wk.minus(new Decimal(1).div(mu)))
  }

  function meanInSystem(lambdaK: Decimal, wk: Decimal): Decimal {
    return lambdaK.mul(wk)
  }

  function meanInQueue(lk: Decimal, lambdaK: Decimal, mu: Decimal): Decimal {
    return Decimal.max(new Decimal(0), lk.minus(lambdaK.div(mu)))
  }

  const WByClass: number[] = []
  const WqByClass: number[] = []
  const LByClass: number[] = []
  const LqByClass: number[] = []

  for (let i = 0; i < arrivalRates.length; i++) {
    const k = i + 1 // priority class (1-based)
    const lambdaK = arrivalRates[i]
    const Wk = calcWk(k, arrivalRates, mu, s)
    const WqK = meanQueueTime(Wk, mu)
    const LK = meanInSystem(lambdaK, Wk)
    const LqK = meanInQueue(LK, lambdaK, mu)
    WByClass.push(Wk.toNumber())
    WqByClass.push(WqK.toNumber())
    LByClass.push(LK.toNumber())
    LqByClass.push(LqK.toNumber())
  }

  return {
    arrivalRates: params.arrivalRates,
    serviceRate: params.serviceRate,
    servers: params.servers,
    WByClass,
    WqByClass,
    LByClass,
    LqByClass,
  }
}
