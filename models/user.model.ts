import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    minlength: 5,
    maxlength: 16,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: String,
  avatar: String,
  bio: String,
  walletAddresses: [String],
  // 这个用户创建的IP
  IPs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IP",
    },
  ],
  // 这个用户加入的工会
  unions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Union",
    },
  ],
  // 这个用户参与创建的二创
  adaptations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adaptation",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
