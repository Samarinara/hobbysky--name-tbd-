/**
 * Tweet.tsx - Tweet Component
 * 
 * This component displays an individual tweet in the feed.
 * It shows the user profile, tweet content, engagement stats,
 * and allows interaction through likes, comments, retweets, and shares.
 * The entire tweet card is clickable and navigates to a detailed view.
 * 
 * For Rust Backend Integration:
 * - Clicking on the tweet navigates to a detail view with comments
 * - Action buttons (like, retweet) would call backend APIs
 * - Engagement counts would be fetched from the backend
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftIcon, ArrowPathRoundedSquareIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';

/**
 * TweetProps Interface
 * 
 * Props for the Tweet component, containing all data needed to display a tweet.
 * 
 * @property tweet - The tweet data object with all required fields
 */
interface TweetProps {
  tweet: {
    id: number;
    name: string;
    username: string;
    userImg: string;
    img?: string;
    text: string;
    timestamp: string;
  };
}

/**
 * Tweet Component
 * 
 * Displays a single tweet with user info, content, and interaction buttons.
 * The entire component is clickable, navigating to a detailed view.
 * 
 * @param tweet - The tweet data to display
 */
const Tweet: React.FC<TweetProps> = ({ tweet }) => {
  // React Router's navigation hook for programmatic navigation
  const navigate = useNavigate();
  
  // Local state for like functionality
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(35);

  /**
   * Handle the like button click
   * 
   * Toggles the liked state and updates the count accordingly.
   * Stops event propagation to prevent navigation when clicking the like button.
   * 
   * For Rust Backend Integration:
   * - Would make a POST request to toggle like status in the database
   * - Could use optimistic UI updates while waiting for API response
   * 
   * @param e - The click event object
   */
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when liking
    
    // Toggle like state and update count
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
    
    // BACKEND INTEGRATION: API call would go here
    // Example: await api.toggleLike(tweet.id);
  };

  /**
   * Navigate to the tweet detail page
   * 
   * Called when clicking anywhere on the tweet card.
   */
  const handleNavigateToDetail = () => {
    navigate(`/tweet/${tweet.id}`);
  };

  /**
   * Handle clicks on action buttons
   * 
   * Stops event propagation to prevent navigation when clicking action buttons.
   * 
   * @param e - The click event object
   */
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking on action buttons
  };

  return (
    <div 
      className="tweet-card mb-4 cursor-pointer transition-transform hover:scale-[1.01]" 
      onClick={handleNavigateToDetail}
    >
      <div className="flex space-x-4">
        {/* User Profile Picture */}
        <img
          src={tweet.userImg}
          alt="Profile Picture"
          className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
        />
        
        <div className="flex-1">
          {/* User Info and Timestamp */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-base">{tweet.name}</h4>
            <span className="text-sm sm:text-[15px] text-gray-500">@{tweet.username}</span>
            <span className="text-sm sm:text-[15px] text-gray-500">· {tweet.timestamp}</span>
          </div>
          
          {/* Tweet Text Content */}
          <p className="text-gray-900 text-[15px] sm:text-base my-2">{tweet.text}</p>
          
          {/* Optional Tweet Image */}
          {tweet.img && (
            <div className="rounded-xl overflow-hidden mt-3 mb-2 shadow-sm">
              <img
                src={tweet.img}
                alt="Tweet image"
                className="w-full max-h-80 object-cover"
              />
            </div>
          )}
          
          {/* Engagement Actions (Comment, Retweet, Like, Share) */}
          <div className="flex justify-between text-gray-500 mt-4 w-full sm:w-10/12" onClick={handleActionClick}>
            {/* Comment Button */}
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-blue-100">
                <ChatBubbleOvalLeftIcon className="h-5 group-hover:text-blue-400" />
              </div>
              <span className="group-hover:text-blue-400 text-sm">5</span>
            </div>
            
            {/* Retweet Button */}
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-100">
                <ArrowPathRoundedSquareIcon className="h-5 group-hover:text-green-500" />
              </div>
              <span className="group-hover:text-green-500 text-sm">12</span>
            </div>
            
            {/* Like Button - with active state styling */}
            <div className="flex items-center space-x-1 group" onClick={handleLike}>
              <div className={`icon ${liked ? 'bg-red-100' : 'group-hover:bg-red-100'}`}>
                <HeartIcon className={`h-5 ${liked ? 'text-red-500 fill-red-500' : 'group-hover:text-red-500'}`} />
              </div>
              <span className={`${liked ? 'text-red-500' : 'group-hover:text-red-500'} text-sm`}>{likeCount}</span>
            </div>
            
            {/* Share Button */}
            <div className="icon group-hover:bg-blue-100">
              <ShareIcon className="h-5 group-hover:text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet; 