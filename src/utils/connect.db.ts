import mongoose from "mongoose";
import logger from "../utils/logger";

export const connect = () => {
  mongoose.connect(process.env.DB_URI!);
  const connection = mongoose.connection;
  connection.once("open", () => {
    logger.info("DATABASE connection established");
  });
  connection.on("error", (error) => {
    logger.error(error);
  });
};
