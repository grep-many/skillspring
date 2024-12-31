import React, { useContext, useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { StudentContext } from '@/context/student-context';

const CourseList = ({ isLoading, courseList }) => {

    const {
        handleCourseNavigate,
    } = useContext(StudentContext);


    return (
        <div className="space-y-4">
            {isLoading ? (
                // Skeleton loader for a better UX during isLoading
                Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray -200 h-32 ,. rounded-md animate-pulse"
                    />
                ))
            ) : courseList && courseList.length > 0 ? (
                courseList.map(courseItem => (
                    <Card className="cursor-pointer" key={courseItem?._id} onClick={() => handleCourseNavigate(courseItem)}>
                        <CardContent className="flex flex-col items-center md:items-none lg:flex-row gap-4 p-4">
                            <div className="w-48 h-32 flex-shrink-0">
                                <img
                                    src={courseItem?.image}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-2">
                                    {courseItem?.title}
                                </CardTitle>
                                <p className="text-sm text-gray-600 mb-1">
                                    Created By <span className="font-bold">{courseItem?.instructorName}</span>
                                </p>
                                <p className="text-[16px] text-gray-600 mb-2 mt-3">
                                    {`${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length < 2
                                        ? 'Lecture'
                                        : 'Lectures'
                                        } - ${courseItem?.level.toUpperCase()} Level`}
                                </p>
                                <p className="font-bold text-lg">${courseItem.pricing}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
            <h1 className='font-extrabold text-4xl text-center'>No Courses Found</h1>
            )}
        </div>
    );
}

export default CourseList;
