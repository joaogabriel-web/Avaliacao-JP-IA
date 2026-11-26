# DESENVOLVIMENTO DE UM CARDÁPIO DIGITAL INTERATIVO PARA RESTAURANTE

## 1. CONTEXTO DO PROJETO

Você é um desenvolvedor Full Stack Sênior, especialista em desenvolvimento de aplicações web, Vue.js, TypeScript, JavaScript, Node.js, Express, APIs REST, CRUD e interfaces modernas e responsivas.

Sua tarefa é analisar, integrar, aprimorar e desenvolver um sistema de **Cardápio Digital Interativo para Restaurante**, utilizando dois projetos que já existem no ambiente local.

O sistema deverá proporcionar uma experiência simples, intuitiva, moderna e agradável para os clientes de um restaurante, permitindo visualizar produtos, consultar informações, selecionar pratos, adicionar observações e montar pedidos.

O projeto deve aproveitar ao máximo a estrutura, as tecnologias, as bibliotecas e os recursos já implementados.

## 2. CAMINHOS DOS PROJETOS

### Backend — Projeto BASE

Caminho:
`C:\Users\joao62425746\Documents\aula-exemplo-backend-jp-2026`

Este projeto contém a estrutura inicial do backend e deverá ser utilizado como base para as funcionalidades de servidor, regras de negócio, operações CRUD, gerenciamento de dados e comunicação com o frontend.

### Frontend — Cardápio Digital

Caminho:
`C:\Users\joao62425746\Documents\dish-discovery-order-garden`

Este projeto contém a aplicação frontend do cardápio digital.

Deverá ser analisado e aprimorado para se tornar uma interface funcional, interativa, responsiva e integrada ao backend.

**IMPORTANTE:** Antes de realizar qualquer alteração, analise os dois projetos individualmente. Identifique suas estruturas, arquivos principais, dependências, configurações, componentes e funcionalidades existentes.

Não crie projetos novos sem necessidade.

## 3. TECNOLOGIAS UTILIZADAS

### Frontend

Utilize as tecnologias já existentes no projeto:

- HTML5.
- CSS3.
- JavaScript.
- TypeScript.
- Vue.js.
- Node.js.
- npm.

Utilize os componentes, bibliotecas e dependências já instalados sempre que possível.

### Backend

Utilize as tecnologias e ferramentas existentes:

- Node.js.
- Express.
- JavaScript.
- TypeScript, caso já esteja configurado.
- HTML, quando aplicável à estrutura existente.
- JWT para autenticação, caso já faça parte da implementação.
- Banco de dados local.
- Operações CRUD.
- APIs REST.

Utilize bibliotecas auxiliares já existentes no projeto.

Não substitua bibliotecas ou frameworks sem uma justificativa técnica.

## 4. OBJETIVO PRINCIPAL

Desenvolver um cardápio digital interativo para restaurantes, permitindo que os clientes tenham acesso aos produtos disponíveis e consigam montar seus pedidos de maneira rápida e intuitiva.

A aplicação deverá funcionar como um cardápio digital tradicional, mas com recursos de interação.

A experiência deverá priorizar:

- Facilidade de utilização.
- Navegação intuitiva.
- Organização dos alimentos por categorias.
- Apresentação visual dos produtos.
- Facilidade para adicionar e remover produtos.
- Personalização dos pedidos.
- Registro de observações.
- Visualização do resumo do pedido.
- Interface responsiva para celulares, tablets e computadores.

## 5. IDENTIDADE VISUAL E PALETAS DE CORES

A identidade visual deverá transmitir modernidade, organização, qualidade e uma experiência gastronômica agradável.

Utilize as paletas abaixo como referências visuais. Você poderá combinar, distribuir e adaptar as cores conforme a necessidade de cada página.

Não é obrigatório utilizar todas as cores.

### Paleta 1 — Cinza e tons neutros

https://ascores.com.br/paleta/232323-444444-656565-858585-cacaca-727272-7b7b7b-575757-3e3e3e-4a4a4a/

Utilização sugerida:
- Fundos.
- Textos secundários.
- Bordas.
- Elementos neutros.
- Separadores.

### Paleta 2 — Vermelho e verde

https://ascores.com.br/paleta/5c0000-751717-ba0c0c-ff0000-ffebeb-ecffeb-27a300-2a850e-2d661b-005c00/

Utilização sugerida:
- Botões de ação.
- Destaques.
- Indicadores de disponibilidade.
- Estados de sucesso.
- Elementos relacionados à gastronomia.

### Paleta 3 — Tons quentes

https://ascores.com.br/paleta/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08/

Utilização sugerida:
- Destaques dos produtos.
- Promoções.
- Botões principais.
- Elementos de identidade visual.
- Detalhes relacionados à alimentação.

### Paleta 4 — Vermelho, preto e branco

https://ascores.com.br/paleta/0b090a-161a1d-660708-a4161a-ba181b-e5383b-b1a7a6-d3d3d3-f5f3f4-ffffff/

Utilização sugerida:
- Estrutura principal da interface.
- Cabeçalhos.
- Botões.
- Textos.
- Cartões de produtos.

### Paleta 5 — Azul e tons claros

https://ascores.com.br/paleta/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-ade8f4-caf0f8/

Utilização sugerida:
- Elementos secundários.
- Fundos alternativos.
- Informações.
- Componentes de navegação.
- Detalhes visuais.

### Paleta 6 — Preto e branco

https://ascores.com.br/paleta/000000-ffffff/

Utilização sugerida:
- Contraste.
- Textos.
- Fundos.
- Elementos minimalistas.

### Diretrizes de design

- Desenvolva uma identidade visual consistente.
- Evite excesso de cores na mesma tela.
- Priorize uma aparência moderna e profissional.
- Utilize contraste adequado entre texto e fundo.
- Crie botões visualmente claros.
- Utilize bordas arredondadas de maneira equilibrada.
- Trabalhe com espaçamentos padronizados.
- Utilize ícones intuitivos.
- Dê destaque às imagens dos alimentos.
- Utilize efeitos sutis de hover e transições.
- Evite interfaces visualmente poluídas.

A aparência deve lembrar um sistema profissional de pedidos digitais utilizado por restaurantes modernos.

## 6. FUNCIONALIDADES DO SISTEMA

### 6.1. Página inicial do cardápio

Desenvolva uma página inicial contendo:

- Nome e identidade visual do restaurante.
- Logotipo ou espaço reservado para a marca.
- Banner ou imagem de destaque.
- Campo de pesquisa de produtos.
- Categorias do cardápio.
- Produtos em destaque.
- Produtos disponíveis.
- Acesso ao carrinho de pedidos.

A página deverá permitir que o cliente encontre rapidamente o que deseja consumir.

### 6.2. Categorias de produtos

Organize os produtos em categorias.

Exemplos:

- Entradas.
- Pratos principais.
- Hambúrgueres.
- Pizzas.
- Massas.
- Bebidas.
- Sobremesas.
- Promoções.

As categorias deverão ser apresentadas de forma organizada e permitir filtragem dos produtos.

Ao selecionar uma categoria, exiba somente os produtos correspondentes.

### 6.3. Cards dos produtos

Cada produto deverá possuir:

- Imagem.
- Nome.
- Descrição.
- Preço.
- Categoria.
- Indicador de disponibilidade.
- Botão para adicionar ao pedido.
- Acesso aos detalhes do produto.

Os cards deverão ter um visual agradável, com imagens bem dimensionadas e informações organizadas.

### 6.4. Detalhes do produto

Ao selecionar um produto, abra uma janela modal ou uma página de detalhes contendo:

- Imagem ampliada.
- Nome do produto.
- Descrição completa.
- Preço.
- Opções adicionais, quando disponíveis.
- Campo para observações.
- Controle de quantidade.
- Botão para adicionar ao carrinho.

O campo de observações deverá permitir que o cliente informe preferências ou solicitações.

Exemplos:
- Sem cebola.
- Sem tomate.
- Pouco sal.
- Molho separado.
- Ponto da carne.

### 6.5. Carrinho de pedidos

Desenvolva um carrinho interativo contendo:

- Lista dos produtos selecionados.
- Imagem e nome dos produtos.
- Quantidade.
- Preço unitário.
- Subtotal de cada produto.
- Observações individuais.
- Botão para aumentar quantidade.
- Botão para diminuir quantidade.
- Botão para remover produtos.
- Valor total do pedido.

O carrinho deverá atualizar automaticamente os valores sempre que houver alguma alteração.

### 6.6. Finalização do pedido

Desenvolva uma etapa de revisão e finalização do pedido contendo:

- Resumo completo dos produtos.
- Quantidades.
- Observações.
- Subtotal.
- Taxas adicionais, caso existam na configuração.
- Valor total.
- Campo para identificação do cliente, quando necessário.
- Botão para confirmar pedido.

A finalização deverá apresentar uma confirmação visual clara.

Não simule uma integração com pagamentos externos.

### 6.7. Gerenciamento de produtos — CRUD

Aproveite a estrutura existente do backend para implementar ou aprimorar as operações CRUD.

O gerenciamento deverá permitir:

- Cadastrar produtos.
- Consultar produtos.
- Atualizar produtos.
- Excluir produtos.
- Definir categorias.
- Atualizar preços.
- Atualizar descrições.
- Atualizar imagens.
- Controlar disponibilidade.

Implemente as operações de maneira consistente com a arquitetura já existente.

### 6.8. Gerenciamento de categorias

Permita:

- Criar categorias.
- Listar categorias.
- Editar categorias.
- Excluir categorias.
- Associar produtos às categorias.

Respeite as regras de integridade dos dados existentes.

## 7. INTEGRAÇÃO ENTRE FRONTEND E BACKEND

Analise como os projetos estão estruturados e estabeleça uma comunicação adequada entre eles.

O frontend deverá consumir as APIs disponibilizadas pelo backend.

Verifique:

- Rotas existentes.
- Controllers.
- Models.
- Middlewares.
- Configurações do Express.
- Estrutura de dados.
- Configuração do banco local.
- Configuração de CORS.
- Variáveis de ambiente.
- Tratamento de erros.

Não crie rotas duplicadas caso já existam funcionalidades equivalentes.

Mantenha a organização e os padrões utilizados nos projetos.

Caso alguma funcionalidade esteja ausente, implemente-a seguindo a arquitetura existente.

## 8. EXPERIÊNCIA DO USUÁRIO

O sistema deverá ser extremamente simples de utilizar.

Considere que o usuário principal é um cliente de restaurante que deseja consultar o cardápio e realizar seu pedido sem dificuldades.

A navegação deverá seguir uma sequência lógica:

1. Cliente acessa o cardápio.
2. Visualiza as categorias.
3. Seleciona uma categoria.
4. Escolhe um produto.
5. Consulta os detalhes.
6. Define a quantidade.
7. Adiciona observações.
8. Adiciona o produto ao carrinho.
9. Continua escolhendo outros produtos.
10. Consulta o carrinho.
11. Revisa o pedido.
12. Confirma o pedido.

Utilize feedbacks visuais para informar quando um produto for adicionado, removido ou atualizado.

Evite etapas desnecessárias.

## 9. RESPONSIVIDADE

A aplicação deverá funcionar corretamente em:

- Smartphones.
- Tablets.
- Notebooks.
- Desktops.

Priorize a experiência mobile-first, pois muitos clientes utilizarão o cardápio pelo celular.

Adapte:
- Menus.
- Categorias.
- Cards.
- Imagens.
- Modais.
- Carrinho.
- Botões.
- Campos de formulário.

Não permita rolagem horizontal indesejada.

## 10. ACESSIBILIDADE

Implemente boas práticas de acessibilidade:

- HTML semântico.
- Textos alternativos nas imagens.
- Contraste adequado.
- Identificação dos campos de formulário.
- Navegação por teclado.
- Estados de foco visíveis.
- Botões com nomes acessíveis.
- Mensagens de erro compreensíveis.
- Modais com comportamento acessível.

## 11. ORGANIZAÇÃO E QUALIDADE DO CÓDIGO

Mantenha o código organizado, reutilizável e de fácil manutenção.

Diretrizes:

- Respeite a arquitetura existente.
- Evite duplicação de código.
- Utilize componentes Vue reutilizáveis.
- Separe responsabilidades.
- Utilize TypeScript quando já estiver configurado.
- Organize os estilos.
- Padronize nomenclaturas.
- Evite dependências desnecessárias.
- Trate erros de requisição.
- Valide os dados recebidos.
- Mantenha a consistência entre frontend e backend.

## 12. RESTRIÇÕES E CUIDADOS

- NÃO apague arquivos importantes sem necessidade.
- NÃO reconstrua os projetos do zero.
- NÃO substitua tecnologias existentes sem justificativa.
- NÃO instale bibliotecas desnecessárias.
- NÃO crie funcionalidades desconectadas da proposta.
- NÃO deixe botões sem funcionalidade.
- NÃO utilize dados inconsistentes.
- NÃO duplique funcionalidades já implementadas.
- NÃO exponha informações sensíveis.
- NÃO remova funcionalidades existentes sem autorização.
- NÃO altere configurações importantes sem verificar seus impactos.

Antes de realizar alterações significativas, identifique os arquivos afetados e explique brevemente o que será modificado.

Preserve o histórico e a estrutura dos projetos.

## 13. ETAPAS DE EXECUÇÃO

Execute o trabalho seguindo esta ordem:

### Etapa 1 — Análise

- Examine o backend.
- Examine o frontend.
- Identifique as tecnologias efetivamente utilizadas.
- Identifique funcionalidades existentes.
- Identifique problemas e inconsistências.
- Verifique como os projetos podem se comunicar.

### Etapa 2 — Planejamento

- Defina a arquitetura de integração.
- Identifique os componentes necessários.
- Identifique as páginas necessárias.
- Planeje as alterações no backend.
- Planeje as alterações no frontend.

### Etapa 3 — Desenvolvimento do Backend

- Ajuste as rotas necessárias.
- Implemente ou corrija operações CRUD.
- Verifique os modelos de dados.
- Implemente validações.
- Garanta respostas consistentes da API.

### Etapa 4 — Desenvolvimento do Frontend

- Aprimore a identidade visual.
- Desenvolva as páginas.
- Crie componentes reutilizáveis.
- Implemente a navegação.
- Desenvolva os filtros.
- Implemente os detalhes dos produtos.
- Desenvolva o carrinho.
- Implemente as observações.
- Implemente a finalização do pedido.

### Etapa 5 — Integração

- Conecte o frontend às APIs.
- Verifique as requisições.
- Teste a comunicação entre os projetos.
- Corrija inconsistências.

### Etapa 6 — Testes

Teste:

- Listagem de produtos.
- Pesquisa.
- Filtragem por categoria.
- Visualização de detalhes.
- Adição ao carrinho.
- Remoção do carrinho.
- Alteração de quantidades.
- Cálculo de valores.
- Registro de observações.
- Finalização do pedido.
- Operações CRUD.
- Responsividade.
- Tratamento de erros.

### Etapa 7 — Finalização

- Revise a interface.
- Corrija problemas visuais.
- Verifique os fluxos de utilização.
- Confira os comandos necessários para executar os projetos.
- Documente eventuais configurações necessárias.

## 14. CRITÉRIOS DE ACEITAÇÃO

O projeto será considerado satisfatório quando:

1. O frontend estiver funcionando corretamente.
2. O backend estiver funcionando corretamente.
3. Os dois projetos estiverem integrados.
4. Os produtos forem exibidos corretamente.
5. As categorias funcionarem.
6. A pesquisa encontrar produtos.
7. Os detalhes dos produtos forem exibidos.
8. O cliente conseguir adicionar produtos ao carrinho.
9. O cliente conseguir alterar quantidades.
10. O cliente conseguir adicionar observações.
11. O total do pedido for calculado corretamente.
12. O pedido puder ser revisado e confirmado.
13. O CRUD de produtos funcionar.
14. A interface for responsiva.
15. O design estiver consistente com as paletas de cores.
16. Não existirem botões principais sem funcionamento.
17. Não existirem erros críticos no console ou nas requisições.

## 15. INSTRUÇÃO FINAL AO COPILOT

Comece realizando uma análise completa dos dois diretórios informados.

Não faça alterações imediatamente antes de entender a estrutura existente.

Após a análise, apresente um diagnóstico resumido contendo:

- Estrutura do backend.
- Estrutura do frontend.
- Tecnologias encontradas.
- Funcionalidades já implementadas.
- Funcionalidades que precisam ser desenvolvidas.
- Problemas identificados.
- Plano de execução.

Depois, prossiga com o desenvolvimento em etapas, verificando o funcionamento de cada parte antes de avançar.

Não se limite a criar uma interface visual estática. O objetivo é entregar uma aplicação funcional, com frontend e backend integrados, mantendo a estrutura original dos projetos.

**RESULTADO ESPERADO:** Um Cardápio Digital Interativo moderno, intuitivo, responsivo e funcional, que permita ao cliente navegar pelos produtos, personalizar escolhas, adicionar observações, montar seu carrinho e confirmar pedidos de maneira simples e eficiente.