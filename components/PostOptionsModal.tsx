import React from 'react';
import { PlusSquareIcon, PlusCircleIcon, XIcon } from './Icon';

interface PostOptionsModalProps {
    onSelect: (type: 'post' | 'story') => void;
    onClose: () => void;
}

const PostOptionsModal: React.FC<PostOptionsModalProps> = ({ onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 w-full max-w-xs rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-100">Create</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <button 
                    onClick={() => onSelect('post')}
                    className="w-full flex items-center space-x-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                    <PlusSquareIcon className="w-8 h-8 text-sky-400" />
                    <div>
                        <p className="font-semibold text-slate-200">New Post</p>
                        <p className="text-sm text-slate-400">Share a photo on your feed.</p>
                    </div>
                </button>
                <button 
                    onClick={() => onSelect('story')}
                    className="w-full flex items-center space-x-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                    <PlusCircleIcon className="w-8 h-8 text-purple-400" />
                    <div>
                        <p className="font-semibold text-slate-200">Add to Story</p>
                        <p className="text-sm text-slate-400">Share a photo for 24 hours.</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default PostOptionsModal;
