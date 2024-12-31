import { Navigate, useLocation } from "react-router-dom";
import { Fragment, useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function RouteGuard({ element }) {
    const location = useLocation();
    const { auth } = useContext(AuthContext);
    const authenticate = auth?.authenticate;
    const user = auth?.user;
    if (!sessionStorage.getItem('accessToken')) {

        if (!authenticate && !location.pathname.includes("/auth")) {
            return <Navigate to="/auth" />;
        }
    }

    if (
        authenticate &&
        user?.role !== "instructor" &&
        (location.pathname.includes("instructor") ||
            location.pathname.includes("/auth"))
    ) {
        return <Navigate to="/student" />;
    }

    if (
        authenticate &&
        user?.role === "instructor" &&
        !location.pathname.includes("instructor")
    ) {
        return <Navigate to="/instructor" />;
    }

    return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
