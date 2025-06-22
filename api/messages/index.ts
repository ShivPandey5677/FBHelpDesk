import { supabase } from '../../src/lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { conversationId, text } = req.body;
    
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

    if (!conversationId || !text) {
      return res.status(400).json({ message: 'Conversation ID and text are required' });
    }

    // Insert new message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        text: text.trim(),
        sender_id: userId,
        sender_type: 'agent',
      })
      .select('*')
      .single();

    if (messageError) {
      console.error('Database error:', messageError);
      return res.status(500).json({ message: 'Failed to send message' });
    }

    // Update conversation last_message_at
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_message_at: message.timestamp })
      .eq('id', conversationId);

    if (updateError) {
      console.error('Update conversation error:', updateError);
    }

    // Transform message to match frontend expectations
    const transformedMessage = {
      id: message.id,
      conversationId: message.conversation_id,
      text: message.text,
      senderId: message.sender_id,
      senderType: message.sender_type,
      timestamp: message.timestamp,
      facebookMessageId: message.facebook_message_id,
    };
    
    // In a real app, this would send the message to Facebook
    
    res.status(201).json({ message: transformedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}