import React from 'react';
import { UserRole } from '../../types';
import { UserIcon, BookOpenIcon, SparklesIcon } from '../Icon';

interface LoginViewProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<{ role: UserRole; icon: React.ReactNode; onClick: () => void; description: string; }> = ({ role, icon, onClick, description }) => (
    <button
        onClick={onClick}
        className="w-full p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-sky-500 hover:bg-slate-700/50 transition-all duration-300 transform hover:-translate-y-1 group"
    >
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-sky-500 transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-left text-slate-100 group-hover:text-sky-400 transition-colors">{role}</h3>
                <p className="text-sm text-slate-400 text-left">{description}</p>
            </div>
        </div>
    </button>
);


const LoginView: React.FC<LoginViewProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-sky-400 tracking-tighter">CampusKizuna</h1>
        <p className="text-slate-300 mt-2">Beyond Classrooms</p>
      </div>
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-center text-slate-200 mb-4">Get in as...</h2>
        <RoleCard 
            role={UserRole.STUDENT} 
            icon={<UserIcon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />} 
            description="Access your feed, academics, and profile."
            onClick={() => onRoleSelect(UserRole.STUDENT)} 
        />
        <RoleCard 
            role={UserRole.FACULTY} 
            icon={<BookOpenIcon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />} 
            description="Manage attendance, post notices, view students."
            onClick={() => onRoleSelect(UserRole.FACULTY)} 
        />
        <RoleCard 
            role={UserRole.ADMIN} 
            icon={<SparklesIcon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />}
            description="Oversee announcements and manage the platform."
            onClick={() => onRoleSelect(UserRole.ADMIN)} 
        />
      </div>
    </div>
  );
};

export default LoginView;