
import React from 'react';
import { Post, User } from '../types';
import PostCard from './PostCard';
import { XIcon } from './Icon';

interface PostViewerModalProps {
    post: Post;
    currentUser: User;
    onClose: () => void;
    onViewProfile: (userId: string) => void;
    onLikeToggle: (postId: string) => void;
    onComment: (post: Post) => void;
    onShare: (post: Post) => void;
}

const PostViewerModal: React.FC<PostViewerModalProps> = ({ post, currentUser, onClose, onViewProfile, onLikeToggle, onComment, onShare }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <PostCard 
                    post={post} 
                    currentUser={currentUser}
                    onViewProfile={onViewProfile} 
                    onLikeToggle={onLikeToggle}
                    onComment={onComment}
                    onShare={onShare}
                />
            </div>
             <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 bg-black/30 rounded-full hover:bg-black/50" aria-label="Close post viewer">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default PostViewerModal;