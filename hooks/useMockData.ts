
import { createContext } from 'react';
import { User, Post, UserRole, AttendanceRecord, Subject, Classroom, Assignment, Story, Comment } from '../types';

export const UserContext = createContext<User | null>(null);

const MOCK_USERS_RAW: Omit<User, 'followerIds' | 'followingIds'>[] = [
  {
    id: 'student01',
    name: 'Alex Johnson',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/seed/student/200',
    bio: 'Computer Science sophomore. Passionate about AI and mobile development. Coffee enthusiast.',
    stats: { posts: 12, followers: 1, following: 2 },
    skills: ['React', 'TypeScript', 'Python', 'UI/UX Design'],
    achievements: ['Dean\'s List 2023', 'Hackathon Winner \'24'],
    uucms: 'UUCMS001',
    personalNumber: '9876543210',
    classroomId: 'bca_2a',
    coins: 150,
  },
  {
    id: 'student02',
    name: 'Maria Garcia',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/seed/student2/200',
    bio: 'Business Administration student.',
    stats: { posts: 5, followers: 1, following: 1 },
    skills: ['Marketing', 'Public Speaking'],
    achievements: ['Best Presentation Award'],
    uucms: 'UUCMS002',
    personalNumber: '9876543211',
    classroomId: 'bba_2a',
    coins: 75,
  },
  {
    id: 'student03',
    name: 'Sam Wilson',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/seed/student3/200',
    bio: 'Loves DSA.',
    stats: { posts: 8, followers: 0, following: 1 },
    skills: ['Algorithms', 'Data Structures'],
    achievements: [],
    uucms: 'UUCMS003',
    personalNumber: '9876543212',
    classroomId: 'bca_2a',
    coins: 200,
  },
  {
    id: 'faculty01',
    name: 'Dr. Evelyn Reed',
    role: UserRole.FACULTY,
    avatar: 'https://picsum.photos/seed/faculty/200',
    bio: 'Professor in the Computer Science department. Research focus on machine learning and natural language processing.',
    stats: { posts: 5, followers: 1, following: 1 },
    skills: ['Machine Learning', 'NLP', 'Academia', 'Research'],
    achievements: ['Published 15+ research papers', 'IEEE Senior Member'],
    coins: 0,
  },
   {
    id: 'faculty02',
    name: 'Dr. Alan Grant',
    role: UserRole.FACULTY,
    avatar: 'https://picsum.photos/seed/faculty2/200',
    bio: 'Professor in the Business department.',
    stats: { posts: 3, followers: 0, following: 0 },
    skills: ['Business Strategy', 'Economics'],
    achievements: ['Author of "Modern Business"'],
    coins: 0,
  },
  {
    id: 'admin01',
    name: 'Mark Davis',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/admin/200',
    bio: 'Campus Administrator. Working to make our campus a better place for everyone.',
    stats: { posts: 25, followers: 1, following: 0 },
    skills: ['Management', 'Public Relations', 'Event Planning'],
    achievements: ['Campus Improvement Award', '10 Years of Service'],
    coins: 0,
  },
];


const MOCK_USERS: User[] = MOCK_USERS_RAW.map(u => {
    let followingIds: string[] = [];

    switch(u.id) {
        case 'student01':
            followingIds = ['faculty01', 'student02'];
            break;
        case 'student02':
            followingIds = ['student01'];
            break;
        case 'student03':
            followingIds = ['faculty01'];
            break;
        case 'faculty01':
            followingIds = ['admin01'];
            break;
    }
    
    return {
        ...u,
        followerIds: [], // We'll populate this in a second pass
        followingIds,
        stats: { ...u.stats, following: followingIds.length }
    };
});

// Second pass to populate followerIds and stats.followers
MOCK_USERS.forEach(user => {
    const followers = MOCK_USERS.filter(otherUser => otherUser.followingIds.includes(user.id));
    user.followerIds = followers.map(f => f.id);
    user.stats.followers = user.followerIds.length;
});

const MOCK_ROLE_USERS: Record<UserRole, User> = {
    [UserRole.STUDENT]: MOCK_USERS.find(u => u.id === 'student01')!,
    [UserRole.FACULTY]: MOCK_USERS.find(u => u.id === 'faculty01')!,
    [UserRole.ADMIN]: MOCK_USERS.find(u => u.id === 'admin01')!,
};

const MOCK_COMMENTS: Record<string, Comment[]> = {
    post01: [
        { id: 'c1', author: MOCK_USERS.find(u => u.id === 'faculty01')!, text: 'Looking great! Keep up the hard work.', timestamp: '1h ago' },
        { id: 'c2', author: MOCK_USERS.find(u => u.id === 'student02')!, text: 'So cool! Good luck!', timestamp: '30m ago' },
    ],
    post02: [
        { id: 'c3', author: MOCK_USERS.find(u => u.id === 'student01')!, text: 'Thanks for the reminder, Dr. Reed!', timestamp: '12h ago' }
    ],
    post03: [],
};


const MOCK_POSTS: Post[] = [
  {
    id: 'post01',
    author: MOCK_USERS.find(u => u.id === 'student01')!,
    mediaUrl: 'https://picsum.photos/seed/post1/600/400',
    mediaType: 'image',
    thumbnailUrl: 'https://picsum.photos/seed/post1/600/400',
    caption: 'Late night coding session for the final project. Wish me luck! ☕️💻 #cs #devlife',
    likes: ['faculty01', 'student02'],
    comments: MOCK_COMMENTS.post01,
    timestamp: '2h ago',
  },
  {
    id: 'post02',
    author: MOCK_USERS.find(u => u.id === 'faculty01')!,
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    mediaType: 'video',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    caption: 'Reminder: The submission deadline for the CS101 project is this Friday. Please upload your work to the portal by 11:59 PM.',
    likes: ['student01', 'student03', 'admin01'],
    comments: MOCK_COMMENTS.post02,
    timestamp: '1d ago',
    isNotice: true,
  },
   {
    id: 'post03',
    author: MOCK_USERS.find(u => u.id === 'admin01')!,
    mediaUrl: 'https://picsum.photos/seed/post3/600/400',
    mediaType: 'image',
    thumbnailUrl: 'https://picsum.photos/seed/post3/600/400',
    caption: 'Preparations for the annual college fest are in full swing! Get ready for an amazing week of events. #CampusFest2024',
    likes: ['student01', 'student02', 'faculty01'],
    comments: MOCK_COMMENTS.post03,
    timestamp: '3d ago',
    isNotice: true,
  },
];

const MOCK_STORIES: Story[] = [
    { id: 'story01', author: MOCK_USERS.find(u => u.id === 'faculty01')!, mediaUrl: 'https://picsum.photos/seed/story1/400/800', mediaType: 'image', timestamp: '3h ago' },
    { id: 'story02', author: MOCK_USERS.find(u => u.id === 'student02')!, mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', mediaType: 'video', timestamp: '5h ago' },
    { id: 'story03', author: MOCK_USERS.find(u => u.id === 'student02')!, mediaUrl: 'https://picsum.photos/seed/story3/400/800', mediaType: 'image', timestamp: '4h ago' },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { subject: 'Data Structures', attended: 28, total: 30 },
    { subject: 'Algorithms', attended: 25, total: 30 },
    { subject: 'Database Systems', attended: 29, total: 30 },
    { subject: 'Operating Systems', attended: 22, total: 30 },
];

const MOCK_SUBJECTS: Subject[] = [
    { id: 'cs101', name: 'Data Structures', code: 'CS101' },
    { id: 'cs102', name: 'Algorithms', code: 'CS102' },
    { id: 'cs103', name: 'Database Systems', code: 'CS103' },
    { id: 'os201', name: 'Operating Systems', code: 'OS201'},
    { id: 'ba101', name: 'Marketing Principles', code: 'BA101' },
    { id: 'ba102', 'name': 'Microeconomics', code: 'BA102' },
];

const MOCK_CLASSROOMS: Classroom[] = [
    {
        id: 'bca_2a',
        name: 'BCA - 2A',
        department: 'Computer Applications',
        semester: 2,
        course: 'Bachelor of Computer Applications',
        coordinatorId: 'faculty01',
        studentIds: ['student01', 'student03'],
        subjectIds: ['cs101', 'cs102', 'cs103'],
        timetable: [
            { day: 'Monday', startTime: '10:00', endTime: '11:00', subjectId: 'cs101', facultyId: 'faculty01' },
            { day: 'Tuesday', startTime: '11:00', endTime: '12:00', subjectId: 'cs102', facultyId: 'faculty01' },
            { day: 'Wednesday', startTime: '09:00', endTime: '10:00', subjectId: 'cs103', facultyId: 'faculty01' },
            { day: 'Thursday', startTime: '10:00', endTime: '11:00', subjectId: 'cs101', facultyId: 'faculty01' },
            { day: 'Friday', startTime: '11:00', endTime: '12:00', subjectId: 'cs102', facultyId: 'faculty01' },
        ]
    },
    {
        id: 'bba_2a',
        name: 'BBA - 2A',
        department: 'Business Administration',
        semester: 2,
        course: 'Bachelor of Business Administration',
        coordinatorId: 'faculty02',
        studentIds: ['student02'],
        subjectIds: ['ba101', 'ba102'],
        timetable: [
            { day: 'Monday', startTime: '10:00', endTime: '11:00', subjectId: 'ba101', facultyId: 'faculty02' },
            { day: 'Tuesday', startTime: '11:00', endTime: '12:00', subjectId: 'ba102', facultyId: 'faculty02' },
            { day: 'Wednesday', startTime: '09:00', endTime: '10:00', subjectId: 'ba101', facultyId: 'faculty02' },
        ]
    }
];

const MOCK_ASSIGNMENTS: Assignment[] = [
    {
        id: 'asg01',
        classroomId: 'bca_2a',
        subjectId: 'cs101',
        facultyId: 'faculty01',
        title: 'Data Structures - Lab 1',
        description: 'Implement a linked list with insert, delete, and search operations.',
        assignedDate: '2024-09-05',
        submissionDate: '2024-09-15',
    },
    {
        id: 'asg02',
        classroomId: 'bca_2a',
        subjectId: 'cs102',
        facultyId: 'faculty01',
        title: 'Algorithm Design Worksheet',
        description: 'Solve the attached problems related to Big-O notation and recursion.',
        assignedDate: '2024-09-10',
        submissionDate: '2024-09-24',
    },
    {
        id: 'asg03',
        classroomId: 'bba_2a',
        subjectId: 'ba101',
        facultyId: 'faculty02',
        title: 'Marketing Plan Proposal',
        description: 'Draft a one-page marketing plan for a fictional startup. Details in the portal.',
        assignedDate: '2024-09-01',
        submissionDate: '2024-09-20',
    },
];

export const useMockData = () => ({
  roleUsers: MOCK_ROLE_USERS,
  allUsers: MOCK_USERS,
  posts: MOCK_POSTS,
  stories: MOCK_STORIES,
  attendance: MOCK_ATTENDANCE,
  subjects: MOCK_SUBJECTS,
  classrooms: MOCK_CLASSROOMS,
  assignments: MOCK_ASSIGNMENTS,
});