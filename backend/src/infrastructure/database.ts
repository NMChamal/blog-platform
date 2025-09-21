import { injectable, inject } from "tsyringe";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Logger } from "./logger";

dotenv.config({ path: "./backend/.env" });

@injectable()
export class Database {
  private readonly mongoUri: string;

  constructor(@inject("Logger") private logger: Logger) {
    this.mongoUri = process.env.MONGO_URI || "";

    if (!this.mongoUri) {
      this.logger.error("MONGO_URI is not defined in .env file");
      process.exit(1);
    }
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.info("Connecting to MongoDB...");
      mongoose
        .connect(this.mongoUri)
        .then(() => {
          this.logger.info("MongoDB connected");
          resolve();
        })
        .catch((err) => {
          this.logger.error("MongoDB connection error:", err);
          reject(err);
        });
    });
  }
}
