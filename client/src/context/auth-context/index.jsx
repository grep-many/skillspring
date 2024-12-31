import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, checkServerHealthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [serverStatus, setServerStatus] = useState(null)
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('signup');
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null,
    });
    const navigate = useNavigate();

    const location = useLocation();

    async function checkServerStatus() {
        try {
            const response = await checkServerHealthService();
            if (response.success) {
                setServerStatus(true)
            } else {
                console.log(response)
                setServerStatus(false);
                toast.error('something went wrong while checking server')
            }
        } catch (err) {
            setServerStatus(false)
            console.log(err)
        }
    }

    async function handleRegisterUser(e) {
        e.preventDefault();
        setProgress(0)
        try {
            const { confirmPassword, ...dataToSubmit } = signUpFormData;

            const response = await registerService(dataToSubmit, setProgress);

            if (response?.success) {
                sessionStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
                setAuth({
                    authenticate: true,
                    user: response.data.user,
                });
                toast.success(response?.message)
            } else {
                if (response?.status) {
                    toast.error(response?.data?.message)
                }
            }

        } catch (err) {
            sessionStorage.clear();
            setAuth({
                authenticate: false,
                user: null,
            });
            console.error(err);
            toast.error('something went wrong while sign up');
        } finally {
            setProgress(100)
        }
    }

    async function handleLoginUser(e) {
        e.preventDefault();
        setProgress(0);
        try {

            const response = await loginService(signInFormData, setProgress);

            if (response?.success) {
                sessionStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
                setAuth({
                    authenticate: true,
                    user: response.data.user,
                });
                toast.success(response?.message)
            } else {

                if (response?.status) {
                    toast.error(response?.data?.message)
                }
            }
        } catch (err) {
            sessionStorage.clear();
            setAuth({
                authenticate: false,
                user: null,
            });
            console.error(err)
            toast.error('Something went wrong')
        } finally {
            setProgress(100);
        }
    }

    async function checkAuthUser() {
        if (!sessionStorage.getItem('accessToken') && (location.pathname.includes('auth') || location.pathname === '/')) {
            return
        }

        setProgress(0);
        try {
            const response = await checkAuthService(setProgress);
            if (response.success) {
                setAuth({
                    authenticate: true,
                    user: response.data.user,
                });
            } else {
                setAuth({
                    authenticate: false,
                    user: null,
                });
            }
        } catch (error) {
            console.error('Error during auth check');
            setAuth({
                authenticate: false,
                user: null,
            });
        } finally {
            setProgress(100);
        }
    }

    function resetCredentials() {
        setAuth({
            authenticate: false,
            user: null
        })
        toast.success('Logout Successfully')
    }

    useEffect(() => {
        setProgress(100); // Initial progress indicator
        checkAuthUser();

        const timer = setTimeout(() => {
            setProgress(0);
        }, 500);

        return () => clearTimeout(timer); // Cleanup on component unmount
    }, [location]);


    return (
        <AuthContext.Provider value={{
            signInFormData,
            setSignInFormData,
            signUpFormData,
            setSignUpFormData,
            handleRegisterUser,
            handleLoginUser,
            auth,
            progress,
            setProgress,
            resetCredentials,
            navigate,
            location,
            checkServerStatus,
            serverStatus,
            activeTab, 
            setActiveTab,
        }}>
            <LoadingBar color='#000' progress={progress} />
            {children}
        </AuthContext.Provider>
    );
}
