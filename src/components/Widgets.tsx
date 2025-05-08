/**
 * Widgets.tsx - Widgets Component
 * 
 * This component displays the right sidebar widgets including search,
 * trending topics/feeds, and suggested accounts to follow.
 * These widgets provide additional functionality and discovery options
 * for the Bluesky social network.
 * 
 * For Rust Backend Integration:
 * - Trending feeds could be fetched from the Bluesky API
 * - Suggested accounts could be fetched based on user interests
 * - Search would query the Bluesky API for posts/users
 */

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Widgets: React.FC = () => {
  // Sample trending feeds
  const trendingFeeds = [
    { id: 1, name: "What's Hot", description: 'Popular posts from across Bluesky', imageUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'In My Network', description: 'Posts popular among people you follow', imageUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Developer', description: 'Topics and posts from the developer community', imageUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Photography', description: 'Beautiful images from Bluesky photographers', imageUrl: 'https://i.pravatar.cc/150?img=4' },
  ];
  
  // Sample suggested accounts
  const suggestedAccounts = [
    { id: 1, name: 'Bluesky', handle: 'bsky.app', avatar: 'https://i.pravatar.cc/150?img=10' },
    { id: 2, name: 'Jay Graber', handle: 'jay.bsky.social', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 3, name: 'Paul Frazee', handle: 'pfrazee.com', avatar: 'https://i.pravatar.cc/150?img=12' },
  ];
  
  return (
    <div className="px-6 py-4">
      {/* Search Bar */}
      <div className="sticky top-0 py-2 z-10 bg-white">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Bluesky"
            className="w-full bg-gray-100 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-bluesky-400 focus:bg-white border border-gray-200"
          />
        </div>
      </div>
      
      {/* Trending Feeds */}
      <div className="widget-card mt-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-xl">Trending Feeds</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {trendingFeeds.map(feed => (
            <div key={feed.id} className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img src={feed.imageUrl} alt={feed.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">{feed.name}</h3>
                  <p className="text-sm text-gray-500">{feed.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-4 text-bluesky-500 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
            <span className="font-semibold">Show more</span>
          </div>
        </div>
      </div>
      
      {/* Suggested Accounts */}
      <div className="widget-card mt-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-xl">Who to follow</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {suggestedAccounts.map(account => (
            <div key={account.id} className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={account.avatar} alt={account.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">{account.name}</h3>
                    <p className="text-sm text-gray-500">@{account.handle}</p>
                  </div>
                </div>
                <button className="btn-primary bg-bluesky-500 hover:bg-bluesky-600 text-sm py-1.5 px-4">
                  Follow
                </button>
              </div>
            </div>
          ))}
          
          <div className="p-4 text-bluesky-500 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
            <span className="font-semibold">Show more</span>
          </div>
        </div>
      </div>
      
      {/* AT Protocol Info */}
      <div className="mt-6 p-4 text-xs text-gray-500">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">About</a>
        </div>
        <p className="mt-2">
          Powered by the AT Protocol · © 2023 Bluesky
        </p>
      </div>
    </div>
  );
};

export default Widgets; 