import React, { useState } from 'react';
import { PhotoIcon, FaceSmileIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface TweetInputProps {
  addTweet: (tweetText: string) => void;
}

const TweetInput: React.FC<TweetInputProps> = ({ addTweet }) => {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim()) {
      addTweet(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex space-x-4">
        <img 
          src="https://i.pravatar.cc/150?img=3" 
          alt="User avatar" 
          className="h-12 w-12 rounded-full cursor-pointer border-2 border-white shadow-sm"
        />
        <div className="w-full">
          <div className="mb-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's happening?"
              rows={2}
              className="bg-transparent outline-none text-gray-900 text-lg placeholder-gray-500 tracking-wide w-full min-h-[60px] focus:ring-0 border-0"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="icon bg-white">
                <PhotoIcon className="h-[22px] w-[22px] text-orange-500" />
              </div>
              <div className="icon bg-white rotate-90">
                <FaceSmileIcon className="h-[22px] w-[22px] text-orange-500" />
              </div>
              <div className="icon bg-white">
                <CalendarIcon className="h-[22px] w-[22px] text-orange-500" />
              </div>
              <div className="icon bg-white">
                <MapPinIcon className="h-[22px] w-[22px] text-orange-500" />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={`btn-primary px-5 py-2 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-default`}
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetInput; 