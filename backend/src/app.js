import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export default createApp;
