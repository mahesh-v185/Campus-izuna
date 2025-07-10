const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  id: { type: String, unique: true, required: true },
  author: { type: Object, required: true }, // Simple for now, can be ref: 'User' later
  mediaUrl: String,
  mediaType: String, // 'image' or 'video'
  thumbnailUrl: String, // For video previews
  caption: String,
  likes: Number,
  comments: Number,
  timestamp: String,
  isNotice: Boolean,
});

module.exports = mongoose.model('Post', postSchema);