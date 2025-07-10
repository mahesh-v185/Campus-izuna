const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: String,
  bio: String,
  stats: {
    posts: Number,
    followers: Number,
    following: Number,
  },
  followerIds: [String],
  followingIds: [String],
  skills: [String],
  achievements: [String],
  uucms: String,
  classroomId: String,
  coins: Number,
  personalNumber: String,
});

module.exports = mongoose.model('User', userSchema);