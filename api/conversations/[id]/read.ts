import { supabase } from '../../../src/lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { id: conversationId } = req.query;
    
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

    // Update conversation unread count
    const { error } = await supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId)
      .eq('facebook_pages.user_id', userId);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database error' });
    }
    
    res.status(200).json({ message: 'Conversation marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}