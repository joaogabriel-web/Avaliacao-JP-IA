import { createApp } from "./src/app.js";
import { closeDatabase, createDatabase } from "./src/database.js";

const database = createDatabase();
const app = createApp(database);
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";
const server = app.listen(port, host, () => {
  console.log(`API disponível em http://${host}:${port}`);
});

function shutdown() {
  server.close(() => {
    closeDatabase(database);
    process.exit(0);
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
