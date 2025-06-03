# Queue Optimization Calculator

O **Queue Optimization Calculator** é uma aplicação de desktop desenvolvida com Electron, React e TypeScript, projetada para auxiliar na análise e otimização de sistemas de filas. A ferramenta permite simular diferentes cenários de atendimento, fornecendo métricas essenciais para a tomada de decisões em ambientes como call centers, serviços de atendimento ao cliente e outros sistemas que envolvem filas.

## Funcionalidades

* Simulação de modelos de filas, como M/M/1, M/M/c, entre outros.
* Cálculo de métricas de desempenho, incluindo:

  * Tempo médio de espera na fila (Wq)
  * Tempo médio no sistema (W)
  * Número médio de clientes na fila (Lq)
  * Número médio de clientes no sistema (L)
  * Taxa de utilização do sistema (ρ)
* Interface intuitiva para entrada de parâmetros e visualização de resultados.
* Geração de relatórios para análise comparativa entre diferentes configurações.([GitHub][1], [GitHub][2])

## Tecnologias Utilizadas

* [Electron](https://www.electronjs.org/)
* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [pnpm](https://pnpm.io/)

## Requisitos

* Node.js (versão 16 ou superior)
* pnpm (gerenciador de pacotes)

## Instalação e Execução

1. Clone o repositório:

   ```bash
   git clone https://github.com/pedroaba/queue-optimization-calculator.git
   cd queue-optimization-calculator
   ```



2. Instale as dependências:

   ```bash
   pnpm install
   ```



3. Inicie o ambiente de desenvolvimento:

   ```bash
   pnpm dev
   ```



4. Para gerar o executável da aplicação:

   ```bash
   pnpm build
   ```



## Estrutura do Projeto

* `src/`: Contém os componentes React e a lógica da aplicação.
* `resources/`: Arquivos estáticos e recursos utilizados pela aplicação.
* `build/`: Diretório onde os arquivos de build são gerados.
* `electron.vite.config.ts`: Configurações específicas do Electron com Vite.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
