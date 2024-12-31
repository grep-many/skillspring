const Course = require('../../models/Course');
const StudentCourses = require('../../models/StudentCourses')

const getAllStudentViewCourses = async (req, res) => {
    try {

        const {
            category = [],
            level = [],
            primaryLanguage = [],
            sortBy = ''
        } = req.query

        let filters = {};
        if (category.length > 0) {
            filters.category = { $in: category.split(',') };
        }
        if (level.length > 0) {
            filters.level = { $in: level.split(',') };
        }
        if (primaryLanguage.length > 0) {
            filters.primaryLanguage = { $in: primaryLanguage.split(',') };
        }

        let sort = {};

        switch (sortBy) {
            case 'price-lowtohigh':
                sort.pricing = 1

                break;
            case 'price-hightolow':
                sort.pricing = -1

                break;
            case 'title-atoz':
                sort.title = 1

                break;
            case 'title-ztoa':
                sort.title = -1

                break;

            default:
                sort = {};
                break;
        }

        const coursesList = sort ? await Course.find(filters).sort(sort) : await Course.find(filters);

        return res.status(200).json({
            success: true,
            data: coursesList,
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
        console.log(err)
    }
}

const getStudentViewDetails = async (req, res) => {
    try {

        const { id } = req.params;
        const courseDetails = await Course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'No Course Details Found',
                data: null,
            })
        }

        return res.status(200).json({
            success: true,
            data: courseDetails,
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
        console.log(err)
    }
}

const checkCoursePurchaseInfo = async(req,res)=>{
    
    try {
        const { id, studentId } = req.params;
        const studentCourses = await StudentCourses.findOne({
          userId: studentId,
        });
    
        const ifStudentAlreadyBoughtCurrentCourse =
          studentCourses?.courses.findIndex((item) => item.courseId === id) > -1;
        res.status(200).json({
          success: true,
          data: ifStudentAlreadyBoughtCurrentCourse,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Some error occured!",
        });
      }
}

module.exports = {
    getAllStudentViewCourses,
    getStudentViewDetails,
    checkCoursePurchaseInfo,
}