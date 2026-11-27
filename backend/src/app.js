import express from "express";
import { ApiError } from "./errors.js";
import { createOrder, listMenu } from "./orders.js";

export function createApp(database) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.get("/api/menu", (_request, response) => {
    response.json({ products: listMenu(database) });
  });

  app.post("/api/orders", (request, response) => {
    response.status(201).json(createOrder(database, request.body));
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "NOT_FOUND", message: "Rota não encontrada." },
    });
  });

  app.use((error, _request, response, _next) => {
    if (error instanceof ApiError) {
      response.status(error.status).json({
        error: { code: error.code, message: error.message },
      });
      return;
    }
    if (error?.type === "entity.parse.failed") {
      response.status(400).json({
        error: { code: "INVALID_JSON", message: "O corpo da requisição não contém JSON válido." },
      });
      return;
    }
    if (error?.type === "entity.too.large") {
      response.status(413).json({
        error: { code: "PAYLOAD_TOO_LARGE", message: "O pedido enviado é muito grande." },
      });
      return;
    }

    console.error(error);
    response.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Erro interno ao processar a requisição." },
    });
  });

  return app;
}
