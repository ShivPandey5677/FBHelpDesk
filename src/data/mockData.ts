import { User, FacebookPage, Conversation, Customer, Message } from '../types';

// Mock database - in production, this would be a real database
export const users: User[] = [
  {
    id: '1',
    email: 'demo@richpanel.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  }
];

export const facebookPages: FacebookPage[] = [
  {
    id: '1',
    name: 'Amazon Business',
    accessToken: 'mock_access_token',
    userId: '1',
    connectedAt: new Date().toISOString(),
  }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Amit RG',
    email: 'amit@richpanel.com',
    facebookId: 'fb_1',
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face',
    firstName: 'Amit',
    lastName: 'RG',
  },
  {
    id: '2',
    name: 'Hiten Saxena',
    facebookId: 'fb_2',
    profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face',
    firstName: 'Hiten',
    lastName: 'Saxena',
  }
];

export const messages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    text: 'Is it in stock right now?',
    senderId: '1',
    senderType: 'customer',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    facebookMessageId: 'fb_msg_1',
  },
  {
    id: '2',
    conversationId: '1',
    text: "We've 3 left in stock!",
    senderId: 'agent_1',
    senderType: 'agent',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
  },
  {
    id: '3',
    conversationId: '1',
    text: 'If you order before 8PM we can ship it today.',
    senderId: 'agent_1',
    senderType: 'agent',
    timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 minutes ago
  },
  {
    id: '4',
    conversationId: '2',
    text: 'Hi do you have any T-Shirt available in store?',
    senderId: '2',
    senderType: 'customer',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    facebookMessageId: 'fb_msg_2',
  }
];

export const conversations: Conversation[] = [
  {
    id: '1',
    pageId: '1',
    customerId: '1',
    customer: customers[0],
    lastMessageAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    unreadCount: 0,
    messages: messages.filter(m => m.conversationId === '1'),
    status: 'open',
  },
  {
    id: '2',
    pageId: '1',
    customerId: '2',
    customer: customers[1],
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 1,
    messages: messages.filter(m => m.conversationId === '2'),
    status: 'open',
  }
];

// Helper functions to simulate database operations
export const findUserByEmailAndPassword = (email: string, password: string): User | null => {
  return users.find(u => u.email === email) || null; // In real app, check password hash
};

export const createUser = (name: string, email: string, password: string): User => {
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

export const findUserById = (id: string): User | null => {
  return users.find(u => u.id === id) || null;
};

export const findPageByUserId = (userId: string): FacebookPage | null => {
  return facebookPages.find(p => p.userId === userId) || null;
};

export const createFacebookPage = (userId: string): FacebookPage => {
  const newPage: FacebookPage = {
    id: (facebookPages.length + 1).toString(),
    name: 'Demo Business Page',
    accessToken: 'mock_access_token_' + Date.now(),
    userId,
    connectedAt: new Date().toISOString(),
  };
  facebookPages.push(newPage);
  return newPage;
};

export const deleteFacebookPage = (userId: string): void => {
  const index = facebookPages.findIndex(p => p.userId === userId);
  if (index > -1) {
    facebookPages.splice(index, 1);
  }
};

export const getConversationsByUserId = (userId: string): Conversation[] => {
  const userPage = findPageByUserId(userId);
  if (!userPage) return [];
  
  return conversations.filter(c => c.pageId === userPage.id);
};

export const addMessageToConversation = (conversationId: string, text: string, senderId: string, senderType: 'customer' | 'agent'): Message => {
  const newMessage: Message = {
    id: (messages.length + 1).toString(),
    conversationId,
    text,
    senderId,
    senderType,
    timestamp: new Date().toISOString(),
  };
  
  messages.push(newMessage);
  
  // Update conversation
  const conversation = conversations.find(c => c.id === conversationId);
  if (conversation) {
    conversation.messages.push(newMessage);
    conversation.lastMessageAt = newMessage.timestamp;
  }
  
  return newMessage;
};