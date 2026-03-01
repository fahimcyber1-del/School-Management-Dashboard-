import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './modules/dashboard/Dashboard';
import StudentsList from './modules/students/StudentsList';
import TeachersModule from './modules/teachers/TeachersModule';
import TeacherProfile from './modules/teachers/TeacherProfile';
import TeacherDashboard from './modules/teachers/TeacherDashboard';
import AcademicModule from './modules/academic/AcademicModule';
import StudentAttendance from './modules/attendance/StudentAttendance';
import ExamsModule from './modules/exams/ExamsModule';
import FeesCollection from './modules/fees/FeesCollection';
import SettingsModule from './modules/settings/SettingsModule';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="academic" element={<AcademicModule />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="teachers" element={<TeachersModule />} />
          <Route path="teachers/:id" element={<TeacherProfile />} />
          <Route path="teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="exams" element={<ExamsModule />} />
          <Route path="fees" element={<FeesCollection />} />
          <Route path="settings" element={<SettingsModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
