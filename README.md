# Facebook Helpdesk - Richpanel Assignment

A comprehensive Facebook Messenger helpdesk application built with React, TypeScript, Supabase, and Vercel API routes.

## Features

- 🔐 User authentication with secure password hashing
- 🗄️ Supabase database with real-time capabilities
- 🔗 Facebook Page integration management
- 💬 Real-time conversation management with 24-hour grouping
- 📱 Responsive design with mobile support
- 🎨 Modern UI with Tailwind CSS
- 🚀 Full-stack deployment ready for Vercel
- 🔒 Row Level Security (RLS) for data protection

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Vercel API Routes (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom with bcrypt password hashing
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase Account
- Facebook Developer Account
- Vercel Account (for deployment)

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the migration files in the `supabase/migrations` folder
   - Get your project URL and anon key

4. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

5. Update `.env.local` with your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   FB_APP_ID=your_facebook_app_id
   FB_APP_SECRET=your_facebook_app_secret
   FB_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application uses Supabase with the following schema:

- **users**: User accounts with secure password hashing
- **facebook_pages**: Connected Facebook pages
- **customers**: Facebook users who send messages
- **conversations**: Message threads with 24-hour grouping logic
- **messages**: Individual messages in conversations

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

### Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

The application is configured to work seamlessly with Vercel's serverless functions.

## Facebook App Setup

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add Messenger and Pages products
3. Set up webhook URL: `https://your-domain.vercel.app/api/webhook/facebook`
4. Configure webhook events: `messages`, `messaging_postbacks`
5. Get page access tokens for your pages

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── conversations/  # Chat and conversation components
│   │   ├── integration/    # Facebook integration
│   │   └── layout/         # Layout components
│   ├── context/            # React context providers
│   ├── lib/               # Database and utility libraries
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── api/                   # Vercel API routes
│   ├── auth/             # Authentication endpoints
│   ├── conversations/    # Conversation management
│   ├── facebook/         # Facebook integration
│   ├── messages/         # Message handling
│   └── webhook/          # Facebook webhook
├── supabase/             # Database migrations
└── public/               # Static assets
```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/facebook/page` - Get connected page
- `POST /api/facebook/connect` - Connect Facebook page
- `DELETE /api/facebook/disconnect` - Disconnect page
- `GET /api/conversations` - Get user conversations
- `POST /api/messages` - Send message
- `POST /api/webhook/facebook` - Facebook webhook handler

## Demo Credentials

For testing purposes, you can register a new account or use the sample data created by the migration.

## Features Implemented

- ✅ User registration and login with secure password hashing
- ✅ Supabase database integration with RLS
- ✅ Facebook page connection management
- ✅ Real-time conversation list with unread counts
- ✅ Chat interface with message history
- ✅ Customer profile display
- ✅ Message sending and receiving
- ✅ Responsive design
- ✅ Webhook setup for Facebook messages
- ✅ 24-hour conversation grouping logic
- ✅ Agent interface with three-column layout
- ✅ Database migrations and sample data

## Security Features

- Row Level Security (RLS) on all database tables
- Secure password hashing with bcrypt
- User authentication and authorization
- Protected API endpoints
- Environment variable configuration

## Production Considerations

This application is production-ready with:

- Real database with Supabase
- Secure authentication system
- Proper error handling and logging
- Responsive design
- Scalable architecture
- Environment-based configuration

For enhanced production use, consider:

- Real-time updates with Supabase subscriptions
- Message pagination for large conversations
- File/image message support
- User roles and permissions
- Advanced monitoring and analytics
- Rate limiting and abuse prevention

## License

This project is created as part of the Richpanel assignment.