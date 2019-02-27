// models/user.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String, 
  points: Number,
  avatarURL: {
    type: String, default: '/images/defaultUser.jpeg'
  },
  stories: Array,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
