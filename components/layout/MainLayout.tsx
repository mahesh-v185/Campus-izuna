import React from 'react';
import { View, UserRole } from '../../types';
import { HomeIcon, SearchIcon, PlusSquareIcon, BookOpenIcon, UserIcon, MessageSquareIcon, BellIcon, LayoutDashboardIcon } from '../Icon';

interface HeaderProps {
    setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveView }) => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 z-20 flex items-center justify-between px-4">
    <h1 className="text-2xl font-bold text-sky-400 tracking-tighter">CampusKizuna</h1>
    <div className="flex items-center space-x-4">
      <button onClick={() => setActiveView(View.CHAT)} className="text-slate-300 hover:text-sky-400 transition-colors" aria-label="Messages">
        <MessageSquareIcon className="w-6 h-6" />
      </button>
      <button onClick={() => setActiveView(View.NOTIFICATIONS)} className="text-slate-300 hover:text-sky-400 transition-colors" aria-label="Notifications">
        <BellIcon className="w-6 h-6" />
      </button>
    </div>
  </header>
);

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
  userRole: UserRole;
  onOpenPostOptions: () => void;
}

const NavButton: React.FC<{
  view: View;
  icon: React.ComponentType<{ className?: string }>;
  activeView: View;
  setActiveView: (view: View) => void;
}> = ({ view, icon: Icon, activeView, setActiveView }) => (
  <button
    onClick={() => setActiveView(view)}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
      activeView === view ? 'text-sky-400' : 'text-slate-400 hover:text-sky-300'
    }`}
    aria-label={view}
  >
    <Icon className="w-6 h-6" />
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, userRole, onOpenPostOptions }) => {
  const navItems = userRole === UserRole.ADMIN 
    ? [
        { view: View.HOME, icon: HomeIcon },
        { view: View.DASHBOARD, icon: LayoutDashboardIcon },
        { view: View.ACADEMICS, icon: BookOpenIcon },
        { view: View.PROFILE, icon: UserIcon },
      ]
    : [
        { view: View.HOME, icon: HomeIcon },
        { view: View.SEARCH, icon: SearchIcon },
        { view: View.ACADEMICS, icon: BookOpenIcon },
        { view: View.PROFILE, icon: UserIcon },
      ];

  const firstHalf = navItems.slice(0, 2);
  const secondHalf = navItems.slice(2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 z-20 flex justify-around items-center">
      {firstHalf.map(({ view, icon }) => (
        <NavButton key={view} view={view} icon={icon} activeView={activeView} setActiveView={setActiveView} />
      ))}

      <button
        onClick={onOpenPostOptions}
        className="flex items-center justify-center w-full h-full text-slate-300 hover:text-sky-400 transition-colors"
        aria-label="Create Post or Story"
      >
        <PlusSquareIcon className="w-7 h-7" />
      </button>

      {secondHalf.map(({ view, icon }) => (
        <NavButton key={view} view={view} icon={icon} activeView={activeView} setActiveView={setActiveView} />
      ))}
    </nav>
  );
};


interface MainLayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
  userRole: UserRole;
  onOpenPostOptions: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeView, setActiveView, userRole, onOpenPostOptions }) => {
  return (
    <div className="h-screen w-screen max-w-md mx-auto bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Header setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto pt-16 pb-16">
        {children}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} userRole={userRole} onOpenPostOptions={onOpenPostOptions}/>
    </div>
  );
};

export default MainLayout;
