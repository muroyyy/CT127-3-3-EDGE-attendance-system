import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import AttendanceTable from '../components/AttendanceTable';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { mockAttendanceRecords, mockDashboardStats } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderStudentDashboard = () => {
    // Filter records for current student
    const studentRecords = mockAttendanceRecords.filter(record => record.studentId === user?.id);
    const recentRecords = studentRecords.slice(0, 5);
    
    // Calculate student stats
    const totalClasses = studentRecords.length;
    const presentCount = studentRecords.filter(r => r.status === 'present').length;
    const lateCount = studentRecords.filter(r => r.status === 'late').length;
    const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="opacity-90">Here's your attendance overview for this semester.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon={TrendingUp}
            color="green"
            trend={{ value: 5.2, isPositive: true }}
          />
          <DashboardCard
            title="Classes Attended"
            value={presentCount}
            icon={CheckCircle}
            color="blue"
            subtitle="This semester"
          />
          <DashboardCard
            title="Late Arrivals"
            value={lateCount}
            icon={Clock}
            color="orange"
            subtitle="This semester"
          />
          <DashboardCard
            title="Total Classes"
            value={totalClasses}
            icon={BookOpen}
            color="purple"
            subtitle="Enrolled courses"
          />
        </div>

        {/* Recent Attendance */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attendance</h2>
          <AttendanceTable records={recentRecords} />
        </div>
      </div>
    );
  };

  const renderLecturerDashboard = () => {
    // Mock data for lecturer
    const todayAttendance = mockAttendanceRecords.filter(record => 
      record.date === new Date().toISOString().split('T')[0]
    );
    
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Good morning, {user?.name}!</h1>
          <p className="opacity-90">Manage your classes and track student attendance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Today's Classes"
            value="3"
            icon={Calendar}
            color="blue"
            subtitle="Scheduled for today"
          />
          <DashboardCard
            title="Students Present"
            value={todayAttendance.filter(r => r.status === 'present').length}
            icon={Users}
            color="green"
            subtitle="Currently checked in"
          />
          <DashboardCard
            title="Late Arrivals"
            value={todayAttendance.filter(r => r.status === 'late').length}
            icon={AlertTriangle}
            color="orange"
            subtitle="Today"
          />
          <DashboardCard
            title="Attendance Rate"
            value="89%"
            icon={TrendingUp}
            color="purple"
            trend={{ value: 3.1, isPositive: true }}
          />
        </div>

        {/* Today's Attendance */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Attendance</h2>
          <AttendanceTable 
            records={todayAttendance} 
            showStudentName={true}
            showActions={true}
            onExport={() => alert('Export functionality would be implemented here')}
          />
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white p-6">
          <h1 className="text-2xl font-bold mb-2">System Overview</h1>
          <p className="opacity-90">Monitor and manage the entire attendance system.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Students"
            value={mockDashboardStats.totalStudents.toLocaleString()}
            icon={Users}
            color="blue"
            trend={{ value: 12.5, isPositive: true }}
          />
          <DashboardCard
            title="Active Classes"
            value={mockDashboardStats.totalClasses}
            icon={BookOpen}
            color="green"
            subtitle="This semester"
          />
          <DashboardCard
            title="System Attendance Rate"
            value={`${mockDashboardStats.attendancePercentage}%`}
            icon={BarChart3}
            color="purple"
            trend={{ value: 2.3, isPositive: true }}
          />
          <DashboardCard
            title="Today's Check-ins"
            value={mockDashboardStats.todayAttendance}
            icon={CheckCircle}
            color="orange"
            subtitle="Students present today"
          />
        </div>

        {/* Recent System Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent System Activity</h2>
          <AttendanceTable 
            records={mockAttendanceRecords.slice(0, 10)} 
            showStudentName={true}
            showActions={true}
            onExport={() => alert('Export functionality would be implemented here')}
          />
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return renderStudentDashboard();
      case 'lecturer':
        return renderLecturerDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50 p-6">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;