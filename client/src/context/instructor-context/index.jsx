import { createContext, useState } from "react";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {

    const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData)
    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData)
    const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
    const [lectureUploadProgress, setLectureUploadProgress] = useState({});
    const [instructorCoursesList, setInstructorCoursesList] = useState([])
    const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null)


    return (
        <InstructorContext.Provider
            value={{
                courseLandingFormData,
                setCourseLandingFormData,
                courseCurriculumFormData,
                setCourseCurriculumFormData,
                mediaUploadProgress,
                setMediaUploadProgress,
                lectureUploadProgress,
                setLectureUploadProgress,
                instructorCoursesList,
                setInstructorCoursesList,
                currentEditedCourseId,
                setCurrentEditedCourseId,
            }}
        >
            {children}
        </InstructorContext.Provider>
    )
}