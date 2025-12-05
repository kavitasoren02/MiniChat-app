# Team Chat Application - Full-Stack Project

A professional real-time team chat application built with modern web technologies, inspired by Slack. This project demonstrates a complete full-stack implementation with user authentication, channels, real-time messaging, mobile-responsive UI, and advanced features like public/private channels.

## Overview

Team Chat is a collaborative communication tool that allows teams to communicate in real-time across multiple channels. The application features instant messaging, user authentication, channel management, online status indicators, and beautiful message bubbles with user avatars.

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server  
- **React Router DOM** - Client-side routing
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client for API requests
- **Tailwind CSS v4** - Utility-first CSS framework with full responsive design
- **JavaScript** - Programming language

### Backend
- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time WebSocket server
- **JWT** - JSON Web Token authentication
- **Cookies** - Session management
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **JavaScript** - Programming language

## Features

### Core Features
- **User Authentication**: Secure sign up and login with email/password
- **Real-time Messaging**: Instant message delivery using WebSockets
- **Channels**: Create, join, and leave channels with descriptions
- **Online Presence**: See which users are currently online with live indicators
- **Message History**: Paginated message loading (20 messages per page)
- **Reusable Components**: Modular React components for consistency

### Advanced Features  
- **Public/Private Channels**: Channel owners can toggle channel privacy
- **Beautiful Message Bubbles**: Messages display with user avatars, names, timestamps
- **Typing Indicators**: See when users are typing with animated dots
- **Responsive UI**: Fully mobile-responsive design that works on all devices
- **User Avatars**: Gradient-colored avatar circles with user initials
- **Online User List**: Track online users in real-time with visual indicators

## Mobile Responsiveness

The application is built with a mobile-first approach featuring:
- Fully responsive layout that adapts from mobile to desktop
- Touch-friendly buttons and inputs (minimum 44px height on mobile)
- Collapsible sidebar on mobile with drawer menu
- Adaptive font sizes for better readability
- Mobile-optimized spacing and padding
- Overlay modals for online users list on mobile
- Smooth transitions and animations

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx           # Reusable button with variants
│   │   │   ├── Input.jsx            # Accessible input component
│   │   │   ├── Card.jsx             # Card wrapper component
│   │   │   ├── ChannelList.jsx      # Channel sidebar with privacy toggle
│   │   │   ├── ChatArea.jsx         # Main chat interface
│   │   │   ├── MessageList.jsx      # Messages container
│   │   │   ├── Message.jsx          # Enhanced message with avatar & timestamp
│   │   │   ├── MessageInput.jsx     # Message input form
│   │   │   ├── OnlineUsers.jsx      # Online users panel with avatars
│   │   │   └── ProtectedRoute.jsx   # Auth-protected routes
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Enhanced login page
│   │   │   ├── SignupPage.jsx       # Enhanced signup page
│   │   │   └── ChatPage.jsx         # Main chat page
│   │   ├── utils/
│   │   │   ├── api.js               # Axios with interceptors & env support
│   │   │   └── socket.js            # Socket.io client with reconnection
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles with animations
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Channel.js               # Channel schema with isPrivate field
│   │   └── Message.js               # Message schema
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   ├── channels.js              # Channel routes with privacy toggle
│   │   └── messages.js              # Message routes with pagination
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── index.js                     # Server entry point
│   ├── .env.example                 # Environment variables template
│   └── package.json
│
└── README.md                        # This file
```

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB
- npm

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/team-chat
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file (optional - uses defaults if not provided)**
   ```bash
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`

## Running the Application

1. **Start both servers** (in separate terminals)
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

2. **Open your browser**
   - Navigate to `http://localhost:5173`
   - On mobile: Use your device browser or mobile view in DevTools

3. **Create an account or login**
   - Sign up with a new account
   - Create or join channels
   - Invite others and start chatting in real-time

## API Documentation

### Authentication Routes (`/api/auth`)
- `POST /signup` - Create a new user account
- `POST /login` - Login with email and password
- `GET /me` - Get current user info (requires auth)

### Channel Routes (`/api/channels`)
- `GET /` - Get all channels (requires auth)
- `POST /` - Create a new channel with optional privacy setting (requires auth)
- `GET /:channelId` - Get channel details (requires auth)
- `POST /:channelId/join` - Join a channel (requires auth)
- `POST /:channelId/leave` - Leave a channel (requires auth)
- `PATCH /:channelId/privacy` - Toggle channel privacy (owner only, requires auth)

### Message Routes (`/api/messages`)
- `GET /:channelId` - Get paginated messages (requires auth)
  - Query params: `page` (default: 1), `limit` (default: 20)
- `POST /` - Send a new message (requires auth)

## Socket.io Events

### Client → Server
- `joinChannel` - Join a channel room
- `leaveChannel` - Leave a channel room
- `sendMessage` - Send a message to channel
- `typing` - Indicate typing status

### Server → Client
- `onlineUsers` - List of online users
- `newMessage` - New message received
- `userJoined` - User joined channel
- `userLeft` - User left channel
- `userTyping` - User typing indicator

## Key Features Explained

### Message Bubbles
Messages display in beautiful bubbles with:
- **User Avatar**: Colored circle with user's first initial
- **Username**: Displayed above message on received messages
- **Message Content**: Clean text presentation
- **Timestamp**: Shows exact time message was sent
- **Distinction**: Different colors for sent vs. received messages

### Channel Privacy
- **Channel Owners** can toggle between public (🔓) and private (🔒) channels
- Settings accessible via gear icon next to channel name
- Public channels: Anyone can join
- Private channels: Members only

### Responsive Design Breakpoints
- **Mobile (< 640px)**: Full-width layout, collapsible sidebar
- **Tablet (640px - 1024px)**: Optimized spacing and sizing
- **Desktop (> 1024px)**: Full sidebar with online users panel

## Performance Optimizations

- **Pagination**: Messages loaded in batches to reduce memory usage
- **Socket.io Rooms**: Channels use separate rooms for efficient broadcasting
- **Lazy Loading**: Components only load what's needed
- **Debouncing**: Typing indicators are debounced to reduce server load
- **Image Optimization**: Avatars use lightweight SVG-like gradients

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs for secure password storage
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Input Validation**: All inputs validated on client and server
- **Protected Routes**: Authentication middleware on all sensitive routes
- **Secure Cookies**: Cookie-based session management options