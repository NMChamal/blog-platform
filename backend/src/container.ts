import "reflect-metadata";
import { container } from "tsyringe";
import { Database } from "./infrastructure/database";
import { Logger } from "./infrastructure/logger";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";

// Register the logger
container.register<Logger>("Logger", {
  useClass: Logger,
});

// Register the database
container.register<Database>("Database", {
  useClass: Database,
});

// Register services
container.register<AuthService>("AuthService", {
    useClass: AuthService,
});
container.register<UserService>("UserService", {
    useClass: UserService,
});