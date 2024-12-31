const express = require('express')
const { getCurrentCourseProgress, resetCurrentCourseProgress, markCurrentLectureAsViewed } = require('../../controllers/student-controller/course-progress-controller');

const router = express.Router();

router.get('/get/:userId/:courseId',getCurrentCourseProgress);
router.post('/mark-lecture-viewed',markCurrentLectureAsViewed);
router.post('/reset-progress',resetCurrentCourseProgress);

module.exports = router