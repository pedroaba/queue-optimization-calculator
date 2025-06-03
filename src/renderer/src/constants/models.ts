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
    slug: 'mm1n',
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
      'Modelo de fila M/M/1/N com um servidor, chegadas e atendimentos exponenciais, e capacidade limitada a N clientes. Quando o sistema atinge sua capacidade máxima, novos clientes são bloqueados.',
    // TODO: change description to MM1N
    description: `
### Modelo M/M/1/N

O modelo **M/M/1/N** é um sistema de filas onde:

- **M**: As chegadas dos clientes seguem um processo de Poisson (ou seja, os tempos entre chegadas são distribuídos exponencialmente).
- **M**: Os tempos de serviço também seguem uma distribuição exponencial.
- **1**: Existe apenas **um servidor** atendendo os clientes.
- **N**: O sistema possui **capacidade máxima de N clientes** (incluindo o que está sendo atendido).

#### Características principais

- **Capacidade limitada**: Se o sistema já possui N clientes, novos clientes que chegam são **bloqueados** ou **perdidos** (não entram na fila).
- **Disciplina de atendimento**: Normalmente, o atendimento é feito por ordem de chegada (FIFO).
- **Taxa de chegada (λ)**: Média de chegadas por unidade de tempo.
- **Taxa de serviço (μ)**: Média de atendimentos por unidade de tempo.

#### Aplicações

Este modelo é utilizado para representar sistemas onde há limitação física ou lógica de capacidade, como:
- Linhas telefônicas com número máximo de chamadas simultâneas.
- Sistemas de atendimento com espaço limitado (ex: estacionamento, buffers de computadores).

#### Fórmulas importantes

- **Probabilidade de haver n clientes no sistema (P0)**:
  - Para ρ = 1:  
    P0 = 1 / (N + 1)
  - Para ρ ≠ 1:  
    P0 = (1 - ρ) / (1 - ρ^(N + 1)), onde ρ = λ/μ
- **Probabilidade de haver n clientes no sistema (Pn)**:
  - Pn = ρ^n * P0, para n = 0, 1, ..., N
- **Número médio de clientes no sistema (L)**:
  - L = Σ(n * Pn), para n = 0 até N
- **Taxa efetiva de chegada (λe)**:
  - λe = λ * (1 - PN)
- **Tempo médio de espera no sistema (W)**:
  - W = L / λe

> O modelo M/M/1/N é fundamental para analisar sistemas reais onde a capacidade é limitada e o bloqueio de clientes pode ocorrer.
    `,
    tags: ['new'],
  },
  {
    id: 2,
    slug: 'mm1',
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
  {
    id: 3,
    slug: 'mms>1',
    name: 'Modelo M/M/s>1',
    fields: [
      {
        name: 'l',
        type: 'number',
        description: 'Taxa de chegada (λ)',
      },
      {
        name: 'm',
        type: 'number',
        description: 'Taxa de serviço (μ)',
      },
      {
        name: 's',
        type: 'number',
        description: 'Número de servidores (s)',
      },
    ],
    function: `
import math

# --- Funções auxiliares e de cálculo do modelo ---

def calculate_rho(lambda_val, mu_val, s_val):
    """
    Calcula o fator de utilização (rho).
    rho = lambda / (s * mu)
    """
    if s_val * mu_val == 0:
        raise ValueError("s * mu não pode ser zero. Erro de divisão por zero.")
    return lambda_val / (s_val * mu_val)

def p_0(lambda_val, mu_val, s_val):
    """
    Calcula a probabilidade de ter 0 clientes no sistema (P_0) para um sistema M/M/s (capacidade infinita).
    P_0 = 1 / [ sum_{n=0}^{s-1} (lambda/mu)^n / n! + (lambda/mu)^s / s! * 1 / (1 - lambda/(s*mu)) ]
    """
    if lambda_val >= s_val * mu_val:
        raise ValueError("Sistema instável: lambda deve ser menor que s * mu para P_0 em regime estacionário.")

    sum_term = 0
    for n in range(s_val):  # Soma de n=0 a s-1
        sum_term += (lambda_val / mu_val)**n / math.factorial(n)

    rho = calculate_rho(lambda_val, mu_val, s_val)

    denominator_term_2_part_1 = (lambda_val / mu_val)**s_val / math.factorial(s_val)
    denominator_term_2_part_2 = 1 / (1 - rho)
    
    denominator = sum_term + (denominator_term_2_part_1 * denominator_term_2_part_2)

    if denominator == 0:
        raise ValueError("Denominador para P_0 é zero, não é possível calcular P_0.")

    return 1 / denominator

def p_n(lambda_val, mu_val, s_val, n_val, p0_val):
    """
    Calcula a probabilidade de ter n clientes no sistema (P_n) para um sistema M/M/s (capacidade infinita).
    P_n = (lambda/mu)^n / n! * P_0  para n <= S
    P_n = (lambda/mu)^n / (s! * s^(n-s)) * P_0 para n > S
    """
    if n_val < 0:
        return 0
    elif n_val <= s_val:
        return ((lambda_val / mu_val)**n_val / math.factorial(n_val)) * p0_val
    else: # n_val > s_val
        return ((lambda_val / mu_val)**n_val / (math.factorial(s_val) * (s_val**(n_val - s_val)))) * p0_val

def p_wq_equals_0(lambda_val, mu_val, s_val, p0_val):
    """
    Calcula a probabilidade do tempo de espera na fila ser 0 (P(Wq = 0)).
    P(Wq = 0) = sum_{n=0}^{s-1} P_n
    """
    sum_pn = 0
    for n in range(s_val): # Soma de n=0 a s-1
        sum_pn += p_n(lambda_val, mu_val, s_val, n, p0_val)
    return sum_pn

def p_w_greater_than_t(lambda_val, mu_val, s_val, t_val, p0_val):
    """
    Calcula a probabilidade do tempo de espera no sistema (W) ser maior que t.
    P(W > t) = e^(-mu*t) * [1 + P_0*(lambda/mu)^s / (s!*(1-rho)) * (1 - e^(-mu*(s-1-lambda/mu)*t)) / (s-1-lambda/mu) ]
    """
    rho = calculate_rho(lambda_val, mu_val, s_val)

    term1 = math.exp(-mu_val * t_val)
    
    numerator_inner_bracket = p0_val * (lambda_val / mu_val)**s_val
    denominator_inner_bracket = math.factorial(s_val) * (1 - rho)
    
    if denominator_inner_bracket == 0:
        raise ValueError("Denominador no parênteses interno de P(W > t) é zero, sistema instável (rho=1).")

    middle_term_fraction = numerator_inner_bracket / denominator_inner_bracket
    
    s_minus_1_minus_lambda_over_mu = s_val - 1 - (lambda_val / mu_val)
    
    if abs(s_minus_1_minus_lambda_over_mu) < 1e-9: # Usar uma pequena tolerância para zero
        last_term_fraction = mu_val * t_val
    else:
        last_term_fraction = (1 - math.exp(-mu_val * s_minus_1_minus_lambda_over_mu * t_val)) / s_minus_1_minus_lambda_over_mu

    return term1 * (1 + middle_term_fraction * last_term_fraction)

def p_wq_greater_than_t(lambda_val, mu_val, s_val, t_val, pwq0_val):
    """
    Calcula a probabilidade do tempo de espera na fila (W_q) ser maior que t.
    P(W_q > t) = [1 - P(W_q = 0)] * e^(-s*mu*(1-rho)*t)
    """
    rho = calculate_rho(lambda_val, mu_val, s_val)
    
    return (1 - pwq0_val) * math.exp(-s_val * mu_val * (1 - rho) * t_val)

def l_q(lambda_val, mu_val, s_val, p0_val):
    """
    Calcula o número médio de clientes na fila (L_q).
    L_q = P_0 * (lambda/mu)^s * rho / (s! * (1-rho)^2)
    """
    rho = calculate_rho(lambda_val, mu_val, s_val)

    numerator = p0_val * (lambda_val / mu_val)**s_val * rho
    denominator = math.factorial(s_val) * (1 - rho)**2

    if denominator == 0:
        raise ValueError("Denominador para L_q é zero, não é possível calcular L_q (rho=1).")

    return numerator / denominator

def w_q(lambda_val, lq_val):
    """
    Calcula o tempo médio de espera na fila (W_q).
    W_q = L_q / lambda
    """
    if lambda_val == 0:
        return 0.0 # Se não há chegadas, não há tempo de espera na fila
    return lq_val / lambda_val

def l_system(lambda_val, mu_val, lq_val):
    """
    Calcula o número médio de clientes no sistema (L).
    L = L_q + lambda / mu
    """
    if mu_val == 0:
        raise ValueError("Taxa de serviço mu não pode ser zero para o cálculo de L.")
    
    return lq_val + (lambda_val / mu_val)

def w_system(lambda_val, mu_val, l_val):
    """
    Calcula o tempo médio gasto no sistema (W).
    W = L / lambda
    """
    if lambda_val == 0:
        return 0.0 # Se não há chegadas, não há tempo gasto no sistema
    return l_val / lambda_val
def func(l, m, s):
    p0_val = p_0(l, m, s)
    lq_val = l_q(l, m, s, p0_val)
    
    # Cálculos necessários para os prints
    rho_val = calculate_rho(l, m, s)
    l_system_val = l_system(l, m, lq_val)
    wq_val = w_q(l, lq_val)
    w_system_val = w_system(l, m, l_system_val)
    
    p_n_5_val = p_n(l, m, s, 5, p0_val)

    pwq_0_val = p_wq_equals_0(l, m, s, p0_val)
    pw_greater_3_val = p_w_greater_than_t(l, m, s, 3, p0_val)
    pwq_greater_2_val = p_wq_greater_than_t(l, m, s, 2, pwq_0_val)

    return {
      "Lq": lq_val,
      "Wq": wq_val, 
      "L": l_system_val,
      "W": w_system_val,
      "P0": p0_val,
      "rho": rho_val,
      "P_n_5": p_n_5_val,
      "P_W_greater_3": pw_greater_3_val,
      "P_Wq_greater_2": pwq_greater_2_val
    }
    `.trim(),
    preview:
      'Modelo de fila com múltiplos servidores (s>1), chegadas e atendimentos exponenciais. Sistema com capacidade ilimitada onde s servidores atendem em paralelo.',
    description: `
### Modelo M/M/s>1

O modelo **M/M/s>1** é um sistema de filas onde:

- **M**: As chegadas dos clientes seguem um processo de Poisson (tempos entre chegadas distribuídos exponencialmente).
- **M**: Os tempos de serviço seguem uma distribuição exponencial.
- **s>1**: Existem **múltiplos servidores** (mais de um) atendendo os clientes em paralelo.
- **Capacidade ilimitada**: Não há limite para o número de clientes no sistema.

#### Características principais

- **Servidores paralelos**: s servidores idênticos atendem os clientes simultaneamente.
- **Fila única**: Existe uma única fila que alimenta todos os servidores.
- **Disciplina de atendimento**: FIFO (First In, First Out).
- **Taxa de chegada (λ)**: Média de chegadas por unidade de tempo.
- **Taxa de serviço (μ)**: Média de atendimentos por unidade de tempo por servidor.

#### Aplicações

Este modelo é aplicado em diversos cenários com múltiplos atendentes, como:
- Caixas de supermercado
- Guichês de atendimento bancário
- Call centers
- Postos de pedágio
- Equipes de manutenção

#### Fórmulas importantes

- **Intensidade de tráfego**:
  - ρ = λ/(s*μ), onde s é o número de servidores
- **Probabilidade de sistema vazio (P0)**:
  - P0 = 1/[Σ(n=0 até s-1)((λ/μ)^n/n!) + ((λ/μ)^s/s!)*(1/(1-ρ))]
- **Número médio de clientes no sistema (L)**:
  - L = Lq + λ/μ
- **Tempo médio de espera no sistema (W)**:
  - W = Wq + 1/μ

#### Vantagens

- Maior eficiência operacional
- Redução do tempo médio de espera
- Melhor utilização dos recursos
- Maior capacidade de atendimento

#### Considerações importantes

- O sistema é estável quando ρ < 1
- A performance melhora com o aumento do número de servidores
- O custo operacional aumenta com mais servidores
- Necessário equilibrar custo x benefício

> O modelo M/M/s>1 é essencial para dimensionar sistemas de atendimento com múltiplos servidores, otimizando recursos e qualidade de serviço.
    `,
    tags: ['new'],
  },
  {
    id: 4,
    slug: 'mms>1k',
    name: 'Modelo M/M/s>1/K',
    fields: [
      {
        name: 'l',
        type: 'number',
        description: 'Taxa de chegada (λ)',
      },
      {
        name: 'm',
        type: 'number',
        description: 'Taxa de serviço (μ)',
      },
      {
        name: 's',
        type: 'number',
        description: 'Número de servidores (s)',
      },
      {
        name: 'K',
        type: 'number',
        description: 'Capacidade do sistema (K)',
      },
    ],
    function: `
import math

# --- Funções auxiliares e de cálculo do modelo ---

def calculate_rho(lambda_val, mu_val, s_val):
    """
    Calcula o fator de utilização (rho).
    rho = lambda / (s * mu)
    """
    if s_val * mu_val == 0:
        raise ValueError("s * mu não pode ser zero. Erro de divisão por zero.")
    return lambda_val / (s_val * mu_val)

def p_0(lambda_val, mu_val, s_val, K_val):
    """
    Calcula a probabilidade de ter 0 clientes no sistema (P_0) para um sistema M/M/s/K.
    P_0 = 1 / [ sum_{n=0}^{s-1} (lambda/mu)^n / n! + (lambda/mu)^s / s! * sum_{n=s+1}^{K} (lambda/(s*mu))^(n-s) ]
    """
    if K_val < s_val:
        raise ValueError("A capacidade do sistema K não pode ser menor que o número de servidores s.")

    sum_n_less_than_S = 0
    for n in range(s_val):  # Soma de n=0 a s-1
        sum_n_less_than_S += ((lambda_val / mu_val)**n) / math.factorial(n)

    term_S_part_1 = ((lambda_val / mu_val)**s_val) / math.factorial(s_val)

    sum_n_greater_than_S = 0
    # A soma vai de n=s+1 até K
    for n in range(s_val + 1, K_val + 1):
        sum_n_greater_than_S += (lambda_val / (s_val * mu_val))**(n - s_val)
    
    denominator = sum_n_less_than_S + (term_S_part_1 * sum_n_greater_than_S)

    if denominator == 0:
        raise ValueError("Denominador para P_0 é zero, não é possível calcular P_0.")

    return 1 / denominator

def p_n(lambda_val, mu_val, s_val, K_val, n_val, p0_val):
    """
    Calcula a probabilidade de ter n clientes no sistema (P_n) para um sistema M/M/s/K.
    P_n = (lambda/mu)^n / n! * P_0  para n <= S
    P_n = (lambda/mu)^n / (s! * s^(n-s)) * P_0 para s < n <= K
    P_n = 0 para n > K
    """
    if n_val < 0:
        return 0
    elif n_val <= s_val:
        return ((lambda_val / mu_val)**n_val / math.factorial(n_val)) * p0_val
    elif s_val < n_val <= K_val:
        return (((lambda_val / mu_val)**n_val) / (math.factorial(s_val) * (s_val**(n_val - s_val)))) * p0_val
    elif n_val > K_val:
        return 0
    else:
        return 0 # Caso para garantir que todos os caminhos retornem um valor

def p_k(lambda_val, mu_val, s_val, K_val, p0_val):
    """
    Calcula a probabilidade de ter K clientes no sistema (P_K).
    Equivalente a p_n(..., K_val)
    """
    return p_n(lambda_val, mu_val, s_val, K_val, K_val, p0_val)

def lambda_bar(lambda_val, mu_val, s_val, K_val, p0_val):
    """
    Calcula a taxa de chegada efetiva (lambda_bar) para um sistema M/M/s/K.
    lambda_bar = lambda * (1 - P_K)
    """
    p_k_val = p_k(lambda_val, mu_val, s_val, K_val, p0_val)
    return lambda_val * (1 - p_k_val)


def l_q(lambda_val, mu_val, s_val, K_val, p0_val):
    """
    Calcula o número médio de clientes na fila (L_q) para um sistema M/M/s/K.
    L_q = P_0 * (lambda/mu)^s * rho / (s! * (1-rho)^2) * [1 - rho^(K-s) - (K-s)*rho^(K-s)*(1-rho)]
    """
    rho = calculate_rho(lambda_val, mu_val, s_val)

    # Termo principal
    main_term_numerator = p0_val * (lambda_val / mu_val)**s_val * rho
    main_term_denominator = math.factorial(s_val) * (1 - rho)**2

    if main_term_denominator == 0:
        raise ValueError("Denominador para L_q é zero. Verifique se rho é 1. As fórmulas fornecidas são para rho < 1.")

    main_term = main_term_numerator / main_term_denominator

    # Termo dentro do colchete
    bracket_term = 1 - rho**(K_val - s_val) - (K_val - s_val) * rho**(K_val - s_val) * (1 - rho)

    return main_term * bracket_term

def w_q(lambda_val, mu_val, s_val, K_val, p0_val):
    """
    Calcula o tempo médio de espera na fila (W_q) para um sistema M/M/s/K.
    W_q = L_q / lambda_bar
    """
    lq_val = l_q(lambda_val, mu_val, s_val, K_val, p0_val)
    lambda_bar_val = lambda_bar(lambda_val, mu_val, s_val, K_val, p0_val)

    if lambda_bar_val == 0:
        return 0.0 # Se não há chegadas efetivas, não há tempo de espera na fila
    return lq_val / lambda_bar_val

def l_system(lambda_val, mu_val, s_val, K_val, p0_val):
    """
    Calcula o número médio de clientes no sistema (L) para um sistema M/M/s/K.
    L = sum_{n=0}^{s-1} n * P_n + L_q + s * (1 - sum_{n=0}^{s-1} P_n)
    """
    lq_val = l_q(lambda_val, mu_val, s_val, K_val, p0_val)

    sum_n_pn_less_than_s = 0
    sum_pn_less_than_s = 0
    for n in range(s_val): # Soma de n=0 a s-1
        pn_val = p_n(lambda_val, mu_val, s_val, K_val, n, p0_val)
        sum_n_pn_less_than_s += n * pn_val
        sum_pn_less_than_s += pn_val
    
    return sum_n_pn_less_than_s + lq_val + (s_val * (1 - sum_pn_less_than_s))

def w_system(lambda_val, mu_val, s_val, K_val, p0_val):
    """
    Calcula o tempo médio gasto no sistema (W) para um sistema M/M/s/K.
    W = L / lambda_bar
    """
    l_val = l_system(lambda_val, mu_val, s_val, K_val, p0_val)
    lambda_bar_val = lambda_bar(lambda_val, mu_val, s_val, K_val, p0_val)

    if lambda_bar_val == 0:
        return 0.0 # Se não há chegadas efetivas, não há tempo gasto no sistema
    return l_val / lambda_bar_val

# --- Funções de probabilidade de tempo (W e Wq) ---

def p_wq_equals_0(lambda_val, mu_val, s_val, K_val, p0_val):
    """
    Calcula a probabilidade do tempo de espera na fila ser 0 (P(Wq = 0)).
    P(Wq = 0) = sum_{n=0}^{s-1} P_n
    """
    sum_pn = 0
    for n in range(s_val): # Soma de n=0 a s-1
        sum_pn += p_n(lambda_val, mu_val, s_val, K_val, n, p0_val)
    return sum_pn

def p_w_greater_than_t(lambda_val, mu_val, s_val, K_val, t_val, p0_val):
    """
    Calcula a probabilidade do tempo de espera no sistema (W) ser maior que t.
    P(W > t) = e^(-mu*t) * [1 + P_0*(lambda/mu)^s / (s!*(1-rho)) * (1 - e^(-mu*(s-1-lambda/mu)*t)) / (s-1-lambda/mu) ]
    """
    rho = calculate_rho(lambda_val, mu_val, s_val)

    term1 = math.exp(-mu_val * t_val)
    
    numerator_inner_bracket = p0_val * (lambda_val / mu_val)**s_val
    denominator_inner_bracket = math.factorial(s_val) * (1 - rho)
    
    if denominator_inner_bracket == 0:
        raise ValueError("Denominador no parênteses interno de P(W > t) é zero (rho=1). A fórmula fornecida não é aplicável.")

    middle_term_fraction = numerator_inner_bracket / denominator_inner_bracket
    
    s_minus_1_minus_lambda_over_mu = s_val - 1 - (lambda_val / mu_val)
    
    if abs(s_minus_1_minus_lambda_over_mu) < 1e-9: # Usar uma pequena tolerância para zero
        last_term_fraction = mu_val * t_val
    else:
        last_term_fraction = (1 - math.exp(-mu_val * s_minus_1_minus_lambda_over_mu * t_val)) / s_minus_1_minus_lambda_over_mu

    return term1 * (1 + middle_term_fraction * last_term_fraction)

def p_wq_greater_than_t(lambda_val, mu_val, s_val, K_val, t_val, p0_val):
    """
    Calcula a probabilidade do tempo de espera na fila (W_q) ser maior que t.
    P(W_q > t) = [1 - P(W_q = 0)] * e^(-s*mu*(1-rho)*t)
    """
    rho = calculate_rho(lambda_val, mu_val, s_val)
    pwq0_val = p_wq_equals_0(lambda_val, mu_val, s_val, K_val, p0_val)
    
    return (1 - pwq0_val) * math.exp(-s_val * mu_val * (1 - rho) * t_val)

def func(l, m, s, K):
    p0_val = p_0(l, m, s, K)
    
    # Calcula Lq
    lq_val = l_q(l, m, s, K, p0_val)

    # Calcula os demais valores
    rho_val = calculate_rho(l, m, s)
    lambda_bar_val = lambda_bar(l, m, s, K, p0_val)
    l_system_val = l_system(l, m, s, K, p0_val)
    wq_val = w_q(l, m, s, K, p0_val)
    w_system_val = w_system(l, m, s, K, p0_val)
    pn_k_val = p_n(l, m, s, K, K, p0_val) # P_K
    pn_greater_k_val = p_n(l, m, s, K, K + 1, p0_val) # P_n para n > K (deve ser 0)
    pw_greater_3_val = p_w_greater_than_t(l, m, s, K, 3, p0_val)
    pwq_greater_2_val = p_wq_greater_than_t(l, m, s, K, 2, p0_val)

    return {
      "Lq": lq_val,
      "Wq": wq_val, 
      "L": l_system_val,
      "W": w_system_val,
      "P0": p0_val,
      "rho": rho_val,
      "lambda_bar": lambda_bar_val,
      # f"P(n={K})": pn_k_val,
      # f"P(n>{K})": pn_greater_k_val,
      # "P(W > 3)": pw_greater_3_val,
      # "P(Wq > 2)": pwq_greater_2_val,
      "P_n_K": pn_k_val,
      "P_n_greater_K": pn_greater_k_val,
      "P_W_greater_3": pw_greater_3_val,
      "P_Wq_greater_2": pwq_greater_2_val,
    }
    `.trim(),
    preview:
      'Modelo de fila com múltiplos servidores (s>1), chegadas e atendimentos exponenciais. Sistema com capacidade limitada a K clientes onde s servidores atendem em paralelo.',
    description: `
### Modelo M/M/s/K

O modelo **M/M/s/K** é um sistema de filas onde:

* **M**: As chegadas dos clientes seguem um processo de Poisson (tempos entre chegadas distribuídos exponencialmente).
* **M**: Os tempos de serviço seguem uma distribuição exponencial.
* **s>1**: Existem **múltiplos servidores** (mais de um) atendendo os clientes em paralelo.
* **K**: O sistema possui **capacidade limitada**, ou seja, pode haver no máximo **K clientes** no sistema (em atendimento + em fila).

#### Características principais

* **Servidores paralelos**: s servidores idênticos atendem os clientes simultaneamente.
* **Fila única**: Existe uma única fila que alimenta todos os servidores.
* **Capacidade máxima**: Se o sistema atingir K clientes, novos clientes são bloqueados ou perdidos (não entram na fila).
* **Disciplina de atendimento**: FIFO (First In, First Out).
* **Taxa de chegada (λ)**: Média de chegadas por unidade de tempo.
* **Taxa de serviço (μ)**: Média de atendimentos por unidade de tempo por servidor.

#### Aplicações

O modelo M/M/s/K é aplicado em cenários onde há limitação física ou operacional de capacidade, como:

* Estacionamentos com vagas limitadas
* Linhas telefônicas limitadas em call centers
* Sistemas de produção com capacidade máxima de lotes
* Hospitais com leitos limitados
* Elevadores com limite de ocupação

#### Fórmulas importantes

* **Intensidade de tráfego**:

  * ρ = λ/(s\*μ), onde s é o número de servidores

* **Probabilidade de haver n clientes no sistema (Pn)**:

  * Pn = \[ (λ/μ)^n / n! ] \* P0, para n ≤ s
  * Pn = \[ (λ/μ)^n / (s! \* s^{n-s}) ] \* P0, para s < n ≤ K
  * Onde **P0** é a probabilidade do sistema vazio, calculada por:

    P0 = 1 / { Σ\[n=0 até s-1] (λ/μ)^n/n! + Σ\[n=s até K] (λ/μ)^n/(s! \* s^{n-s}) }

* **Taxa efetiva de chegada (λₑₓ)**:

  * λₑₓ = λ \* (1 - Pk)
    (onde Pk é a probabilidade do sistema estar cheio)

* **Número médio de clientes no sistema (L)** e outras métricas:

  * Calculadas considerando a limitação K e usando as probabilidades Pn

#### Vantagens

* Permite controlar a ocupação máxima do sistema
* Reduz o risco de sobrecarga nos servidores
* Aplicável em cenários reais com restrição física de espaço ou recursos

#### Considerações importantes

* Clientes que chegam com o sistema cheio são bloqueados ou perdidos
* O balanceamento entre s e K é fundamental para evitar alta rejeição ou ociosidade
* A limitação K torna o modelo mais realista para muitos sistemas práticos

> O modelo M/M/s/K é essencial para projetar sistemas de atendimento e operações onde a capacidade máxima é restrita, permitindo o dimensionamento eficiente dos recursos e controle de rejeição de clientes.
    `,
    tags: ['new'],
  },
  {
    id: 5,
    slug: 'mm1k',
    name: 'M/M/1/K',
    fields: [
      {
        name: 'lambd',
        type: 'number',
        description: 'Taxa de chegada (λ)',
      },
      {
        name: 'mu',
        type: 'number',
        description: 'Taxa de serviço (μ)',
      },
      {
        name: 'K',
        type: 'number',
        description: 'Capacidade do sistema (K)',
      },
      {
        name: 'n',
        type: 'number',
        description: 'Número de clientes (n)',
      },
    ],
    preview:
      'Sistema de filas com múltiplos servidores (s > 1), em que as chegadas de clientes ocorrem de forma aleatória segundo um processo de Poisson (tempos entre chegadas exponenciais) e os tempos de atendimento são também exponenciais. O sistema possui capacidade máxima de K clientes, ou seja, novos clientes são bloqueados ou perdidos se o total de clientes (em atendimento e na fila) atinge esse limite. Todos os s servidores atendem em paralelo e de forma independente.',
    function: `
import math

def func(lambd: float, mu: float, K: int, n: int) -> dict[str, float]:
    s = 1
    K = int(K)
    n = int(n)

    def fatorial(x):
        return math.factorial(int(x))

    # Cálculo de P0 (probabilidade do sistema vazio)
    def calc_p0(lambd, mu, s, K):
        sum1 = sum((lambd / mu) ** nn / fatorial(nn) for nn in range(s))
        sum2 = sum((lambd / mu) ** nn / (fatorial(s) * s ** (nn - s)) for nn in range(s, K + 1))
        return 1 / (sum1 + sum2)

    p0 = calc_p0(lambd, mu, s, K)

    def pn(nn):
        if nn < s:
            return ((lambd / mu) ** nn / fatorial(nn)) * p0
        else:
            return ((lambd / mu) ** nn) / (fatorial(s) * s ** (nn - s)) * p0

    # Lista de probabilidades P(n) para n = 0 até n
    pn_list = [pn(ni) for ni in range(n+1)]
    pk = pn(K)                 # Probabilidade do sistema cheio
    pk1 = pn(K+1) if K+1 >= 0 else 0  # n > K (overflow), normalmente 0

    # Taxa efetiva de chegada
    lambda_bar = lambd * (1 - pk)

    # Número médio de clientes no sistema (L)
    L = sum(j * pn(j) for j in range(K+1))

    # Número médio de clientes na fila (Lq)
    Lq = sum((j - s) * pn(j) for j in range(s, K+1))

    # Tempo médio no sistema (W)
    W = L / lambda_bar if lambda_bar > 0 else 0.0

    # Tempo médio de espera na fila (Wq)
    Wq = Lq / lambda_bar if lambda_bar > 0 else 0.0

    # Utilização do sistema (rho)
    rho = lambd / (s * mu)

    return {
        "Lq": Lq,
        "Wq": Wq,
        "L": L,
        "W": W,
        "P0": p0,
        "rho": rho,
        "lambda_bar": lambda_bar,
        f"P(n=K)": pk,
        f"P(n>K)": pk1,
        "pnList": pn_list,
    }
    `.trim(),
    description: `
### Modelo M/M/s/K

O modelo **M/M/s/K** representa um sistema de filas com múltiplos servidores, chegadas e atendimentos exponenciais e capacidade máxima limitada a K clientes.

* **M**: As chegadas seguem um processo de Poisson (tempos entre chegadas distribuídos exponencialmente).
* **M**: Os tempos de atendimento seguem uma distribuição exponencial.
* **s > 1**: Existem **múltiplos servidores** atendendo os clientes em paralelo.
* **K**: O sistema comporta no máximo **K clientes** (atendidos + em fila). Chegadas extras são bloqueadas ou perdidas.

#### Características principais

* **Servidores paralelos**: s servidores idênticos atendem simultaneamente.
* **Fila única**: Uma única fila alimenta todos os servidores.
* **Capacidade máxima**: Quando o sistema atinge K clientes, novos clientes não entram e são rejeitados.
* **Disciplina de atendimento**: FIFO (First In, First Out).
* **Taxa de chegada (λ)**: Média de chegadas por unidade de tempo.
* **Taxa de serviço (μ)**: Média de atendimentos por unidade de tempo de cada servidor.

#### Aplicações

O modelo M/M/s/K é utilizado quando há limitação de capacidade física ou operacional, como:

* Estacionamentos com vagas limitadas
* Call centers com número restrito de linhas telefônicas
* Linhas de produção com limitação de lotes
* Hospitais com quantidade máxima de leitos
* Elevadores com limite de ocupação

#### Fórmulas importantes

* **Intensidade de tráfego**:
  * ρ = λ / (s × μ), onde s é o número de servidores

* **Probabilidade de haver n clientes no sistema (Pn)**:
  * Pn = [(λ/μ)^n / n!] × P0, para n ≤ s
  * Pn = [(λ/μ)^n / (s! × s^{n-s})] × P0, para s < n ≤ K

  Onde **P0** (probabilidade do sistema vazio) é:

  P0 = 1 / { Σ[n=0 até s-1] (λ/μ)^n / n! + Σ[n=s até K] (λ/μ)^n / (s! × s^{n-s}) }

* **Taxa efetiva de chegada (λₑₓ)**:
  * λₑₓ = λ × (1 - Pk), onde Pk é a probabilidade do sistema estar cheio

* **Médias do sistema**:
  * Número médio de clientes, tempos médios, e outros indicadores são calculados levando em conta a limitação K e as probabilidades Pn

#### Vantagens

* Permite controlar a ocupação máxima do sistema
* Evita sobrecarga dos servidores
* Reflete restrições reais de capacidade física ou operacional

#### Considerações importantes

* Clientes que chegam quando o sistema está cheio são rejeitados ou bloqueados
* O equilíbrio entre s (servidores) e K (capacidade) é fundamental para evitar tanto excesso de rejeição quanto ociosidade
* O modelo M/M/s/K representa de forma mais realista sistemas sujeitos a limitações físicas ou operacionais

> O modelo M/M/s/K é essencial para projetar sistemas de atendimento com restrição de capacidade, garantindo o uso eficiente dos recursos e o controle da rejeição de clientes.
    `,
    tags: ['new'],
  },
]
