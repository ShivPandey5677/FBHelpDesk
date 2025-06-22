import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
      facebook_pages: {
        Row: {
          id: string;
          name: string;
          facebook_page_id: string;
          access_token: string;
          user_id: string;
          connected_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          facebook_page_id: string;
          access_token: string;
          user_id: string;
          connected_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          facebook_page_id?: string;
          access_token?: string;
          user_id?: string;
          connected_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          facebook_id: string;
          profile_picture: string | null;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          facebook_id: string;
          profile_picture?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          facebook_id?: string;
          profile_picture?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          page_id: string;
          customer_id: string;
          last_message_at: string;
          unread_count: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          customer_id: string;
          last_message_at?: string;
          unread_count?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          page_id?: string;
          customer_id?: string;
          last_message_at?: string;
          unread_count?: number;
          status?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          text: string;
          sender_id: string;
          sender_type: 'customer' | 'agent';
          facebook_message_id: string | null;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          text: string;
          sender_id: string;
          sender_type: 'customer' | 'agent';
          facebook_message_id?: string | null;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          text?: string;
          sender_id?: string;
          sender_type?: 'customer' | 'agent';
          facebook_message_id?: string | null;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
}