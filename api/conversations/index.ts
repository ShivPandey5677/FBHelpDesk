import { supabase } from '../../src/lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Get conversations with customer data and messages
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        customers (*),
        messages (*)
      `)
      .eq('facebook_pages.user_id', userId)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database error' });
    }

    // Transform data to match frontend expectations
    const transformedConversations = conversations?.map(conv => ({
      id: conv.id,
      pageId: conv.page_id,
      customerId: conv.customer_id,
      customer: {
        id: conv.customers.id,
        name: conv.customers.name,
        email: conv.customers.email,
        facebookId: conv.customers.facebook_id,
        profilePicture: conv.customers.profile_picture,
        firstName: conv.customers.first_name,
        lastName: conv.customers.last_name,
      },
      lastMessageAt: conv.last_message_at,
      unreadCount: conv.unread_count,
      status: conv.status,
      messages: conv.messages.map((msg: any) => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        text: msg.text,
        senderId: msg.sender_id,
        senderType: msg.sender_type,
        timestamp: msg.timestamp,
        facebookMessageId: msg.facebook_message_id,
      })).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    })) || [];
    
    res.status(200).json({ conversations: transformedConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}