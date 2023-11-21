import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  creation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creation",
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;
