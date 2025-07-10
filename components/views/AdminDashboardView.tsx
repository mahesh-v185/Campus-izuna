import React from 'react';
import { User, UserRole } from '../../types';
import { LayoutDashboardIcon, TrashIcon } from '../Icon';

interface AdminDashboardViewProps {
  users: User[];
  onRemoveUser: (userId: string) => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ users, onRemoveUser }) => {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <LayoutDashboardIcon className="w-7 h-7 text-sky-400" />
        <h2 className="text-2xl font-bold text-slate-100 ml-3">Admin Dashboard</h2>
      </div>

      <section>
        <h3 className="text-xl font-semibold text-slate-200 mb-4">User Management</h3>
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="space-y-2 p-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                <div className="flex items-center space-x-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-slate-200">{user.name}</p>
                    <p className={`text-xs ${user.role === UserRole.STUDENT ? 'text-sky-400' : 'text-purple-400'}`}>{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveUser(user.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors" 
                  aria-label={`Remove ${user.name}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            {users.length === 0 && (
                <p className="text-center text-slate-500 py-4">No other users found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardView;