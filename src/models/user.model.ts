import mongoose, { models, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    activationToken: String,
    activeExpires: Date,
    changePassToken: String,
    changePassExpires: Date,
    company: {
      name: { type: String, required: true },
      professionalEmail: { type: String, required: true },
    },
    shortedUrl: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
      },
    ],
  },
  { timestamps: true }
);

export default models.User || model("User", userSchema);
