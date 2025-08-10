import { User, AttendanceRecord, Course, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@university.edu',
    role: 'student',
    studentId: 'STU001',
    department: 'Computer Science',
    profilePicture: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'lecturer',
    department: 'Computer Science',
    profilePicture: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'admin@university.edu',
    role: 'admin',
    department: 'Administration',
    profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'CS101',
    name: 'Introduction to Programming',
    code: 'CS101',
    lecturer: 'Dr. Sarah Johnson',
    schedule: 'Mon, Wed, Fri 9:00 AM',
    students: ['1', '4', '5', '6']
  },
  {
    id: 'CS201',
    name: 'Data Structures',
    code: 'CS201',
    lecturer: 'Dr. Sarah Johnson',
    schedule: 'Tue, Thu 2:00 PM',
    students: ['1', '7', '8', '9']
  },
  {
    id: 'MATH101',
    name: 'Calculus I',
    code: 'MATH101',
    lecturer: 'Dr. Robert Wilson',
    schedule: 'Mon, Wed, Fri 11:00 AM',
    students: ['1', '4', '5', '10']
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Smith',
    courseId: 'CS101',
    courseName: 'Introduction to Programming',
    date: '2025-01-15',
    time: '09:05',
    status: 'present',
    location: 'Room A101'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'John Smith',
    courseId: 'CS201',
    courseName: 'Data Structures',
    date: '2025-01-14',
    time: '14:10',
    status: 'late',
    location: 'Room B205'
  },
  {
    id: '3',
    studentId: '1',
    studentName: 'John Smith',
    courseId: 'MATH101',
    courseName: 'Calculus I',
    date: '2025-01-13',
    time: '11:00',
    status: 'present',
    location: 'Room C301'
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'Emily Davis',
    courseId: 'CS101',
    courseName: 'Introduction to Programming',
    date: '2025-01-15',
    time: '09:02',
    status: 'present',
    location: 'Room A101'
  },
  {
    id: '5',
    studentId: '5',
    studentName: 'David Wilson',
    courseId: 'CS101',
    courseName: 'Introduction to Programming',
    date: '2025-01-15',
    time: '09:15',
    status: 'late',
    location: 'Room A101'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 1250,
  totalClasses: 45,
  attendancePercentage: 87.5,
  todayAttendance: 892
};

// Mock API functions
export const mockFaceRecognition = async (imageData: string): Promise<{ success: boolean; studentId?: string; confidence?: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful recognition
  return {
    success: true,
    studentId: '1',
    confidence: 0.95
  };
};

export const mockAttendanceSubmission = async (studentId: string, courseId: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: 'Attendance recorded successfully!'
  };
};