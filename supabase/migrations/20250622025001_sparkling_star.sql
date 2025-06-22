/*
  # Add Sample Data for Development

  1. Sample Data
    - Demo user account
    - Sample Facebook page
    - Sample customers
    - Sample conversations and messages

  Note: This is for development/demo purposes only
*/

-- Insert demo user (password: 'demo123')
INSERT INTO users (id, email, name, password_hash) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@richpanel.com', 'Demo User', '$2b$10$rOvHPxfzAcct/zwNBpjOXuRuAzDWEaOcYMp6oXEG.nUwfGG4f5jAa')
ON CONFLICT (email) DO NOTHING;

-- Insert sample Facebook page
INSERT INTO facebook_pages (id, name, facebook_page_id, access_token, user_id) VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'Amazon Business', 'fb_page_123', 'mock_access_token', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (facebook_page_id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, name, email, facebook_id, profile_picture, first_name, last_name) VALUES 
('770e8400-e29b-41d4-a716-446655440000', 'Amit RG', 'amit@richpanel.com', 'fb_user_1', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face', 'Amit', 'RG'),
('880e8400-e29b-41d4-a716-446655440000', 'Hiten Saxena', 'hiten@richpanel.com', 'fb_user_2', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face', 'Hiten', 'Saxena')
ON CONFLICT (facebook_id) DO NOTHING;

-- Insert sample conversations
INSERT INTO conversations (id, page_id, customer_id, last_message_at, unread_count, status) VALUES 
('990e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', now() - interval '7 minutes', 0, 'open'),
('aa0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', now() - interval '30 minutes', 1, 'open')
ON CONFLICT (id) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (conversation_id, text, sender_id, sender_type, facebook_message_id, timestamp) VALUES 
('990e8400-e29b-41d4-a716-446655440000', 'Is it in stock right now?', 'fb_user_1', 'customer', 'fb_msg_1', now() - interval '10 minutes'),
('990e8400-e29b-41d4-a716-446655440000', 'We''ve 3 left in stock!', '550e8400-e29b-41d4-a716-446655440000', 'agent', null, now() - interval '8 minutes'),
('990e8400-e29b-41d4-a716-446655440000', 'If you order before 8PM we can ship it today.', '550e8400-e29b-41d4-a716-446655440000', 'agent', null, now() - interval '7 minutes'),
('aa0e8400-e29b-41d4-a716-446655440000', 'Hi do you have any T-Shirt available in store?', 'fb_user_2', 'customer', 'fb_msg_2', now() - interval '30 minutes')
ON CONFLICT DO NOTHING;