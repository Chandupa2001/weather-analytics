import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  return app;
}

export default createApp;
