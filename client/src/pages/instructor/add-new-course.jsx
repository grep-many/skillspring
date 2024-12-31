import CourseCurriculum from '@/components/instructor-view/courses/add-new-course/course-curriculum';
import CourseLandingPage from '@/components/instructor-view/courses/add-new-course/course-landing-page';
import CourseSettings from '@/components/instructor-view/courses/add-new-course/course-settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config';
import { AuthContext } from '@/context/auth-context';
import { InstructorContext } from '@/context/instructor-context';
import { addNewCourseService, fetchInstructorCourseDetailsListService, updateCourseByIdService } from '@/services';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddNewCoursePage = () => {

    const {
        courseCurriculumFormData,
        courseLandingFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId,
    } = useContext(InstructorContext);

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate();

    const params = useParams();
    const [headPage, setHeadPage] = useState(true);

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        }

        return value === "" || value === null || value === undefined;
    }

    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) {
                return false;
            }
        }

        let hasFreePreview = false;

        for (const item of courseCurriculumFormData) {
            if (
                isEmpty(item.title) ||
                isEmpty(item.videoUrl) ||
                isEmpty(item.public_id)
            ) {
                return false;
            }

            if (item.freePreview) {
                hasFreePreview = true; //found at least one free preview
            }
        }

        return hasFreePreview;
    }

    async function handleCreateCourse() {
        const toastId = toast.loading("Creating course...");
        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...courseLandingFormData,
            students: [],
            curriculum: courseCurriculumFormData,
            isPublised: true,
        };

        try {
            const response =
                currentEditedCourseId !== null ?
                    await updateCourseByIdService(currentEditedCourseId, courseFinalFormData) :
                    await addNewCourseService(courseFinalFormData);
            if (response?.success) {
                setCourseLandingFormData(courseLandingInitialFormData);
                setCourseCurriculumFormData(courseCurriculumInitialFormData);
                setCurrentEditedCourseId(null);
                toast.update(toastId, { render: "Course created successfully!", type: "success", isLoading: false, autoClose: 3000 });
                navigate(-1);
            } else {
                toast.update(toastId, { render: "Error creating Course!", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (err) {
            toast.update(toastId, { render: "Error creating Course!", type: "error", isLoading: false, autoClose: 3000 });
            console.error(err)
        }
    }

    async function fetchCurrentCourseDetails() {
        try {
            const response = await fetchInstructorCourseDetailsListService(currentEditedCourseId)

            if (response?.success) {
                const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                    acc[key] = response?.data[key] || courseLandingInitialFormData[key]

                    return acc
                }, {})

                setCourseLandingFormData(setCourseFormData)
                setCourseCurriculumFormData(response?.data?.curriculum)
            }


        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        if (params?.courseId) {
            setHeadPage(false)
            setCurrentEditedCourseId(params?.courseId);
        }
    }, [params?.courseId])

    useEffect(() => {
        if (currentEditedCourseId !== null) {
            fetchCurrentCourseDetails()
        }
    }, [currentEditedCourseId])

    return (
        <div className='container mx-auto p-4'>
            <div className="flex justify-between">
                <h1 className='text-3xl font-extrabold mb-5'>{headPage ? 'Create New Course' : 'Update Course'}</h1>
                <Button
                    className='text-sm tracking-wider font-bold px-8'
                    disabled={!validateFormData()}
                    onClick={handleCreateCourse}
                >
                    SUBMIT
                </Button>
            </div>
            <Card>
                <CardContent>
                    <div className="container mx-auto p-0 py-4 ">
                        <Tabs defaultValue='curriculum' className='space-y-4'>
                            <TabsList className="flex flex-wrap gap-2 justify-evenly h-fit">
                                <TabsTrigger value='curriculum' className="flex-1 w-[30%] sm:flex-none min-w-[120px] text-center sm:px-4 py-2 rounded-md">
                                    Curriculum
                                </TabsTrigger>
                                <TabsTrigger value='settings' className="flex-1 w-[30%] sm:flex-none min-w-[120px] text-center sm:px-4 py-2 rounded-md">
                                    Settings
                                </TabsTrigger>
                                <TabsTrigger value='course-landing-page' className="flex-1 w-[30%] sm:flex-none min-w-[120px] text-center sm:px-4 py-2 rounded-md">
                                    Course Landing Page
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value='curriculum'>
                                <CourseCurriculum headPage={headPage} />
                            </TabsContent>
                            <TabsContent value='course-landing-page'>
                                <CourseLandingPage headPage={headPage} />
                            </TabsContent>
                            <TabsContent value='settings'>
                                <CourseSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddNewCoursePage;