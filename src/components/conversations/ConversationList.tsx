import React from 'react';
import { Conversation } from '../../types';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        <div className="flex items-center mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">{conversations.length} active</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
            <p className="text-xs mt-1">Messages will appear here when customers contact you</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={conversation.customer.profilePicture || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face`}
                    alt={conversation.customer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(conversation.lastMessageAt)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="text-xs text-gray-400">Facebook DM</span>
                  </p>
                  {conversation.messages.length > 0 && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.messages[conversation.messages.length - 1].text}
                    </p>
                  )}
                  {conversation.unreadCount > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {conversation.unreadCount} new
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;