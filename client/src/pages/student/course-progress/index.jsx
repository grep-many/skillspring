import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/video-player';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context';
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from '@/services';
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Card } from '@/components/ui/card';

const StudentViewCourseProgressPage = () => {

  const { auth, navigate, setProgress } = useContext(AuthContext);

  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    setProgress(30)
    try {

      const response = await getCurrentCourseProgressService(auth?.user?._id, id);
      if (response?.success) {
        if (!response?.data?.isPurchased) {
          setLockCourse(true);
        } else {
          setStudentCurrentCourseProgress({
            courseDetails: response?.data?.courseDetails,
            progress: response?.data?.progress,
          });

          if (response?.data?.completed) {
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
            setShowCourseCompleteDialog(true);
            setShowConfetti(true);
            setIsSideBarOpen(false)

            return;
          }

          if (response?.data?.progress?.length === 0) {
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          } else {
            const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
              (acc, obj, index) => {
                return acc === -1 && obj.viewed ? index : acc;
              },
              -1
            );

            setCurrentLecture(
              response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
              ]
            );
          }
        }
      }
    } catch (err) {
      toast.error(err.response.message)
    } finally {
      setProgress(100)
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    setProgress(30)
    try {
      const response = await resetCourseProgressService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id
      );

      if (response?.success) {
        setCurrentLecture(null);
        setShowConfetti(false);
        setShowCourseCompleteDialog(false);
        fetchCurrentCourseProgress();
      }
    } catch (err) {
      alert(err)
    } finally {
      setProgress(100)
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b z-10">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student/student-courses")}
            className="text-white border"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${isSideBarOpen ? "mr-[370px]" : ""
            } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            thumbnail={studentCurrentCourseProgress?.courseDetails?.image}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[370px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14 border rounded-none">
              <TabsTrigger
                value="content"
                className=" text-white rounded-none h-full"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className=" text-white rounded-none h-full"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-[80vh]">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <Card
                        className="p-4 m-2 bg-gray flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                        key={item._id}
                        onClick={()=>setCurrentLecture(item)}
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className={`h-4 w-4 ${currentLecture?.title===item?.title?'text-green-500':''}`} />
                        )}
                        <span className={currentLecture?.title===item?.title?'text-green-500':''}>{currentLecture?.title===item?.title?'Playing':item?.title}</span>
                      </Card>
                    )
                  )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <Card className="p-4 m-2 bg-gray text-white text-center">
                  <h2 className="text-xl font-bold mb-4 underline">About this course</h2>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={lockCourse} onOpenChange={()=>navigate(`/student/course/details/${id}`)}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog} onOpenChange={()=>setShowCourseCompleteDialog(!showCourseCompleteDialog)}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <span className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student/student-courses")}>
                  My Courses Page
                </Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;