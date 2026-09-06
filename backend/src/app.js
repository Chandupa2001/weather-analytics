import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/healthRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import cacheRoutes from "./routes/cacheRoutes.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  // Public
  app.use("/api/health", healthRoutes);

  // Protected (Auth0 access token required)
  app.use("/api/weather", weatherRoutes);
  app.use("/api/cache", cacheRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export default createApp;
