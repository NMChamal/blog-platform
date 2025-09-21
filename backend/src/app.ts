import "./container";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { container } from "tsyringe";
import { Database } from "./infrastructure/database";
import { Logger } from "./infrastructure/logger";
import { swaggerSpec } from "./infrastructure/swagger";
import errorHandler from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";

import routes from "./routes";
import uploadRoutes from "./routes/upload.routes";

dotenv.config({ path: './backend/.env' });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/uploads', express.static('public/uploads'));

const logger = container.resolve(Logger);
const database = container.resolve(Database);

const startServer = async () => {
  await database.connect();

  app.use("/api", routes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/", (req, res) => {
    res.send("Blog Platform API");
  });

  app.use(errorHandler);

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`API docs available at http://localhost:${port}/api-docs`);
  });
};

startServer();