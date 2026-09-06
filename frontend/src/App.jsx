import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./context/AuthContext";
import VideoMeetComponent from "./pages/VideoMeetComponent";
import HomeComponent from "./pages/HomeComponent";
import History from "./pages/history";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<HomeComponent/>} />     
          <Route path="/history" element={<History/>} />     
              
          <Route path="/:url" element={<VideoMeetComponent/>} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;