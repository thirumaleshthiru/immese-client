import { Routes,Route } from "react-router-dom"
import Home from "../pages/Home"
import StudentLogin from "../pages/StudentLogin"
import StudentRegister from "../pages/StudentRegister"
import TeacherRegister from "../pages/TeacherRegister"
import TeacherLogin from "../pages/TeacherLogin"
import StudentDashboard from "../pages/StudentDashboard"
import TeacherDashboard from "../pages/TeacherDashboard"
import CreateClass from "../pages/CreateClass"
import ManageClasses from "../pages/ManageClasses"
import ClassAttendance from "../pages/ClassAttendance"
import CreateNotes from "../pages/CreateNotes"
import ManageNotes from "../pages/ManageNotes"
import VRVideoPlayer from '../pages/VRScreen'
import StudentLiveClasses from "../pages/StudentLiveClasses"
import Notes from "../pages/Notes"
import NormalClass from "../pages/NormalClass"
import StudentPreviousClasses from "../pages/StudentPreviousClasses"
import Analytics from "../pages/Analytics"
function Routex() {
  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/studentregister" element={<StudentRegister/>} />
        <Route path="/studentlogin" element={<StudentLogin/>} />
        <Route path="/teacherregister" element={<TeacherRegister/>} />
        <Route path="/teacherlogin" element={<TeacherLogin/>} />
        <Route path="/studentdashboard" element={<StudentDashboard/>} />
        <Route path="/teacherdashboard" element={<TeacherDashboard/>} />
        <Route path="/createclass" element = {<CreateClass />} />
        <Route path="/manageclasses" element = {<ManageClasses />} />
        <Route path="/classattendance/:class_id" element = {<ClassAttendance />} />
        <Route path="/createnotes/:class_id" element = {<CreateNotes />} />
        <Route path="/managenotes/:class_id" element = {<ManageNotes />} />
        <Route path="/liveclass" element = {<StudentLiveClasses />} />
        <Route path="/notes/:class_id" element = {<Notes />} />
        <Route path="/class/:classId" element= {<NormalClass />}/>
        <Route path="/previousclass" element= {<StudentPreviousClasses />}/>
        <Route path="/vrpage/:classId" element= {<VRVideoPlayer />}/>
        <Route path="/analytics" element= {<Analytics />}/>

    </Routes>
  )
}

export default Routex