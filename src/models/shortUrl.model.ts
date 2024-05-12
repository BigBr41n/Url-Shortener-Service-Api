import mongoose, { models, model, Schema } from "mongoose";

const shortedUrlSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalUrl: {
      type: String,
      required: true,
    },
    ShortedUrl: {
      type: String,
      required: true,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    referer: {
      type: String,
      required: false,
    },
    regions: [
      {
        name: { type: String, required: true },
        clicks: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default models.User || model("Url", shortedUrlSchema);
