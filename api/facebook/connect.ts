import { supabase } from '../../src/lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
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

    // In a real app, this would handle Facebook OAuth flow
    // For demo purposes, we'll create a mock page connection
    const { data: page, error } = await supabase
      .from('facebook_pages')
      .insert({
        name: 'Demo Business Page',
        facebook_page_id: `fb_page_${Date.now()}`,
        access_token: `mock_access_token_${Date.now()}`,
        user_id: userId,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Failed to connect page' });
    }
    
    res.status(200).json({ 
      page: {
        id: page.id,
        name: page.name,
        accessToken: page.access_token,
        userId: page.user_id,
        connectedAt: page.connected_at,
      }
    });
  } catch (error) {
    console.error('Connect page error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}