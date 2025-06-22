export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  accessToken: string;
  userId: string;
  connectedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  facebookId: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  senderId: string;
  senderType: 'customer' | 'agent';
  timestamp: string;
  facebookMessageId?: string;
}

export interface Conversation {
  id: string;
  pageId: string;
  customerId: string;
  customer: Customer;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
  status: 'open' | 'closed';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}