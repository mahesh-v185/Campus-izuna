
import React from 'react';
import { MessageSquareIcon, CoinIcon } from '../Icon';

const ChatView: React.FC = () => {
  return (
    <div className="p-4 text-slate-300 h-full flex flex-col items-center justify-center text-center">
        <MessageSquareIcon className="w-16 h-16 text-sky-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Stranger Chat</h2>
        <p className="text-slate-400 max-w-xs mb-6">This feature is coming soon! Get ready to connect with random students on campus.</p>
        <div className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full">
            <CoinIcon className="w-5 h-5"/>
            <span className="font-semibold text-sm">Use coins to chat</span>
        </div>
    </div>
  );
};

export default ChatView;
