
import React, { useState, useEffect } from 'react';
import { User, Story } from '../types';
import { XIcon } from './Icon';

interface StoryViewerProps {
    user: User;
    stories: Story[];
    onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ user, stories, onClose }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => p + 1);
        }, 50); // 5 seconds per story (100 / (5000ms / 50ms))

        return () => clearInterval(timer);
    }, [currentStoryIndex]);

    useEffect(() => {
        if (progress >= 100) {
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(i => i + 1);
                setProgress(0);
            } else {
                onClose();
            }
        }
    }, [progress, currentStoryIndex, stories.length, onClose]);
    
    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e;
        const { left, width } = currentTarget.getBoundingClientRect();
        const tapPosition = clientX - left;

        if (tapPosition < width / 3) { // Tap on left third
            if (currentStoryIndex > 0) {
                setCurrentStoryIndex(i => i - 1);
                setProgress(0);
            }
        } else { // Tap on right two-thirds
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(i => i + 1);
                setProgress(0);
            } else {
                onClose();
            }
        }
    };

    if (stories.length === 0) {
        // This case should ideally not be reached if button to open is disabled
        useEffect(() => {
            onClose();
        }, [onClose]);
        return null;
    }

    const currentStory = stories[currentStoryIndex];

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in" onClick={handleTap}>
            <div className="relative w-full h-full max-w-md mx-auto flex flex-col p-4">
                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
                    {stories.map((_, index) => (
                        <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                            <div 
                                className="h-1 bg-white rounded-full" 
                                style={{ width: `${index < currentStoryIndex ? 100 : (index === currentStoryIndex ? progress : 0)}%` }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                 <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
                     <div className="flex items-center space-x-2">
                         <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                         <span className="font-semibold text-white shadow-lg">{user.name}</span>
                         <span className="text-gray-300 text-sm shadow-lg">{currentStory.timestamp}</span>
                     </div>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-white p-2">
                        <XIcon className="w-7 h-7" />
                    </button>
                </div>

                {/* Story Media */}
                <div className="flex-1 flex items-center justify-center pt-16 pb-8">
                    {currentStory.mediaType === 'image' && (
                        <img src={currentStory.mediaUrl} alt="Story content" className="max-w-full max-h-full rounded-lg object-contain" />
                    )}
                    {currentStory.mediaType === 'video' && (
                        <video 
                            src={currentStory.mediaUrl}
                            autoPlay
                            playsInline
                            loop
                            muted
                            className="max-w-full max-h-full rounded-lg object-contain"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;