import { GraduationCap, LogIn, LogOut, Menu, SearchCode, TvMinimalPlay, X } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/auth-context';

const StudentViewCommonHeader = () => {
    const { auth, navigate, location } = useContext(AuthContext);
    const [navbarOpen, setNavbarOpen] = useState(false);
    const { resetCredentials } = useContext(AuthContext);

    function handleLogout() {
        sessionStorage.clear();
        resetCredentials();
    }

    return (
        <header
            className={`flex items-center justify-between p-4 border-b ${!(location.pathname.includes('auth') || location.pathname.includes('student') || location.pathname.includes('instructor')) ?'fixed w-full':'sticky'} top-0 z-20 transition-all duration-300 ease-in-out ${location.pathname.includes('student') ? 'bg-white' : 'backdrop-blur bg-opacity-20 bg-white'}`}
        >
            {/* Left Section: Logo */}
            <div className="flex items-center space-x-4">
                <Link
                    to={auth.authenticate?auth.user.role==='instructor'?"/instructor":"/student":'/'}
                    className="flex items-center hover:text-black transition-all duration-300 ease-in-out"
                    onClick={() => setNavbarOpen(false)}
                >
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold md:text-xl text-[14px]">SkillSpring</span>
                </Link>
            </div>

            {/* Join Button or Hamburger Menu */}
            {!(location.pathname.includes('auth') ||location.pathname.includes('payment-return') || location.pathname.includes('student') || location.pathname.includes('instructor')) ? (
                <Button
                    onClick={() => navigate('/auth')}
                    className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-all duration-300"
                >
                    <LogIn className="w-5 h-5" />
                    Join
                </Button>
            ) : location.pathname.includes('auth')?null:(
                <>
                    {/* Hamburger Menu for Mobile */}
                    <button
                        className="md:hidden flex items-center"
                        onClick={() => setNavbarOpen(!navbarOpen)}
                    >
                        {navbarOpen ? (
                            <X className="w-6 h-6 transition-all duration-300" />
                        ) : (
                            <Menu className="w-6 h-6 transition-all duration-300" />
                        )}
                    </button>

                    {/* Navigation Links */}
                    <nav
                        className={`absolute md:static top-16 md:top-auto left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none z-20 flex flex-col md:flex-row md:items-center transition-all duration-300 ease-in-out ${navbarOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 md:opacity-100'
                            } overflow-hidden md:overflow-visible`}
                    >
                        {auth.authenticate ? (
                            <>
                                <Link
                                    to="/student/courses"
                                    className="px-4 py-2 md:px-4 flex items-center gap-2 hover:bg-gray-100 md:hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                                    onClick={() => setNavbarOpen(false)}
                                >
                                    <SearchCode className="w-5 h-5" />
                                    <span>Explore Courses</span>
                                </Link>
                                <Link
                                    to="/student/student-courses"
                                    className="px-4 py-2 md:px-4 flex items-center gap-2 hover:bg-gray-100 md:hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                                    onClick={() => setNavbarOpen(false)}
                                >
                                    <TvMinimalPlay className="w-5 h-5" />
                                    <span>My Courses</span>
                                </Link>
                                <Button
                                    onClick={handleLogout}
                                    className="px-4 py-2 md:px-4 flex items-center gap-2 bg-red-200 text-red-900 hover:bg-red-600 rounded-lg hover:text-white transition-all duration-300"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </Button>
                            </>
                        ) : null}
                    </nav>
                </>
            )}
        </header>
    );
};

export default StudentViewCommonHeader;
