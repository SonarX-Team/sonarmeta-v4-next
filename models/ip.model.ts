import mongoose from "mongoose";

const IPSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
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
  images: [String], // 这个IP的预览图片
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // 关注者列表
  subscribers: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
    }
  ],
  // 已经向这个IP发出孵化请求的工会列表（待审核列表）
  inclinedUnions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IP",
    },
  ],
  // 和这个IP签署了协议的工会
  unions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Union",
    },
  ],
  // 围绕这个IP做的二创
  adaptations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adaptation",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const IP = mongoose.models.IP || mongoose.model("IP", IPSchema);

export default IP;
