import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import StudentViewCommonHeader from '@/components/student-view/header';
import { AuthContext } from '@/context/auth-context';

const StudentViewCommonLayout = () => {
    
    const {location}= useContext(AuthContext);

    return (
        <>
            {!(location.pathname.includes("course-progress")||location.pathname.includes("instructor")) && <StudentViewCommonHeader />}
            <Outlet />
        </>
    );
}

export default StudentViewCommonLayout;
