/**
 * Post.tsx - Post Component
 * 
 * This component displays an individual Bluesky post in the feed.
 * It shows the user profile, post content, engagement stats,
 * and allows interaction through likes, reposts, and replies.
 * The entire post card is clickable and navigates to a detailed view.
 * 
 * For Rust Backend Integration:
 * - Clicking on the post navigates to a detail view with replies
 * - Action buttons (like, repost) call the Bluesky API through our Rust backend
 * - Engagement counts are fetched from the Bluesky API
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftIcon, ArrowPathRoundedSquareIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { invoke } from '../utils/tauri-api';

/**
 * Author Interface
 * 
 * Defines the structure for user profile data.
 * 
 * @property did - Decentralized identifier for the user
 * @property handle - User's handle (username)
 * @property display_name - Display name of the user
 * @property avatar - URL to the profile image
 */
interface Author {
  did: string;
  handle: string;
  display_name: string;
  avatar?: string;
}

/**
 * PostProps Interface
 * 
 * Props for the Post component, containing all data needed to display a post.
 * 
 * @property post - The post data object with all required fields
 * @property session - User session data for authentication
 */
interface PostProps {
  post: {
    id: string;
    author: Author;
    text: string;
    created_at: string;
    images?: string[];
    likes_count: number;
    reposts_count: number;
    replies_count: number;
  };
  session: string | null;
}

/**
 * Post Component
 * 
 * Displays a single Bluesky post with user info, content, and interaction buttons.
 * The entire component is clickable, navigating to a detailed view.
 * 
 * @param post - The post data to display
 * @param session - User session data for authentication
 */
const Post: React.FC<PostProps> = ({ post, session }) => {
  // React Router's navigation hook for programmatic navigation
  const navigate = useNavigate();
  
  // Local state for like functionality
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count);

  /**
   * Handle the like button click
   * 
   * Toggles the liked state and updates the count accordingly.
   * Makes an API call to the Bluesky service through our Rust backend.
   * Stops event propagation to prevent navigation when clicking the like button.
   * 
   * @param e - The click event object
   */
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when liking
    
    if (!session) {
      console.error('Must be logged in to like posts');
      return;
    }
    
    try {
      const success = await invoke<boolean>('like_post', {
        service: 'https://bsky.social',
        session,
        post_uri: post.id
      });
      
      if (success) {
        // Toggle like state and update count
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  /**
   * Navigate to the post detail page
   * 
   * Called when clicking anywhere on the post card.
   */
  const handleNavigateToDetail = () => {
    navigate(`/post/${post.id}`);
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
          src={post.author.avatar || `https://i.pravatar.cc/150?u=${post.author.handle}`}
          alt="Profile Picture"
          className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
        />
        
        <div className="flex-1">
          {/* User Info and Timestamp */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-base">{post.author.display_name}</h4>
            <span className="text-sm sm:text-[15px] text-gray-500">@{post.author.handle}</span>
            <span className="text-sm sm:text-[15px] text-gray-500">· {post.created_at}</span>
          </div>
          
          {/* Post Text Content */}
          <p className="text-gray-900 text-[15px] sm:text-base my-2">{post.text}</p>
          
          {/* Optional Post Image */}
          {post.images && post.images.length > 0 && (
            <div className="rounded-xl overflow-hidden mt-3 mb-2 shadow-sm">
              <img
                src={post.images[0]}
                alt="Post image"
                className="w-full max-h-80 object-cover"
              />
            </div>
          )}
          
          {/* Engagement Actions (Reply, Repost, Like, Share) */}
          <div className="flex justify-between text-gray-500 mt-4 w-full sm:w-10/12" onClick={handleActionClick}>
            {/* Reply Button */}
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-bluesky-100">
                <ChatBubbleOvalLeftIcon className="h-5 group-hover:text-bluesky-400" />
              </div>
              <span className="group-hover:text-bluesky-400 text-sm">{post.replies_count}</span>
            </div>
            
            {/* Repost Button */}
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-100">
                <ArrowPathRoundedSquareIcon className="h-5 group-hover:text-green-500" />
              </div>
              <span className="group-hover:text-green-500 text-sm">{post.reposts_count}</span>
            </div>
            
            {/* Like Button - with active state styling */}
            <div className="flex items-center space-x-1 group" onClick={handleLike}>
              <div className={`icon ${liked ? 'bg-red-100' : 'group-hover:bg-red-100'}`}>
                <HeartIcon className={`h-5 ${liked ? 'text-red-500 fill-red-500' : 'group-hover:text-red-500'}`} />
              </div>
              <span className={`${liked ? 'text-red-500' : 'group-hover:text-red-500'} text-sm`}>{likeCount}</span>
            </div>
            
            {/* Share Button */}
            <div className="icon group-hover:bg-bluesky-100">
              <ShareIcon className="h-5 group-hover:text-bluesky-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post; 