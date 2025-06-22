import { supabase } from '../../src/lib/supabase';
import { hashPassword } from '../../src/lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
      })
      .select('id, email, name, created_at')
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Failed to create user' });
    }

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}