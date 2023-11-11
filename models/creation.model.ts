import mongoose from "mongoose";

const creationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tokenId: {
    type: Number,
    required: true,
  },
  // 授权协议
  agreement: {
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
  externalLink: String,
  images: [String], // 这个作品的预览图片
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Creation = mongoose.models.Creation || mongoose.model("Creation", creationSchema);

export default Creation;
