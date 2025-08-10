export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  profilePicture?: string;
  studentId?: string;
  department?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  status: 'present' | 'absent' | 'late';
  location?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  schedule: string;
  students: string[];
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  attendancePercentage: number;
  todayAttendance: number;
}