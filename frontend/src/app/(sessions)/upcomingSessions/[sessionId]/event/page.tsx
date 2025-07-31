import React from 'react';
import { Users, MessageSquare, Video } from 'lucide-react';

export default function SessionEventPage() {
  return (
    <div className="min-h-screen flex bg-zinc-900 text-white">
      {/* Sidebar for chat and participants */}
      <aside className="w-80 bg-zinc-800 flex flex-col border-r border-zinc-700">
        <div className="p-4 border-b border-zinc-700 flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="font-semibold">Participants</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Placeholder participants */}
          <div className="mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
            <span>Sarah Johnson</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
            <span>Michael Chen</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
            <span>Emily Rodriguez</span>
          </div>
        </div>
        <div className="p-4 border-t border-zinc-700 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="font-semibold">Chat</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Placeholder chat messages */}
          <div className="mb-2">
            <span className="font-bold">Sarah:</span> Hi everyone!
          </div>
          <div className="mb-2">
            <span className="font-bold">Michael:</span> Ready to start?
          </div>
        </div>
        <div className="p-4 border-t border-zinc-700">
          <input
            className="w-full rounded bg-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none"
            placeholder="Type a message..."
            disabled
          />
        </div>
      </aside>
      {/* Main video area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl aspect-video bg-zinc-800 rounded-lg flex items-center justify-center mb-6 border-4 border-zinc-700">
          {/* Placeholder for video grid */}
          <Video className="h-16 w-16 text-zinc-500" />
          <span className="ml-4 text-lg text-zinc-400">Video Grid Placeholder</span>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Join Audio
          </button>
          <button className="bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded text-white font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Open Chat
          </button>
        </div>
      </main>
    </div>
  );
} 