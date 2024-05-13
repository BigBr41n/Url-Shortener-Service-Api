import { Express, NextFunction, Request, Response } from "express";
import { HttpError } from "./models/CustomError";
import authRoutes from "./routes/auth.route";

function routes(app: Express): void {
  app.get("/api/v1/healthCheck", (req: Request, res: Response) =>
    res.status(200).json("Server is On")
  );

  //auth routes
  app.use("/api/v1/auth", authRoutes);
}

export default routes;
