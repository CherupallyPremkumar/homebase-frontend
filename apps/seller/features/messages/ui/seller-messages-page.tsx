'use client';

import { useState } from 'react';
import { cn } from '@homebase/ui';
import { Search, Star, ExternalLink, MoreVertical, Send, Paperclip, Image } from 'lucide-react';

interface Conversation {
  id: number;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  orderId: string;
  time: string;
  unread: number;
}

interface ChatMessage {
  id: number;
  sender: 'customer' | 'seller';
  text: string;
  time: string;
}

const conversations: Conversation[] = [
  {
    id: 1, name: 'Anita Kumar', initials: 'AK', color: 'from-blue-400 to-blue-600',
    lastMessage: "Thanks for the update! I'll wait for...", orderId: '#HB-20260328-1042',
    time: '2:45 PM', unread: 0,
  },
  {
    id: 2, name: 'Vikram Mehta', initials: 'VM', color: 'from-purple-400 to-purple-600',
    lastMessage: 'Is this available in size XL? Need it...', orderId: '#HB-20260328-1038',
    time: '1:20 PM', unread: 2,
  },
  {
    id: 3, name: 'Priya Sharma', initials: 'PS', color: 'from-green-400 to-green-600',
    lastMessage: 'Can you send the invoice for my order?', orderId: '#HB-20260327-0987',
    time: '12:05 PM', unread: 1,
  },
  {
    id: 4, name: 'Rohit Jain', initials: 'RJ', color: 'from-amber-400 to-amber-600',
    lastMessage: 'Great, the delivery was on time. Thank...', orderId: '#HB-20260326-0854',
    time: 'Yesterday', unread: 0,
  },
  {
    id: 5, name: 'Neha Desai', initials: 'ND', color: 'from-rose-400 to-rose-600',
    lastMessage: 'I received the wrong color. Can I retu...', orderId: '#HB-20260325-0712',
    time: 'Yesterday', unread: 1,
  },
  {
    id: 6, name: 'Sanjay Kapoor', initials: 'SK', color: 'from-teal-400 to-teal-600',
    lastMessage: "Okay, I'll place a new order next week.", orderId: '#HB-20260324-0691',
    time: 'Mar 25', unread: 0,
  },
];

const chatMessages: ChatMessage[] = [
  { id: 1, sender: 'customer', text: 'Hi, I placed an order yesterday for the Wooden Dining Table Set. Can you confirm when it will be shipped?', time: '9:15 AM' },
  { id: 2, sender: 'seller', text: 'Hello Anita! Thank you for your order. Let me check the status for you. Your order #HB-20260328-1042 for the Wooden Dining Table Set is currently being prepared.', time: '9:22 AM' },
  { id: 3, sender: 'customer', text: "That's great! Do you know the estimated delivery date? I need it before April 5th for a family event.", time: '9:30 AM' },
  { id: 4, sender: 'seller', text: "Absolutely! We'll ship it by tomorrow (March 29th). With our standard delivery, it should reach you by April 1st or 2nd at the latest. Well before your event!", time: '9:38 AM' },
  { id: 5, sender: 'customer', text: 'Perfect! Can I also add a set of matching dining chairs to the same order?', time: '10:15 AM' },
  { id: 6, sender: 'seller', text: "Unfortunately, we can't modify the current order since it's already being prepared. However, you can place a separate order for the chairs and I'll make sure both are shipped together!", time: '10:22 AM' },
  { id: 7, sender: 'customer', text: "That works! I'll place the order for chairs now. Thanks for the help!", time: '2:30 PM' },
  { id: 8, sender: 'seller', text: "You're welcome, Anita! Feel free to reach out if you need anything else. Happy to help!", time: '2:45 PM' },
];

export function SellerMessagesPage() {
  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('All');

  return (
    <div className="-m-6">
      {/* Page Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">Communicate with your customers</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Chat Layout */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 180px)' }}>

          {/* Left Panel: Conversation List */}
          <div className="w-80 border-r border-gray-200 flex flex-col shrink-0">
            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100">
              {['All', 'Unread', 'Starred'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                    filter === f ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 transition-colors',
                    selectedConv.id === conv.id ? 'bg-orange-50' : 'hover:bg-gray-50',
                  )}
                >
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${conv.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {conv.initials}
                    </div>
                    {conv.unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={cn('text-sm truncate', conv.unread > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900')}>
                        {conv.name}
                      </p>
                      <span className={cn('text-[10px] shrink-0 ml-2', conv.unread > 0 ? 'text-orange-500 font-semibold' : 'text-gray-400')}>
                        {conv.time}
                      </span>
                    </div>
                    <p className={cn('text-xs truncate', conv.unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-500')}>
                      {conv.lastMessage}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Order {conv.orderId}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedConv.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {selectedConv.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{selectedConv.name}</h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">Order {selectedConv.orderId}</span>
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Processing</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Star conversation">
                  <Star className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="View order">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="More options">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-gray-50/50">
              {/* Date Separator */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Today, March 28</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {chatMessages.map((msg) => (
                <div key={msg.id} className={cn('flex items-end gap-2', msg.sender === 'seller' && 'justify-end')}>
                  {msg.sender === 'customer' && (
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${selectedConv.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {selectedConv.initials}
                    </div>
                  )}
                  <div className={msg.sender === 'seller' ? 'text-right' : ''}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2.5 max-w-md inline-block text-left',
                        msg.sender === 'customer'
                          ? 'bg-white border border-gray-200 rounded-bl-md shadow-sm'
                          : 'bg-orange-50 border border-orange-100 rounded-br-md',
                      )}
                    >
                      <p className="text-sm text-gray-800">{msg.text}</p>
                    </div>
                    <p className={cn('text-[10px] text-gray-400 mt-1', msg.sender === 'seller' ? 'text-right mr-1' : 'ml-1')}>
                      {msg.time}
                    </p>
                  </div>
                  {msg.sender === 'seller' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      RS
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Paperclip className="w-4.5 h-4.5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Image className="w-4.5 h-4.5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                  onKeyDown={(e) => { if (e.key === 'Enter' && message.trim()) setMessage(''); }}
                />
                <button
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition',
                    message.trim()
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-100 text-gray-400',
                  )}
                  onClick={() => message.trim() && setMessage('')}
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
