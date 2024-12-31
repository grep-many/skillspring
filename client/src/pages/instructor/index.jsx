import InstructorCourses from '@/components/instructor-view/courses';
import InstructorDashboard from '@/components/instructor-view/dashboard';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import { AuthContext } from '@/context/auth-context';
import { InstructorContext } from '@/context/instructor-context';
import { fetchInstructorCourseListService } from '@/services';
import { BarChart, Book, ChevronLeft, ChevronRight, LogOut, SearchCode, TvMinimalPlay } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import StudentViewCoursesPage from '../student/courses';
import StudentCoursesPage from '../student/student-courses';
import { toast } from 'react-toastify';

const InstructorDashboardPage = () => {

    const {auth} = useContext(AuthContext)
    const { resetCredentials } = useContext(AuthContext);
    const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    function handleLogout() {
        sessionStorage.clear();
        resetCredentials();
    }

    async function fetchAllCourses() {
        try {

            const response = await fetchInstructorCourseListService(auth?.user?._id);
            
            if (response?.success) {
                setInstructorCoursesList(response?.data);
            } else {
                toast.error('something went wrong while fetching courses')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const [isMediumWidth, setIsMediumWidth] = useState(window.innerWidth >= 980);
    const [isMediumWidthForApp, setIsMediumWidthForApp] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMediumWidth(window.innerWidth >= 980);
            setIsMediumWidthForApp(window.innerWidth >= 768);
        };

        // Add event listener to handle window resize
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        (async () => {
            await fetchAllCourses();
        })()
    }, [])

    const menuItems = [
        {
            icon: BarChart,
            label: 'Dashboard',
            value: 'dashboard',
            component: <InstructorDashboard listOfCourses={instructorCoursesList} />
        },
        {
            icon: Book,
            label: 'Courses',
            value: 'courses',
            component: <InstructorCourses listOfCourses={instructorCoursesList} />
        },
        {
            icon: SearchCode,
            label: 'Explore',
            value: 'explore',
            component: <StudentViewCoursesPage />
        },
        {
            icon: TvMinimalPlay,
            label: 'Purchased',
            value: 'purchased',
            component: <StudentCoursesPage />
        },
        {
            icon: LogOut,
            label: 'Logout',
            value: 'logout',
            component: null
        },
    ];


    return (
        <div className='flex h-fit bg-gray-100'>
            <aside className={`bg-white shadow-md block sticky top-0 left-0 ${isSideBarOpen ? 'w-72' : 'w-0 md:w-20'} transition-all duration-300`} style={{ height: '100vh' }}>
                <div className="p-4">
                    <div className="flex items-center mb-7">
                        {isSideBarOpen && <h2 className="text-2xl font-bold">Instructor View</h2>}
                        <Button className={isSideBarOpen ? 'mx-4' : 'mb-4'} onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                            {isSideBarOpen ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                    <nav>
                        {(isMediumWidthForApp || isSideBarOpen) && menuItems.map(menuItem => <Button
                            className={`w-full justify-start mb-2 transition duration-300 ease ${menuItem.value === 'logout' ? 'bg-red-200 text-red-900 hover:bg-red-600 hover:text-white' : ''}`}
                            onClick={menuItem.value === 'logout' ? handleLogout : () => {setActiveTab(menuItem.value),!isMediumWidth?setIsSideBarOpen(false):null}}
                            key={menuItem.value}
                            variant={activeTab === menuItem.value ? 'secondary' : 'ghost'}
                        >
                            <menuItem.icon className='mr-2 h-4 w-4' />
                            {isSideBarOpen&&menuItem.label}
                        </Button>)}
                    </nav>
                </div>
            </aside>
            <main className="flex-1 md:p-8 mt-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {menuItems.map(menuItem => <TabsContent value={menuItem.value} key={menuItem.value}>
                            {
                                menuItem.component !== null ? menuItem.component : null
                            }
                        </TabsContent>)}
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default InstructorDashboardPage;
