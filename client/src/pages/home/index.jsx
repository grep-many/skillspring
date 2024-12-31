import React, { useContext, useEffect, useRef } from "react";
import hero from '@/assets/hero.jpg'
import student1 from "@/assets/student1.jpg";
import student2 from "@/assets/student2.jpg";
import student3 from "@/assets/student3.jpg";
import { fetchStudentViewCourseListService } from "@/services";
import { AuthContext } from "@/context/auth-context";
import { toast } from "react-toastify";
import { StudentContext } from "@/context/student-context";
import useIntersection from "./useInterSection";

const HomePage = () => {

  const {
    auth,
    setProgress,
    navigate,
    signUpFormData,
    setSignUpFormData,
  } = useContext(AuthContext);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    handleCourseNavigate,
  } = useContext(StudentContext);

  const heroRef = useRef(null);
  const coursesRef = useRef(null);
  const testimonialsRef = useRef(null);

  const heroInView = useIntersection(heroRef, { threshold: 0.3 });
  const coursesInView = useIntersection(coursesRef, { threshold: 0.3 });
  const testimonialsInView = useIntersection(testimonialsRef, { threshold: 0.3 });

  const handleInstructorNavigate = () => {
    navigate('auth')
    setSignUpFormData({
      ...signUpFormData,
      role: 'instructor'
    })
  }

  const handleExploreNavigate = () => {
    (auth.authenticate&&auth.user.role === 'instructor') ?
      navigate('instructor/explore')
      : navigate('student/student-courses')
  }

  useEffect(() => {
    (async () => {
      setProgress(30); // Set isLoading to true when fetching starts
      try {
        const response = await fetchStudentViewCourseListService();
        if (response?.success) {
          setStudentViewCoursesList(response?.data);
        } else {
          toast.error('Something went wrong while fetching courses');
        }
      } catch (err) {
        toast.error(err.response.message);
      } finally {
        setProgress(100); // Set isLoading to false once fetching is complete
      }
    })()
  }, [])

  return (
    <div className="font-sans text-gray-800">

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[512px] bg-cover bg-fixed bg-center text-center py-28 px-4"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white relative z-10">Learn. Teach. Connect.</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 relative z-10">
          A platform where anyone can teach and anyone can learn. Start your journey today!
        </p>
        <div className="flex justify-center gap-4 relative z-10">
          <button onClick={handleExploreNavigate} className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900">
            Explore Courses
          </button>
          <button onClick={handleInstructorNavigate} className="border border-black text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100">
            Start Teaching
          </button>
        </div>
      </section>

      {/* Featured Courses */}
      <section
        ref={coursesRef}
        id="courses"
        className={`py-16 px-6 transform transition-all duration-700 ${coursesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-black">Popular Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.slice(0, 6).map((courseItem, index) => (
              <div
                key={index}
                className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition duration-200"
              >
                <img
                  src={courseItem?.image}
                  alt={`Course ${index + 1}`}
                  className="mb-4 rounded"
                />
                <h3 className="text-xl font-medium mb-2">{courseItem?.title}</h3>
                <p className="text-gray-600">By {courseItem?.instructorName}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-bold">${courseItem?.pricing}</p>
                  <button onClick={() => handleCourseNavigate(courseItem?._id)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900">
                    Learn More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1 className='font-extrabold text-4xl text-center'>No Courses Found</h1>
          )}
        </div>
      </section>

      {/* Become an Instructor */}
      <section
        id="instructors"
        className={`py-16 px-6 bg-gray-50 text-center transform transition-all duration-700 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <h2 className="text-3xl font-bold mb-4 text-black">Teach on SkillSpring</h2>
        <p className="text-gray-600 mb-8">Share your knowledge and earn while helping others grow.</p>
        <button onClick={handleInstructorNavigate} className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900">
          Start Teaching
        </button>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        id="testimonials"
        className={`py-16 px-6 transform transition-all duration-700 ${testimonialsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-black">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-200">
            <p className="text-gray-600 italic mb-4">
              "SkillSpring has completely changed how I learn. The courses are amazing and easy to follow!"
            </p>
            <div className="flex items-center gap-4">
              <img
                src={student1}
                alt="Student"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-black">Alice Johnson</p>
                <p className="text-gray-500">Web Developer</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-200"
          >
            <p className="text-gray-600 italic mb-4">
              "SkillSpring’s courses have helped me grow my skills and confidence in ways I never imagined."
            </p>
            <div className="flex items-center gap-4">
              <img
                src={student3}
                alt="Student"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-black">Michael Brown</p>
                <p className="text-gray-500">Data Analyst</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-200"
          >
            <p className="text-gray-600 italic mb-4">
              "The hands-on projects and supportive community have made all the difference in my learning journey."
            </p>
            <div className="flex items-center gap-4">
              <img
                src={student2}
                alt="Student"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-black">Samantha Lee</p>
                <p className="text-gray-500">Graphic Designer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-100 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="cursor-default text-gray-600">© {new Date().getFullYear()} SkillSpring. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="cursor-default hover:text-black">
              About Us
            </div>
            <div className="cursor-default hover:text-black">
              Contact
            </div>
            <div className="cursor-default hover:text-black">
              Privacy Policy
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
