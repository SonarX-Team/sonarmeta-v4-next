import mongoose from "mongoose";

const authorizationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creation",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Authorization = mongoose.models.Authorization || mongoose.model("Authorization", authorizationSchema);

export default Authorization;
