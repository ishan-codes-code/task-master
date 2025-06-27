import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar";
import Login from "./components/login";
import Signup from "./components/signup";
import ToasterStyles from "./components/toasterStyles";
import AuthRoute from "./service/authRoute";
import { useMyContext } from "./context/Context";
import { useEffect, useState } from "react";
import { refreshAccessToken } from "./service/authService";
import { jwtDecode } from "jwt-decode";
import Dashboard from "./components/dashboard";
import Tasks from "./components/tasks";
import WorkSpace from "./pages/workspace";
import Project from "./components/project";
import { attachToken, responseInterceptor } from "./service/apiService";
import Bin from "./components/bin";
import ProjectDetails from "./components/projectDetails";

function App() {
  const { accessToken, setAccessToken } = useMyContext();
  // console.log(accessToken);
  useEffect(() => {
    if (!accessToken) {
      const fetchData = async () => {
        const updatedAccessToken = await refreshAccessToken(setAccessToken);
        if (updatedAccessToken) {
          attachToken(updatedAccessToken);
        }
      };

      fetchData();

      // Setup response interceptor only once
      responseInterceptor(setAccessToken);
    }
  }, []);

 

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <AuthRoute forLogedIn={true} redirectTo="/dashboard">
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute forLogedIn={true} redirectTo="/dashboard">
              <Signup />
            </AuthRoute>
          }
        />

        <Route
          element={
            <AuthRoute forLogedIn={false} redirectTo="/login">
              <WorkSpace />
            </AuthRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/project" element={<Project />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/bin" element={<Bin />} />
        </Route>
      </Routes>

      <ToasterStyles />
    </div>
  );
}

export default App;
