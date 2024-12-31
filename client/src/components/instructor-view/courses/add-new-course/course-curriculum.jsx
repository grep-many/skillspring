import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/video-player';
import { courseCurriculumInitialFormData } from '@/config';
import { InstructorContext } from '@/context/instructor-context';
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from '@/services';
import { Send, Upload } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const CourseCurriculum = ({ headPage }) => {

  const { courseCurriculumFormData, setCourseCurriculumFormData, mediaUploadProgress, setMediaUploadProgress, lectureUploadProgress, setLectureUploadProgress, courseLandingFormData } = useContext(InstructorContext);
  const [ytplay, setYtplay] = useState();
  const [courseYtplay, setCourseYtplay] = useState([]);
  const bulkUploadInputRef = useRef(null);
  const singleUploadInputRefs = useRef([]);
  const [isMediumWidth, setIsMediumWidth] = useState(window.innerWidth >= 550);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] }, // Add fresh initial form
    ]);
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  async function handleYtUpload(url, currentIndex) {
    const toastId = toast.loading("Uploading youtube url...");
    if (url) {
      setMediaUploadProgress(true);
      setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: 30 }));

      try {
        const response = await mediaUploadService(url, progress =>
          setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: progress })));
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.secure_url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        }
        setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: 100 }));
        toast.update(toastId, { render: "Youtube url uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
      }
      catch (err) {
        setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: 0 }));
        toast.update(toastId, { render: "Error uploading youtube url!", type: "error", isLoading: false, autoClose: 3000 });
        console.error(err)
      } finally {
        setMediaUploadProgress(false);
      }
    } else {
      console.error('url is empty')
    }
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const toastId = toast.loading("Uploading video...");
    setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: 0 }));
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: 30 }));
        const response = await mediaUploadService(videoFormData, progress =>
          setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: progress })));

        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
          ...cpyCourseCurriculumFormData[currentIndex],
          videoUrl: response.secure_url,
          public_id: response.public_id,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: 100 }));
        toast.update(toastId, { render: "Video uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
      }
      catch (err) {
        setLectureUploadProgress(prev => ({ ...prev, [currentIndex]: 0 }));
        toast.update(toastId, { render: "Error uploading video!", type: "error", isLoading: false, autoClose: 3000 });
        console.error(err);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleReplaceVideo(index) {
    const toastId = toast.loading("Replacing video...");
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId = cpyCourseCurriculumFormData[index].public_id;

    try {
      const response = await mediaDeleteService(getCurrentVideoPublicId, 'video');

      if (response?.success) {
        cpyCourseCurriculumFormData[index] = {
          ...cpyCourseCurriculumFormData[index],
          videoUrl: '',
          public_id: ''
        };

        setCourseCurriculumFormData(cpyCourseCurriculumFormData);

        setTimeout(() => {
          singleUploadInputRefs.current[index]?.click();
        }, 0);
      }
      toast.update(toastId, { render: "Video replaced successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "Error replacing video!", type: "error", isLoading: false, autoClose: 3000 });
    }
  }


  async function handleDeleteVideo(index) {
    const toastId = toast.loading("Deleting video...");
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId = cpyCourseCurriculumFormData[index].public_id;

    try {
      const response = await mediaDeleteService(getCurrentVideoPublicId, 'video');

      if (response?.success) {
        cpyCourseCurriculumFormData[index] = {
          ...cpyCourseCurriculumFormData[index],
          videoUrl: '',
          public_id: ''
        }

        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      }

      toast.update(toastId, { render: "Video deleted successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "Error deleting video!", type: "error", isLoading: false, autoClose: 3000 });
    }
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === 'boolean') {
          return true
        }
        return value === ''
      })
    })
  }

  async function handleMediaBulkUpload(e) {
    const toastId = toast.loading("Uploading video...");
    const selectedFiles = Array.from(e.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach(fileItem => {
      console.log('Appending File:', fileItem); // Debugging step 2
      bulkFormData.append('files', fileItem);
    });

    try {

      setMediaUploadProgress(true)
      const response = await mediaBulkUploadService(bulkFormData, setLectureUploadProgress)

      if (response?.success) {
        let cpyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty((courseCurriculumFormData))
          ? [] : [...courseCurriculumFormData];

        const newLectures = response?.data.map((item, index) => ({
          videoUrl: item?.secure_url,
          public_id: item?.public_id,
          title: `Lecture ${cpyCourseCurriculumFormData.length + (index + 1)}`,
          freePreview: false,
        }));

        cpyCourseCurriculumFormData = [...cpyCourseCurriculumFormData, ...newLectures];
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);

        const updatedProgress = { ...lectureUploadProgress };
        newLectures.forEach((_, index) => {
          const progressIndex = cpyCourseCurriculumFormData.length - newLectures.length + index;
          updatedProgress[progressIndex] = 100;
        });
        setLectureUploadProgress(updatedProgress);
      }
      toast.update(toastId, { render: "Video uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "Error uploading video!", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setMediaUploadProgress(false)
    }
  }

  const handleYoutubePlaylistUrlChange = (e) => {
    setYtplay(e.target.value);
  };

  async function handleYtPlaylistUpload() {
    const toastId = toast.loading("Uploading youtube url...");
    try {
      const response = await mediaBulkUploadService(ytplay, setLectureUploadProgress);

      if (response?.success) {
        let cpyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty((courseCurriculumFormData))
          ? [] : [...courseCurriculumFormData];

        const newLectures = response?.data.map((item, index) => ({
          videoUrl: item?.secure_url,
          public_id: item?.public_id,
          title: `Lecture ${cpyCourseCurriculumFormData.length + (index + 1)}`,
          freePreview: false,
        }));

        cpyCourseCurriculumFormData = [...cpyCourseCurriculumFormData, ...newLectures];
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);

        const updatedProgress = { ...lectureUploadProgress };
        newLectures.forEach((_, index) => {
          const progressIndex = cpyCourseCurriculumFormData.length - newLectures.length + index;
          updatedProgress[progressIndex] = 100;
        });
        setLectureUploadProgress(updatedProgress);
        toast.update(toastId, { render: "Youtube url uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
      }

    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "Error uploading youtube url!", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setMediaUploadProgress(false)
    }
  }

  const handleYoutubeUrlChange = (e, index) => {
    setCourseYtplay(prev => {
      const updatedYtplay = [...prev];
      updatedYtplay[index] = e.target.value;
      return updatedYtplay;
    });
  };

  async function handleRemoveLecture(currentIndex) {
    const toastId = toast.loading("Removing Lecture...");

    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];

    const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

    cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter((_, index) => index !== currentIndex);
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);

    try {
      // If there's a public ID (indicating an Removed video), delete it from the server
      if (getCurrentVideoPublicId) {
        const response = await mediaDeleteService(getCurrentVideoPublicId, 'video');

        if (response?.success) {
          cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter((_, index) => index !== currentIndex);
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        } else {
          toast.update(toastId, { render: "Something went wrong while removing Lecture!", type: "error", isLoading: false, autoClose: 3000 });
        }
      }
      toast.update(toastId, { render: "Lecture removed successfully!", type: "success", isLoading: false, autoClose: 3000 });
      // Remove the lecture from the form data
    } catch (err) {
      console.error(`Error removing lecture: ${err.message}`);
      toast.update(toastId, { render: "Error removing Lecture!", type: "error", isLoading: false, autoClose: 3000 });
    }
  }


  useEffect(() => {
    // Reset progress to zero for any lecture without a video URL
    const updatedProgress = { ...lectureUploadProgress };
    courseCurriculumFormData.forEach((item, index) => {
      if (!item.videoUrl) {
        updatedProgress[index] = 0;
      }
    });
    setLectureUploadProgress(updatedProgress);
  }, [courseCurriculumFormData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumWidth(window.innerWidth >= 550);
    };

    // Add event listener to handle window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
          {headPage ? 'Create Course Curriculum' : 'Update Course Curriculum'}
        </CardTitle>
        <Tabs defaultValue='bulk-upload' className='space-y-4'>
          <TabsList className="flex flex-wrap gap-2 justify-evenly h-fit">
            <TabsTrigger value='bulk-upload' className="flex-1 w-[25%] sm:flex-none min-w-[120px] text-center sm:px-4 py-2 rounded-md">
              Upload files
            </TabsTrigger>
            <TabsTrigger value='youtube-playlist' className="flex-1 w-[25%] sm:flex-none min-w-[120px] text-center sm:px-4 py-2 rounded-md">
              YouTube Playlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value='bulk-upload'>
            <div>
              <input
                type="file"
                name="files"
                ref={bulkUploadInputRef}
                accept="video/*"
                multiple
                className="hidden"
                id="bulkMediaUpload"
                onChange={handleMediaBulkUpload}
              />
              <Button
                as="label"
                htmlFor="bulkMediaUpload"
                variant="outline"
                className="cursor w-full"
                onClick={handleOpenBulkUploadDialog}
              >
                <Upload className="h-5 w-4 mr-2" />
                Bulk Upload
              </Button>
            </div>
          </TabsContent>
          <TabsContent value='youtube-playlist'>
            <div className="flex">
              <Input
                type="text"
                id="youtube-url"
                name="youtube-url"
                placeholder="Enter YouTube URL"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mr-1"
                value={ytplay}
                onChange={handleYoutubePlaylistUrlChange}
              />
              <Button onClick={handleYtPlaylistUpload}><Send /></Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
          className="m-1"
        >
          Add Lecture
        </Button>
        <div className="mt-4 space-y-6">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div className="border p-4 rounded-md flex flex-col gap-4" key={index}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-semibold text-lg">Lecture {index + 1}</h3>
                <Input
                  name="title"
                  placeholder="Enter Lecture Title"
                  className="flex-1 max-w-full"
                  onChange={(e) =>
                    setCourseCurriculumFormData(
                      courseCurriculumFormData.map((item, idx) =>
                        idx === index ? { ...item, [e.target.name]: e.target.value } : item
                      )
                    )
                  }
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center gap-2 flex-col md:flex-row">
                  <Switch
                    name="freePreview"
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                    onCheckedChange={(value) =>
                      setCourseCurriculumFormData(
                        courseCurriculumFormData.map((item, idx) =>
                          idx === index ? { ...item, freePreview: value } : item
                        )
                      )
                    }
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>Free Preview</Label>
                  <Button
                    onClick={() => handleRemoveLecture(index)}
                    className="bg-red-600 hover:bg-red-900 text-sm"
                  >
                    Remove Lecture
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center gap-4">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <VideoPlayer
                      play={false}
                      thumbnail={courseLandingFormData?.image}
                      width={isMediumWidth ? "375px" : '200px'}
                      height={isMediumWidth ? "200px" : '100px'}
                      url={courseCurriculumFormData[index]?.videoUrl}
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => handleReplaceVideo(index)}>Replace Video</Button>
                      <Button
                        className="bg-red-600 hover:bg-red-900"
                        onClick={() => handleDeleteVideo(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Tabs defaultValue='curriculum' className='space-y-4'>
                      <TabsList className="flex flex-wrap gap-2 justify-evenly h-fit">
                        <TabsTrigger value='curriculum' className="flex-1 w-[25%] sm:flex-none min-w-[120px] text-center sm:px-4 py-2 rounded-md">
                          Upload files
                        </TabsTrigger>
                        <TabsTrigger value='youtube-url' className="flex-1 w-[25%] sm:flex-none min-w-[120px] text-center sm:px-4 py-2 rounded-md">
                          YouTube URL
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value='curriculum'>
                        <div>
                          <Input
                            className="cursor-pointer w-full"
                            name="videoUrl"
                            type="file"
                            accept="video/*"
                            ref={(el) => (singleUploadInputRefs.current[index] = el)}
                            onChange={(event) => handleSingleLectureUpload(event, index)}
                          />
                          {lectureUploadProgress[index] !== undefined && (
                            <div className="h-1 bg-gray-200 w-full rounded overflow-hidden">
                              <div
                                className="h-full bg-black"
                                style={{
                                  width: `${lectureUploadProgress[index]}%`,
                                  transition: 'width 1s ease',
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value='youtube-url'>
                        <div className="flex">
                          <Input
                            type="text"
                            id="youtube-url"
                            name="youtube-url"
                            placeholder="Enter YouTube URL"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mr-1"
                            value={courseYtplay[index] || ''}
                            onChange={(e) => handleYoutubeUrlChange(e, index)}
                          />
                          <Button onClick={() => handleYtUpload(courseYtplay[index], index)}><Send /></Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent >
    </Card>
  );
}

export default CourseCurriculum;
