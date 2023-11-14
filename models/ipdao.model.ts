import mongoose from "mongoose";

const ipDaoSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // 招募说明
  recruitment: {
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
  images: [String], // 这个IP DAO的图片介绍
  externalLink: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // 关注者列表
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // 向该IP DAO发出加入请求的用户列表（待审核列表）
  inclinedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // 该IP DAO拥有的成员
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const IpDao = mongoose.models.IpDao || mongoose.model("IpDao", ipDaoSchema);

export default IpDao;
