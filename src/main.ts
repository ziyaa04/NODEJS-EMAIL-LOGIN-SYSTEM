import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as expressLayouts from "express-ejs-layouts";
import { NextFunction, Request, Response } from "express";

async function start() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set("view engine", "ejs");
  app.useStaticAssets(join(__dirname, "..", "public"), {
    prefix: "/public",
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/public")) return res.status(404).end();
    next();
  });

  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.use(cookieParser());
  app.use(expressLayouts);

  // set layouts
  app.use((req: Request, res: Response, next: NextFunction) => {
    app.set("layout", "layouts/home");

    if (req.path.startsWith("/user")) {
      req.app.set("layout", "layouts/user");
    }

    if (req.path.startsWith("/auth")) {
      req.app.set("layout", "layouts/auth");
    }
    return next();
  });

  // set Header
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.set("Cache-control", "no-cache, no-store, must-revalidate");
    next();
  });

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
  });
}

start();
