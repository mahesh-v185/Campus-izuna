
import React, { useState } from 'react';
import { User } from '../types';
import { XIcon, PlusIcon, UserIcon } from './Icon';

interface EditProfileModalProps {
    currentUser: User;
    onClose: () => void;
    onSave: (updatedData: {
        fullName: string;
        bio: string;
        skills: string[];
        achievements: string[];
        avatar: string;
    }) => void;
}

const TagInput: React.FC<{
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder: string;
    title: string;
}> = ({ items, setItems, placeholder, title }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddItem = () => {
        if (inputValue.trim() && !items.includes(inputValue.trim())) {
            setItems([...items, inputValue.trim()]);
            setInputValue('');
        }
    };
    
    const handleRemoveItem = (itemToRemove: string) => {
        setItems(items.filter(item => item !== itemToRemove));
    };

    return (
        <div>
            <label className="block text-slate-300 font-semibold mb-2">{title}</label>
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button type="button" onClick={handleAddItem} className="p-3 bg-sky-600 hover:bg-sky-500 rounded-lg transition text-white">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
                {items.map(item => (
                    <span key={item} className="flex items-center bg-sky-500/20 text-sky-300 text-sm font-semibold pl-3 pr-2 py-1 rounded-full">
                        {item}
                        <button onClick={() => handleRemoveItem(item)} className="ml-2 text-sky-300 hover:text-white">
                            <XIcon className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ currentUser, onClose, onSave }) => {
    const [fullName, setFullName] = useState(currentUser.name);
    const [bio, setBio] = useState(currentUser.bio);
    const [skills, setSkills] = useState(currentUser.skills);
    const [achievements, setAchievements] = useState(currentUser.achievements);
    const [avatar, setAvatar] = useState(currentUser.avatar);
    
    const handleSaveChanges = () => {
        onSave({ fullName, bio, skills, achievements, avatar });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-slate-900 z-40 flex flex-col animate-fade-in" aria-modal="true">
            <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-16 bg-slate-900/80 backdrop-blur-sm flex items-center justify-between px-4 z-10">
                <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors text-lg px-2 -ml-2">Cancel</button>
                <h2 className="font-bold text-lg">Edit Profile</h2>
                <button onClick={handleSaveChanges} className="text-sky-400 hover:text-sky-300 transition-colors font-bold text-lg px-2 -mr-2">Save</button>
            </header>

            <main className="pt-20 p-4 text-slate-300 overflow-y-auto space-y-6">
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-28 h-28 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-600">
                        {avatar ? (
                            <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-16 h-16 text-slate-500" />
                        )}
                    </div>
                    <label htmlFor="avatar-upload" className="cursor-pointer text-sky-400 font-semibold hover:underline">
                        Change Profile Photo
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div>
                    <label className="block text-slate-300 font-semibold mb-2">Full Name</label>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                     <label className="block text-slate-300 font-semibold mb-2">Bio</label>
                    <textarea placeholder="Your Bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                </div>
                 
                <TagInput items={skills} setItems={setSkills} placeholder="e.g., React, Python..." title="Skills"/>
                <TagInput items={achievements} setItems={setAchievements} placeholder="e.g., Dean's List..." title="Achievements"/>
                
            </main>
        </div>
    );
};

export default EditProfileModal;
