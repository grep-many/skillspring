import RouteGuard from '@/components/route-guard';
import StudentViewCourseDetailsPage from '@/pages/student/course-details';
import StudentViewCourseProgressPage from '@/pages/student/course-progress';
import StudentViewCoursesPage from '@/pages/student/courses';
import StudentHomePage from '@/pages/student/home';
import PaypalPaymentReturnPage from '@/pages/student/payment-return';
import StudentCoursesPage from '@/pages/student/student-courses';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const StudentRoutes = () => {
    return (
        <Routes>
                <Route
                    path='/'
                    element={
                        <RouteGuard
                            element={<StudentHomePage />}
                        />
                    }
                />
                <Route
                    path='/courses/*'
                    element={
                        <RouteGuard
                            element={<StudentViewCoursesPage />}
                        />
                    }
                />
                <Route
                    path='/student-courses'
                    element={
                        <RouteGuard
                            element={<StudentCoursesPage />}
                        />
                    }
                />
                <Route
                    path='/course/details/:id'
                    element={
                        <RouteGuard
                            element={<StudentViewCourseDetailsPage />}
                        />
                    }
                />
                <Route
                    path='/course-progress/:id'
                    element={
                        <RouteGuard
                            element={<StudentViewCourseProgressPage />}
                        />
                    }
                />
                <Route
                    path='*'
                    element={
                        <RouteGuard
                            element={<Navigate to='/student/' />}
                        />
                    }
                />
        </Routes>
    );
};

export default StudentRoutes;
