
import React, { useState } from 'react';
import { ImageIcon, XIcon } from '../Icon';

interface CreatePostViewProps {
    onShare: (caption: string, mediaUrl: string) => void;
    onCancel: () => void;
}

const CreatePostView: React.FC<CreatePostViewProps> = ({ onShare, onCancel }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleShare = () => {
        if (imagePreview) {
            onShare(caption, imagePreview);
        } else {
            alert("Please select an image to share.");
        }
    };

    return (
        <div className="bg-slate-900 h-full w-full flex flex-col text-slate-100">
            <header className="flex items-center justify-between p-3 border-b border-slate-700 flex-shrink-0">
                <button onClick={onCancel} className="text-slate-300 hover:text-white transition-colors text-lg">Cancel</button>
                <h2 className="font-bold text-lg">New Post</h2>
                <button onClick={handleShare} className="text-sky-400 hover:text-sky-300 transition-colors font-bold text-lg">Share</button>
            </header>

            <main className="p-4 flex-grow flex flex-col space-y-4">
                <div className="aspect-square w-full bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-700">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/>
                            <button 
                                onClick={() => setImagePreview(null)}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                                aria-label="Remove image"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center text-slate-500">
                            <ImageIcon className="w-16 h-16 mb-2" />
                            <span className="font-semibold text-slate-400">Upload Image</span>
                            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="w-full bg-transparent p-2 text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
                    rows={4}
                />
            </main>
        </div>
    );
};

export default CreatePostView;
