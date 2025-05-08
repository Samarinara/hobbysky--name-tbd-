/**
 * App.tsx - Main Application Component
 * 
 * This is the root component of the Bluesky client application.
 * It sets up routing and defines the overall page layout with three panels:
 * 1. Left panel: Navigation sidebar
 * 2. Center panel: Main content area (either feed or post detail)
 * 3. Right panel: Widgets (trending feeds, suggested accounts, etc.)
 * 
 * For Rust Backend Integration:
 * - The posts array would be fetched from the Bluesky API using bsky-sdk
 * - The addPost function would make a request to create new posts
 * - Authentication state would be managed here or in a context provider
 */

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import Widgets from "./components/Widgets";
import PostDetail from "./components/PostDetail";
import { invoke } from "./utils/tauri-api";

/**
 * Author Interface
 * 
 * Defines the structure for user profile data throughout the application.
 * 
 * @property did - Decentralized identifier for the user
 * @property handle - User's handle (username)
 * @property displayName - Display name of the user
 * @property avatar - URL to the profile image
 */
interface Author {
  did: string;
  handle: string;
  display_name: string;
  avatar?: string;
}

/**
 * Post Interface
 * 
 * Defines the structure for post objects throughout the application.
 * This matches the data structure from the Rust backend using bsky-sdk.
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

function App() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  
  /**
   * Fetch the timeline from the Bluesky API
   * 
   * Uses the Tauri invoke function to call into our Rust backend
   */
  useEffect(() => {
    async function fetchTimeline() {
      try {
        setLoading(true);
        const timeline = await invoke<PostData[]>('get_timeline', { 
          service: 'https://bsky.social',
          session: session
        });
        setPosts(timeline);
      } catch (err) {
        console.error('Failed to fetch timeline:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTimeline();
  }, [session]);

  /**
   * Add a new post to the feed
   * 
   * For Rust Backend Integration:
   * 1. This makes a request to the Bluesky API through our Rust backend
   * 2. The post is created via the AT Protocol
   * 3. On success, we update the local state with the new post
   * 
   * @param postText - The content of the post to add
   */
  const addPost = async (postText: string) => {
    if (!session) {
      setError('You must be logged in to post');
      return;
    }
    
    try {
      /*const postUri = */ await invoke<string>('create_post', {
        service: 'https://bsky.social',
        session,
        text: postText
      });
      
      // Fetch the timeline again to get the updated posts
      const timeline = await invoke<PostData[]>('get_timeline', { 
        service: 'https://bsky.social',
        session
      });
      setPosts(timeline);
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post. Please try again later.');
    }
  };

  return (
    <Router>
      <div className="bg-white min-h-screen">
        {/* 
          Main grid layout with 12 columns
          Using Tailwind CSS grid system with Bluesky design elements
        */}
        <div className="grid grid-cols-12 mx-auto max-w-7xl">
          {/* Left panel - Menu */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <Sidebar session={session} setSession={setSession} />
          </div>
          
          {/* Center panel - Content */}
          <div className="col-span-10 md:col-span-7 lg:col-span-6 border-x border-gray-200">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-2">
                {error}
                <button 
                  className="float-right font-bold"
                  onClick={() => setError(null)}
                >
                  &times;
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bluesky-500"></div>
              </div>
            ) : (
              <Routes>
                {/* Home route - shows the main feed */}
                <Route path="/" element={<Feed posts={posts} addPost={addPost} session={session} />} />
                
                {/* Post detail route - shows a single post with replies */}
                <Route path="/post/:postId" element={<PostDetail session={session} />} />
              </Routes>
            )}
          </div>
          
          {/* Right panel - Widgets (hidden on smaller screens) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <Widgets />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
