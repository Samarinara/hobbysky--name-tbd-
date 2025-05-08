import React, { useState } from 'react';
import { PaperAirplaneIcon, FaceSmileIcon, PaperClipIcon } from '@heroicons/react/24/outline';

export interface CommentType {
  id: number;
  text: string;
  username: string;
  userImg: string;
  timestamp: string;
  isOwn: boolean;
}

/**
 * Comments Component Props
 * @property initialComments - Optional array of initial comments
 */
interface CommentsProps {
  initialComments?: CommentType[];
}

/**
 * Comments Component
 * 
 * Displays a list of comments for a given post.
 * Allows users to add new comments.
 * 
 * @param initialComments - Optional initial set of comments
 */
const Comments: React.FC<CommentsProps> = ({ initialComments = [] }) => {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newComment.trim()) {
      // Add new comment
      const comment: CommentType = {
        id: Date.now(),
        text: newComment,
        username: 'you',
        userImg: 'https://i.pravatar.cc/150?img=3',
        timestamp: 'Just now',
        isOwn: true
      };
      
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 mt-2">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-base font-medium text-gray-700">Comments ({comments.length})</h3>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`flex ${comment.isOwn ? 'justify-end' : 'justify-start'}`}>
              {!comment.isOwn && (
                <img 
                  src={comment.userImg} 
                  alt={comment.username}
                  className="h-8 w-8 rounded-full mr-2 self-end"
                />
              )}
              <div 
                className={`rounded-2xl py-2 px-3 max-w-[85%] relative ${
                  comment.isOwn 
                    ? 'bg-orange-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                }`}
              >
                {!comment.isOwn && (
                  <p className="text-xs font-medium text-orange-500 mb-1">{comment.username}</p>
                )}
                <p className="text-sm">{comment.text}</p>
                <span className={`text-[10px] ${comment.isOwn ? 'text-orange-100' : 'text-gray-500'} absolute bottom-1 right-2`}>
                  {comment.timestamp}
                  {comment.isOwn && (
                    <span className="ml-1">✓✓</span>
                  )}
                </span>
              </div>
              {comment.isOwn && (
                <img 
                  src={comment.userImg} 
                  alt={comment.username}
                  className="h-8 w-8 rounded-full ml-2 self-end"
                />
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Comment Input - Fixed at the bottom */}
      <div className="sticky bottom-0 bg-gray-50 pt-2">
        <form 
          onSubmit={handleSendComment}
          className="flex items-center bg-white rounded-full border border-gray-200 px-4 py-1"
        >
          <div className="flex items-center space-x-1 mr-2">
            <button type="button" className="icon h-8 w-8 text-gray-500">
              <PaperClipIcon className="h-5 w-5" />
            </button>
          </div>
          
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border-0 bg-transparent focus:ring-0 text-sm px-2 py-1"
          />
          
          <div className="flex items-center space-x-1 ml-2">
            <button type="button" className="icon h-8 w-8 text-gray-500">
              <FaceSmileIcon className="h-5 w-5" />
            </button>
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="icon h-8 w-8 bg-orange-500 text-white disabled:bg-gray-300"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments; 