import mongoose from "mongoose";

const adaptationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: String,
  // 这个二创所发布平台的网络链接
  url: {
    type: [String],
    required: true,
    minlength: 1,
  },
  images: [String], // 这个二创的预览图片
  // 参与这个二创的作者们
  creators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // 参与这个二创的工会
  unions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Union",
    },
  ],
  // 这个二创改编自哪些IP
  relatedIPs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IP",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Adaptation = mongoose.models.Adaptation || mongoose.model("Adaptation", adaptationSchema);

export default Adaptation;
