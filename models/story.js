const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const storySchema = new Schema({
  user_id: {type:Schema.Types.ObjectId, ref:"User"},
  title: String,
  description: String,
  sources: String,
  image: String, 
  points: Number,
  commentId: {type:Schema.Types.ObjectId, ref:"Comment"}

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;