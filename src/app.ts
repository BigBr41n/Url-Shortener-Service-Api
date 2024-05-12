import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

//app instance
const app = express();

//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//pass the app to the router function
router(app);

export default app;
