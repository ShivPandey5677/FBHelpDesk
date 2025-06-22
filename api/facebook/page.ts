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

    // Get user's Facebook page
    const { data: page, error } = await supabase
      .from('facebook_pages')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json({ 
      page: page ? {
        id: page.id,
        name: page.name,
        accessToken: page.access_token,
        userId: page.user_id,
        connectedAt: page.connected_at,
      } : null 
    });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}