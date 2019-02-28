const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
  user_id: {type:Schema.Types.ObjectId, ref:"User"},
  links: String,
  comment: String,
  points: Number,
  storyId: {type:Schema.Types.ObjectId, ref:"Story"}
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;