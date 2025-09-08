import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AddCourses from "./pages/AddCourses.jsx";
import UpdateCourses from "./pages/UpdateCourses.jsx";
import ViewCourses from "./pages/ViewCourses.jsx";
import ShowUsers from "./pages/showUsers.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(
    sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
  );

  useEffect(() => {
    sessionStorage.setItem("token", token);
  }, [token]);

  return (
    <>
      <div>
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Routes>
              <Route
                path="/"
                element={<AddCourses token={token} setToken={setToken} />}
              />
              <Route
                path="/update"
                element={<UpdateCourses token={token} setToken={setToken} />}
              />
              <Route
                path="/view"
                element={<ViewCourses token={token} setToken={setToken} />}
              />
              <Route
                path="/users"
                element={<ShowUsers token={token} setToken={setToken} />}
              />
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default App;
