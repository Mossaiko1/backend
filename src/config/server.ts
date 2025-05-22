import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./env";
import { errorMiddleware } from "../middlewares/error.middleware";
import routes from "../routes";

export const createServer = (): Application => {
  const app: Application = express();

  // Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));

  // Routes
  app.use("/api", routes);

  // Error handling
  app.use(errorMiddleware);

  return app;
};
