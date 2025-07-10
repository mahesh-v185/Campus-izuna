
const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableSlotSchema = new Schema({
  day: String,
  startTime: String,
  endTime: String,
  subjectId: String,
  facultyId: String,
}, {_id: false});

const classroomSchema = new Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  department: String,
  semester: Number,
  course: String,
  coordinatorId: String,
  studentIds: [String],
  subjectIds: [String],
  timetable: [timetableSlotSchema],
});

module.exports = mongoose.model('Classroom', classroomSchema);
