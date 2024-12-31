import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App.jsx';
import AuthProvider from './context/auth-context';
import InstructorProvider from './context/instructor-context';
import StudentProvider from './context/student-context';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter
      basename='/skillspring/'
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AuthProvider>
        <InstructorProvider>
          <StudentProvider>
            <App />
          </StudentProvider>
        </InstructorProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
