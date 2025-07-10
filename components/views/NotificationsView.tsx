
import React from 'react';
import { Post } from '../../types';
import { BellIcon } from '../Icon';

interface NoticeCardProps {
  post: Post;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ post }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center mb-3">
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />
            <div className="ml-3">
                <p className="font-semibold text-slate-200">{post.author.name}</p>
                <p className="text-xs text-slate-400">{post.author.role}</p>
            </div>
            <p className="ml-auto text-slate-500 text-xs uppercase tracking-wider">{post.timestamp}</p>
        </div>
        {post.mediaType === 'image' && post.mediaUrl && <img src={post.mediaUrl} alt="Notice visual" className="w-full h-auto rounded-md mb-3" />}
        {post.mediaType === 'video' && post.mediaUrl && <video src={post.mediaUrl} controls className="w-full h-auto rounded-md mb-3" />}
        <p className="text-slate-300">{post.caption}</p>
    </div>
);


interface NotificationsViewProps {
  posts: Post[];
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ posts }) => {
  const noticePosts = posts.filter(p => p.isNotice).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-4 text-slate-300">
      <div className="flex items-center mb-6">
        <BellIcon className="w-7 h-7 text-sky-400"/>
        <h2 className="text-2xl font-bold text-slate-100 ml-3">Notifications</h2>
      </div>
      <div className="space-y-4">
        {noticePosts.length > 0 ? (
          noticePosts.map(post => <NoticeCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500">No notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;