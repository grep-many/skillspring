import RouteGuard from '@/components/route-guard';
import InstructorDashboardPage from '@/pages/instructor';
import AddNewCoursePage from '@/pages/instructor/add-new-course';
import StudentViewCourseDetailsPage from '@/pages/student/course-details';
import StudentViewCourseProgressPage from '@/pages/student/course-progress';
import StudentViewCoursesPage from '@/pages/student/courses';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const InstructorRoutes = () => {

  return (
    <Routes>
      <Route
        path='/'
        element={
          <RouteGuard
            // authenticated={auth?.authenticate}
            element={<InstructorDashboardPage />}
          />}
      />
      <Route
        path='/explore'
        element={
          <RouteGuard
            // authenticated={auth?.authenticate}
            element={<StudentViewCoursesPage />}
          />}
      />
      <Route
        path='/details/:id'
        element={
          <RouteGuard
            // authenticated={auth?.authenticate}
            element={<StudentViewCourseDetailsPage />}
          />}
      />
      <Route
        path='/course-progress/:id'
        element={
          <RouteGuard
            // authenticated={auth?.authenticate}
            element={<StudentViewCourseProgressPage />}
          />}
      />
      <Route
        path='*'
        element={
          <RouteGuard
            // authenticated={auth?.authenticate}
            element={<Navigate to='/' />}
          />}
      />
      <Route
        path='/create-new-course'
        element={
          <RouteGuard
            // authenticated={auth?.authenticate}
            element={<AddNewCoursePage />}
          />}
      />
      <Route
        path='/edit-course/:courseId'
        element={
          <RouteGuard
            // authenticated={auth?.authenticate}
            element={<AddNewCoursePage />}
          />}
      />
    </Routes>
  );
}

export default InstructorRoutes;
