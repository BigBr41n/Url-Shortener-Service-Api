import mongoose, { models, model, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    professionalEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hasAnAccount: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.User || model("Admin", adminSchema);
