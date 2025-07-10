
export enum UserRole {
  STUDENT = 'Student',
  FACULTY = 'Faculty',
  ADMIN = 'Admin',
}

export enum View {
  HOME = 'Home',
  SEARCH = 'Search',
  CREATE_POST = 'Create Post',
  CREATE_STORY = 'Create Story',
  ACADEMICS = 'Academics',
  PROFILE = 'Profile',
  NOTIFICATIONS = 'Notifications',
  CHAT = 'Chat',
  DASHBOARD = 'Dashboard',
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimetableSlot {
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  subjectId: string;
  facultyId: string;
}

export interface Classroom {
  id: string;
  name: string; // e.g., "BCA - 2A"
  department: string;
  semester: number;
  course: string; // e.g., "Bachelor of Computer Applications"
  coordinatorId: string; // faculty user ID
  studentIds: string[];
  subjectIds: string[];
  timetable: TimetableSlot[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  bio: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  followerIds: string[];
  followingIds: string[];
  skills: string[];
  achievements: string[];
  uucms?: string; // For students
  personalNumber?: string; // For students' OTP
  classroomId?: string; // For students
  coins?: number;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id:string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string; // For video grid previews
  caption: string;
  likes: string[];
  comments: Comment[];
  timestamp: string;
  isNotice?: boolean;
}

export interface Story {
  id: string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: string;
}


export interface AttendanceRecord {
    subject: string;
    attended: number;
    total: number;
}

export interface Assignment {
  id: string;
  classroomId: string;
  subjectId: string;
  facultyId: string;
  title: string;
  description: string;
  assignedDate: string; // e.g., '2024-09-10'
  submissionDate: string; // e.g., '2024-09-24'
}