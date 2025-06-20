export type Model = {
  id: number
  slug: string
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
    tags: [],
  },
  {
    id: 2,
    slug: 'mm1',
    name: 'Modelo M/M/1',
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
    tags: [],
  },
  {
    id: 3,
    slug: 'mms-greater-than-1',
    name: 'Modelo M/M/s>1',
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
    tags: [],
  },
  {
    id: 4,
    slug: 'mms-greater-than-1-k',
    name: 'Modelo M/M/s>1/K',
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
    tags: [],
  },
  {
    id: 5,
    slug: 'mm1k',
    name: 'M/M/1/K',
    preview:
      'Sistema de filas com múltiplos servidores (s > 1), em que as chegadas de clientes ocorrem de forma aleatória segundo um processo de Poisson (tempos entre chegadas exponenciais) e os tempos de atendimento são também exponenciais. O sistema possui capacidade máxima de K clientes, ou seja, novos clientes são bloqueados ou perdidos se o total de clientes (em atendimento e na fila) atinge esse limite. Todos os s servidores atendem em paralelo e de forma independente.',
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
    tags: [],
  },
  {
    id: 6,
    slug: 'mg1',
    name: 'M/G/1',
    preview:
      'Sistema de filas com chegada de clientes segundo processo de Poisson (tempos entre chegadas exponenciais), tempo de atendimento com média e desvio padrão genéricos (não necessariamente exponencial), e apenas um servidor (single server). Usado para modelar sistemas em que a variabilidade do tempo de serviço é relevante.',
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
    tags: [],
  },
  {
    id: 7,
    slug: 'mss-priority',
    name: 'M/M/s com Prioridade',
    tags: [],
    preview:
      'Sistema de filas com múltiplas classes de prioridade, onde cada classe possui uma taxa de chegada distinta e os atendimentos são realizados por múltiplos servidores. O tempo de atendimento segue distribuição exponencial (M/M/s) e as prioridades são tratadas por classes de chegada ordenadas.',
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
    id: 9,
    slug: 'mm1n-finite-population',
    name: 'Modelo M/M/1/N com População Finita',
    preview:
      'Modelo de fila M/M/1/N com população finita, considerando unidades que falham e precisam de conserto com técnico exclusivo.',
    description: `
### Modelo M/M/1/N com População Finita

Esse modelo representa um **sistema de conserto** com população limitada de unidades (por exemplo, máquinas ou equipamentos). É usado para analisar a disponibilidade e eficiência de técnicos de manutenção.

#### Características principais

- Há **N unidades** no sistema, que podem falhar e precisam de reparo.
- Um único **técnico (servidor)** realiza os consertos.
- A **taxa de falha de cada unidade** é \( λ_i = 1 / \text{tempo médio entre falhas} \).
- A **taxa de serviço (conserto)** é \( μ = 1 / \text{tempo médio de conserto} \).
- Quando uma unidade está em manutenção, ela não pode falhar novamente.

#### Métricas calculadas

- **P₀**: Probabilidade de o técnico estar ocioso.
- **Pn_list**: Lista com as probabilidades de haver n unidades quebradas.
- **L**: Número médio de unidades quebradas.
- **Lq**: Número médio de unidades esperando pelo conserto.
- **λ efetiva**: Taxa de falhas que de fato entram no sistema de manutenção.
- **W**: Tempo médio que uma unidade permanece quebrada.
- **Wq**: Tempo médio de espera antes de conserto.
- **tempoOcioso**: Porcentagem do tempo em que o técnico está sem consertar.

#### Aplicações

- Manutenção de máquinas industriais.
- Equipamentos eletrônicos sob assistência técnica.
- Infraestrutura com técnico único responsável por reparos.

> Esse modelo ajuda a dimensionar a equipe de manutenção ideal e prever a indisponibilidade dos equipamentos.
  `,
    tags: [],
  },
  {
    id: 8,
    slug: 'mss-without-preemption',
    name: 'M/M/s com Prioridade Não Preemptiva',
    tags: [],
    preview:
      'Sistema de filas com múltiplas classes de prioridade, múltiplos servidores e disciplina de atendimento sem interrupção (não preemptiva). Cada classe possui sua própria taxa de chegada.',
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
  {
    id: 10,
    slug: 'mms-greater-than-1-n',
    name: 'Modelo M/M/s/N com População Finita',
    preview:
      'Modelo de fila M/M/s/N com população finita, permitindo múltiplos servidores e limitação no número de clientes/unidades no sistema.',
    description: `
### Modelo M/M/s/N com População Finita

Esse modelo representa um **sistema de filas com múltiplos servidores** e **população finita** de clientes/unidades, onde apenas um número limitado de elementos pode estar no sistema a qualquer momento (por exemplo, máquinas para manutenção, pacientes em um hospital, etc.).

#### Características principais

- Há **N unidades** (ou clientes) na população total.
- Existem **s servidores** operando em paralelo.
- A **taxa de falha (ou chegada) individual** é \\( \\lambda_{ind} = 1 / \\text{tempo médio entre falhas} \\).
- A **taxa de serviço** de cada servidor é \\( \\mu = 1 / \\text{tempo médio de serviço/conserto} \\).
- O número de unidades no sistema nunca ultrapassa N.

#### Métricas calculadas

- **P₀**: Probabilidade de todos os servidores estarem ociosos (sistema vazio).
- **PnList**: Lista com as probabilidades de haver n unidades no sistema.
- **L**: Número médio de unidades no sistema (quebradas ou em atendimento).
- **Lq**: Número médio de unidades aguardando serviço (na fila).
- **lambdaEffective**: Taxa efetiva de chegada (ou falhas atendidas).
- **W**: Tempo médio no sistema (espera + serviço/conserto).
- **Wq**: Tempo médio de espera na fila.
- **idlePercentage**: Porcentagem do tempo em que todos os servidores estão ociosos.

#### Aplicações

- Manutenção de equipamentos com múltiplos técnicos.
- Atendimento em hospitais com leitos limitados.
- Serviços de TI, impressão, ou call centers com capacidade limitada e vários atendentes.

> Este modelo é ideal para estimar indisponibilidade, filas e necessidade de recursos em cenários onde a população de “clientes” ou “equipamentos” é limitada e existem múltiplos servidores atuando simultaneamente.
  `,
    tags: [],
  },
]
