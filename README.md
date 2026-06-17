# 🛡️ Summoners War - Siege Dashboard | Death Cannon

![Status](https://img.shields.io/badge/Status-Ativo-success)
![Game](https://img.shields.io/badge/Game-Summoners_War-orange)
![Guild](https://img.shields.io/badge/Guild-Death_Cannon-black)

Um painel interativo (Dashboard) em formato *Single Page Application (SPA)* desenvolvido para analisar, registrar e otimizar o desempenho da guilda **Death Cannon** nas Batalhas de Cerco (Siege Battles) do jogo Summoners War.

🌐 **[Acesse o Dashboard ao vivo aqui!](https://jordaolps.github.io/sw-dashboard-siege)**

---

## 🎯 Objetivos do Sistema

No cenário competitivo (G1/G2) de Summoners War, a informação é a maior arma de uma guilda. O objetivo deste projeto é transformar os dados brutos gerados pelo jogo em inteligência tática acessível para todos os membros.

- **Disseminação de Conhecimento:** Permitir que jogadores descubram quais times de ataque estão funcionando e quais devem ser evitados.
- **Estudo de Counters:** Identificar defesas inimigas problemáticas e analisar exatamente quais composições nossa guilda usou contra elas (com vitórias ou derrotas).
- **Padronização de Defesas:** Fornecer um guia visual e interativo das defesas oficiais da guilda, facilitando a montagem de torres robustas.
- **Acompanhamento de Desempenho:** Manter um histórico da participação, taxa de vitórias (Win Rate) e engajamento dos membros ao longo da temporada.

---

## ✨ Funcionalidades

O Dashboard foi construído para ser leve, rodar diretamente no navegador e oferecer uma experiência rica em dados. Suas principais sessões incluem:

### 1. 📖 História & Liderança
Uma área dedicada ao *lore* da guilda, nosso histórico de ranqueamento e a estrutura atual do Corpo Diretivo (Líder, Vice-líderes e Membros Sêniores).

### 2. 📊 Visão Geral (Histórico de Sieges)
- Listagem em acordeão de todas as Batalhas de Cerco registradas.
- **Placar e Rank:** Posição final e Win Rate da guilda contra os oponentes da chave.
- **Gráfico de Atividade:** Gráfico em barras (Chart.js) mostrando os picos de atividade da guilda por hora (UTC-3).
- **Desempenho Individual:** Tabela de classificação interna mostrando Vitórias, Derrotas e Win Rate de cada jogador.

### 3. 💡 Insights & Counters
O núcleo de inteligência da guilda.
- **Decks Interativos:** Cartões com as fotos reais dos monstros e as estatísticas daquele time.
- **Sistema de Filtros:** Botões rápidos para visualizar o `Top 25 Melhores Ataques`, `Top 25 Mais Usados`, `Top 25 Piores (Para estudo)` e `Top 25 Defesas Mais Difíceis`.
- **Busca Global:** Barra de pesquisa para encontrar rapidamente times que contenham um monstro específico (ex: *Zenitsu*, *Moore*).
- **Modal de Histórico:** Ao clicar em qualquer composição, um Pop-up exibe o histórico detalhado de quem atacou, contra qual guilda foi, o time usado e o resultado da batalha.

### 4. 🧱 Defesas Padrão
Um catálogo oficial de defesas recomendadas pela inteligência da guilda, separadas por **Torres 5 Estrelas** e **Torres 4 Estrelas**.
- **Interatividade de Variações:** Monstros alternativos ficam disponíveis ao lado da composição principal. Clicar em uma variação a coloca em destaque na torre, permitindo visualizar a defesa customizada.

---

## ⚙️ Arquitetura e Como Funciona

Este repositório hospeda o **resultado visual** (HTML/CSS/JS + Ícones) do nosso sistema de dados. A arquitetura funciona da seguinte maneira:

1. **Extração (Raw Data):** O arquivo bruto `Battle Record.json` é capturado do tráfego do jogo via proxy.
2. **Processamento (Python/Pandas):** Um script local em Python lê a API de monstros, resolve duplicações de IDs de personagens de *Collab*, cruza os dados de múltiplas Sieges e calcula as taxas de vitória.
3. **Geração Estática:** O Python injeta toda essa inteligência em um único arquivo `dashboard_siege.html` contendo os *arrays* JSON embutidos no JavaScript.
4. **Deploy:** O HTML gerado e os ícones são submetidos para este repositório e hospedados nativamente pelo **GitHub Pages**.

Essa abordagem garante **custo zero de servidor**, ausência de tempo de carregamento do banco de dados e uma experiência fluida para os usuários no celular ou no PC.

---

## 👨‍💻 Autor

Desenvolvido por **[jordaolps](https://github.com/jordaolps)** para o núcleo de inteligência da guilda **Death Cannon**.

*Summoners War é uma marca registrada da Com2uS. Este é um projeto de análise de dados sem fins lucrativos criado pela comunidade.*