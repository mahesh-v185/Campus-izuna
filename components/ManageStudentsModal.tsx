import React, { useState, useMemo } from 'react';
import { Classroom, User, UserRole } from '../types';
import { XIcon, UserPlusIcon, SearchIcon, TrashIcon } from './Icon';

interface ManageStudentsModalProps {
    classroom: Classroom;
    allUsers: User[];
    allClassrooms: Classroom[];
    onClose: () => void;
}

const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({ classroom, allUsers, allClassrooms, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [conflict, setConflict] = useState<{ student: User, conflictingClassroom: Classroom } | null>(null);
    
    const enrolledStudents = useMemo(() => 
        allUsers.filter(u => classroom.studentIds.includes(u.id)),
        [allUsers, classroom.studentIds]
    );

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return allUsers.filter(u => 
            u.role === UserRole.STUDENT &&
            (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.uucms?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !classroom.studentIds.includes(u.id)
        );
    }, [searchTerm, allUsers, classroom.studentIds]);

    const handleAddStudent = (student: User) => {
        const conflictingClassroom = allClassrooms.find(c =>
            c.id !== classroom.id &&
            c.department === classroom.department &&
            c.semester === classroom.semester &&
            c.studentIds.includes(student.id)
        );

        if (conflictingClassroom) {
            setConflict({ student, conflictingClassroom });
        } else {
            alert(`✅ ${student.name} added to ${classroom.name}. (Mock)`);
            setSearchTerm('');
        }
    };

    const handleMoveStudent = () => {
        if (!conflict) return;
        alert(`✅ ${conflict.student.name} successfully moved from ${conflict.conflictingClassroom.name} to ${classroom.name}. (Mock)`);
        setConflict(null);
        setSearchTerm('');
    };

    const handleRemoveStudent = (student: User) => {
        alert(`❌ ${student.name} removed from ${classroom.name}. (Mock)`);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-sky-400" id="modal-title">Manage Students: {classroom.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </header>

                <main className="p-6 flex-1 overflow-y-auto space-y-8">
                    <section>
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Enrolled Students ({enrolledStudents.length})</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                           {enrolledStudents.map(student => (
                               <div key={student.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                                  <div className="flex items-center space-x-3">
                                      <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full"/>
                                      <div>
                                          <p className="text-slate-200 font-semibold">{student.name}</p>
                                          <p className="text-xs text-slate-400">UUCMS: {student.uucms}</p>
                                      </div>
                                  </div>
                                  <button onClick={() => handleRemoveStudent(student)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors" aria-label={`Remove ${student.name}`}>
                                      <TrashIcon className="w-5 h-5"/>
                                  </button>
                               </div>
                           ))}
                           {enrolledStudents.length === 0 && <p className="text-slate-500 text-center py-4">No students enrolled yet.</p>}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Add New Student</h3>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Search by name or UUCMS number..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
                            {searchResults.map(student => (
                                <div key={student.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full"/>
                                        <div>
                                          <p className="text-slate-200 font-semibold">{student.name}</p>
                                          <p className="text-xs text-slate-400">UUCMS: {student.uucms}</p>
                                      </div>
                                    </div>
                                    <button onClick={() => handleAddStudent(student)} className="p-2 text-sky-400 hover:bg-sky-500/20 rounded-md transition-colors" aria-label={`Add ${student.name}`}>
                                        <UserPlusIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            {conflict && (
                <div className="absolute inset-0 bg-slate-900/90 z-60 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="conflict-title">
                    <div className="bg-slate-700 p-8 rounded-lg text-center max-w-md shadow-lg border border-yellow-500/50">
                        <h4 id="conflict-title" className="text-2xl font-bold text-yellow-400 mb-4">⚠️ Student Already Assigned</h4>
                        <p className="text-slate-300 mb-6">
                            Student <span className="font-bold text-white">{conflict.student.name}</span> is already assigned to <span className="font-bold text-white">{conflict.conflictingClassroom.name}</span>. A student can only belong to one classroom per semester.
                        </p>
                        <p className="text-slate-200 mb-6 font-semibold">What would you like to do?</p>
                        <div className="flex flex-col space-y-3">
                            <button onClick={handleMoveStudent} className="w-full p-3 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-bold text-white">
                                Remove from "{conflict.conflictingClassroom.name}" and Add
                            </button>
                             <button onClick={() => setConflict(null)} className="w-full p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition text-slate-200">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudentsModal;
