import Decimal from 'decimal.js'

export function factorial(val: Decimal | number): Decimal {
  let v = new Decimal(val)
  if (v.isNegative() || !v.isInteger()) {
    throw new Error('Valor inválido para fatorial.')
  }

  let result = new Decimal(1)
  for (let i = new Decimal(2); i.lte(v); i = i.plus(1)) {
    result = result.mul(i)
  }

  return result
}
