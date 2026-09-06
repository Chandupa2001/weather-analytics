import { createApp } from "./app.js";
import { env } from "./config/env.js";

async function start() {

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Weather Analytics backend listening on http://localhost:${env.port}`);
  });
}

start();
