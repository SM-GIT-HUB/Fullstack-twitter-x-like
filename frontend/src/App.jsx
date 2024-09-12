import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import ErrorPage from "./pages/ErrorPage"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import LoadingSpinner from "./components/common/LoadingSpinner"

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const response = await axios.get('/api/auth/me');
        const data = response.data;
        console.log(data);
        return data;
      }
      catch {
        return "";
      }
    }
  })

  return (
    <>
      {
        isLoading?
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner size="lg"/>
        </div> :
        <div className="flex max-w-6xl mx-auto">
          {
            authUser && <Sidebar/>
          }
          <Routes>
            <Route path="/" element={authUser? <HomePage/>: <Navigate to='/login'/>} />
            <Route path="/login" element={!authUser? <LoginPage/> : <Navigate to='/'/>} />
            <Route path="/signup" element={!authUser? <SignupPage/> : <Navigate to='/'/>} />
            <Route path="/notifications" element={authUser? <NotificationPage/> : <Navigate to='/login'/>} />
            <Route path="/profile/:username" element={authUser? <ProfilePage/>: <Navigate to='/login'/>} />

            <Route path="/:anything" element={<ErrorPage/>} />
            <Route path="/login/:anything" element={<ErrorPage/>} />
            <Route path="/signup/:anything" element={<ErrorPage/>} />
            <Route path="/notifications/:anything" element={<ErrorPage/>} />
            <Route path="/profile/:username/:anything" element={<ErrorPage/>} />
          </Routes>
          
          {
            authUser && <RightPanel/>
          }
          
          <Toaster/>
        </div>
      }
    </>
  )
}

export default App
