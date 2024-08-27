const mongoose = require("mongoose");

// Token schema definition
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: 86400000, // TTL index to automatically delete the document after 1 day (86400000 ms)
    },
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
