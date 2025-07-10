
const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model('Subject', subjectSchema);
