import React, { useState } from 'react';
import { Classroom, TimetableSlot, Subject, User, DayOfWeek, UserRole } from '../types';
import { XIcon, PlusSquareIcon, TrashIcon, EditIcon } from './Icon';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

interface TimetableEditModalProps {
    classroom: Classroom;
    allSubjects: Subject[];
    allFaculty: User[];
    onClose: () => void;
    onSave: (updatedTimetable: TimetableSlot[]) => void;
}

const SlotEditForm: React.FC<{
    day: DayOfWeek;
    time: string;
    currentSlot: TimetableSlot | null;
    subjects: Subject[];
    faculty: User[];
    onSave: (subjectId: string, facultyId: string) => void;
    onCancel: () => void;
}> = ({ day, time, currentSlot, subjects, faculty, onSave, onCancel }) => {
    const [subjectId, setSubjectId] = useState(currentSlot?.subjectId || '');
    const [facultyId, setFacultyId] = useState(currentSlot?.facultyId || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (subjectId && facultyId) {
            onSave(subjectId, facultyId);
        }
    };

    return (
        <div className="absolute inset-0 bg-slate-900/70 z-10 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-slate-700 p-6 rounded-lg shadow-xl w-full max-w-sm space-y-4 border border-slate-600">
                <h4 className="text-lg font-bold text-sky-300">Edit Slot: {day} at {time}</h4>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                    <select id="subject" value={subjectId} onChange={e => setSubjectId(e.target.value)} required className="w-full bg-slate-600 border border-slate-500 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="" disabled>Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="faculty" className="block text-sm font-medium text-slate-300 mb-1">Faculty</label>
                    <select id="faculty" value={facultyId} onChange={e => setFacultyId(e.target.value)} required className="w-full bg-slate-600 border border-slate-500 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="" disabled>Select Faculty</option>
                        {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <div className="flex space-x-2 pt-2">
                    <button type="button" onClick={onCancel} className="w-full p-2 bg-slate-500 hover:bg-slate-400 rounded-lg transition text-white font-semibold">Cancel</button>
                    <button type="submit" className="w-full p-2 bg-sky-600 hover:bg-sky-500 rounded-lg transition text-white font-semibold">Save Slot</button>
                </div>
            </form>
        </div>
    );
};


const TimetableEditModal: React.FC<TimetableEditModalProps> = ({ classroom, allSubjects, allFaculty, onClose, onSave }) => {
    const [localTimetable, setLocalTimetable] = useState<TimetableSlot[]>(classroom.timetable);
    const [editingSlotInfo, setEditingSlotInfo] = useState<{ day: DayOfWeek, time: string, currentSlot: TimetableSlot | null } | null>(null);

    const findSlot = (day: DayOfWeek, time: string): TimetableSlot | undefined => {
        return localTimetable.find(s => s.day === day && s.startTime === time);
    };

    const handleSlotSave = (subjectId: string, facultyId: string) => {
        if (!editingSlotInfo) return;

        const { day, time } = editingSlotInfo;
        const endTime = (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0') + ':00';

        const newSlot: TimetableSlot = { day, startTime: time, endTime, subjectId, facultyId };

        setLocalTimetable(prev => {
            const filtered = prev.filter(s => !(s.day === day && s.startTime === time));
            return [...filtered, newSlot];
        });
        setEditingSlotInfo(null);
    };

    const handleSlotRemove = (day: DayOfWeek, time: string) => {
        setLocalTimetable(prev => prev.filter(s => !(s.day === day && s.startTime === time)));
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true">
            <div className="bg-slate-800 w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-sky-400">Edit Timetable: {classroom.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </header>

                <main className="p-6 flex-1 overflow-y-auto relative">
                    {editingSlotInfo && (
                        <SlotEditForm
                            day={editingSlotInfo.day}
                            time={editingSlotInfo.time}
                            currentSlot={editingSlotInfo.currentSlot}
                            subjects={allSubjects}
                            faculty={allFaculty}
                            onSave={handleSlotSave}
                            onCancel={() => setEditingSlotInfo(null)}
                        />
                    )}

                    <div className="grid grid-cols-6 gap-1 text-center text-xs">
                        <div className="font-bold text-slate-400 py-2">Time</div>
                        {DAYS.map(day => <div key={day} className="font-bold text-slate-400 py-2">{day}</div>)}

                        {TIME_SLOTS.map(time => (
                            <React.Fragment key={time}>
                                <div className="font-bold text-slate-400 py-2 flex items-center justify-center">{time}</div>
                                {DAYS.map(day => {
                                    const slot = findSlot(day, time);
                                    if (!slot) {
                                        return (
                                            <button 
                                                key={day} 
                                                onClick={() => setEditingSlotInfo({ day, time, currentSlot: null })}
                                                className="bg-slate-800/50 rounded-md min-h-[70px] flex items-center justify-center text-slate-500 hover:bg-slate-700/50 hover:border-sky-500 border border-transparent transition"
                                            >
                                                <PlusSquareIcon className="w-6 h-6"/>
                                            </button>
                                        );
                                    }
                                    
                                    const subject = allSubjects.find(s => s.id === slot.subjectId);
                                    const faculty = allFaculty.find(u => u.id === slot.facultyId);

                                    return (
                                        <div key={day} className="group relative p-1.5 rounded-md flex flex-col justify-center items-center min-h-[70px] text-left bg-sky-600/10 border border-sky-500/20">
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 z-10">
                                                <button onClick={() => setEditingSlotInfo({ day, time, currentSlot: slot })} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white">
                                                    <EditIcon className="w-4 h-4"/>
                                                </button>
                                                <button onClick={() => handleSlotRemove(day, time)} className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-md text-red-400">
                                                     <TrashIcon className="w-4 h-4"/>
                                                </button>
                                            </div>
                                            <span className="font-bold text-sky-300">{subject?.name}</span>
                                            <span className="text-slate-400 text-[10px]">{faculty?.name}</span>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </main>

                <footer className="p-4 border-t border-slate-700 flex-shrink-0 flex justify-end space-x-3">
                    <button onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition font-semibold">Cancel</button>
                    <button onClick={() => onSave(localTimetable)} className="py-2 px-4 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-semibold">Save Timetable</button>
                </footer>
            </div>
        </div>
    );
};

export default TimetableEditModal;
