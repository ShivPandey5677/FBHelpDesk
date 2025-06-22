import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Conversation, Message } from '../types';
import Sidebar from '../components/layout/Sidebar';
import ConversationList from '../components/conversations/ConversationList';
import ChatWindow from '../components/conversations/ChatWindow';
import CustomerProfile from '../components/conversations/CustomerProfile';

const ConversationsPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
        
        // Auto-select first conversation if none selected
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mark conversation as read
    markConversationAsRead(conversation.id);
  };

  const markConversationAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const handleSendMessage = async (conversationId: string, messageText: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          conversationId,
          text: messageText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newMessage: Message = data.message;

        // Update conversations with new message
        setConversations(prev => 
          prev.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessageAt: newMessage.timestamp,
              };
            }
            return conv;
          })
        );

        // Update selected conversation
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(prev => prev ? {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessageAt: newMessage.timestamp,
          } : null);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
        />
        <ChatWindow
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
        />
        <CustomerProfile
          customer={selectedConversation?.customer || null}
        />
      </div>
    </div>
  );
};

export default ConversationsPage;