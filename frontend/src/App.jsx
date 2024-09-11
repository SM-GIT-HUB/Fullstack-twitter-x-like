import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import ErrorPage from "./pages/ErrorPage"

function App() {

  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/notifications" element={<NotificationPage/>} />
        <Route path="/profile/:username" element={<ProfilePage/>} />
        <Route path="/profile/:username/:anything" element={<ErrorPage/>} />
        <Route path="/:anything" element={<ErrorPage/>} />
      </Routes>
      <RightPanel/>     
    </div>
  )
}

export default App
