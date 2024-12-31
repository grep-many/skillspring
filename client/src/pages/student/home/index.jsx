import homeImage from '@/assets/homePageMainImage.png'
import { Button } from '@/components/ui/button';
import { courseCategories } from '@/config';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context';
import { fetchStudentViewCourseListService } from '@/services';
import React, { useContext, useEffect } from 'react';

const StudentHomePage = () => {

    const {
        studentViewCoursesList,
        setStudentViewCoursesList,
        handleCourseNavigate,
    } = useContext(StudentContext);
    const {navigate} = useContext(AuthContext)

    async function fetchAllStudentViewCourses() {
        try {
            const response = await fetchStudentViewCourseListService();

            if (response?.success) {
                setStudentViewCoursesList(response?.data);
            } else {
                alert('Something went wrong while fetching courses');
            }
        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        fetchAllStudentViewCourses()
    }, [])

    return (
        <div className='min-h-screen bg-white'>
            <section className="flex flex-col lg:flex-row items-center justify-center py-8 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
                    <h1 className="text-5xl font-bold mb-4">Learning that gets you </h1>
                    <p className="text-xl">Skills for your present and your future. Get started with us</p>
                </div>
                <div className="lg:w-1/2 mb-8 lg:mb-0 flex justify-center">
                    <img src={homeImage} alt="" className="max-w-full" />
                </div>
            </section>
            <section className='py-8 px-4 lg:px-8 bg-gray-100'>
                <h2 className='text-2xl font-bold mb-6'>Course Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {
                        courseCategories.map(categoryItem =>
                            <Button className='justify-start' variant='outline' key={categoryItem.id} onClick={()=>navigate(`/student/courses?category=${categoryItem.id}`)}>
                                {categoryItem.label}
                            </Button>
                        )
                    }
                </div>
            </section>
            <section className="py-12 px-4 lg:px-8">
                <h2 className='text-2xl font-bold mb-6'>Featured Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        studentViewCoursesList && studentViewCoursesList.length > 0 ?
                            studentViewCoursesList.map(courseItem =>
                                <div className="border rounded-lg overflow-hidden shadow cursor-pointer" key={courseItem.instructorName+courseItem.date} onClick={()=>handleCourseNavigate(courseItem)}>
                                    <img
                                        src={courseItem?.image}
                                        width={300} height={150}
                                        className='w-full h-40 object-cover'
                                    />
                                    <div className="p-4">
                                        <p className="font-bold mb-2">
                                            {courseItem?.title}
                                        </p>
                                        <p className='text-sm text-gray-700 mb-2'>
                                            {courseItem?.instructorName}
                                        </p>
                                        <p className='font-bold text-[16px]'>
                                            ${courseItem?.pricing}
                                        </p>
                                    </div>
                                </div>
                            ) : <h1>No Courses Found</h1>
                    }
                </div>

            </section>
        </div>
    );
}

export default StudentHomePage;
