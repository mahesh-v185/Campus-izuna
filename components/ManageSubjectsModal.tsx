import React, { useState, useMemo } from 'react';
import { Classroom, Subject } from '../types';
import { XIcon, ClipboardPlusIcon } from './Icon';

interface ManageSubjectsModalProps {
    classroom: Classroom;
    allSubjects: Subject[];
    onClose: () => void;
    onSave: (classroomId: string, subjectIds: string[]) => void;
    onSubjectCreate: (newSubjectData: Omit<Subject, 'id'>) => void;
}

const ManageSubjectsModal: React.FC<ManageSubjectsModalProps> = ({ classroom, allSubjects, onClose, onSave, onSubjectCreate }) => {
    const [assignedSubjectIds, setAssignedSubjectIds] = useState<string[]>(classroom.subjectIds || []);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectCode, setNewSubjectCode] = useState('');

    const { assignedSubjects, availableSubjects } = useMemo(() => {
        const assigned = allSubjects.filter(s => assignedSubjectIds.includes(s.id));
        const available = allSubjects.filter(s => !assignedSubjectIds.includes(s.id));
        return { assignedSubjects: assigned, availableSubjects: available };
    }, [allSubjects, assignedSubjectIds]);

    const handleAssignSubject = (subjectId: string) => {
        setAssignedSubjectIds(prev => [...prev, subjectId]);
    };

    const handleUnassignSubject = (subjectId: string) => {
        setAssignedSubjectIds(prev => prev.filter(id => id !== subjectId));
    };

    const handleCreateNewSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectName.trim() || !newSubjectCode.trim()) {
            alert('Please provide a name and code for the new subject.');
            return;
        }
        onSubjectCreate({ name: newSubjectName, code: newSubjectCode });
        setNewSubjectName('');
        setNewSubjectCode('');
    };

    const handleSaveChanges = () => {
        onSave(classroom.id, assignedSubjectIds);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-sky-400" id="modal-title">Manage Subjects: {classroom.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </header>

                <main className="p-6 flex-1 overflow-y-auto grid md:grid-cols-2 gap-6">
                    {/* Assigned Subjects Column */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">Assigned Subjects ({assignedSubjects.length})</h3>
                        <div className="space-y-2 bg-slate-900/50 p-3 rounded-lg min-h-[200px] max-h-96 overflow-y-auto">
                            {assignedSubjects.map(subject => (
                                <div key={subject.id} className="flex items-center justify-between bg-slate-700 p-2 rounded-md">
                                    <div>
                                        <p className="font-semibold text-slate-200">{subject.name}</p>
                                        <p className="text-xs text-slate-400">{subject.code}</p>
                                    </div>
                                    <button onClick={() => handleUnassignSubject(subject.id)} className="text-red-400 font-bold px-2 text-xl" aria-label={`Unassign ${subject.name}`}>-</button>
                                </div>
                            ))}
                            {assignedSubjects.length === 0 && <p className="text-slate-500 text-center py-4">No subjects assigned.</p>}
                        </div>
                    </section>

                    {/* Available Subjects Column */}
                    <section className="flex flex-col">
                         <h3 className="text-lg font-semibold text-slate-200 mb-3">Available Subjects ({availableSubjects.length})</h3>
                         <div className="space-y-2 bg-slate-900/50 p-3 rounded-lg min-h-[200px] flex-grow max-h-96 overflow-y-auto">
                           {availableSubjects.map(subject => (
                                <div key={subject.id} className="flex items-center justify-between bg-slate-700 p-2 rounded-md">
                                    <div>
                                        <p className="font-semibold text-slate-200">{subject.name}</p>
                                        <p className="text-xs text-slate-400">{subject.code}</p>
                                    </div>
                                    <button onClick={() => handleAssignSubject(subject.id)} className="text-green-400 font-bold px-2 text-xl" aria-label={`Assign ${subject.name}`}>+</button>
                                </div>
                           ))}
                           {availableSubjects.length === 0 && <p className="text-slate-500 text-center py-4">No available subjects.</p>}
                        </div>

                         {/* Create New Subject Form */}
                        <form onSubmit={handleCreateNewSubject} className="mt-4 p-4 bg-slate-700/50 rounded-lg space-y-3 flex-shrink-0">
                            <h4 className="font-semibold text-slate-200">Create New Subject</h4>
                             <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Subject Name"
                                    value={newSubjectName}
                                    onChange={e => setNewSubjectName(e.target.value)}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-md p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Subject Code"
                                    value={newSubjectCode}
                                    onChange={e => setNewSubjectCode(e.target.value)}
                                    className="w-full bg-slate-600 border border-slate-500 rounded-md p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                            <button type="submit" className="w-full p-2 bg-sky-700 hover:bg-sky-600 rounded-lg transition font-semibold text-white text-sm">Add Subject to System</button>
                        </form>
                    </section>
                </main>

                <footer className="p-4 border-t border-slate-700 flex-shrink-0 flex justify-end space-x-3">
                    <button onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition font-semibold">Cancel</button>
                    <button onClick={handleSaveChanges} className="py-2 px-4 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-semibold flex items-center space-x-2">
                        <ClipboardPlusIcon className="w-5 h-5"/>
                        <span>Save Changes</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ManageSubjectsModal;