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
  // 已经向这IP DAO发出加入请求的用户列表（待审核列表）
  inclinedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // 这IP DAO拥有的成员
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