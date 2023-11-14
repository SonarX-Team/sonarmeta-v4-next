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
  externalLink: String,
  // 向该Creation的TBA发出授权申请的列表（待审核列表）
  inclinedComponents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creation",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Creation = mongoose.models.Creation || mongoose.model("Creation", creationSchema);

export default Creation;
