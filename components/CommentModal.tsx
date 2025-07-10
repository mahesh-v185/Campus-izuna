
import React, { useState } from 'react';
import { Post, User, Comment } from '../types';
import { XIcon, SendIcon } from './Icon';

interface CommentModalProps {
    post: Post;
    currentUser: User;
    onClose: () => void;
    onCommentAdd: (postId: string, commentText: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, currentUser, onClose, onCommentAdd }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onCommentAdd(post.id, commentText.trim());
            setCommentText('');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in" aria-modal="true">
            <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-16 bg-slate-800/80 backdrop-blur-sm flex items-center justify-between px-4 z-10 border-b border-slate-700">
                <h2 className="text-xl font-bold text-slate-100">Comments</h2>
                <button onClick={onClose} className="text-slate-300 hover:text-white p-2 -mr-2">
                    <XIcon className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pt-20 pb-20 px-4 space-y-4">
                {/* Original Post Caption */}
                {post.caption && (
                    <div className="flex items-start space-x-3 pb-4 border-b border-slate-700/50">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div>
                            <p className="text-slate-300 text-sm">
                                <span className="font-semibold text-slate-100">{post.author.name}</span>
                                <span className="ml-2">{post.caption}</span>
                            </p>
                            <p className="text-slate-500 text-xs mt-1">{post.timestamp}</p>
                        </div>
                    </div>
                )}
                
                {/* Comments List */}
                {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                        <img src={comment.author.avatar} alt={comment.author.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div>
                            <p className="text-slate-300 text-sm">
                                <span className="font-semibold text-slate-100">{comment.author.name}</span>
                                <span className="ml-2">{comment.text}</span>
                            </p>
                            <p className="text-slate-500 text-xs mt-1">{comment.timestamp}</p>
                        </div>
                    </div>
                ))}

                {post.comments.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        <p>No comments yet.</p>
                        <p className="text-sm">Be the first to comment.</p>
                    </div>
                )}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-800 border-t border-slate-700 p-2">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <img src={currentUser.avatar} alt="Your avatar" className="w-10 h-10 rounded-full" />
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button type="submit" disabled={!commentText.trim()} className="p-2 bg-sky-600 rounded-full text-white disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default CommentModal;
