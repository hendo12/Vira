const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const storySchema = new Schema({
  ownerID: String,
  links: String,
  description: String,
  points: Number
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;