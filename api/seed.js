require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('./models/User');
const Post = require('./models/Post');
const Classroom = require('./models/Classroom');
const Subject = require('./models/Subject');
const Assignment = require('./models/Assignment');

// --- Mock Data ---
// We're copying the data from the frontend's useMockData hook
const MOCK_USERS = [
  {
    id: 'student01',
    name: 'Alex Johnson',
    role: 'Student',
    avatar: 'https://picsum.photos/seed/student/200',
    bio: 'Computer Science sophomore. Passionate about AI and mobile development. Coffee enthusiast.',
    stats: { posts: 12, followers: 1, following: 2 },
    skills: ['React', 'TypeScript', 'Python', 'UI/UX Design'],
    achievements: ['Dean\'s List 2023', 'Hackathon Winner \'24'],
    uucms: 'UUCMS001',
    personalNumber: '9876543210',
    classroomId: 'bca_2a',
    coins: 150,
    followingIds: ['faculty01', 'student02'],
    followerIds: ['student02', 'faculty01'],
  },
  {
    id: 'student02',
    name: 'Maria Garcia',
    role: 'Student',
    avatar: 'https://picsum.photos/seed/student2/200',
    bio: 'Business Administration student.',
    stats: { posts: 5, followers: 1, following: 1 },
    skills: ['Marketing', 'Public Speaking'],
    achievements: ['Best Presentation Award'],
    uucms: 'UUCMS002',
    personalNumber: '9876543211',
    classroomId: 'bba_2a',
    coins: 75,
    followingIds: ['student01'],
    followerIds: ['student01'],
  },
  {
    id: 'student03',
    name: 'Sam Wilson',
    role: 'Student',
    avatar: 'https://picsum.photos/seed/student3/200',
    bio: 'Loves DSA.',
    stats: { posts: 8, followers: 0, following: 1 },
    skills: ['Algorithms', 'Data Structures'],
    achievements: [],
    uucms: 'UUCMS003',
    personalNumber: '9876543212',
    classroomId: 'bca_2a',
    coins: 200,
    followingIds: ['faculty01'],
    followerIds: [],
  },
  {
    id: 'faculty01',
    name: 'Dr. Evelyn Reed',
    role: 'Faculty',
    avatar: 'https://picsum.photos/seed/faculty/200',
    bio: 'Professor in the Computer Science department. Research focus on machine learning and natural language processing.',
    stats: { posts: 5, followers: 1, following: 1 },
    skills: ['Machine Learning', 'NLP', 'Academia', 'Research'],
    achievements: ['Published 15+ research papers', 'IEEE Senior Member'],
    coins: 0,
    followingIds: ['admin01'],
    followerIds: ['student01', 'student03'],
  },
   {
    id: 'faculty02',
    name: 'Dr. Alan Grant',
    role: 'Faculty',
    avatar: 'https://picsum.photos/seed/faculty2/200',
    bio: 'Professor in the Business department.',
    stats: { posts: 3, followers: 0, following: 0 },
    skills: ['Business Strategy', 'Economics'],
    achievements: ['Author of "Modern Business"'],
    coins: 0,
    followingIds: [],
    followerIds: [],
  },
  {
    id: 'admin01',
    name: 'Mark Davis',
    role: 'Admin',
    avatar: 'https://picsum.photos/seed/admin/200',
    bio: 'Campus Administrator. Working to make our campus a better place for everyone.',
    stats: { posts: 25, followers: 1, following: 0 },
    skills: ['Management', 'Public Relations', 'Event Planning'],
    achievements: ['Campus Improvement Award', '10 Years of Service'],
    coins: 0,
    followingIds: [],
    followerIds: ['faculty01'],
  },
];

const MOCK_POSTS = [
  {
    id: 'post01',
    author: MOCK_USERS.find(u => u.id === 'student01'),
    mediaUrl: 'https://picsum.photos/seed/post1/600/400',
    mediaType: 'image',
    thumbnailUrl: 'https://picsum.photos/seed/post1/600/400',
    caption: 'Late night coding session for the final project. Wish me luck! ☕️💻 #cs #devlife',
    likes: 42,
    comments: 8,
    timestamp: '2h ago',
  },
  {
    id: 'post02',
    author: MOCK_USERS.find(u => u.id === 'faculty01'),
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    mediaType: 'video',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    caption: 'Reminder: The submission deadline for the CS101 project is this Friday. Please upload your work to the portal by 11:59 PM.',
    likes: 89,
    comments: 15,
    timestamp: '1d ago',
    isNotice: true,
  },
   {
    id: 'post03',
    author: MOCK_USERS.find(u => u.id === 'admin01'),
    mediaUrl: 'https://picsum.photos/seed/post3/600/400',
    mediaType: 'image',
    thumbnailUrl: 'https://picsum.photos/seed/post3/600/400',
    caption: 'Preparations for the annual college fest are in full swing! Get ready for an amazing week of events. #CampusFest2024',
    likes: 250,
    comments: 34,
    timestamp: '3d ago',
    isNotice: true,
  },
];
const MOCK_SUBJECTS = [
    { id: 'cs101', name: 'Data Structures', code: 'CS101' },
    { id: 'cs102', name: 'Algorithms', code: 'CS102' },
    { id: 'cs103', name: 'Database Systems', code: 'CS103' },
    { id: 'os201', name: 'Operating Systems', code: 'OS201'},
    { id: 'ba101', name: 'Marketing Principles', code: 'BA101' },
    { id: 'ba102', 'name': 'Microeconomics', code: 'BA102' },
];
const MOCK_CLASSROOMS = [
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
const MOCK_ASSIGNMENTS = [
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
// --- End Mock Data ---


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Subject.deleteMany({});
    await Classroom.deleteMany({});
    await Assignment.deleteMany({});
    console.log('Cleared existing data.');

    // Insert new data
    await User.insertMany(MOCK_USERS);
    await Post.insertMany(MOCK_POSTS);
    await Subject.insertMany(MOCK_SUBJECTS);
    await Classroom.insertMany(MOCK_CLASSROOMS);
    await Assignment.insertMany(MOCK_ASSIGNMENTS);
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDatabase();