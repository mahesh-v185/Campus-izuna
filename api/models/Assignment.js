
const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
  id: { type: String, unique: true, required: true },
  classroomId: String,
  subjectId: String,
  facultyId: String,
  title: String,
  description: String,
  assignedDate: String,
  submissionDate: String,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
