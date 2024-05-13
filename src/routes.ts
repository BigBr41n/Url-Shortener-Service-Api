import { Express, NextFunction, Request, Response } from "express";

import userRoute from "./routes/user.routes";
import authRoutes from "./routes/auth.route";

function routes(app: Express): void {
  app.get("/api/v1/healthCheck", (req: Request, res: Response) =>
    res.status(200).json("Server is On")
  );

  //auth routes
  app.use("/api/v1/auth", authRoutes);

  //user routes
  app.use("/api/v1/user", userRoute);
}

export default routes;
