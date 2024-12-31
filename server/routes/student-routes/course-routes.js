const express = require('express');
const { getAllStudentViewCourses, getStudentViewDetails, checkCoursePurchaseInfo } = require('../../controllers/student-controller/course-controller');
const router = express.Router();

router.get('/get',getAllStudentViewCourses);
router.get('/get/details/:id',getStudentViewDetails);
router.get('/purchase-info/:id/:studentId',checkCoursePurchaseInfo);

module.exports = router