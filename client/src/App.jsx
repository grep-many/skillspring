import React, { useContext, useEffect } from 'react';
import AuthPage from './pages/auth';
import { Routes, Route, Navigate } from "react-router-dom";
import RouteGuard from './components/route-guard';
import InstructorRoutes from './routes/InstructorRoutes';
import StudentRoutes from './routes/StudentRoutes';
import HomePage from './pages/home';
import { AuthContext } from './context/auth-context';
import ServerCheck from './pages/server/ServerCheck';
import ServerBad from './pages/server/ServerBad';
import { ToastContainer } from 'react-toastify';
import StudentViewCommonLayout from './components/student-view/common-layout';
import PaypalPaymentReturnPage from './pages/student/payment-return';


const App = () => {

  const {
    checkServerStatus,
    serverStatus,
  } = useContext(AuthContext);

  useEffect(() => {
    checkServerStatus();
  }, [])

  if (serverStatus === null) {
    return (
      <ServerCheck />
    );
  }

  if (serverStatus === false) {
    // Show an error screen if the server is down
    return (
      <ServerBad />
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path=''
          element={<StudentViewCommonLayout />}
        >
          <Route
            path='/auth'
            element={
              <RouteGuard
                element={<AuthPage />}
              />}
          />
          <Route
            path='/instructor/*'
            element={
              <RouteGuard
                element={<InstructorRoutes />}
              />}
          />
          <Route
            path='/student/*'
            element={
              <RouteGuard
                element={<StudentRoutes />}
              />}
          />
          <Route
            path='/payment-return'
            element={<PaypalPaymentReturnPage />}
          />
          <Route
            path='/payment-cancel'
            element={<PaypalPaymentReturnPage />}
          />
          <Route
            path='*'
            element={
              <RouteGuard
                element={<Navigate to='/auth' />}
              />}
          />
          <Route
            path='/'
            element={
              <HomePage />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
