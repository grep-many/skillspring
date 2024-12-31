import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context';
import { fetchStudentBoughtCoursesService } from '@/services';
import { Watch } from 'lucide-react';
import React, { useContext, useEffect } from 'react';

const StudentCoursesPage = () => {

    const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
    const { auth, navigate, setProgress } = useContext(AuthContext);

    async function fetchStudentBoughtCourses() {
        setProgress(30);
        try {
            const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
            if (response?.success) {
                setStudentBoughtCoursesList(response?.data);
            }

        } catch (err) {
            alert(err)
        } finally {
            setProgress(100);
        }
    }

    const handleNavigate=(item)=>{
        const courseId = item.courseId;
        if(location.pathname.includes('student')){
            navigate(`/student/course-progress/${courseId}`)
        }else{
            navigate(`/instructor/course-progress/${courseId}`)
        }
    }

    useEffect(() => {
        fetchStudentBoughtCourses();
    }, [auth])

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-8">My Courses</h1>
            <div className="flex flex-wrap gap-5 justify-center">
                {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                    studentBoughtCoursesList.map((course) => (
                        <Card key={course._id} className="flex flex-col w-[300px]">
                            <CardContent className="p-4 flex-grow">
                                <img
                                    src={course?.courseImage}
                                    alt={course?.title}
                                    className="h-52 w-full object-cover rounded-md mb-4"
                                />
                                <h3 className="font-bold mb-1">{course?.title}</h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    {course?.instructorName}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() =>{
                                        handleNavigate(course)
                                    }
                                    }
                                    className="flex-1"
                                >
                                    <Watch className="mr-2 h-4 w-4" />
                                    Start Watching
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <h1 className="text-3xl font-bold">No Courses found</h1>
                )}
            </div>
        </div>
    );
}

export default StudentCoursesPage;
