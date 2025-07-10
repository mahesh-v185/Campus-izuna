import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ArrowLeftIcon, UserIcon, MailIcon, LockIcon, PhoneIcon } from '../Icon';

interface AuthViewProps {
    role: UserRole;
    onAuthSubmit: (data: any, isSignUp: boolean) => void;
    onBack: () => void;
}

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-1/2 pb-3 font-semibold transition-all duration-300 border-b-2 ${
            isActive
                ? 'text-sky-400 border-sky-400'
                : 'text-slate-400 border-transparent hover:border-slate-500 hover:text-slate-200'
        }`}
    >
        {label}
    </button>
);

const InputField: React.FC<{ icon: React.ReactNode, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ icon, type, placeholder, value, onChange }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
        </div>
        <input 
            type={type}
            placeholder={placeholder}
            required
            value={value}
            onChange={onChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
    </div>
);

const AuthView: React.FC<AuthViewProps> = ({ role, onAuthSubmit, onBack }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [personalNumber, setPersonalNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isSignUp = activeTab === 'signup';
        if (isSignUp && password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        
        const data = { identifier, password, personalNumber };
        onAuthSubmit(data, isSignUp);
    };

    const isStudent = role === UserRole.STUDENT;
    const identifierPlaceholder = isStudent ? "UUCMS Number" : "Email";
    const identifierIcon = isStudent 
        ? <UserIcon className="w-5 h-5 text-slate-400" /> 
        : <MailIcon className="w-5 h-5 text-slate-400" />;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-sm">
                <button onClick={onBack} className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors mb-6 group">
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-semibold">Back to Role Selection</span>
                </button>
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-100">Welcome, {role}</h1>
                    <p className="text-slate-400">Sign in or create an account to continue</p>
                </div>
                
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                    <div className="flex mb-6">
                        <TabButton label="Login" isActive={activeTab === 'login'} onClick={() => setActiveTab('login')} />
                        <TabButton label="Sign Up" isActive={activeTab === 'signup'} onClick={() => setActiveTab('signup')} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField icon={identifierIcon} type="text" placeholder={identifierPlaceholder} value={identifier} onChange={e => setIdentifier(e.target.value)} />
                        
                        {activeTab === 'signup' && isStudent && (
                             <InputField icon={<PhoneIcon className="w-5 h-5 text-slate-400" />} type="tel" placeholder="Personal Number" value={personalNumber} onChange={e => setPersonalNumber(e.target.value)} />
                        )}

                        <InputField icon={<LockIcon className="w-5 h-5 text-slate-400" />} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        
                        {activeTab === 'signup' && (
                            <InputField icon={<LockIcon className="w-5 h-5 text-slate-400" />} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        )}

                        <button type="submit" className="w-full p-3 mt-4 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-bold text-white shadow-lg shadow-sky-600/20">
                            {activeTab === 'login' ? 'Login' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthView;