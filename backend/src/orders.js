import { randomInt } from "node:crypto";
import { ApiError } from "./errors.js";

const DELIVERY_FEE_CENTS = 1200;
const DISCOUNT_THRESHOLD_CENTS = 15000;
const DISCOUNT_RATE = 0.1;

const findProduct = (database, id) =>
  database
    .prepare(
      `SELECT id, name, short_description, full_description, price_cents,
              category_id, image_key, image_alt, stock, pieces
       FROM products WHERE id = ?`,
    )
    .get(id);

function record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value, label, { required = false, max = 200 } = {}) {
  if (value === undefined || value === null) {
    if (required) throw new ApiError(400, "INVALID_ORDER", `${label} é obrigatório.`);
    return "";
  }
  if (typeof value !== "string") {
    throw new ApiError(400, "INVALID_ORDER", `${label} deve ser texto.`);
  }

  const result = value.trim();
  if (required && result.length < 2) {
    throw new ApiError(400, "INVALID_ORDER", `${label} deve ter pelo menos 2 caracteres.`);
  }
  if (result.length > max) {
    throw new ApiError(400, "INVALID_ORDER", `${label} excede o limite de ${max} caracteres.`);
  }
  return result;
}

function cashAmountToCents(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d+(?:[.,]\d{1,2})?$/.test(value.trim())) {
    throw new ApiError(400, "INVALID_CASH_AMOUNT", "Informe um valor em dinheiro válido.");
  }
  const [whole, fraction = ""] = value.trim().replace(",", ".").split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

function orderLines(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 30) {
    throw new ApiError(400, "INVALID_ORDER", "O pedido deve conter de 1 a 30 produtos.");
  }

  const quantities = new Map();
  for (const item of value) {
    if (!record(item) || typeof item.productId !== "string" ||
        !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new ApiError(400, "INVALID_ORDER", "Cada item precisa de produto e quantidade válida.");
    }

    const quantity = (quantities.get(item.productId) ?? 0) + item.quantity;
    if (quantity > 99) {
      throw new ApiError(400, "INVALID_ORDER", "A quantidade por produto não pode passar de 99.");
    }
    quantities.set(item.productId, quantity);
  }

  return [...quantities].map(([productId, quantity]) => ({ productId, quantity }));
}

function toProduct(row, stock = row.stock) {
  return {
    id: row.id,
    name: row.name,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    price: row.price_cents / 100,
    categoryId: row.category_id,
    imageKey: row.image_key,
    imageAlt: row.image_alt,
    stock,
    ...(row.pieces ? { pieces: row.pieces } : {}),
  };
}

function generateOrderNumber(database) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const number = `KS-${randomInt(1000, 10000)}`;
    if (!database.prepare("SELECT 1 FROM orders WHERE order_number = ?").get(number)) {
      return number;
    }
  }
  throw new ApiError(503, "ORDER_NUMBER_UNAVAILABLE", "Não foi possível gerar o número do pedido.");
}

export function createOrder(database, input) {
  if (!record(input)) {
    throw new ApiError(400, "INVALID_ORDER", "O corpo do pedido deve ser um objeto.");
  }

  const customerName = text(input.customerName, "Nome do cliente", { required: true, max: 100 });
  const fulfillment = input.fulfillment;
  if (fulfillment !== "pickup" && fulfillment !== "delivery") {
    throw new ApiError(400, "INVALID_ORDER", "Tipo de atendimento inválido.");
  }

  const street = text(input.street, "Rua", { required: fulfillment === "delivery", max: 120 });
  const addressNumber = text(input.number, "Número", { required: fulfillment === "delivery", max: 30 });
  const neighborhood = text(input.neighborhood, "Bairro", {
    required: fulfillment === "delivery",
    max: 100,
  });
  const complement = text(input.complement, "Complemento", { max: 120 });
  const notes = text(input.notes, "Observações", { max: 500 });
  const paymentMethod = input.paymentMethod;
  if (!["pix", "cash", "credit", "debit"].includes(paymentMethod)) {
    throw new ApiError(400, "INVALID_ORDER", "Forma de pagamento inválida.");
  }

  const lines = orderLines(input.items);
  const cashPaidCents = paymentMethod === "cash" ? cashAmountToCents(input.cashAmount) : null;
  const result = database.transaction(() => {
    const pricedLines = lines.map((line) => {
      const product = findProduct(database, line.productId);
      if (!product) {
        throw new ApiError(400, "UNKNOWN_PRODUCT", "O pedido contém um produto desconhecido.");
      }
      if (product.stock < line.quantity) {
        throw new ApiError(
          409,
          "INSUFFICIENT_STOCK",
          `${product.name} não possui estoque suficiente.`,
        );
      }
      return { ...line, product };
    });

    const subtotalCents = pricedLines.reduce(
      (sum, line) => sum + line.product.price_cents * line.quantity,
      0,
    );
    const deliveryFeeCents = fulfillment === "delivery" ? DELIVERY_FEE_CENTS : 0;
    const discountCents =
      subtotalCents >= DISCOUNT_THRESHOLD_CENTS
        ? Math.round(subtotalCents * DISCOUNT_RATE)
        : 0;
    const totalCents = subtotalCents + deliveryFeeCents - discountCents;

    if (cashPaidCents !== null && cashPaidCents < totalCents) {
      throw new ApiError(400, "INSUFFICIENT_CASH", "O valor informado é menor que o total do pedido.");
    }

    const orderNumber = generateOrderNumber(database);
    const createdAt = new Date().toISOString();
    const insertOrder = database.prepare(`
      INSERT INTO orders (
        order_number, created_at, customer_name, fulfillment, street, address_number,
        neighborhood, complement, notes, payment_method, cash_paid_cents,
        subtotal_cents, delivery_fee_cents, discount_cents, total_cents
      ) VALUES (
        @orderNumber, @createdAt, @customerName, @fulfillment, @street, @addressNumber,
        @neighborhood, @complement, @notes, @paymentMethod, @cashPaidCents,
        @subtotalCents, @deliveryFeeCents, @discountCents, @totalCents
      )
    `);
    const orderId = Number(
      insertOrder.run({
        orderNumber,
        createdAt,
        customerName,
        fulfillment,
        street: fulfillment === "delivery" ? street : null,
        addressNumber: fulfillment === "delivery" ? addressNumber : null,
        neighborhood: fulfillment === "delivery" ? neighborhood : null,
        complement: fulfillment === "delivery" ? complement || null : null,
        notes: notes || null,
        paymentMethod,
        cashPaidCents,
        subtotalCents,
        deliveryFeeCents,
        discountCents,
        totalCents,
      }).lastInsertRowid,
    );
    const insertItem = database.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);
    const reduceStock = database.prepare(
      "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
    );

    const items = pricedLines.map((line) => {
      insertItem.run(
        orderId,
        line.product.id,
        line.product.name,
        line.product.price_cents,
        line.quantity,
      );
      const update = reduceStock.run(line.quantity, line.product.id, line.quantity);
      if (update.changes !== 1) {
        throw new ApiError(409, "INSUFFICIENT_STOCK", `${line.product.name} está sem estoque.`);
      }
      return {
        product: toProduct(line.product, line.product.stock - line.quantity),
        quantity: line.quantity,
      };
    });

    const addressSummary = [street, addressNumber, neighborhood, complement]
      .filter(Boolean)
      .join(", ");
    return {
      orderNumber,
      createdAt,
      customerName,
      fulfillment,
      ...(fulfillment === "delivery" ? { addressSummary } : {}),
      ...(notes ? { notes } : {}),
      paymentMethod,
      ...(cashPaidCents !== null
        ? { cashPaid: cashPaidCents / 100, cashChange: (cashPaidCents - totalCents) / 100 }
        : {}),
      items,
      subtotal: subtotalCents / 100,
      deliveryFee: deliveryFeeCents / 100,
      discount: discountCents / 100,
      total: totalCents / 100,
    };
  });

  return result();
}

export function listMenu(database) {
  return database
    .prepare("SELECT * FROM products ORDER BY sort_order")
    .all()
    .map((row) => toProduct(row));
}
