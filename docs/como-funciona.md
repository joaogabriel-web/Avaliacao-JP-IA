# Como o projeto funciona

O projeto está dividido em duas aplicações independentes:

```text
Navegador -> Frontend (menu e carrinho com dados demonstrativos)

Backend Express -> PostgreSQL (cadastro de pessoas)
```

No estado atual, o frontend **não consome a API do backend**. Eles podem ser iniciados separadamente; iniciar um não inicia o outro.

## Frontend

O frontend fica em `frontend/` e usa React, TypeScript, TanStack Start e Vite. Ele apresenta o cardápio e gerencia a interação do cliente no navegador.

- Os produtos e categorias vêm de `src/data/menu.ts` e são dados demonstrativos.
- `src/hooks/use-cart.ts` mantém o estado do carrinho na interface.
- `src/services/menu-service.ts` contém funções locais para filtros, preços, validação do checkout e cálculo de totais.
- O pedido confirmado é demonstrativo: não é enviado ao backend nem persistido.

Para iniciar:

```powershell
cd frontend
npm install
npm run dev
```

Abra o endereço que o Vite mostrar no terminal. Em geral, é `http://localhost:5173`; se essa porta estiver ocupada, o Vite pode selecionar outra. Para executar os testes do frontend:

```powershell
npm test
```

## Backend

O backend fica em `backend/` e usa Node.js, Express e Sequelize. `index.js` conecta ao banco, sincroniza o modelo e, quando essa etapa termina, inicia a API na porta `3000`. As rotas são montadas sob o prefixo `/api`.

Atualmente, a API gerencia registros de pessoas (`id`, `nome` e `idade`), não os produtos ou pedidos do cardápio:

| Método | Rota | Função |
| --- | --- | --- |
| `GET` | `/api/buscar` | Lista as pessoas |
| `GET` | `/api/buscarUm/:id` | Busca uma pessoa pelo ID |
| `POST` | `/api/criar` | Cria uma pessoa; recebe `{ "nome": "...", "idade": 30 }` |
| `PUT` | `/api/alterar/:id` | Altera o nome; recebe `{ "nome": "..." }` |
| `DELETE` | `/api/deletar/:id` | Exclui uma pessoa |

**Limitação conhecida:** embora a rota de busca por ID esteja definida, a implementação atual chama `Pessoa.BuscarUm`, método que não existe no modelo Sequelize. Portanto, essa operação precisa ser corrigida antes de ser considerada funcional.

Para iniciar:

```powershell
cd backend
npm install
npm run dev
```

O backend depende do PostgreSQL configurado em `src/config/database.js` e de uma conexão disponível. As credenciais do banco não devem ser incluídas na documentação nem compartilhadas; antes de publicar ou implantar o projeto, configure-as por variáveis de ambiente e substitua credenciais que tenham sido expostas no código.

## Executar as duas partes

Abra dois terminais, um em `frontend/` e outro em `backend/`, e execute os comandos de inicialização de cada seção. O frontend fica no endereço informado pelo Vite; a API fica em `http://localhost:3000`.

Para que o cardápio use dados reais, ainda é necessário criar endpoints de produtos e pedidos no backend e implementar a comunicação do frontend com esses endpoints. A API atual de pessoas não fornece esses dados.
