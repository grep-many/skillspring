import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context';
import { checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailsService } from '@/services';
import { CheckCircle,  Globe, Lock, PlayCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const StudentViewCourseDetailsPage = () => {

    const {
        studentViewCoursesDetails,
        setStudentViewCoursesDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
    } = useContext(StudentContext);
    const { navigate, setProgress, auth } = useContext(AuthContext);
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
    const [showFreePreviewDialogue, setShowFreePreviewDialogue] = useState(false);
    const [buyDisable,setBuyDisable] = useState(false)

    const { id } = useParams();
    const location = useLocation();

    async function fetchStudentViewCourseDetails() {

        const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(currentCourseDetailsId,auth?.user?._id)

        if(checkCoursePurchaseInfoResponse?.success&&checkCoursePurchaseInfoResponse?.data){
            navigate(`/student/course-progress/${currentCourseDetailsId}`)
            return
        }
        setProgress(30)
        try {
            const response = await fetchStudentViewCourseDetailsService(
                currentCourseDetailsId,
            );
            if (response?.success) {
                setStudentViewCoursesDetails(response.data);
            } else {
                navigate('/student/courses')
            }

        } catch (err) {
            alert(err)
        } finally {
            setProgress(100); // Set isLoading to false once fetching is complete
        }
    }

    const getIndexOfFreePreview = studentViewCoursesDetails !== null ?
        studentViewCoursesDetails?.curriculum?.findIndex(item => item.freePreview)
        : -1;

    function handleSetFreePreview(getCurrentVideoInfo) {
        if (getCurrentVideoInfo?.freePreview) {
            setDisplayCurrentVideoFreePreview(getCurrentVideoInfo)
            setShowFreePreviewDialogue(true);
        } else {
            alert('not a free preview')
        }
    }

    async function handleCreatePayment() {
        setBuyDisable(true);
        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "initiated",
            orderDate: new Date(),
            paymentId: "",  // Will be set after successful payment
            payerId: "",    // Will be set after successful payment
            instructorId: studentViewCoursesDetails?.instructorId,
            instructorName: studentViewCoursesDetails?.instructorName,
            courseImage: studentViewCoursesDetails?.image,
            courseTitle: studentViewCoursesDetails?.title,
            courseId: studentViewCoursesDetails?._id,
            coursePricing: studentViewCoursesDetails?.pricing,
        };
    
        setProgress(30);
    
        try {
            const response = await createPaymentService(paymentPayload);
    
            if (response.success) {
                setProgress(100);  // Update progress to 100% after successful payment
                sessionStorage.setItem("currentOrderId", JSON.stringify(response?.data?.orderId));
                window.location.href = response?.data?.approveUrl;
            } else {
                toast.error('Payment failed');
            }
        } catch (err) {
            console.error('Payment Error:', err);
            toast.error('An error occurred during payment.');
        } finally {
            setProgress(100);
            setBuyDisable(false)
        }
    }
    

    useEffect(() => {
        if (!location.pathname.includes('course/details')) (
            setStudentViewCoursesDetails(null),
            setCurrentCourseDetailsId(null)
        )
    }, [location.pathname])

    useEffect(() => {
        if (currentCourseDetailsId !== null) {
            fetchStudentViewCourseDetails();
        }
    }, [currentCourseDetailsId])

    useEffect(() => {
        if (id) {
            setCurrentCourseDetailsId(id)
        }
    }, [id])

    return (
        <div className='container mx-auto p-4'>
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">{studentViewCoursesDetails?.title}</h1>
                <p className='text-xl mb-4'>{studentViewCoursesDetails?.subtitle}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Created By {studentViewCoursesDetails?.instructorName}</span>
                    <span>Create On {studentViewCoursesDetails?.date.split('T')[0]}</span>
                    <span className='flex items-center'>
                        <Globe className='mr-1 h-4 w-4' />
                        {studentViewCoursesDetails?.primaryLanguage}
                    </span>
                    <span>{studentViewCoursesDetails?.students.length} {studentViewCoursesDetails?.students.length > 1 ? 'Seekers' : 'Seeker'}</span>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className='mb-8'>
                        <CardHeader>
                            <CardTitle>What you gonna grab in this Course</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gird-cols-1 md:grid-cols-2 gap-2">
                                {studentViewCoursesDetails?.objectives.split(',' || '.').map((objective, index) =>
                                    <li key={index} className='flex items-center'>
                                        <CheckCircle className='mr-2 h-5 w-5 text-green-500 flex-shrink-0' />
                                        <span>
                                            {objective}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className='mb-8'>
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-xl mb-4'>{studentViewCoursesDetails?.description}</p>
                        </CardContent>
                    </Card>
                    <Card className='mb-8'>
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                studentViewCoursesDetails?.curriculum?.map((curriculumItem, index) =>
                                    <li
                                        key={index}
                                        className={`${curriculumItem.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'} flex items-center mb-4`}
                                        onClick={() => handleSetFreePreview(curriculumItem)}
                                    >
                                        {
                                            curriculumItem?.freePreview ?
                                                <PlayCircle className='mr-2 h-4 w-4' key={index} /> : <Lock className='mr-2 h-4 w-4' key={index} />
                                        }
                                        <span>{curriculumItem?.title}</span>
                                    </li>
                                )
                            }
                        </CardContent>
                    </Card>
                </main>
                <aside className='w-full md:w-[500px]'>
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                <VideoPlayer
                                    url={
                                        getIndexOfFreePreview !== -1 ?
                                            studentViewCoursesDetails?.curriculum[getIndexOfFreePreview].videoUrl : ''
                                    }
                                    thumbnail={studentViewCoursesDetails?.image}
                                // width='450px'
                                // height='200px'
                                />
                            </div>
                            <div className="mb-4">
                                <span className='text-3xl font-bold'>${studentViewCoursesDetails?.pricing}</span>
                            </div>
                            <Button onClick={handleCreatePayment} className='w-full' disabled={buyDisable}>Buy Now</Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            <Dialog open={showFreePreviewDialogue} onOpenChange={setShowFreePreviewDialogue}>
                <DialogContent className="w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <div className="aspect-video rounded-lg flex items-center justify-center">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview?.videoUrl}
                            thumbnail={studentViewCoursesDetails?.image}
                        // width='450px'
                        // height='200px'
                        />
                    </div>
                    <div className='flex flex-row gap-2'>
                        {
                            studentViewCoursesDetails?.curriculum?.filter(item => item.freePreview).map(filteredItem =>
                                <Button variant={`${filteredItem?._id === displayCurrentVideoFreePreview?._id ? '' : 'outline'}`} onClick={() => handleSetFreePreview(filteredItem)} key={filteredItem?._id} className='cursor-pointer text-[16px] font-medium'>{filteredItem.title}</Button>
                            )
                        }
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentViewCourseDetailsPage;
