import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { once } from "node:events";
import { createApp } from "../src/app.js";
import { closeDatabase, createDatabase } from "../src/database.js";

describe("API de cardápio e pedidos", () => {
  let database;
  let server;
  let baseUrl;

  beforeEach(async () => {
    database = createDatabase(":memory:");
    server = createApp(database).listen(0, "127.0.0.1");
    await once(server, "listening");
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterEach(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    closeDatabase(database);
  });

  it("retorna o cardápio com os produtos e o estoque persistido", async () => {
    const response = await fetch(`${baseUrl}/api/menu`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.products.length, 15);
    assert.equal(body.products[0].id, "comb-omakase-24");
    assert.equal(body.products[0].price, 118.9);
  });

  it("registra pedido, calcula valores no servidor e reduz estoque atomicamente", async () => {
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: "Ana Costa",
        fulfillment: "delivery",
        street: "Rua Japão",
        number: "120",
        neighborhood: "Liberdade",
        paymentMethod: "cash",
        cashAmount: "100",
        items: [{ productId: "temaki-salmao-completo", quantity: 2 }],
      }),
    });
    const order = await response.json();

    assert.equal(response.status, 201);
    assert.match(order.orderNumber, /^KS-\d{4}$/);
    assert.equal(order.subtotal, 69.8);
    assert.equal(order.deliveryFee, 12);
    assert.equal(order.total, 81.8);
    assert.equal(order.cashChange, 18.2);
    assert.equal(order.items[0].product.stock, 10);

    const menuResponse = await fetch(`${baseUrl}/api/menu`);
    const menu = await menuResponse.json();
    const temaki = menu.products.find((product) => product.id === "temaki-salmao-completo");
    assert.equal(temaki.stock, 10);
  });

  it("rejeita pedido acima do estoque sem criar pedido parcial", async () => {
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: "Ana Costa",
        fulfillment: "pickup",
        paymentMethod: "pix",
        items: [{ productId: "temaki-salmao-completo", quantity: 99 }],
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 409);
    assert.equal(body.error.code, "INSUFFICIENT_STOCK");
    assert.equal(database.prepare("SELECT COUNT(*) AS count FROM orders").get().count, 0);
    assert.equal(
      database.prepare("SELECT stock FROM products WHERE id = ?").get("temaki-salmao-completo").stock,
      12,
    );
  });

  it("rejeita entrega sem endereço e valor em dinheiro abaixo do total", async () => {
    const missingAddress = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: "Ana Costa",
        fulfillment: "delivery",
        paymentMethod: "pix",
        items: [{ productId: "temaki-salmao-completo", quantity: 1 }],
      }),
    });
    assert.equal(missingAddress.status, 400);

    const insufficientCash = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: "Ana Costa",
        fulfillment: "pickup",
        paymentMethod: "cash",
        cashAmount: "10",
        items: [{ productId: "temaki-salmao-completo", quantity: 1 }],
      }),
    });
    assert.equal(insufficientCash.status, 400);
    assert.equal(database.prepare("SELECT COUNT(*) AS count FROM orders").get().count, 0);
  });
});
