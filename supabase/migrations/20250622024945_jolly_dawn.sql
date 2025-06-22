/*
  # Initial Schema for Facebook Helpdesk

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `password_hash` (text)
      - `created_at` (timestamp)
    - `facebook_pages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `facebook_page_id` (text, unique)
      - `access_token` (text)
      - `user_id` (uuid, foreign key)
      - `connected_at` (timestamp)
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `facebook_id` (text, unique)
      - `profile_picture` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `created_at` (timestamp)
    - `conversations`
      - `id` (uuid, primary key)
      - `page_id` (uuid, foreign key)
      - `customer_id` (uuid, foreign key)
      - `last_message_at` (timestamp)
      - `unread_count` (integer, default 0)
      - `status` (text, default 'open')
      - `created_at` (timestamp)
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `text` (text)
      - `sender_id` (text)
      - `sender_type` (text)
      - `facebook_message_id` (text)
      - `timestamp` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Facebook pages table
CREATE TABLE IF NOT EXISTS facebook_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  facebook_page_id text UNIQUE NOT NULL,
  access_token text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  connected_at timestamptz DEFAULT now()
);

ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pages"
  ON facebook_pages
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  facebook_id text UNIQUE NOT NULL,
  profile_picture text,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read customers through pages"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM facebook_pages fp
      WHERE fp.user_id = auth.uid()
    )
  );

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES facebook_pages(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  unread_count integer DEFAULT 0,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage conversations through pages"
  ON conversations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM facebook_pages fp
      WHERE fp.id = page_id AND fp.user_id = auth.uid()
    )
  );

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  text text NOT NULL,
  sender_id text NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('customer', 'agent')),
  facebook_message_id text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage messages through conversations"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      JOIN facebook_pages fp ON fp.id = c.page_id
      WHERE c.id = conversation_id AND fp.user_id = auth.uid()
    )
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_facebook_pages_user_id ON facebook_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_page_id ON conversations(page_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_customers_facebook_id ON customers(facebook_id);