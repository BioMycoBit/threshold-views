import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Neurosity } from "@neurosity/sdk";

import { ProvideNeurosity } from "./services/neurosity";
import { AudioProvider } from "./context/AudioContext";
import { Devices } from "./pages/Devices";
import { Loading } from "./components/Loading";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Calm } from "./pages/Calm";
import { useNeurosity } from "./services/neurosity";
import { Focus } from "./pages/Focus";
import { Dashboard } from "./pages/Dashboard";
import { Footer } from "./components/Footer";

const neurosity = new Neurosity({
  autoReconnect: true,
  timesync: true,
  deviceId: process.env.REACT_APP_DEVICE_ID,
});

function RequireAuth({ children }) {
  const { user, loadingUser } = useNeurosity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    }
  }, [user, loadingUser, navigate]);

  if (loadingUser) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function App() {
  useEffect(() => {
    return () => {
      neurosity.disconnect();
    };
  }, []);

  return (
    <AudioProvider>
      <ProvideNeurosity>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/devices"
                element={
                  <RequireAuth>
                    <Devices />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/calm" element={<Calm />} />
              <Route path="/focus" element={<Focus />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </ProvideNeurosity>
    </AudioProvider>
  );
}