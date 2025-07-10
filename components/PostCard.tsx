
import React from 'react';
import { Post, User } from '../types';
import { HeartIcon, MessageCircleIcon, SendIcon, MoreHorizontalIcon, PlayIcon } from './Icon';
import RoleBadge from './RoleBadge';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onViewProfile: (userId: string) => void;
  onLikeToggle: (postId: string) => void;
  onComment: (post: Post) => void;
  onShare: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onViewProfile, onLikeToggle, onComment, onShare }) => {
  const isLiked = post.likes.includes(currentUser.id);

  return (
    <div className="bg-slate-800/50 border-b border-slate-700/50">
      <div className="flex items-center p-3">
        <button onClick={() => onViewProfile(post.author.id)} className="flex items-center text-left">
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-sky-500" />
            <div className="ml-3">
              <p className="font-semibold text-slate-200">{post.author.name}</p>
              <RoleBadge role={post.author.role} />
            </div>
        </button>
        <button className="ml-auto text-slate-400">
          <MoreHorizontalIcon />
        </button>
      </div>
      
      <div className="w-full bg-black">
        {post.mediaType === 'image' ? (
          <img src={post.mediaUrl} alt="Post content" className="w-full h-auto max-h-[70vh] object-contain" />
        ) : (
          <video src={post.mediaUrl} controls className="w-full h-auto max-h-[70vh]"></video>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={() => onLikeToggle(post.id)} className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`}>
            <HeartIcon className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes.length}</span>
          </button>
          <button onClick={() => onComment(post)} className="flex items-center space-x-1 text-slate-300 hover:text-sky-400 transition-colors">
            <MessageCircleIcon className="w-6 h-6" />
            <span className="text-sm">{post.comments.length}</span>
          </button>
          <button onClick={() => onShare(post)} className="text-slate-300 hover:text-sky-400 transition-colors">
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-slate-300 text-sm">
          <button onClick={() => onViewProfile(post.author.id)} className="font-semibold text-slate-200 hover:underline">{post.author.name}</button>
          <span className="ml-2">{post.caption}</span>
        </div>
        
        <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider">{post.timestamp}</p>
      </div>
    </div>
  );
};

export default PostCard;