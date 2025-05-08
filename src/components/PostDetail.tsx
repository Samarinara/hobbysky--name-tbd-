import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, HeartIcon, ArrowPathRoundedSquareIcon, ShareIcon } from '@heroicons/react/24/outline';
import { invoke } from '../utils/tauri-api';

interface Author {
  did: string;
  handle: string;
  display_name: string;
  avatar?: string;
}

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

interface Reply {
  id: string;
  author: Author;
  text: string;
  created_at: string;
  images?: string[];
  isOwn?: boolean;
}

interface PostDetailProps {
  session: string | null;
}

const PostDetail: React.FC<PostDetailProps> = ({ session }) => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState<PostData | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Fetch post details and replies
  useEffect(() => {
    async function fetchPostDetails() {
      if (!postId) return;
      
      try {
        setLoading(true);
        const postDetail = await invoke<PostData>('get_post_detail', {
          service: 'https://bsky.social',
          session,
          post_uri: postId
        });
        
        setPost(postDetail);
        
        const postReplies = await invoke<Reply[]>('get_post_replies', {
          service: 'https://bsky.social',
          session,
          post_uri: postId
        });
        
        setReplies(postReplies);
      } catch (err) {
        console.error('Failed to fetch post details:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPostDetails();
  }, [postId, session]);
  
  const handleLike = async () => {
    if (!session || !post) {
      setError('You need to be logged in to like posts');
      return;
    }
    
    try {
      const success = await invoke<boolean>('like_post', {
        service: 'https://bsky.social',
        session,
        post_uri: post.id
      });
      
      if (success) {
        setLiked(!liked);
        // Update the like count in the UI
        if (liked) {
          post.likes_count--;
        } else {
          post.likes_count++;
        }
      }
    } catch (err) {
      console.error('Failed to like post:', err);
      setError('Failed to like post. Please try again later.');
    }
  };
  
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session || !post || !replyText.trim()) {
      setError('You need to be logged in and write something to reply');
      return;
    }
    
    try {
      // This would need to be implemented in the backend
      // For now, just add a local placeholder reply
      const newReply: Reply = {
        id: `temp-${Date.now()}`,
        author: {
          did: 'temp-did',
          handle: 'you',
          display_name: 'You',
          avatar: 'https://i.pravatar.cc/150?img=3'
        },
        text: replyText,
        created_at: 'now',
        isOwn: true
      };
      
      setReplies([...replies, newReply]);
      setReplyText('');
    } catch (err) {
      console.error('Failed to reply to post:', err);
      setError('Failed to reply. Please try again later.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bluesky-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold mb-2 text-red-500">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary px-4 py-2 bg-bluesky-500 hover:bg-bluesky-600"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary px-4 py-2 bg-bluesky-500 hover:bg-bluesky-600"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center py-3 px-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <button 
          onClick={() => navigate('/')}
          className="icon mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold">Post</h2>
      </div>
      
      {/* Post */}
      <div className="px-4 mb-6">
        <div className="flex space-x-4">
          <img
            src={post.author.avatar || `https://i.pravatar.cc/150?u=${post.author.handle}`}
            alt="Profile"
            className="h-12 w-12 rounded-full cursor-pointer border-2 border-white shadow-sm"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <h4 className="font-bold text-[16px] sm:text-lg">{post.author.display_name}</h4>
              <span className="text-sm sm:text-[15px] text-gray-500">@{post.author.handle}</span>
            </div>
            
            <p className="text-gray-900 text-[16px] sm:text-lg my-3">{post.text}</p>
            
            {post.images && post.images.length > 0 && (
              <div className="rounded-xl overflow-hidden my-3 shadow-sm">
                <img
                  src={post.images[0]}
                  alt="Post image"
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}
            
            <p className="text-gray-500 text-sm py-3 border-b border-gray-100">
              {post.created_at} · Bluesky
            </p>
            
            <div className="flex justify-between text-gray-500 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.replies_count}</span>
                <span className="text-sm">Replies</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.reposts_count}</span>
                <span className="text-sm">Reposts</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.likes_count}</span>
                <span className="text-sm">Likes</span>
              </div>
            </div>
            
            <div className="flex justify-around text-gray-500 py-2 border-b border-gray-100">
              <div className="icon group-hover:bg-blue-100">
                <ArrowPathRoundedSquareIcon className="h-5 group-hover:text-green-500" />
              </div>
              
              <div className="icon" onClick={handleLike}>
                <HeartIcon className={`h-5 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
              </div>
              
              <div className="icon group-hover:bg-blue-100">
                <ShareIcon className="h-5 group-hover:text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reply input */}
      {session && (
        <div className="px-4 mb-6">
          <form onSubmit={handleSubmitReply} className="flex space-x-2">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Your profile"
              className="h-10 w-10 rounded-full border border-gray-200"
            />
            <div className="flex-1 relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full border border-gray-200 rounded-xl p-2 pl-3 pr-12 resize-none h-14 focus:outline-none focus:ring-2 focus:ring-bluesky-400 focus:border-bluesky-400"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="absolute bottom-2 right-2 bg-bluesky-500 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Replies section */}
      <div className="px-4">
        <h3 className="font-bold text-xl mb-4">Replies</h3>
        
        {replies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No replies yet. Be the first to reply!
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map(reply => (
              <div key={reply.id} className="flex space-x-3">
                <img 
                  src={reply.author.avatar || `https://i.pravatar.cc/150?u=${reply.author.handle}`}
                  alt={`${reply.author.handle}'s profile`}
                  className="h-10 w-10 rounded-full border border-gray-200"
                />
                <div className={`flex-1 p-3 rounded-lg ${reply.isOwn ? 'bg-bluesky-50 text-bluesky-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="font-semibold">{reply.author.display_name}</span>
                    <span className="text-sm text-gray-500">@{reply.author.handle}</span>
                    <span className="text-sm text-gray-500">· {reply.created_at}</span>
                  </div>
                  <p>{reply.text}</p>
                  
                  {reply.images && reply.images.length > 0 && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img
                        src={reply.images[0]}
                        alt="Reply image"
                        className="w-full max-h-60 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail; 