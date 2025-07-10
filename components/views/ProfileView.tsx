
import React from 'react';
import { User, Post, Story } from '../../types';
import { LogOutIcon, EditIcon, ArrowLeftIcon, MessageSquareIcon, CheckIcon, PlusIcon, PlayIcon } from '../Icon';
import RoleBadge from '../RoleBadge';

interface ProfileViewProps {
  userToView: User;
  currentUser: User;
  posts: Post[];
  stories: Story[];
  onLogout: () => void;
  onFollowToggle: (userId: string) => void;
  onBack: () => void;
  isMyProfile: boolean;
  onEditProfile?: () => void;
  onViewStory: (userId: string) => void;
  onViewPost: (post: Post) => void;
}

const StatItem: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-xl font-bold text-slate-100">{value}</p>
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ userToView, currentUser, posts, stories, onLogout, onFollowToggle, onBack, isMyProfile, onEditProfile, onViewStory, onViewPost }) => {
  const isFollowing = currentUser.followingIds.includes(userToView.id);
  const userHasStories = stories.some(s => s.author.id === userToView.id);

  return (
    <div className="absolute inset-0 bg-slate-900 z-30 flex flex-col animate-fade-in">
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-16 bg-slate-900/80 backdrop-blur-sm flex items-center px-4 z-10">
            {!isMyProfile && (
                <button onClick={onBack} className="text-slate-300 hover:text-sky-400 transition-colors p-2 -ml-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            )}
            <div className="flex items-center space-x-2 ml-2">
                <h2 className="text-xl font-bold text-slate-100">{userToView.name}</h2>
                <RoleBadge role={userToView.role} />
            </div>
            {isMyProfile && (
                <button onClick={onLogout} className="ml-auto text-slate-400 hover:text-red-500 transition-colors" aria-label="Logout">
                    <LogOutIcon className="w-6 h-6" />
                </button>
            )}
        </header>

        <div className="pt-20 p-4 text-slate-300 overflow-y-auto pb-8">
            <div className="flex items-center space-x-4 mb-6">
                {userHasStories ? (
                    <button
                        onClick={() => onViewStory(userToView.id)}
                        className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex-shrink-0"
                        aria-label="View story"
                    >
                        <div className="bg-slate-900 p-0.5 rounded-full w-full h-full">
                            <img src={userToView.avatar} alt={userToView.name} className="w-full h-full rounded-full object-cover" />
                        </div>
                    </button>
                ) : (
                    <img src={userToView.avatar} alt={userToView.name} className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-md flex-shrink-0" />
                )}
                <div className="flex-1 flex items-center justify-around pt-2">
                    <StatItem value={posts.length} label="Posts" />
                    <StatItem value={userToView.stats.followers} label="Followers" />
                    <StatItem value={userToView.stats.following} label="Following" />
                </div>
            </div>
            
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-100">{userToView.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{userToView.bio}</p>
            </div>

            <div className="flex items-center space-x-2 mb-6">
                {isMyProfile ? (
                    <button onClick={onEditProfile} className="flex-1 flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition">
                        <EditIcon className="w-5 h-5"/>
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <>
                        <button onClick={() => onFollowToggle(userToView.id)} className={`flex-1 flex items-center justify-center space-x-2 font-semibold py-2 px-4 rounded-lg transition ${isFollowing ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-sky-600 hover:bg-sky-500 text-white'}`}>
                            {isFollowing ? <CheckIcon className="w-5 h-5"/> : <PlusIcon className="w-5 h-5"/>}
                            <span>{isFollowing ? 'Following' : 'Follow'}</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition">
                            <MessageSquareIcon className="w-5 h-5"/>
                            <span>Message</span>
                        </button>
                    </>
                )}
            </div>

            {(userToView.skills.length > 0 || userToView.achievements.length > 0) && (
              <div className="mb-6 space-y-4 p-4 bg-slate-800/50 rounded-lg">
                {userToView.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {userToView.skills.map(skill => <span key={skill} className="bg-sky-500/20 text-sky-300 text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>)}
                    </div>
                  </div>
                )}
                {userToView.achievements.length > 0 && (
                  <div className={userToView.skills.length > 0 ? "mt-4" : ""}>
                    <h4 className="font-semibold text-slate-300 mb-2">Achievements</h4>
                     <div className="flex flex-wrap gap-2">
                        {userToView.achievements.map(ach => <span key={ach} className="bg-green-500/20 text-green-300 text-sm font-semibold px-3 py-1 rounded-full">{ach}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-slate-700 pt-4">
                 <div className="grid grid-cols-3 gap-1">
                    {posts.map(post => (
                        <button
                            key={post.id}
                            onClick={() => onViewPost(post)}
                            className="relative aspect-square bg-slate-800 rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            aria-label={`View post by ${post.author.name}`}
                        >
                            <img src={post.thumbnailUrl || post.mediaUrl} alt="Post thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                             {post.mediaType === 'video' && (
                                <div className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded-full pointer-events-none">
                                    <PlayIcon className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    ))}
                 </div>
                 {posts.length === 0 && (
                     <div className="text-center py-16 text-slate-500">
                         <p>No posts yet.</p>
                     </div>
                 )}
            </div>
        </div>
    </div>
  );
};
