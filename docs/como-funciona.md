# Como o projeto funciona

O projeto reúne o frontend do cardápio e uma API local para produtos e pedidos:

```text
Navegador -> Frontend React/Vite -> API Express -> SQLite local
```

Inicie frontend e backend em terminais separados. O proxy de desenvolvimento encaminha as
requisições `/api` do frontend para `http://127.0.0.1:3000`.

## Backend

O backend fica em `backend/`, usa Node.js, Express e SQLite e requer Node.js 20 ou superior.
Para instalar e iniciar:

```powershell
cd backend
npm install
npm run dev
```

O banco é criado em `backend/data/menu.sqlite` na primeira inicialização e recebe o cardápio
inicial. Esse diretório é ignorado pelo Git para que pedidos e estoque locais não sejam
publicados. Defina `DATABASE_PATH` para usar outro arquivo de banco.

| Método | Rota | Função |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica a disponibilidade da API |
| `GET` | `/api/menu` | Lista os produtos e o estoque atual |
| `POST` | `/api/orders` | Valida e registra um pedido, atualizando o estoque atomicamente |

O backend calcula os totais com base nos preços do banco e valida a disponibilidade do estoque.
As formas de pagamento são registradas apenas como escolha do cliente: nenhum pagamento é
processado e os pedidos não são transmitidos a um restaurante.

Execute os testes do backend com `npm test` dentro de `backend/`.

## Frontend

O frontend fica em `frontend/` e usa React, TypeScript, TanStack Start e Vite. Inicie-o em outro
terminal:

```powershell
cd frontend
npm install
npm run dev
```

O cardápio é carregado por `GET /api/menu`. O carrinho permanece no armazenamento local do
navegador. O checkout envia os dados do pedido para `POST /api/orders`; o servidor recalcula os
valores e reduz o estoque em uma transação SQLite. A confirmação informa que o pedido foi salvo
localmente, mas não enviado ao restaurante, e que nenhum pagamento foi processado.

Execute os testes do frontend com `npm test` e gere a versão de produção com `npm run build`,
ambos dentro de `frontend/`.
