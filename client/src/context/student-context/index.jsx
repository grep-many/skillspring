import { createContext, useContext, useState } from "react";
import { AuthContext } from "../auth-context";
import { checkCoursePurchaseInfoService } from "@/services";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {

    const { navigate, auth } = useContext(AuthContext);

    const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
    const [studentViewCoursesDetails, setStudentViewCoursesDetails] = useState(null)
    const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
    const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
    const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({})

    async function handleCourseNavigate(getCurrentCourse) {
        try {
            const response = await checkCoursePurchaseInfoService(getCurrentCourse?._id, auth?.user?._id);

            if (response?.success) {
                if (response?.data) {
                    if (auth?.user?.role === 'instructor') {
                        navigate(`/instructor/course-progress/${getCurrentCourse?._id}`)
                    }else{
                        navigate(`/student/course-progress/${getCurrentCourse?._id}`)
                    }
                    
                } else {
                    if(getCurrentCourse?.instructorId===auth?.user?._id){
                        navigate(`/instructor/course-progress/${getCurrentCourse?._id}`)
                    }else{
                        if (auth?.user?.role === 'instructor') {
                            navigate(`/instructor/details/${getCurrentCourse?._id}`)
                        }else{
                            navigate(`/student/course/details/${getCurrentCourse?._id}`)
                        }
                    }

                }
            }

        } catch (err) {
            alert(err)
        }
    }

    return (
        <StudentContext.Provider
            value={{
                studentViewCoursesList,
                setStudentViewCoursesList,
                studentViewCoursesDetails,
                setStudentViewCoursesDetails,
                currentCourseDetailsId,
                setCurrentCourseDetailsId,
                studentBoughtCoursesList,
                setStudentBoughtCoursesList,
                handleCourseNavigate,
                studentCurrentCourseProgress,
                setStudentCurrentCourseProgress,
            }}
        >
            {children}
        </StudentContext.Provider>
    )
}