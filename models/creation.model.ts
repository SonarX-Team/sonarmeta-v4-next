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
  officialLink: String,
  images: [String], // 这个作品的预览图片
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const Creation = mongoose.models.Creation || mongoose.model("Creation", creationSchema);

export default Creation;
