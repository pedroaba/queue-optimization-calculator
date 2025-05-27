export type Model = {
  id: number
  name: string
  preview: string
  description: string
  tags?: string[]
}

export const models = [
  {
    id: 1,
    name: 'Modelo M/M/1/N',
    fields: [
      {
        name: 'lambda_input',
        type: 'number',
        description: 'Taxa de chegada (λ)',
      },
      {
        name: 'mu',
        type: 'number',
        description: 'Taxa de serviço (μ)',
      },
      {
        name: 'N',
        type: 'number',
        description: 'Número de clientes (n)',
      },
    ],
    function: `
import math

def func(lambda_input, mu, N):
    rho = lambda_input / mu
 
    if rho == 1:
        P0 = 1 / (N + 1)
    else:
        P0 = (1 - rho) / (1 - rho**(N + 1))
 
    Pn_list = [rho**n * P0 for n in range(N + 1)]
    L = sum(n * Pn_list[n] for n in range(N + 1))
    lambda_efetiva = lambda_input * (1 - Pn_list[N])
    W = L / lambda_efetiva if lambda_efetiva > 0 else float('inf')

    return {
      "rho": rho,
      "P0": P0,
      "Pn_list": Pn_list,
      "L": L,
      "W": W
    }
    `.trim(),
    preview:
      'Modelo de fila com capacidade limitada, um servidor e chegadas/atendimentos exponenciais. Nesse sistema, novos clientes são bloqueados quando a capacidade máxima é atingida.',
    // TODO: change description to MM1N
    description: `
### Modelo M/M/1/K

O modelo **M/M/1/K** é um sistema de filas onde:

- **M**: As chegadas dos clientes seguem um processo de Poisson (ou seja, os tempos entre chegadas são distribuídos exponencialmente).
- **M**: Os tempos de serviço também seguem uma distribuição exponencial.
- **1**: Existe apenas **um servidor** atendendo os clientes.
- **K**: O sistema possui **capacidade máxima de K clientes** (incluindo o que está sendo atendido).

#### Características principais

- **Capacidade limitada**: Se o sistema já possui K clientes, novos clientes que chegam são **bloqueados** ou **perdidos** (não entram na fila).
- **Disciplina de atendimento**: Normalmente, o atendimento é feito por ordem de chegada (FIFO).
- **Taxa de chegada (λ)**: Média de chegadas por unidade de tempo.
- **Taxa de serviço (μ)**: Média de atendimentos por unidade de tempo.

#### Aplicações

Este modelo é utilizado para representar sistemas onde há limitação física ou lógica de capacidade, como:
- Linhas telefônicas com número máximo de chamadas simultâneas.
- Sistemas de atendimento com espaço limitado (ex: estacionamento, buffers de computadores).

#### Fórmulas importantes

- **Probabilidade de haver n clientes no sistema**:
  - Para ρ diferente de 1:  
    P(n) = [(1 - ρ) * ρ^n] / [1 - ρ^(K+1)], onde ρ = λ/μ e n = 0, 1, ..., K
- **Probabilidade do sistema estar cheio (bloqueio)**:
  - P(K) = [(1 - ρ) * ρ^K] / [1 - ρ^(K+1)]
- **Número médio de clientes no sistema** e **tempo médio de espera** podem ser calculados a partir dessas probabilidades.

> O modelo M/M/1/K é fundamental para analisar sistemas reais onde a capacidade é limitada e o bloqueio de clientes pode ocorrer.
    `,
    tags: ['new'],
  },
  {
    id: 2,
    name: 'Modelo M/M/1',
    fields: [
      {
        name: 'num_chegam',
        type: 'number',
        description: 'Número de chegadas (λ)',
      },
      {
        name: 'num_atendidos',
        type: 'number',
        description: 'Número de atendimentos (μ)',
      },
      {
        name: 'tempo',
        type: 'number',
        description: 'Período de observação (T)',
      },
      {
        name: 't',
        type: 'number',
        description: 'Tempo de espera (t)',
      },
      {
        name: 'n',
        type: 'number',
        description: 'Número (n)',
      },
      {
        name: 'r',
        type: 'number',
        description: 'Número (r)',
      },
    ],
    function: `
import math

def func(num_chegam, num_atendidos, tempo, t, n, r):
    # Cálculos
    lambd = num_chegam / tempo
    mu = num_atendidos / tempo
    
    # Verificação de estabilidade
    if lambd >= mu:
        return {
            "erro": "O sistema é instável (λ ≥ μ). Os cálculos abaixo podem não ser válidos."
        }
    
    # Cálculos principais
    ro = lambd / mu
    P0 = 1 - ro
    
    def Pn(n): return (1 - ro) * (ro ** n)
    def P_mais_que_r(r): return ro ** (r + 1)
    def P_W_maior_t(t): return math.exp(-mu * (1 - ro) * t)
    def P_Wq_maior_t(t): return ro * math.exp(-mu * (1 - ro) * t)
    
    L = lambd / (mu - lambd)
    Lq = (lambd ** 2) / (mu * (mu - lambd))
    W = 1 / (mu - lambd)
    Wq = lambd / (mu * (mu - lambd))
    
    # Retorna um dicionário com todos os resultados
    return {
        "lambda": lambd,
        "mu": mu,
        "ro": ro,
        "P0": P0,
        "Pn": Pn(n),
        "P_mais_que_r": P_mais_que_r(r),
        "P_W_maior_t": P_W_maior_t(t),
        "P_Wq_maior_t": P_Wq_maior_t(t),
        "L": L,
        "Lq": Lq,
        "W": W,
        "Wq": Wq
    }
    `.trim(),
    preview:
      'Modelo de fila com capacidade ilimitada, um servidor e chegadas/atendimentos exponenciais. Neste sistema, não há limite para o número de clientes na fila.',
    description: `
### Modelo M/M/1

O modelo **M/M/1** é um sistema de filas onde:

- **M**: As chegadas dos clientes seguem um processo de Poisson (ou seja, os tempos entre chegadas são distribuídos exponencialmente).
- **M**: Os tempos de serviço também seguem uma distribuição exponencial.
- **1**: Existe apenas **um servidor** atendendo os clientes.
- **Capacidade ilimitada**: Não há limite para o número de clientes no sistema (a fila pode crescer indefinidamente).

#### Características principais

- **Capacidade ilimitada**: Todos os clientes que chegam entram no sistema, sem bloqueio ou perda.
- **Disciplina de atendimento**: Normalmente, o atendimento é feito por ordem de chegada (FIFO).
- **Taxa de chegada (λ)**: Média de chegadas por unidade de tempo.
- **Taxa de serviço (μ)**: Média de atendimentos por unidade de tempo.

#### Aplicações

Este modelo é utilizado para representar sistemas onde não há limitação física ou lógica de capacidade, como:
- Filas de espera em bancos, supermercados, ou sistemas de atendimento online.
- Processos de atendimento onde não há rejeição de clientes.

#### Fórmulas importantes

- **Probabilidade de haver n clientes no sistema**:
  - P(n) = (1 - ρ) * ρ^n, onde ρ = λ/μ e n = 0, 1, 2, ...
- **Número médio de clientes no sistema**:
  - L = ρ / (1 - ρ)
- **Tempo médio de espera no sistema**:
  - W = 1 / (μ - λ)

> O modelo M/M/1 é fundamental para analisar sistemas reais onde a capacidade é ilimitada e todos os clientes são atendidos, mesmo que tenham que esperar.
    `,
    tags: ['new'],
  },
]
