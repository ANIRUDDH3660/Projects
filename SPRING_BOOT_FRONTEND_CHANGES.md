# Spring Boot Frontend Integration Changes

This document outlines the changes made to the frontend to integrate with a Spring Boot backend instead of the original Node.js/Express server.

## Changes Made

### 1. Package.json Updates
- **Removed**: Express, Socket.IO dependencies
- **Added**: 
  - `@stomp/stompjs` - STOMP protocol client for WebSocket communication
  - `sockjs-client` - SockJS client for WebSocket fallback
  - `axios` - HTTP client for REST API calls
- **Updated scripts**: Removed Node.js server-related scripts

### 2. New Service Files

#### WebSocket Service (`src/services/websocket.js`)
- Handles WebSocket connections using STOMP over SockJS
- Connects to Spring Boot WebSocket endpoint at `ws://localhost:8080/ws`
- Subscribes to room-specific topics:
  - `/topic/room/{roomId}/state` - Room state updates
  - `/topic/room/{roomId}/code-change` - Code changes
  - `/topic/room/{roomId}/cursor-change` - Cursor position changes
  - `/topic/room/{roomId}/language-change` - Language changes
  - `/topic/room/{roomId}/filename-change` - Filename changes
  - `/topic/room/{roomId}/user-joined` - User join events
  - `/topic/room/{roomId}/user-left` - User leave events

#### API Service (`src/services/api.js`)
- Handles REST API calls to Spring Boot backend at `http://localhost:8080/api`
- Endpoints for:
  - Room management (create, get, update, delete)
  - Code management (save, get history)
  - File management (upload, list, delete)
  - Code execution
  - Health checks

### 3. App.js Updates
- **WebSocket Integration**: 
  - Connects to Spring Boot WebSocket on component mount
  - Sets up message handlers for real-time collaboration
  - Debounced code change broadcasting (300ms delay)
  
- **State Management**:
  - Room ID from URL parameters or auto-generated
  - User management with random colors and names
  - Connection status tracking
  - File management state

- **Event Handlers**:
  - Real-time code synchronization
  - Language and filename changes broadcast
  - Save functionality using REST API
  - Code execution via REST API
  - Share functionality with room URLs

### 4. Real-time Features
- **Code Collaboration**: Real-time code editing with conflict resolution
- **User Presence**: Shows active users in the room
- **Cursor Tracking**: Visual indicators of other users' cursor positions
- **Language Sync**: Language changes are synchronized across users
- **Filename Sync**: Filename changes are broadcast to all users

## Backend Requirements

The frontend expects a Spring Boot backend with:

### WebSocket Configuration
- WebSocket endpoint at `/ws`
- STOMP messaging support
- SockJS fallback support
- Room-based topic subscriptions

### REST API Endpoints
```
GET    /api/health
GET    /api/rooms/{roomId}
POST   /api/rooms
PUT    /api/rooms/{roomId}
DELETE /api/rooms/{roomId}
GET    /api/rooms/{roomId}/users
POST   /api/rooms/{roomId}/code
GET    /api/rooms/{roomId}/code/history
GET    /api/rooms/{roomId}/files
POST   /api/rooms/{roomId}/files
DELETE /api/rooms/{roomId}/files/{fileId}
POST   /api/rooms/{roomId}/execute
```

### WebSocket Message Handlers
```
/app/join-room
/app/code-change
/app/cursor-change
/app/language-change
/app/filename-change
```

## Running the Application

### Prerequisites
1. Spring Boot backend running on `http://localhost:8080`
2. MongoDB instance for data persistence
3. Node.js and npm installed

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

## Environment Configuration

The frontend is configured to connect to:
- **WebSocket**: `ws://localhost:8080/ws`
- **REST API**: `http://localhost:8080/api`

For production deployment, update these URLs in:
- `src/services/websocket.js` (line 16)
- `src/services/api.js` (line 3)

## Key Features

1. **Real-time Collaboration**: Multiple users can edit code simultaneously
2. **Language Support**: JavaScript, TypeScript, Python, Java, C++, HTML, CSS, JSON
3. **File Management**: Upload, save, and manage files within rooms
4. **Code Execution**: Run code on the backend and display results
5. **Room Sharing**: Share room URLs for collaboration
6. **Connection Status**: Visual indicator of WebSocket connection status
7. **User Management**: See active users with colored cursors
8. **Persistence**: Code and room state saved to MongoDB via Spring Boot

## Browser Compatibility

The application uses modern JavaScript features and requires:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
