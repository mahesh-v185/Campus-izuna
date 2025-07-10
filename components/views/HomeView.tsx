
import React from 'react';
import { Post, User, Story } from '../../types';
import PostCard from '../PostCard';
import StoryReel from '../StoryReel';

interface HomeViewProps {
  posts: Post[];
  currentUser: User;
  allUsers: User[];
  stories: Story[];
  onViewProfile: (userId: string) => void;
  onViewStory: (userId: string) => void;
  onAddStory: () => void;
  onLikeToggle: (postId: string) => void;
  onComment: (post: Post) => void;
  onShare: (post: Post) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ posts, currentUser, allUsers, stories, onViewProfile, onViewStory, onAddStory, onLikeToggle, onComment, onShare }) => {
  return (
    <div className="w-full">
      <StoryReel 
        currentUser={currentUser}
        allUsers={allUsers}
        stories={stories}
        onViewStory={onViewStory}
        onAddStory={onAddStory}
      />
      {posts.map(post => (
        <PostCard 
            key={post.id} 
            post={post} 
            currentUser={currentUser}
            onViewProfile={onViewProfile} 
            onLikeToggle={onLikeToggle}
            onComment={onComment}
            onShare={onShare}
        />
      ))}
    </div>
  );
};

export default HomeView;