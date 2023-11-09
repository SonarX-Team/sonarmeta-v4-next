import mongoose from "mongoose";

// 给Metadata准备的

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creation",
  },
  mintedAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;
