const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const storySchema = new Schema({
  user_id: String,
  title: String,
  sources: String,
  text: String,
  points: Number
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;