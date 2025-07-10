import React, { useState, useMemo } from 'react';
import { User, UserRole, Classroom, TimetableSlot, DayOfWeek, Subject, AttendanceRecord, Assignment } from '../../types';
import { EditIcon, UsersIcon, PlusSquareIcon, FileTextIcon, XIcon, BookOpenIcon, UserCheckIcon, CalendarIcon, ClipboardPlusIcon } from '../Icon';
import CircularProgress from '../CircularProgress';

interface AcademicsViewProps {
  user: User;
  onManageStudents: (classroom: Classroom) => void;
  onEditTimetable: (classroom: Classroom) => void;
  onManageFaculty: (classroom: Classroom) => void;
  onManageSubjects: (classroom: Classroom) => void;
  allUsers: User[];
  classrooms: Classroom[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

const TimetableGrid: React.FC<{
  timetable: TimetableSlot[],
  subjects: Subject[],
  allUsers: User[],
  onSlotClick?: (slot: TimetableSlot, classroom: Classroom) => void,
  classroom?: Classroom
}> = ({ timetable, subjects, allUsers, onSlotClick, classroom }) => {
  const findSlot = (day: DayOfWeek, time: string) => {
    return timetable.find(s => s.day === day && s.startTime === time);
  };

  return (
    <div className="grid grid-cols-6 gap-1 text-center text-xs">
      <div className="font-bold text-slate-400 py-2">Time</div>
      {DAYS.map(day => <div key={day} className="font-bold text-slate-400 py-2">{day.substring(0, 3)}</div>)}
      
      {TIME_SLOTS.map(time => (
        <React.Fragment key={time}>
          <div className="font-bold text-slate-400 py-2 flex items-center justify-center">{time}</div>
          {DAYS.map(day => {
            const slot = findSlot(day, time);
            if (!slot) return <div key={day} className="bg-slate-800/50 rounded-md min-h-[60px]"></div>;
            
            const subject = subjects.find(s => s.id === slot.subjectId);
            const faculty = allUsers.find(u => u.id === slot.facultyId);

            return (
              <button 
                key={day}
                onClick={() => onSlotClick && classroom && onSlotClick(slot, classroom)}
                disabled={!onSlotClick}
                className={`p-1.5 rounded-md flex flex-col justify-center items-center min-h-[60px] text-left transition ${onSlotClick ? 'hover:bg-sky-500/20 cursor-pointer' : ''} bg-sky-600/10 border border-sky-500/20`}
              >
                <span className="font-bold text-sky-300">{subject?.name}</span>
                <span className="text-slate-400 text-[10px]">{faculty?.name}</span>
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${
            isActive
                ? 'bg-sky-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
        }`}
    >
        {label}
    </button>
);

const StudentAcademics: React.FC<{user: User, classrooms: Classroom[], subjects: Subject[], allUsers: User[], attendance: AttendanceRecord[], assignments: Assignment[]}> = ({ user, classrooms, subjects, allUsers, attendance, assignments }) => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'attendance' | 'assignments'>('timetable');

  const studentClassroom = useMemo(() => classrooms.find(c => c.id === user.classroomId), [classrooms, user]);
  const myAssignments = useMemo(() => assignments.filter(a => a.classroomId === user.classroomId).sort((a,b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()), [assignments, user.classroomId]);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800 rounded-xl">
            <TabButton label="Timetable" isActive={activeTab === 'timetable'} onClick={() => setActiveTab('timetable')} />
            <TabButton label="Attendance" isActive={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
            <TabButton label="Assignments" isActive={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')} />
        </div>

        {activeTab === 'timetable' && (
             <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">My Timetable</h3>
                {studentClassroom ? (
                    <TimetableGrid 
                        timetable={studentClassroom.timetable} 
                        subjects={subjects} 
                        allUsers={allUsers}
                    />
                ) : (
                    <p className="text-slate-500 text-center py-8">You are not currently assigned to a classroom.</p>
                )}
            </div>
        )}
        {activeTab === 'attendance' && (
            <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">My Attendance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attendance.map(record => (
                        <div key={record.subject} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-700">
                            <span className="font-semibold text-slate-200">{record.subject}</span>
                            <div className="flex items-center space-x-3">
                                <span className="text-slate-400">{record.attended}/{record.total} classes</span>
                                <CircularProgress percentage={(record.attended / record.total) * 100} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {activeTab === 'assignments' && (
            <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">My Assignments</h3>
                <div className="space-y-4">
                    {myAssignments.length > 0 ? myAssignments.map(assignment => {
                        const subject = subjects.find(s => s.id === assignment.subjectId);
                        const faculty = allUsers.find(u => u.id === assignment.facultyId);
                        return (
                            <div key={assignment.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-sky-400">{subject?.name}</p>
                                        <p className="text-lg text-slate-100 font-semibold">{assignment.title}</p>
                                        <p className="text-sm text-slate-400 mt-1">Assigned by: {faculty?.name}</p>
                                    </div>
                                    <div className="text-right text-xs">
                                        <p className="text-slate-400">Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                                        <p className="text-red-400 font-semibold">Due: {new Date(assignment.submissionDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 mt-3">{assignment.description}</p>
                            </div>
                        );
                    }) : (
                        <p className="text-slate-500 text-center py-8">No assignments found.</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

const CreateAssignmentForm: React.FC<{
    classrooms: Classroom[];
    subjects: Subject[];
    facultyId: string;
    onSubmit: (assignment: Omit<Assignment, 'id'>) => void;
}> = ({ classrooms, subjects, facultyId, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [classroomId, setClassroomId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !classroomId || !subjectId || !submissionDate) {
            alert('Please fill all fields');
            return;
        }
        onSubmit({
            classroomId,
            subjectId,
            facultyId,
            title,
            description,
            assignedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            submissionDate,
        });
        setTitle('');
        setDescription('');
        setClassroomId('');
        setSubjectId('');
        setSubmissionDate('');
    };
    
    const availableSubjects = useMemo(() => {
        if (!classroomId) return [];
        const classroom = classrooms.find(c => c.id === classroomId);
        if (!classroom) return [];
        const subjectIds = new Set(classroom.timetable.map(slot => slot.subjectId));
        return subjects.filter(s => subjectIds.has(s.id));
    }, [classroomId, classrooms, subjects]);
    
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-800 rounded-lg space-y-4 border border-slate-700">
            <h4 className="text-lg font-bold text-white flex items-center"><FileTextIcon className="w-5 h-5 mr-2 text-sky-400"/>Post New Assignment</h4>
            <input type="text" placeholder="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2" />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2" rows={3}></textarea>
            <div className="grid grid-cols-2 gap-4">
                <select value={classroomId} onChange={e => { setClassroomId(e.target.value); setSubjectId(''); }} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2">
                    <option value="" disabled>Select Classroom</option>
                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={subjectId} onChange={e => setSubjectId(e.target.value)} disabled={!classroomId} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2 disabled:opacity-50">
                    <option value="" disabled>Select Subject</option>
                    {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div>
                 <label htmlFor="submissionDate" className="block text-sm font-medium text-slate-400 mb-1">Submission Date</label>
                 <div className="relative">
                    <input id="submissionDate" type="date" value={submissionDate} min={minDate} onChange={e => setSubmissionDate(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2 pr-10" />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                 </div>
            </div>
            <button type="submit" className="w-full p-2 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-bold text-white">Post Assignment</button>
        </form>
    );
};

const FacultyAcademics: React.FC<{
    user: User;
    allUsers: User[];
    classrooms: Classroom[];
    subjects: Subject[];
    assignments: Assignment[];
}> = ({ user, allUsers, classrooms, subjects, assignments }) => {
    const [activeTab, setActiveTab] = useState<'timetable' | 'assignments'>('timetable');
    const [selectedSlotInfo, setSelectedSlotInfo] = useState<{ slot: TimetableSlot, classroom: Classroom } | null>(null);

    const facultyClassrooms = useMemo(() => classrooms.filter(c => c.timetable.some(s => s.facultyId === user.id)), [classrooms, user.id]);
    const facultyAssignments = useMemo(() => assignments.filter(a => a.facultyId === user.id).sort((a,b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()), [assignments, user.id]);

    const handleSlotClick = (slot: TimetableSlot, classroom: Classroom) => {
        setSelectedSlotInfo({ slot, classroom });
    };
    
    const handleAttendanceSubmit = () => {
        alert('Attendance submitted successfully! (Mock)');
        setSelectedSlotInfo(null);
    };

    if (selectedSlotInfo) {
        const { slot, classroom } = selectedSlotInfo;
        const students = allUsers.filter(u => u.role === UserRole.STUDENT && classroom.studentIds.includes(u.id));
        const subject = subjects.find(s => s.id === slot.subjectId);

        return (
            <div className="p-4 bg-slate-800 rounded-lg animate-fade-in border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                     <div>
                        <h3 className="text-xl font-bold text-sky-400">Mark Attendance</h3>
                        <p className="text-slate-300">{subject?.name} - {classroom.name}</p>
                     </div>
                    <button onClick={() => setSelectedSlotInfo(null)} className="text-slate-400 hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {students.map(student => (
                        <div key={student.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                            <div className="flex items-center space-x-3">
                                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-slate-200">{student.name}</p>
                                    <p className="text-xs text-slate-400">UUCMS: {student.uucms}</p>
                                </div>
                            </div>
                            <input type="checkbox" defaultChecked className="w-6 h-6 rounded bg-slate-600 border-slate-500 text-sky-500 focus:ring-sky-500" />
                        </div>
                    ))}
                </div>
                 <button onClick={handleAttendanceSubmit} className="mt-6 w-full p-3 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-bold text-white">Submit Attendance</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl">
                <TabButton label="Timetable" isActive={activeTab === 'timetable'} onClick={() => setActiveTab('timetable')} />
                <TabButton label="Assignments" isActive={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')} />
            </div>
            
            {activeTab === 'timetable' && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-100">My Teaching Schedule</h3>
                     {facultyClassrooms.map(classroom => {
                         const classTimetable = classroom.timetable.filter(s => s.facultyId === user.id);
                         if(classTimetable.length === 0) return null;
                         return (
                            <div key={classroom.id}>
                                <h4 className="text-lg font-semibold text-sky-300 mb-2">{classroom.name}</h4>
                                <TimetableGrid 
                                    timetable={classTimetable}
                                    subjects={subjects}
                                    allUsers={allUsers}
                                    onSlotClick={handleSlotClick}
                                    classroom={classroom}
                                />
                            </div>
                         );
                     })}
                     {facultyClassrooms.length === 0 && <p className="text-center text-slate-500 py-8">You are not assigned to any classes.</p>}
                </div>
            )}
            
            {activeTab === 'assignments' && (
                <div className="space-y-6">
                    <CreateAssignmentForm classrooms={facultyClassrooms} subjects={subjects} facultyId={user.id} onSubmit={(newAssignment) => alert(`Assignment "${newAssignment.title}" created! (Mock)`)} />
                     <div>
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Posted Assignments</h3>
                        <div className="space-y-4">
                            {facultyAssignments.map(assignment => {
                                const subject = subjects.find(s => s.id === assignment.subjectId);
                                const classroom = classrooms.find(c => c.id === assignment.classroomId);
                                return (
                                    <div key={assignment.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-sky-400">{subject?.name} ({classroom?.name})</p>
                                                <p className="text-lg text-slate-100 font-semibold">{assignment.title}</p>
                                            </div>
                                             <div className="text-right text-xs">
                                                <p className="text-slate-400">Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                                                <p className="text-red-400 font-semibold">Due: {new Date(assignment.submissionDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 mt-3">{assignment.description}</p>
                                    </div>
                                );
                            })}
                            {facultyAssignments.length === 0 && <p className="text-slate-500 text-center py-8">You have not posted any assignments.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminAcademics: React.FC<{
    onManageStudents: (classroom: Classroom) => void;
    onEditTimetable: (classroom: Classroom) => void;
    onManageFaculty: (classroom: Classroom) => void;
    onManageSubjects: (classroom: Classroom) => void;
    classrooms: Classroom[];
    allUsers: User[];
}> = ({ onManageStudents, onEditTimetable, onManageFaculty, onManageSubjects, classrooms, allUsers }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newDepartment, setNewDepartment] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const [newSemester, setNewSemester] = useState<number>(1);
    const [newCoordinatorId, setNewCoordinatorId] = useState('');

    const faculty = useMemo(() => allUsers.filter(u => u.role === UserRole.FACULTY), [allUsers]);
    
    const handleCreateClassroom = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`New classroom "${newClassName}" created! (Mock)`);
        setIsCreating(false);
        setNewClassName('');
        setNewDepartment('');
        setNewCourse('');
        setNewSemester(1);
        setNewCoordinatorId('');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-100">Classroom Management</h3>
                <button onClick={() => setIsCreating(true)} className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg transition">
                    <PlusSquareIcon className="w-5 h-5"/>
                    <span>Create New</span>
                </button>
            </div>
            
            {isCreating && (
                <form onSubmit={handleCreateClassroom} className="p-4 bg-slate-800 rounded-lg space-y-4 border border-slate-700 animate-fade-in">
                    <h4 className="text-lg font-bold text-white">Create New Classroom</h4>
                    <input type="text" placeholder="Classroom Name (e.g., BCA - 2A)" value={newClassName} onChange={e => setNewClassName(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Course (e.g., BCA)" value={newCourse} onChange={e => setNewCourse(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2" />
                        <input type="text" placeholder="Department" value={newDepartment} onChange={e => setNewDepartment(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Semester" value={newSemester} min="1" max="8" onChange={e => setNewSemester(parseInt(e.target.value))} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2" />
                        <select value={newCoordinatorId} onChange={e => setNewCoordinatorId(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md focus:ring-sky-500 focus:outline-none focus:ring-2">
                            <option value="" disabled>Select Coordinator</option>
                            {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <div className="flex space-x-2 pt-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="w-full p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition text-slate-200 font-semibold">Cancel</button>
                        <button type="submit" className="w-full p-2 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-bold text-white">Create Classroom</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {classrooms.map(classroom => {
                    const coordinator = faculty.find(f => f.id === classroom.coordinatorId);
                    return (
                        <div key={classroom.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-bold text-sky-400">{classroom.name}</h4>
                                    <p className="text-sm text-slate-400">{classroom.course} - Sem {classroom.semester}</p>
                                    <p className="text-xs text-slate-500 mt-1">Coordinator: {coordinator?.name || 'N/A'}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => onManageStudents(classroom)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition text-slate-300" aria-label="Manage Students">
                                        <UsersIcon className="w-5 h-5"/>
                                    </button>
                                     <button onClick={() => onManageSubjects(classroom)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition text-slate-300" aria-label="Manage Subjects">
                                        <ClipboardPlusIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => onManageFaculty(classroom)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition text-slate-300" aria-label="Manage Faculty">
                                        <UserCheckIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => onEditTimetable(classroom)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition text-slate-300" aria-label="Edit Timetable">
                                        <EditIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AcademicsView: React.FC<AcademicsViewProps> = ({ user, ...props }) => {
  const renderContent = () => {
    switch (user.role) {
      case UserRole.STUDENT:
        return <StudentAcademics user={user} {...props} />;
      case UserRole.FACULTY:
        return <FacultyAcademics user={user} classrooms={props.classrooms} subjects={props.subjects} allUsers={props.allUsers} assignments={props.assignments} />;
      case UserRole.ADMIN:
        return <AdminAcademics classrooms={props.classrooms} allUsers={props.allUsers} onManageStudents={props.onManageStudents} onEditTimetable={props.onEditTimetable} onManageFaculty={props.onManageFaculty} onManageSubjects={props.onManageSubjects} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <BookOpenIcon className="w-7 h-7 text-sky-400"/>
        <h2 className="text-2xl font-bold text-slate-100 ml-3">Academics</h2>
      </div>
      {renderContent()}
    </div>
  );
};

export default AcademicsView;