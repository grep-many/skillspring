const mongoose = require('mongoose');

const LectureProgress = new mongoose.Schema({
    lectureId: String,
    viewed: Boolean,
    dateViewed: Date,
})

const CourseProgressSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    completed: Boolean,
    completionDate: Date,
    lecturesProgress: [LectureProgress]
})

module.exports = mongoose.model.Progress || mongoose.model('Progress',CourseProgressSchema)