import mongoose from "mongoose";

const unionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  avatar: String,
  bio: String,
  // 这个工会的成立者
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // 这个工会拥有的成员
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // 这个工会已签署协议的IP
  signedIPs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IP",
    },
  ],
  // 这个工会有意向的IP
  inclinedIPs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IP",
    },
  ],
  // 这个工会参与创建的二创
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

const Union = mongoose.models.Union || mongoose.model("Union", unionSchema);

export default Union;
