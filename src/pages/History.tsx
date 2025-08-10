import React, { useState } from 'react';
import AttendanceTable from '../components/AttendanceTable';
import { Calendar, Download, Filter, TrendingUp } from 'lucide-react';
import { mockAttendanceRecords } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const History: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Filter records based on user role
  const getFilteredRecords = () => {
    let records = mockAttendanceRecords;
    
    // Filter by user role
    if (user?.role === 'student') {
      records = records.filter(record => record.studentId === user.id);
    }
    
    // Filter by date range
    if (dateRange.start && dateRange.end) {
      records = records.filter(record => {
        const recordDate = new Date(record.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }
    
    // Filter by course
    if (selectedCourse !== 'all') {
      records = records.filter(record => record.courseId === selectedCourse);
    }
    
    return records;
  };

  const filteredRecords = getFilteredRecords();
  
  // Get unique courses for filter
  const uniqueCourses = Array.from(new Set(mockAttendanceRecords.map(record => ({
    id: record.courseId,
    name: record.courseName
  }))));

  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === 'present').length;
  const lateCount = filteredRecords.filter(r => r.status === 'late').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
  const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Time', 'Course', 'Status', 'Location'];
    if (user?.role !== 'student') {
      headers.splice(2, 0, 'Student Name', 'Student ID');
    }
    
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => {
        const row = [
          record.date,
          record.time,
          record.courseName,
          record.status,
          record.location || 'N/A'
        ];
        if (user?.role !== 'student') {
          row.splice(2, 0, record.studentName, record.studentId);
        }
        return row.join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'student':
        return 'My Attendance History';
      case 'lecturer':
        return 'Class Attendance Records';
      case 'admin':
        return 'System Attendance Records';
      default:
        return 'Attendance History';
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600">
            {user?.role === 'student' 
              ? 'View your complete attendance history and track your progress'
              : 'Monitor and analyze attendance patterns across the system'
            }
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late</p>
                <p className="text-2xl font-bold text-orange-600">{lateCount}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-600">{attendanceRate}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                setDateRange({ start: '', end: '' });
                setSelectedCourse('all');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <AttendanceTable 
          records={filteredRecords}
          showStudentName={user?.role !== 'student'}
          showActions={true}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default History;