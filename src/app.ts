import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

import { Request, Response, NextFunction } from "express";
import { HttpError } from "./models/CustomError";

//app instance
const app = express();

//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//pass the app to the router function
router(app);

//handel unknown routes and errors
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError("Route Not Found", 404));
});
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code || 500).json({
    message: err.message,
    code: err.code,
  });
});

export default app;
