export function onlyNumbers(value: string) {
  // Permite apenas números e ponto decimal (um único ponto)
  // Remove tudo que não for dígito ou ponto
  value = value.replace(/[^0-9.]/g, '')
  // Garante que só tenha um ponto
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  // Remove ponto no começo (tipo ".5" vira "0.5")
  if (value.startsWith('.')) value = '0' + value
  return value
}
