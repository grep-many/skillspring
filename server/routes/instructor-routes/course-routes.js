const express = require('express');
const { addNewCourse, getAllCourses, getCourseDetailsById, updateCourseById } = require('../../controllers/instructor-controller/course-controller');


const router = express.Router();

router.post('/add',addNewCourse);
router.post('/get',getAllCourses);
router.get('/get/details/:id',getCourseDetailsById);
router.put('/update/:id',updateCourseById);

module.exports = router;
