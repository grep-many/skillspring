const Course = require('../../models/Course');

const addNewCourse = async (req, res) => {
    try {

        const courseData = req.body;
        const newlyCreatedCourse = new Course(courseData);
        const saveCourse = await newlyCreatedCourse.save();

        if (saveCourse) {
            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: saveCourse
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }
}

const getAllCourses = async (req, res) => {
    try {
        const { id } = req.body;
        const courseList = await Course.find({ instructorId: id });

        res.status(200).json({
            success: true,
            data: courseList,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }
}

const getCourseDetailsById = async (req, res) => {
    try {
        // add a instructorauth for instructor
        const { id } = req.params;

        const courseDetails = await Course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Course Not Found',
            })
        }

        res.status(200).json({
            success: true,
            data: courseDetails
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }
}

const updateCourseById = async (req, res) => {
    try {
        // add a instructorauth for instructor
        const { id } = req.params;
        const updatedCourseData = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course Not Found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Course Updated SuccessFully',
            data: updatedCourse
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }
}

module.exports = {
    addNewCourse,
    getAllCourses,
    getCourseDetailsById,
    updateCourseById
}