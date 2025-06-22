import { supabase } from '../../src/lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'DELETE') {
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

    // Delete user's Facebook page (this will cascade delete conversations and messages)
    const { error } = await supabase
      .from('facebook_pages')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Failed to disconnect page' });
    }
    
    res.status(200).json({ message: 'Page disconnected successfully' });
  } catch (error) {
    console.error('Disconnect page error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}