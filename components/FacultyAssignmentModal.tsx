import React, { useState, useMemo } from 'react';
import { Classroom, Subject, User } from '../types';
import { XIcon, UserCheckIcon } from './Icon';

interface FacultyAssignmentModalProps {
    classroom: Classroom;
    allSubjects: Subject[];
    allFaculty: User[];
    onClose: () => void;
    onSave: (classroomId: string, assignments: Record<string, string>) => void;
}

const FacultyAssignmentModal: React.FC<FacultyAssignmentModalProps> = ({ classroom, allSubjects, allFaculty, onClose, onSave }) => {
    const classroomSubjects = useMemo(() => {
        const subjectIds = new Set(classroom.timetable.map(slot => slot.subjectId));
        return allSubjects.filter(subject => subjectIds.has(subject.id));
    }, [classroom.timetable, allSubjects]);

    const initialAssignments = useMemo(() => {
        const assignments: Record<string, string> = {};
        for (const subject of classroomSubjects) {
            const slot = classroom.timetable.find(s => s.subjectId === subject.id);
            if (slot) {
                assignments[subject.id] = slot.facultyId;
            }
        }
        return assignments;
    }, [classroomSubjects, classroom.timetable]);

    const [assignments, setAssignments] = useState<Record<string, string>>(initialAssignments);

    const handleAssignmentChange = (subjectId: string, facultyId: string) => {
        setAssignments(prev => ({ ...prev, [subjectId]: facultyId }));
    };

    const handleSaveChanges = () => {
        onSave(classroom.id, assignments);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-sky-400" id="modal-title">Manage Faculty: {classroom.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </header>

                <main className="p-6 flex-1 overflow-y-auto space-y-4">
                    <p className="text-slate-400 text-sm">Assign or change the faculty member for each subject taught in this classroom. Changes will apply to all timetable slots for the respective subject.</p>
                    {classroomSubjects.length > 0 ? classroomSubjects.map(subject => (
                        <div key={subject.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                            <label htmlFor={`faculty-for-${subject.id}`} className="font-semibold text-slate-200">{subject.name}</label>
                            <select 
                                id={`faculty-for-${subject.id}`}
                                value={assignments[subject.id] || ''}
                                onChange={(e) => handleAssignmentChange(subject.id, e.target.value)}
                                className="bg-slate-600 border border-slate-500 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 min-w-[200px]"
                            >
                                <option value="" disabled>Unassigned</option>
                                {allFaculty.map(faculty => (
                                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                                ))}
                            </select>
                        </div>
                    )) : (
                        <p className="text-slate-500 text-center py-4">No subjects found in this classroom's timetable.</p>
                    )}
                </main>

                <footer className="p-4 border-t border-slate-700 flex-shrink-0 flex justify-end space-x-3">
                    <button onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition font-semibold">Cancel</button>
                    <button onClick={handleSaveChanges} className="py-2 px-4 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-semibold flex items-center space-x-2">
                        <UserCheckIcon className="w-5 h-5"/>
                        <span>Save Changes</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FacultyAssignmentModal;
