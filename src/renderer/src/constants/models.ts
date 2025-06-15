export type Model = {
  id: number
  slug: string
  name: string
  preview: string
  description: string
  tags?: string[]
  fields: Array<{
    name: string
    type: string
    description: string
  }>
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
        name: 'lambda_val',
        type: 'number',
        description: 'Taxa de chegada (λ)',
      },
      {
        name: 'mu_val',
        type: 'number',
        description: 'Taxa de serviço (μ)',
      },
      {
        name: 's_val',
        type: 'number',
        description: 'Número de servidores (s)',
      },
      {
        name: 'n',
        type: 'number',
        description: 'Número de clientes (n)',
      },
    ],
    function: `
import math
 
def func(lambda_val, mu_val, s_val, n):
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

    p0_val = p_0(lambda_val, mu_val, s_val)
    lq_val = l_q(lambda_val, mu_val, s_val, p0_val)
    rho_val = calculate_rho(lambda_val, mu_val, s_val)
    l_system_val = l_system(lambda_val, mu_val, lq_val)
    wq_val = w_q(lambda_val, lq_val)
    w_system_val = w_system(lambda_val, mu_val, l_system_val)
    pn_val = p_n(lambda_val, mu_val, s_val, n, p0_val)
 
    pwq_0_val = p_wq_equals_0(lambda_val, mu_val, s_val, p0_val)
    pw_greater_n_val = p_w_greater_than_t(lambda_val, mu_val, s_val, n, p0_val)
    pwq_greater_n_val = p_wq_greater_than_t(lambda_val, mu_val, s_val, n, pwq_0_val)
 
    return {
      "lambda": lambda_val,
      "mu": mu_val,
      "ro": rho_val,
      "P0": p0_val,
      "Pn": pn_val,
      "P_mais_que_r": pw_greater_n_val,
      "P_W_maior_t": pwq_greater_n_val,
      "P_W_igual_0": pwq_0_val,
      "L": l_system_val,
      "Lq": lq_val,
      "W": w_system_val,
      "Wq": wq_val
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
        name: 'lambda_val',
        type: 'number',
        description: 'Taxa de chegada (λ)',
      },
      {
        name: 'mu_val',
        type: 'number',
        description: 'Taxa de serviço (μ)',
      },
      {
        name: 's_val',
        type: 'number',
        description: 'Número de servidores (s)',
      },
      {
        name: 'n',
        type: 'number',
        description: 'Número de clientes (n)',
      },
      {
        name: 'K_val',
        type: 'number',
        description: 'Capacidade do sistema (K)',
      },
    ],
    function: `
import math
 
# --- Funções auxiliares e de cálculo do modelo ---
def func(lambda_val, mu_val, s_val, n, K_val):
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
 
 
    p0_val = p_0(lambda_val, mu_val, s_val, K_val)
    rho_val = calculate_rho(lambda_val, mu_val, s_val)
    pn_val = p_n(lambda_val, mu_val, s_val, K_val, n, p0_val)
    pw_greater_n_val = p_w_greater_than_t(lambda_val, mu_val, s_val, K_val, n, p0_val)
    pwq_greater_n_val = p_wq_greater_than_t(lambda_val, mu_val, s_val, K_val, n, p0_val)
    pwq_0_val = p_wq_equals_0(lambda_val, mu_val, s_val, K_val, p0_val)
    l_system_val = l_system(lambda_val, mu_val, s_val, K_val, p0_val)
    wq_val = w_q(lambda_val, mu_val, s_val, K_val, p0_val)
    w_system_val = w_system(lambda_val, mu_val, s_val, K_val, p0_val)
    lq_val = l_q(lambda_val, mu_val, s_val, K_val, p0_val)
 
    return {
      "lambda": lambda_val,
      "mu": mu_val,
      "ro": rho_val,
      "P0": p0_val,
      "Pn": pn_val,
      "P_mais_que_r": pw_greater_n_val,
      "P_W_maior_t": pwq_greater_n_val,
      "P_W_igual_0": pwq_0_val,
      "L": l_system_val,
      "Lq": lq_val,
      "W": w_system_val,
      "Wq": wq_val
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
  {
    id: 6,
    slug: 'mg1',
    name: 'M/G/1',
    fields: [
      {
        name: 'taxa_chegada',
        type: 'number',
        description: 'Taxa de chegada (λ)',
      },
      {
        name: 'taxa_servico',
        type: 'number',
        description: 'Taxa média de atendimento (μ)',
      },
      {
        name: 'desvio_padrao_servico',
        type: 'number',
        description: 'Desvio padrão do tempo de serviço (σ)',
      },
    ],
    preview:
      'Sistema de filas com chegada de clientes segundo processo de Poisson (tempos entre chegadas exponenciais), tempo de atendimento com média e desvio padrão genéricos (não necessariamente exponencial), e apenas um servidor (single server). Usado para modelar sistemas em que a variabilidade do tempo de serviço é relevante.',
    function: `
import math

def func(taxa_chegada: float, taxa_servico: float, desvio_padrao_servico: float):
    """
    Calcula as métricas de desempenho para um sistema de filas M/G/1.

    Parâmetros:
        taxa_chegada (float): A taxa de chegada de clientes (λ).
        taxa_servico (float): A taxa de serviço (μ).
        desvio_padrao_servico (float): O desvio padrão (σ) do tempo de serviço.

    Retorna:
        dict: Um dicionário contendo os parâmetros de entrada e os resultados calculados
              (rho, P0, Lq, Wq, L, W).
    """

    def calcular_rho_interna(taxa_chegada: float, taxa_servico: float) -> float:
        """
        Calcula a intensidade de tráfego (utilização do sistema).
        ρ = λ / μ
        """
        if taxa_servico == 0:
            return float('inf') # Previne divisão por zero
        return taxa_chegada / taxa_servico

    def prob_sistema_vazio_interna(rho: float) -> float:
        """
        Calcula a probabilidade de haver 0 clientes no sistema.
        P₀ = 1 - ρ
        """
        if rho >= 1:
            return 0  # O sistema é instável, a fila crescerá infinitamente.
        return 1 - rho

    def num_medio_clientes_fila_interna(taxa_chegada: float, desvio_padrao_servico: float, rho: float) -> float:
        """
        Calcula o número médio de clientes na fila (Lq).
        Lq = (λ²σ² + ρ²) / (2 * (1 - ρ))
        """
        if rho >= 1:
            return float('inf')  # Fila infinita para sistemas instáveis.
        
        lambda_sq = taxa_chegada**2
        sigma_sq = desvio_padrao_servico**2
        rho_sq = rho**2
        
        numerador = lambda_sq * sigma_sq + rho_sq
        denominador = 2 * (1 - rho)
        
        if denominador == 0: # Caso rho seja muito próximo de 1, evitando divisão por zero
            return float('inf')
            
        return numerador / denominador

    def tempo_medio_espera_fila_interna(lq: float, taxa_chegada: float) -> float:
        """
        Calcula o tempo médio de espera na fila (Wq).
        Wq = Lq / λ
        """
        if taxa_chegada == 0:
            return 0.0 # Se não há chegadas, não há tempo de espera na fila
        return lq / taxa_chegada

    def num_medio_clientes_sistema_interna(rho: float, lq: float) -> float:
        """
        Calcula o número médio de clientes no sistema (L).
        L = ρ + Lq
        """
        return rho + lq

    def tempo_medio_espera_sistema_interna(wq: float, taxa_servico: float) -> float:
        """
        Calcula o tempo médio de espera no sistema (W).
        W = Wq + (1 / μ)
        """
        if taxa_servico == 0:
            return float('inf')
        return wq + (1 / taxa_servico)

    # --- Cálculos das Métricas ---

    # 1. Calcular a utilização do sistema (rho)
    rho_val = calcular_rho_interna(taxa_chegada, taxa_servico)

    # 2. Calcular as medidas de efetividade
    p0_val = prob_sistema_vazio_interna(rho_val)
    lq_val = num_medio_clientes_fila_interna(taxa_chegada, desvio_padrao_servico, rho_val)
    wq_val = tempo_medio_espera_fila_interna(lq_val, taxa_chegada)
    l_val = num_medio_clientes_sistema_interna(rho_val, lq_val)
    w_val = tempo_medio_espera_sistema_interna(wq_val, taxa_servico)

    return {
        "taxa_chegada_entrada": taxa_chegada,
        "taxa_servico_entrada": taxa_servico,
        "desvio_padrao_servico_entrada": desvio_padrao_servico,
        "ro": rho_val,
        "P0": p0_val,
        "Lq": lq_val,
        "Wq": wq_val,
        "L": l_val,
        "W": w_val
    }
    `.trim(),
    description: `
  ### Modelo M/G/1
  
  O modelo **M/G/1** representa um sistema de filas com:
  
  - **M**: Chegadas segundo um processo de Poisson (intervalos exponenciais)
  - **G**: Tempo de serviço com distribuição **Genérica** (média e desvio padrão conhecidos, mas não necessariamente exponencial)
  - **1**: Apenas um servidor
  
  #### Características principais
  
  - Chegadas aleatórias (processo de Poisson)
  - Tempo de serviço com qualquer distribuição (basta conhecer a média e o desvio padrão)
  - Apenas um canal/servidor de atendimento
  - Fila única, sem limitação de capacidade
  
  #### Fórmulas importantes
  
  - **Intensidade de tráfego:** ρ = λ / μ
  - **Número médio na fila:** Lq = (λ² * σ² + ρ²) / [2 * (1 - ρ)]
  - **Número médio no sistema:** L = Lq + ρ
  - **Tempo médio na fila:** Wq = Lq / λ
  - **Tempo médio no sistema:** W = Wq + 1/μ
  
  #### Aplicações
  
  O modelo M/G/1 é utilizado em sistemas onde o tempo de atendimento é **variável**, por exemplo:
  
  - Suporte técnico com diferentes complexidades de atendimento
  - Serviços em que cada cliente demanda tempo diferente
  - Produção industrial com variação no tempo de processamento
  
  #### Considerações
  
  - O sistema é **estável** somente se ρ < 1 (λ < μ).
  - Permite análise da variabilidade do serviço (através do desvio padrão σ).
  
  > O modelo M/G/1 é indicado quando o tempo de serviço não é sempre igual ou exponencial, trazendo flexibilidade para modelagem de situações reais.
    `,
    tags: ['new'],
  },
  {
    id: 7,
    slug: 'mms-priority',
    name: 'M/M/s com Prioridade',
    tags: ['new'],
    preview:
      'Sistema de filas com múltiplas classes de prioridade, onde cada classe possui uma taxa de chegada distinta e os atendimentos são realizados por múltiplos servidores. O tempo de atendimento segue distribuição exponencial (M/M/s) e as prioridades são tratadas por classes de chegada ordenadas.',
    fields: [
      {
        name: 'taxas_de_chegada',
        type: 'number[]',
        description:
          'Lista de taxas de chegada (λₖ), ordenadas por prioridade (classe 1 = maior prioridade)',
      },
      {
        name: 'taxa_de_servico',
        type: 'number',
        description: 'Taxa de serviço por servidor (μ)',
      },
      {
        name: 'num_servidores',
        type: 'number',
        description: 'Número de servidores (s)',
      },
    ],
    function: `
import math

def func(taxas_de_chegada: list, taxa_de_servico: float, num_servidores: int):
    def calcular_prob_fila_erlang_c(lambda_total: float, mu: float, s: int) -> float:
        if s == 0:
            return 1.0
        rho = lambda_total / (s * mu)
        if rho >= 1:
            return 1.0
        sum_term = sum(((s * rho)**n) / math.factorial(n) for n in range(s))
        s_term = ((s * rho)**s) / (math.factorial(s) * (1 - rho))
        Pq = s_term / (sum_term + s_term)
        return Pq

    def calcular_W_mms_padrao(lambda_total: float, mu: float, s: int) -> float:
        rho = lambda_total / (s * mu)
        if rho >= 1:
            return float('inf')
        Pq = calcular_prob_fila_erlang_c(lambda_total, mu, s)
        wq = Pq / (s * mu * (1 - rho))
        w = wq + (1 / mu)
        return w

    def tempo_medio_espera_fila(w_k: float, mu: float) -> float:
        wq_k = w_k - (1 / mu)
        return max(0, wq_k)

    def num_medio_clientes_sistema_corrigido(sum_lambda_k: float, w_k: float) -> float:
        return sum_lambda_k * w_k

    def num_medio_clientes_fila_corrigido(l_k: float, sum_lambda_k: float, mu: float) -> float:
        lq_k = l_k - (sum_lambda_k / mu)
        return max(0, lq_k)

    w_por_classe = []
    wq_por_classe = []
    l_por_classe = []
    lq_por_classe = []
    w_barra_agregado = []
    W_valores_anteriores = []

    for i in range(len(taxas_de_chegada)):
        classe_prioridade = i + 1
        lambda_efetiva = sum(taxas_de_chegada[:classe_prioridade])
        W_bar_k = calcular_W_mms_padrao(lambda_efetiva, taxa_de_servico, num_servidores)
        w_barra_agregado.append(W_bar_k)

        soma_ponderada_W_anteriores = 0
        for j in range(i):
            p_j = taxas_de_chegada[j] / lambda_efetiva
            soma_ponderada_W_anteriores += p_j * W_valores_anteriores[j]

        lambda_k = taxas_de_chegada[i]
        p_k = lambda_k / lambda_efetiva
        if p_k == 0:
            W_k = float('inf')
        else:
            W_k = (1 / p_k) * (W_bar_k - soma_ponderada_W_anteriores)

        W_valores_anteriores.append(W_k)

        Wq_k = tempo_medio_espera_fila(W_k, taxa_de_servico)
        L_k = num_medio_clientes_sistema_corrigido(lambda_efetiva, W_k)
        Lq_k = num_medio_clientes_fila_corrigido(L_k, lambda_efetiva, taxa_de_servico)

        w_por_classe.append(W_k)
        wq_por_classe.append(Wq_k)
        l_por_classe.append(L_k)
        lq_por_classe.append(Lq_k)

    return {
        "taxas_de_chegada_entrada": taxas_de_chegada,
        "taxa_de_servico_entrada": taxa_de_servico,
        "num_servidores_entrada": num_servidores,
        "W_barra_agregado": w_barra_agregado,
        "W_por_classe": w_por_classe,
        "Wq_por_classe": wq_por_classe,
        "L_por_classe": l_por_classe,
        "Lq_por_classe": lq_por_classe
    }
  `.trim(),
    description: `
### Modelo M/M/s com Prioridade

O modelo **M/M/s com prioridade** é uma extensão do clássico sistema M/M/s, considerando **classes de prioridade** onde cada classe possui sua **própria taxa de chegada (λₖ)**.

#### Características

- Chegadas segundo processo de Poisson (M)
- Tempo de atendimento exponencial (M)
- Múltiplos servidores (s)
- Tratamento por **prioridade não-preemptiva** baseado em classes
- Cada classe de prioridade possui uma **taxa de chegada diferente**
- As classes são processadas considerando ordem de prioridade (classe 1 = mais prioritária)

#### Fórmulas principais

- **W̄ (M/M/s):** tempo médio no sistema da fila padrão
- **Wₖ:** tempo médio no sistema para a classe k
- **Wqₖ:** tempo médio na fila da classe k
- **Lₖ:** número médio de clientes no sistema da classe k
- **Lqₖ:** número médio na fila da classe k

#### Aplicações

- Suporte técnico com diferentes SLAs
- Atendimento bancário com categorias de cliente
- Sistemas hospitalares com triagem por urgência
- Redes de computadores com QoS (qualidade de serviço)

> Permite entender como diferentes prioridades afetam o desempenho de cada classe.
`.trim(),
  },
  {
    id: 8,
    slug: 'mss-without-preemption',
    name: 'M/M/s com Prioridade Não Preemptiva',
    tags: ['new'],
    preview:
      'Sistema de filas com múltiplas classes de prioridade, múltiplos servidores e disciplina de atendimento sem interrupção (não preemptiva). Cada classe possui sua própria taxa de chegada.',
    fields: [
      {
        name: 'taxas_de_chegada',
        type: 'number[]',
        description: 'Lista de taxas de chegada (λₖ) ordenadas por prioridade',
      },
      {
        name: 'taxa_de_servico',
        type: 'number',
        description: 'Taxa de serviço por servidor (μ)',
      },
      {
        name: 'num_servidores',
        type: 'number',
        description: 'Número de servidores (s)',
      },
    ],
    function: `
import math

def func(taxas_de_chegada: list, taxa_de_servico: float, num_servidores: int):
    def calcular_W_sem_interrupcao_interna(k: int, lambdas: list[float], mu: float, s: int) -> float:
        if s == 0:
            return float('inf')
        lambda_total = sum(lambdas)
        rho = lambda_total / (s * mu)
        if rho >= 1:
            return float('inf')
        r = lambda_total / mu
        sum_factor = 0
        for j in range(s):
            try:
                sum_factor += (r**j) / math.factorial(j)
            except OverflowError:
                return float('inf')
        try:
            p0_inv_term1 = math.factorial(s) * ((s * mu - lambda_total) / (r**s)) * sum_factor
            p0_inv = p0_inv_term1 + s * mu
        except (ValueError, ZeroDivisionError, OverflowError):
            return float('inf')
        if p0_inv == 0:
            return float('inf')
        wq0_factor = 1 / p0_inv

        k_idx = k - 1
        sum_lambda_k_menos_1 = sum(lambdas[:k_idx])
        sum_lambda_k = sum(lambdas[:k_idx + 1])
        rho_k_menos_1 = sum_lambda_k_menos_1 / (s * mu)
        rho_k = sum_lambda_k / (s * mu)

        if (1 - rho_k_menos_1) == 0 or (1 - rho_k) == 0:
            return float('inf')

        priority_factor = 1 / ((1 - rho_k_menos_1) * (1 - rho_k))
        wq_k = wq0_factor * priority_factor
        w_k = wq_k + (1 / mu)
        return w_k

    def tempo_medio_espera_fila(w_k: float, mu: float) -> float:
        return max(0, w_k - (1 / mu))

    def num_medio_clientes_sistema(lambda_k: float, w_k: float) -> float:
        return lambda_k * w_k

    def num_medio_clientes_fila(l_k: float, lambda_k: float, mu: float) -> float:
        return max(0, l_k - (lambda_k / mu))

    resultados_W = []
    resultados_Wq = []
    resultados_L = []
    resultados_Lq = []

    for i, lambda_k in enumerate(taxas_de_chegada):
        classe_prioridade = i + 1
        W = calcular_W_sem_interrupcao_interna(classe_prioridade, taxas_de_chegada, taxa_de_servico, num_servidores)
        Wq = tempo_medio_espera_fila(W, taxa_de_servico)
        L = num_medio_clientes_sistema(lambda_k, W)
        Lq = num_medio_clientes_fila(L, lambda_k, taxa_de_servico)
        resultados_W.append(W)
        resultados_Wq.append(Wq)
        resultados_L.append(L)
        resultados_Lq.append(Lq)

    return {
        "taxas_de_chegada_entrada": taxas_de_chegada,
        "taxa_de_servico_entrada": taxa_de_servico,
        "num_servidores_entrada": num_servidores,
        "W_por_classe": resultados_W,
        "Wq_por_classe": resultados_Wq,
        "L_por_classe": resultados_L,
        "Lq_por_classe": resultados_Lq
    }
  `.trim(),
    description: `
### Modelo M/M/s com Prioridade Não Preemptiva

Sistema de filas com múltiplas classes, cada uma com sua própria taxa de chegada (λₖ), atendidas por múltiplos servidores (s) com taxa de serviço comum (μ). A prioridade é não preemptiva: clientes de menor prioridade não são interrompidos ao serem atendidos.

#### Fórmulas principais

- **ρ = λ / (s × μ)**  
- **Fator base de espera:**  
  \\[
  Wq₀ = \\frac{1}{\\text{fórmula baseada em Erlang-C modificada}}
  \\]
- **Fator de prioridade para classe \\(k\\):**  
  \\[
  P_k = \\frac{1}{(1 - \\rho_{k-1})(1 - \\rho_k)}
  \\]
- **Tempo de espera:**  
  \\[
  W_k = Wq₀ × P_k + \\frac{1}{μ}
  \\]
- **Outras métricas:**  
  \\[
  Wq_k = W_k - \\frac{1}{μ},\\quad
  L_k = λ_k × W_k,\\quad
  Lq_k = L_k - \\frac{λ_k}{μ}
  \\]

#### Aplicações

- Suporte técnico com SLA por perfil
- Atendimento público por grau de urgência
- Processos fabris com ordens prioritárias

> Esse modelo é útil quando a **ordem de chegada** respeita prioridades, mas o atendimento de clientes **não pode ser interrompido**.
  `.trim(),
  },
]
