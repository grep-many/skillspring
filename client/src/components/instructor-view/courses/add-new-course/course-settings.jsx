import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InstructorContext } from '@/context/instructor-context';
import { mediaUploadService } from '@/services';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CourseSettings = () => {

  const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);
  const [imageUploadProgress, setImageUploadProgress] = useState(undefined)


  async function handleImageUploadChnage(e) {
    const toastId = toast.loading("Uploading image...");
    setImageUploadProgress(30)
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append('file', selectedImage);

      try {

        const response = await mediaUploadService(imageFormData, setImageUploadProgress);

        setCourseLandingFormData({
          ...courseLandingFormData,
          image: response?.secure_url
        })
        toast.update(toastId, { render: "Image uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
        setImageUploadProgress(100);
      }
      catch (err) {
        setImageUploadProgress(0);
        console.log(err);
        toast.update(toastId, { render: "Error uploading Image!", type: "error", isLoading: false, autoClose: 3000 });
      }
    }
  }

  useEffect(() => {
    if (!courseLandingFormData?.image) {
      setImageUploadProgress(0)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>

        <div className="flex flex-col gap-3">
          <label htmlFor="">Upload Course Image</label>
          {courseLandingFormData?.image && <img src={courseLandingFormData.image} className='max-h-[200px] max-w-[200px]' />}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUploadChnage}
            className='cursor-pointer m-0'
          />
          <div className="h-1 bg-gray-200 overflow-hidden mx-1 rounded">
            <div
              className="h-full bg-black"
              style={{ width: `${imageUploadProgress}%`, transition: 'width 1s ease-in-out' }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
