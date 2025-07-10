import React from 'react';
import { User, Story } from '../types';
import { PlusCircleIcon } from './Icon';

interface StoryReelProps {
    currentUser: User;
    allUsers: User[];
    stories: Story[];
    onViewStory: (userId: string) => void;
    onAddStory: () => void;
}

const StoryReel: React.FC<StoryReelProps> = ({ currentUser, allUsers, stories, onViewStory, onAddStory }) => {
    const usersWithStories = React.useMemo(() => {
        const userIds = new Set(stories.map(s => s.author.id));
        return allUsers.filter(user => userIds.has(user.id));
    }, [stories, allUsers]);

    const currentUserHasStory = usersWithStories.some(u => u.id === currentUser.id);
    const otherUsersWithStories = usersWithStories.filter(u => u.id !== currentUser.id);

    return (
        <div className="w-full p-3 border-b border-slate-700/50 overflow-x-auto">
            <div className="flex space-x-4">
                {/* Current User's Story */}
                <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                    <button onClick={currentUserHasStory ? () => onViewStory(currentUser.id) : onAddStory} className="relative">
                        {currentUserHasStory ? (
                             <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                                <div className="bg-slate-900 p-0.5 rounded-full">
                                    <img src={currentUser.avatar} alt="Your Story" className="w-full h-full rounded-full" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <img src={currentUser.avatar} alt="Add to your Story" className="w-16 h-16 rounded-full border-2 border-slate-600" />
                                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full">
                                    <PlusCircleIcon className="w-6 h-6 text-sky-400" />
                                </div>
                            </>
                        )}
                    </button>
                    <p className="text-xs text-slate-400">Your Story</p>
                </div>

                {/* Other Users' Stories */}
                {otherUsersWithStories.map(user => (
                    <div key={user.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
                         <button onClick={() => onViewStory(user.id)}>
                            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                                <div className="bg-slate-900 p-0.5 rounded-full">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                                </div>
                            </div>
                        </button>
                        <p className="text-xs text-slate-300 w-16 truncate text-center">{user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryReel;