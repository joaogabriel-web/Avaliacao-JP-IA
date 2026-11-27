# PROJETO: CARDÁPIO DIGITAL INTERATIVO PARA RESTAURANTE DE SUSHI

## 1. OBJETIVO

Atue como um Engenheiro de Software Sênior, especialista em desenvolvimento Frontend, arquitetura de aplicações, UX/UI, responsividade, acessibilidade e boas práticas de cibersegurança.

Desenvolva um **Cardápio Digital Interativo para um restaurante de Sushi**, com foco na experiência do cliente, facilidade de utilização, organização dos pedidos e visualização dos produtos disponíveis.

O objetivo é criar uma aplicação moderna, intuitiva, visualmente profissional e funcional, permitindo que os clientes:

- Visualizem o cardápio completo.
- Pesquisem produtos.
- Filtrarem os produtos por categorias.
- Consultem preços, descrições e disponibilidade.
- Adicionem produtos ao carrinho.
- Selecionem quantidades.
- Removam produtos do carrinho.
- Visualizem o resumo do pedido.
- Escolham uma forma de pagamento.
- Revisem e confirmem o pedido em uma simulação de finalização.

### Usuário principal

O usuário principal é o cliente do restaurante, que acessará o cardápio pelo celular, tablet ou computador.

Considere que esse cliente pode não ter familiaridade com tecnologia. Portanto, toda a experiência deve ser simples, intuitiva e autoexplicativa.

Não exigir cadastro, login, senha ou qualquer processo de autenticação.

### Problema que o sistema resolve

Atualmente, anotar pedidos manualmente pode gerar dificuldades, erros de comunicação, demora no atendimento e problemas na organização dos pedidos.

O sistema deve facilitar a escolha dos produtos e a montagem do pedido, proporcionando uma experiência semelhante à utilização de aplicativos profissionais de delivery, mas sem implementar serviços externos.

---

## 2. TECNOLOGIAS E ARQUITETURA

Utilize as seguintes tecnologias:

- HTML5.
- CSS3.
- JavaScript ou TypeScript.
- Vue.js, preferencialmente Vue 3.
- Componentização.
- CSS responsivo.
- LocalStorage para persistência local, quando necessário.

Organize o projeto de maneira modular, utilizando componentes reutilizáveis.

Sugestão de estrutura:

- components/
- pages/
- layouts/
- data/
- services/
- composables/
- assets/
- styles/
- tests/

Separe a lógica de negócio da apresentação visual.

Crie uma estrutura que permita futuramente substituir os dados simulados por uma API, sem precisar reconstruir toda a interface.

### Funcionamento offline

A aplicação deverá funcionar sem depender de serviços externos.

Requisitos:

- Não realizar requisições para APIs externas.
- Não utilizar serviços de banco de dados.
- Não utilizar autenticação.
- Não depender de serviços de terceiros.
- Não exigir conexão com internet para consultar os dados simulados após a disponibilização local da aplicação.
- Não implementar pagamentos reais.

Utilize dados simulados, identificando claramente que são informações demonstrativas.

Se necessário, utilizar LocalStorage para manter carrinho e preferências localmente.

Não apresentar informações simuladas como se fossem dados reais do restaurante.

---

## 3. PÁGINAS E COMPONENTES

### 3.1. Página principal — Cardápio

Criar uma página inicial contendo:

**Cabeçalho:**
- Nome ou logotipo do restaurante.
- Identificação visual do cardápio.
- Botão para visualizar o carrinho.
- Indicador da quantidade de produtos selecionados.

**Barra de pesquisa:**
- Campo para pesquisar produtos pelo nome.
- Pesquisa dinâmica.
- Botão para limpar a pesquisa.
- Mensagem quando nenhum produto for encontrado.

**Categorias:**

Criar filtros por categorias, por exemplo:

- Todos.
- Combinados.
- Sushis.
- Sashimis.
- Temakis.
- Hot Rolls.
- Entradas.
- Bebidas.
- Sobremesas.

As categorias devem ser simuladas e facilmente editáveis.

**Lista de produtos:**

Cada produto deverá apresentar:

- Imagem ilustrativa.
- Nome.
- Descrição.
- Preço.
- Categoria.
- Status de disponibilidade.
- Botão para adicionar ao carrinho.

Utilizar imagens ilustrativas adequadas ao universo gastronômico japonês.

Não utilizar imagens quebradas ou produtos sem identificação.

**Status de estoque:**

Cada produto deverá possuir um dos seguintes estados:

- Disponível.
- Indisponível.

Representação visual:

- Verde: disponível.
- Amarelo: atenção ou disponibilidade limitada, quando aplicável.
- Vermelho: indisponível.

Produtos indisponíveis não poderão ser adicionados ao carrinho.

Utilizar dados simulados claramente identificados.

### 3.2. Detalhes do produto

Ao clicar em um produto, abrir um modal ou painel com:

- Imagem ampliada.
- Nome.
- Descrição completa.
- Preço.
- Disponibilidade.
- Seleção de quantidade.
- Botão de adicionar ao carrinho.
- Botão de fechar.

O modal deverá apresentar uma experiência simples e funcionar corretamente em dispositivos móveis.

### 3.3. Carrinho de compras

Criar uma área específica para visualizar os produtos selecionados.

Cada item deverá apresentar:

- Nome do produto.
- Imagem reduzida.
- Preço unitário.
- Quantidade.
- Subtotal.
- Botão para aumentar quantidade.
- Botão para diminuir quantidade.
- Botão para remover o produto.

Apresentar também:

- Subtotal.
- Taxa de entrega demonstrativa, quando aplicável.
- Desconto demonstrativo, quando aplicável.
- Valor total.

Regras:

- Atualizar automaticamente os valores.
- Não permitir quantidades negativas.
- Não permitir adicionar produtos indisponíveis.
- Impedir quantidades superiores ao estoque simulado.
- Permitir remover itens.
- Atualizar o indicador do carrinho em tempo real.
- Apresentar uma mensagem quando o carrinho estiver vazio.

### 3.4. Finalização do pedido

Criar uma etapa de revisão do pedido.

Apresentar:

- Lista dos produtos.
- Quantidades.
- Valores individuais.
- Subtotal.
- Taxas demonstrativas.
- Total geral.

Disponibilizar campos para informações do pedido:

- Nome do cliente.
- Tipo de atendimento: retirada no restaurante ou entrega.
- Observações adicionais.

Quando a opção de entrega estiver selecionada, apresentar campos demonstrativos para endereço.

### 3.5. Forma de pagamento

Disponibilizar opções de pagamento simuladas:

- Pix.
- Dinheiro.
- Cartão de crédito.
- Cartão de débito.

Permitir selecionar somente uma opção.

Quando dinheiro for selecionado, apresentar um campo opcional para informar o valor disponível para pagamento e calcular o troco.

Não implementar processamento financeiro, geração de cobranças ou integração com instituições financeiras.

### 3.6. Confirmação do pedido

Criar uma tela de confirmação contendo:

- Mensagem de pedido realizado com sucesso.
- Número demonstrativo do pedido.
- Resumo dos produtos.
- Forma de pagamento selecionada.
- Valor total.
- Data e horário local da simulação.

O número do pedido deverá ser gerado localmente apenas para fins demonstrativos.

Deixar explícito que o pedido foi registrado apenas nesta demonstração e não foi transmitido para a cozinha ou para o restaurante.

Disponibilizar botão para retornar ao cardápio e iniciar um novo pedido.

---

## 4. COMPORTAMENTOS E REGRAS DE NEGÓCIO

Implementar as seguintes funcionalidades:

### Pesquisa e filtros

- Pesquisa por nome.
- Filtro por categoria.
- Atualização dinâmica dos resultados.
- Combinação entre pesquisa e categoria.
- Opção para limpar filtros.
- Exibição de mensagem quando não houver resultados.

### Seleção de produtos

- Adicionar produtos.
- Remover produtos.
- Aumentar quantidade.
- Diminuir quantidade.
- Atualizar valores automaticamente.
- Validar disponibilidade.
- Validar limite de estoque simulado.

### Carrinho

- Atualização automática.
- Cálculo de subtotais.
- Cálculo do total.
- Exclusão de itens.
- Confirmação visual de alterações.
- Persistência local durante a utilização.

### Validação

Implementar validação dos campos obrigatórios.

Utilizar as seguintes regras visuais:

- Campo obrigatório vazio: borda vermelha.
- Campo preenchido incorretamente: borda vermelha e mensagem de erro.
- Campo preenchido corretamente: borda verde.
- Operação em andamento: indicador amarelo.
- Operação concluída: mensagem visual de sucesso.
- Situações de atenção: amarelo.

Não utilizar somente cores para comunicar erros ou sucessos. Sempre apresentar textos ou ícones complementares.

### Estados de interface

Implementar os seguintes estados:

1. Inicial: carregamento normal da aplicação.
2. Carregando: indicador visual amarelo.
3. Sucesso: indicação visual verde.
4. Erro: mensagem em vermelho.
5. Atenção: indicação amarela.
6. Vazio: mensagens orientativas.
7. Indisponível: produto bloqueado para seleção.
8. Selecionado: produto adicionado ao carrinho.

Criar feedback visual para todas as ações importantes do usuário.

---

## 5. DESIGN E IDENTIDADE VISUAL

Desenvolver uma interface moderna, elegante e minimalista, inspirada na identidade visual de restaurantes japoneses contemporâneos.

A interface deverá transmitir:

- Qualidade.
- Organização.
- Sofisticação.
- Facilidade de utilização.
- Confiança.

### Paletas de cores

Utilize as referências abaixo como inspiração.

**Paleta 1 — Cinza e grafite:**
https://ascores.com.br/paleta/232323-444444-656565-858585-cacaca-727272-7b7b7b-575757-3e3e3e-4a4a4a/

**Paleta 2 — Vermelho e verde:**
https://ascores.com.br/paleta/5c0000-751717-ba0c0c-ff0000-ffebeb-ecffeb-27a300-2a850e-2d661b-005c00/

**Paleta 3 — Cores japonesas e tons quentes:**
https://ascores.com.br/paleta/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08/

**Paleta 4 — Preto, vermelho e branco:**
https://ascores.com.br/paleta/0b090a-161a1d-660708-a4161a-ba181b-e5383b-b1a7a6-d3d3d3-f5f3f4-ffffff/

**Paleta 5 — Azul e tons claros:**
https://ascores.com.br/paleta/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-ade8f4-caf0f8/

**Paleta 6 — Preto e branco:**
https://ascores.com.br/paleta/000000-ffffff/

### Direção visual recomendada

Utilizar principalmente:

- Preto e grafite para textos e elementos estruturais.
- Branco e tons claros para os fundos.
- Vermelho escuro para detalhes e elementos de destaque.
- Verde para estados positivos.
- Amarelo para atenção e carregamento.

Não é obrigatório utilizar todas as paletas.

Priorizar consistência visual e contraste adequado.

Evitar excesso de cores, sombras pesadas, elementos decorativos desnecessários e animações exageradas.

### Componentes visuais

Criar:

- Cards de produtos.
- Botões com estados de interação.
- Modais.
- Campos de formulário.
- Barra de pesquisa.
- Filtros por categoria.
- Indicadores de estoque.
- Contador do carrinho.
- Resumo financeiro.
- Mensagens de feedback.
- Tela de confirmação.

Todos os componentes deverão possuir identidade visual consistente.

---

## 6. RESPONSIVIDADE

Desenvolver a aplicação com abordagem Mobile First.

Garantir funcionamento adequado em:

**Celulares:**
- Layout em uma coluna.
- Cards adaptados à largura da tela.
- Botões grandes e acessíveis.
- Carrinho fácil de acessar.
- Navegação simples.
- Modais adaptados à tela.

**Tablets:**
- Layout com duas colunas, quando apropriado.
- Melhor aproveitamento do espaço.
- Carrinho e produtos organizados.

**Desktops:**
- Grid de produtos.
- Carrinho acessível.
- Melhor distribuição dos componentes.
- Aproveitamento adequado da largura da tela.

Testar diferentes resoluções, incluindo:

- 320px.
- 375px.
- 768px.
- 1024px.
- 1440px.

Não permitir rolagem horizontal indevida.

---

## 7. ACESSIBILIDADE

Aplicar boas práticas de acessibilidade:

- HTML semântico.
- Labels associados aos campos.
- Textos alternativos nas imagens.
- Contraste adequado.
- Navegação por teclado.
- Foco visual nos elementos interativos.
- Botões com nomes acessíveis.
- Mensagens de erro compreensíveis.
- Modais com gerenciamento adequado de foco.
- Compatibilidade com leitores de tela.
- Não depender exclusivamente das cores para transmitir informações.

Utilizar atributos ARIA quando necessário, sem substituir elementos HTML semânticos.

---

## 8. LIMITES DO ESCOPO E RESTRIÇÕES

ATENÇÃO: Este projeto deverá contemplar EXCLUSIVAMENTE O FRONTEND.

Não implementar:

- Backend.
- Banco de dados.
- Supabase.
- Firebase.
- APIs externas.
- Login.
- Cadastro de usuários.
- Autenticação.
- Painel administrativo.
- Integração com WhatsApp.
- Integração com sistemas de delivery.
- Integração com sistemas de PDV.
- Integração com impressoras.
- Integração com sistemas de cozinha.
- Pagamentos reais.
- Gateway de pagamento.
- Sincronização entre dispositivos.

Não criar funcionalidades que dependam desses serviços.

Todos os produtos, preços, categorias, estoques e pedidos deverão utilizar dados simulados.

Identificar os dados como demonstrativos.

O armazenamento local poderá ser utilizado apenas para preservar informações no navegador.

Não apresentar o sistema como uma solução de produção já integrada ao restaurante.

A arquitetura deverá permitir futuras evoluções, sem implementar essas integrações agora.

---

## 9. TESTES E VALIDAÇÕES

Criar testes funcionais para verificar:

**Cardápio:**
- Exibição dos produtos.
- Pesquisa.
- Filtros.
- Combinação de filtros.
- Produtos disponíveis.
- Produtos indisponíveis.

**Carrinho:**
- Adicionar produto.
- Aumentar quantidade.
- Diminuir quantidade.
- Remover produto.
- Atualizar subtotal.
- Atualizar total.
- Impedir quantidades inválidas.
- Impedir adição de produtos indisponíveis.

**Finalização:**
- Validar campos obrigatórios.
- Selecionar forma de pagamento.
- Calcular troco.
- Revisar pedido.
- Confirmar pedido demonstrativo.
- Exibir resumo de confirmação.

**Interface:**
- Responsividade.
- Navegação por teclado.
- Feedback visual.
- Estados de carregamento.
- Estados de erro.
- Estados de sucesso.
- Mensagens de carrinho vazio.

Se possível, utilizar Vitest e Vue Test Utils para testes automatizados.

Não considerar a aplicação concluída apenas porque a interface foi criada. Verificar também o funcionamento das interações e regras de negócio.

---

## 10. CRITÉRIOS DE ACEITAÇÃO VISUAL

O projeto será considerado visualmente satisfatório quando atender aos seguintes requisitos:

1. Interface profissional e moderna.
2. Identidade visual coerente com um restaurante de Sushi.
3. Layout intuitivo e fácil de utilizar.
4. Produtos apresentados em cards organizados.
5. Imagens adequadas aos produtos.
6. Filtros funcionais e visualmente claros.
7. Carrinho de fácil acesso.
8. Resumo dos pedidos organizado.
9. Formulários com validação visual.
10. Indicadores de estoque fáceis de identificar.
11. Feedback visual para todas as operações.
12. Responsividade em celulares, tablets e computadores.
13. Boa acessibilidade.
14. Ausência de elementos quebrados.
15. Ausência de erros no console do navegador.

### ORIENTAÇÃO FINAL AO LOVABLE

Desenvolva a aplicação completa, não apenas um protótipo estático ou uma landing page.

Implemente as páginas, os componentes, os comportamentos e as regras de negócio descritos nesta especificação.

Priorize qualidade de código, organização, reutilização de componentes e experiência do usuário.

Não reduza o escopo das funcionalidades solicitadas.

Não invente integrações externas.

Utilize dados simulados e identifique-os claramente.

Antes de finalizar, revise o projeto, execute os testes disponíveis e corrija erros funcionais e visuais.

**RESULTADO ESPERADO: UM CARDÁPIO DIGITAL INTERATIVO, RESPONSIVO, FUNCIONAL E EXECUTÁVEL LOCALMENTE, COM TODAS AS FUNCIONALIDADES DE FRONTEND IMPLEMENTADAS E PREPARADO PARA FUTURAS EVOLUÇÕES.**