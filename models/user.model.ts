import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  bio: String,
  avatar: String,
  email: String,
  telegram: String,
  twitter: String,
  discord: String,
  // 这个用户关注的别人
  follows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // 这个用户的粉丝
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
