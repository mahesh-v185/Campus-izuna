import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, XIcon, UserIcon, BookOpenIcon, SparklesIcon, ImageIcon } from '../Icon';

interface ProfileSetupViewProps {
    onComplete: (profileData: {
        fullName: string;
        bio: string;
        skills: string[];
        achievements: string[];
        avatar: string;
    }) => void;
}

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
    <div className="w-full bg-slate-700 rounded-full h-2.5 mb-8">
        <div 
            className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
    </div>
);

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

const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [achievements, setAchievements] = useState<string[]>([]);
    const [avatar, setAvatar] = useState('');

    const TOTAL_STEPS = 4;

    const handleNext = () => {
        if (step === 1 && (!fullName || !bio)) {
            alert("Full name and bio are required.");
            return;
        }
        setStep(s => Math.min(s + 1, TOTAL_STEPS));
    };

    const handleBack = () => {
        setStep(s => Math.max(s - 1, 1));
    };

    const handleFinish = () => {
         if (!avatar) {
            alert("Please upload a profile photo.");
            return;
        }
        onComplete({ fullName, bio, skills, achievements, avatar });
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
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-slate-100">Profile Setup</h1>
                    <p className="text-slate-400 mt-1">Let's get your account ready. ({step}/{TOTAL_STEPS})</p>
                </div>

                <ProgressBar step={step} totalSteps={TOTAL_STEPS} />

                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 min-h-[350px] flex flex-col">
                   <div className="flex-grow">
                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                 <h2 className="text-2xl font-semibold text-sky-400 mb-4">About You</h2>
                                <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                <textarea placeholder="Your Bio (e.g., Computer Science sophomore...)" value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                 <h2 className="text-2xl font-semibold text-sky-400 mb-4">Your Skills</h2>
                                <TagInput items={skills} setItems={setSkills} placeholder="e.g., React, Python..." title="Skills"/>
                            </div>
                        )}
                        {step === 3 && (
                             <div className="space-y-4 animate-fade-in">
                                 <h2 className="text-2xl font-semibold text-sky-400 mb-4">Your Achievements</h2>
                                <TagInput items={achievements} setItems={setAchievements} placeholder="e.g., Dean's List, Hackathon Winner..." title="Achievements"/>
                            </div>
                        )}
                         {step === 4 && (
                            <div className="space-y-4 animate-fade-in">
                                 <h2 className="text-2xl font-semibold text-sky-400 mb-4">Profile Photo</h2>
                                 <div className="flex flex-col items-center space-y-4">
                                     <div className="w-40 h-40 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-600">
                                         {avatar ? (
                                             <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                                         ) : (
                                             <UserIcon className="w-20 h-20 text-slate-500" />
                                         )}
                                     </div>
                                     <label htmlFor="avatar-upload" className="cursor-pointer bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition">
                                         Upload Photo
                                     </label>
                                     <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                 </div>
                            </div>
                        )}
                   </div>
                   
                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700/50">
                        <button onClick={handleBack} disabled={step === 1} className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors group disabled:opacity-50 disabled:hover:text-slate-300">
                            <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span className="font-semibold">Back</span>
                        </button>
                        
                        {step < TOTAL_STEPS && (
                            <button onClick={handleNext} className="flex items-center space-x-2 py-2 px-4 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-bold text-white shadow-lg shadow-sky-600/20">
                                <span>Next</span>
                                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        )}
                        {step === TOTAL_STEPS && (
                            <button onClick={handleFinish} className="flex items-center space-x-2 py-2 px-4 bg-green-600 hover:bg-green-500 rounded-lg transition font-bold text-white shadow-lg shadow-green-600/20">
                                <span>Finish Setup</span>
                                <SparklesIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetupView;
