/**
 * Feed.tsx - Main Feed Component
 * 
 * Displays the main feed of Bluesky posts.
 * Allows users to create new posts.
 * 
 * For Rust Backend Integration:
 * - Fetches posts from the Bluesky API via our Rust backend
 * - Handles post creation through the Rust backend
 */

import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Post from './Post';

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
 * PostData Interface
 * 
 * Defines the structure for post objects.
 * 
 * @property id - URI identifier for the post
 * @property author - Author information
 * @property text - The content of the post
 * @property created_at - When the post was created (as a formatted string)
 * @property images - Optional array of image URLs attached to the post
 * @property likes_count - Number of likes on the post
 * @property reposts_count - Number of reposts of the post
 * @property replies_count - Number of replies to the post
 */
interface PostData {
  id: string;
  author: Author;
  text: string;
  created_at: string;
  images?: string[];
  likes_count: number;
  reposts_count: number;
  replies_count: number;
}

/**
 * PostInput Interface
 * 
 * Props for the PostInput component.
 * 
 * @property addPost - Function to call when a new post is submitted
 * @property session - User session data for authentication
 */
interface PostInputProps {
  addPost: (text: string) => void;
  session: string | null;
}

/**
 * PostInput Component
 * 
 * Allows users to compose and submit new posts.
 * Contains a textarea and submit button with attachment options.
 * 
 * For Rust Backend Integration:
 * - Would include file upload functionality
 * - Could include mentions, hashtags, and other rich text features
 * - Would submit the post to the Bluesky API
 * 
 * @param addPost - Function to call when the post is submitted
 * @param session - User session data for authentication
 */
const PostInput: React.FC<PostInputProps> = ({ addPost, session }) => {
  // State for the post input field
  const [input, setInput] = useState('');

  /**
   * Handle post submission
   * 
   * Prevents the default form submission behavior,
   * calls the addPost function with the input text if not empty,
   * and resets the input field.
   * 
   * @param e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addPost(input);
      setInput('');
    }
  };

  if (!session) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 text-center">
        <p className="text-gray-600 mb-3">Sign in to post to your Bluesky timeline</p>
        <button className="btn-primary bg-bluesky-500 hover:bg-bluesky-600">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex space-x-4">
        {/* User profile picture */}
        <img 
          src="https://i.pravatar.cc/150?img=3" 
          alt="User avatar" 
          className="h-12 w-12 rounded-full cursor-pointer border-2 border-white shadow-sm"
        />
        <div className="w-full">
          {/* Post text input area */}
          <div className="mb-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind?"
              rows={2}
              className="bg-transparent outline-none text-gray-900 text-lg placeholder-gray-500 tracking-wide w-full min-h-[60px] focus:ring-0 border-0"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {/* Media attachment buttons */}
            <div className="flex items-center space-x-2">
              {/* Image attachment button */}
              <button className="icon bg-white">
                <svg className="w-5 h-5 text-bluesky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              </button>
              {/* Emoji button */}
              <button className="icon bg-white rotate-90">
                <svg className="w-5 h-5 text-bluesky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            {/* Post submit button */}
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="btn-primary px-5 py-2 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-default bg-bluesky-500 hover:bg-bluesky-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * FeedProps Interface
 * 
 * Props for the Feed component.
 * 
 * @property posts - Array of post data objects to display
 * @property addPost - Function to call when a new post is created
 * @property session - User session data for authentication
 */
interface FeedProps {
  posts: PostData[];
  addPost: (text: string) => void;
  session: string | null;
}

/**
 * Feed Component
 * 
 * Displays the main timeline of posts with a composition area at the top.
 * 
 * For Rust Backend Integration:
 * - Would fetch posts from the Bluesky API
 * - Would include pagination or infinite scrolling
 * - Could implement real-time updates via polling
 * 
 * @param posts - Array of post data to display
 * @param addPost - Function to call when a new post is created
 * @param session - User session data for authentication
 */
const Feed: React.FC<FeedProps> = ({ posts, addPost, session }) => {
  return (
    <div className="min-h-screen px-4">
      {/* Header with title and options button */}
      <div className="flex items-center justify-between py-3 px-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md rounded-xl shadow-sm mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Home</h2>
        <div className="floating-icon bg-white cursor-pointer">
          <SparklesIcon className="h-5 w-5 text-bluesky-500" />
        </div>
      </div>

      {/* Post composition area */}
      <PostInput addPost={addPost} session={session} />
      
      {/* Posts list */}
      <div className="pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No posts in your timeline yet. 
            {session ? "Follow some users to see their posts here!" : "Sign in to see posts from people you follow."}
          </div>
        ) : (
          posts.map(post => (
            <Post key={post.id} post={post} session={session} />
          ))
        )}
      </div>
      
      {/* Floating action button for mobile */}
      <div className="fixed right-6 bottom-6 md:hidden">
        <button className="bg-bluesky-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 11h-8V3h-2v8H3v2h8v8h2v-8h8z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Feed; 