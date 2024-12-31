import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData, setProgress) {
    try {
        setProgress(60);
        const response = await axiosInstance.post('/auth/register', formData);
        return response.data;
    } catch (err) {
        if (err.response.status) {
            const { response } = err
            return response;
        } else {
            console.error(err)
            console.error('something went wrong while registerService')
        }
    } finally {
        setProgress(80);
    }
}

export async function loginService(formData, setProgress) {
    try {
        setProgress(60);
        const { data } = await axiosInstance.post('/auth/login', formData);
        return data;
    } catch (error) {
        if (error.response.status) {
            const { response } = error
            return response;
        } else {
            console.error(error)
            console.error('something went wrong while loginService')
        }
    } finally {
        setProgress(80);
    }
}

export async function checkAuthService(setProgress) {
    try {
        setProgress(60)
        const { data } = await axiosInstance.get('/auth/check-auth');
        return data;
    } catch (error) {
        console.error('something went wrong while checkAuthService', error)
    } finally {
        setProgress(80);
    }
}

export async function mediaUploadService(formData, setProgress) {
    try {
        if (!formData) {
            console.log('no form data');
            return;
        }

        let payload;

        if (formData instanceof FormData) {
            payload = formData;
        } else if (typeof formData === 'string') {
            payload = { url: formData }; // Assuming it's a YouTube playlist or similar
        } else {
            console.log('Invalid formData type. Expected a file or a string (e.g., YouTube playlist URL).');
            return;
        }

        const { data } = await axiosInstance.post('/media/upload', payload);
        setProgress(60); // Update progress after a successful upload
        return data;
    } catch (error) {
        console.error('Error occurred during mediaUploadService:', error);
    } finally {
        setProgress(80); // Update progress in the finally block
    }
}

export async function mediaBulkUploadService(formData, setProgress) {
    try {
        if (formData) {
            if (formData instanceof FormData) {
                // Sending multiple files
                const { data } = await axiosInstance.post('/media/bulk-upload', formData);
                setProgress(60); // Update progress to 60% after successful upload
                return data;
            } else if (typeof (formData) === 'string') {

                // Assuming it's a YouTube playlist URL
                const { data } = await axiosInstance.post('/media/bulk-upload', { url: formData });
                setProgress(60); // Update progress to 60% after successful upload
                return data;
            } else {
                console.log('Invalid formData type. Expected a file array or a YouTube playlist URL.');
            }
        } else {
            console.log('No formData provided.');
        }
    } catch (error) {
        console.error('Error occurred during mediaBulkUploadService:', error);
        // Handle the error appropriately (e.g., show a toast notification, set error state, etc.)
    } finally {
        setProgress(80); // Update progress to 80% in the finally block
    }
}


export async function mediaDeleteService(id, type) {
    try {
        if (!id || !type) {
            console.log('Missing id or type data');
            return;
        }
        const { data } = await axiosInstance.delete(`/media/delete/${type}/${id}`);
        return data;
    } catch (error) {
        console.error(err);
        console.error('something went wrong while mediaDeleteService')
    }
}

export async function fetchInstructorCourseListService(id) {
    try {
        const { data } = await axiosInstance.post(`/instructor/course/get`, { id: id });
        return data;
    } catch (err) {
        console.error('something went wrong while mediaDeleteService')
        console.error(err);
    }
}

export async function addNewCourseService(formData) {
    try {
        const { data } = await axiosInstance.post(`/instructor/course/add`, formData);
        return data;
    } catch (err) {
        console.error('something went wrong while adding')
        console.error(err);
    }
}

export async function fetchInstructorCourseDetailsListService(id) {
    try {
        const { data } = await axiosInstance.get(`/instructor/course/get/details/${id}`);
        return data;
    } catch (err) {
        console.error('something went wrong while mediaDeleteService')
        console.error(err);
    }
}

export async function updateCourseByIdService(id, formData) {
    try {
        const { data } = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
        return data;
    } catch (err) {
        console.error('something went wrong while mediaDeleteService')
        console.error(err);
    }
}

export async function fetchStudentViewCourseListService(query) {
    try {
        const { data } = await axiosInstance.get(`/student/course/get?${query}`);
        return data;
    } catch (err) {
        console.error('something went wrong while mediaDeleteService')
        console.error(err);
    }
}

export async function fetchStudentViewCourseDetailsService(courseId) {
    try {
        const { data } = await axiosInstance.get(`/student/course/get/details/${courseId}`);
        return data;
    } catch (err) {
        console.error('something went wrong while fetching courses details')
        console.error(err);
    }
}

export async function fetchStudentBoughtCoursesService(studentId) {

    try {
        const { data } = await axiosInstance.get(`/student/courses-owned/get/${studentId}`);
        return data;
    } catch (err) {
        console.error('something went wrong while fetching the your owned courses')
        console.error(err);
    }
}

export async function createPaymentService(formData) {
    try {
        const { data } = await axiosInstance.post(`/student/order/create`, formData);
        return data;
    } catch (err) {
        console.error('something went wrong while creatint payment')
        console.error(err);
    }
}

export async function captureAndFinalizePaymentService(paymentId, payerId, orderId) {
    try {
        const { data } = await axiosInstance.post(`/student/order/capture`, { paymentId, payerId, orderId });
        return data;
    } catch (err) {
        if (err.response.status) {
            const { response } = err
            return response
        } else {
            console.error('something went wrong while finalizing payment')
            console.error(err);
        }
    }
}

export async function cancelledFinalizePaymentService(orderId) {
    try {
        const { data } = await axiosInstance.post(`/student/order/cancel`, { orderId });
        return data;
    } catch (err) {
        console.error('something went wrong while finalizing payment')
        console.error(err);
    }
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
    try {
        const { data } = await axiosInstance.get(`/student/course/purchase-info/${courseId}/${studentId}`);
        return data;
    } catch (err) {
        console.error('something went wrong while fetching courses details')
        console.error(err);
    }
}

export async function getCurrentCourseProgressService(userId, courseId) {
    try {
        const { data } = await axiosInstance.get(`/student/course-progress/get/${userId}/${courseId}`);
        return data;
    } catch (err) {
        console.error('something went wrong while fetching courses progress')
        console.error(err);
    }
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
    try {
        const { data } = await axiosInstance.post(`/student/course-progress/mark-lecture-viewed`,
            {
                userId,
                courseId,
                lectureId,
            }
        );

        return data;
    } catch (err) {
        console.error('something went wrong while updating courses progress')
        console.error(err);
    }
}

export async function resetCourseProgressService(userId, courseId) {
    try {
        const { data } = await axiosInstance.post(`/student/course-progress/reset-progress`,
            {
                userId,
                courseId,
            }
        );

        return data;
    } catch (err) {
        console.error('something went wrong while reseting courses progress')
        console.error(err);
    }
}

export async function checkServerHealthService() {
    try {
        const { data } = await axiosInstance.get('/');
        return data
    } catch (err) {
        console.error('Something went wrong while checking server\'s health');
        console.error(err)
    }
}