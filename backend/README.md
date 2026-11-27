# Backend do cardápio

API local de cardápio e pedidos, construída com Express e SQLite. Requer Node.js 20 ou
superior.

```powershell
npm install
npm run dev
```

O servidor inicia em `http://127.0.0.1:3000`. Os dados ficam em `backend/data/menu.sqlite`;
use `DATABASE_PATH` para escolher outro arquivo. O frontend encaminha `/api` para essa API
durante o desenvolvimento.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica se a API está disponível |
| `GET` | `/api/menu` | Lista produtos e estoque |
| `POST` | `/api/orders` | Registra um pedido e atualiza o estoque em uma transação |

O servidor calcula preços, descontos, taxa de entrega e troco; não confia nos totais enviados
pelo navegador. As formas de pagamento são apenas registradas: nenhum pagamento real é
processado e os pedidos não são enviados a um restaurante.

Execute os testes com `npm test`.
