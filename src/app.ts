import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { connect } from "../src/utils/connect.db";
import path from "path";
import cookieParser from "cookie-parser";

import { Request, Response, NextFunction } from "express";
import { HttpError } from "./models/CustomError";
import dotenv from "dotenv";
dotenv.config();
//app instance
const app = express();

//connect to DB
connect();

//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "uploads")));

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
