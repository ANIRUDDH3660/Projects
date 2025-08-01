import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
  }

  connect(roomId, userInfo) {
    return new Promise((resolve, reject) => {
      try {
        // Configure STOMP client with SockJS
        this.client = new Client({
          webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
          connectHeaders: {
            roomId: roomId,
            userId: userInfo.id || Math.random().toString(36).substr(2, 9),
            userName: userInfo.name || 'Anonymous'
          },
          debug: (str) => {
            console.log('STOMP: ' + str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        // Set up connection callbacks
        this.client.onConnect = (frame) => {
          console.log('Connected to WebSocket server:', frame);
          this.connected = true;
          
          // Subscribe to room-specific topics
          this.subscribeToRoom(roomId);
          
          // Send join room message
          this.sendMessage('/app/join-room', {
            roomId: roomId,
            userInfo: userInfo
          });
          
          resolve(frame);
        };

        this.client.onStompError = (frame) => {
          console.error('STOMP error:', frame.headers['message'], frame.body);
          this.connected = false;
          reject(new Error(frame.headers['message']));
        };

        this.client.onWebSocketError = (event) => {
          console.error('WebSocket error:', event);
          this.connected = false;
          reject(event);
        };

        this.client.onDisconnect = () => {
          console.log('Disconnected from WebSocket server');
          this.connected = false;
        };

        // Activate the client
        this.client.activate();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        reject(error);
      }
    });
  }

  subscribeToRoom(roomId) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    // Subscribe to room state updates
    const roomStateSubscription = this.client.subscribe(`/topic/room/${roomId}/state`, (message) => {
      const data = JSON.parse(message.body);
      this.handleMessage('room-state', data);
    });
    this.subscriptions.set('room-state', roomStateSubscription);

    // Subscribe to code changes
    const codeChangeSubscription = this.client.subscribe(`/topic/room/${roomId}/code-change`, (message) => {
      const data = JSON.parse(message.body);
      this.handleMessage('code-change', data);
    });
    this.subscriptions.set('code-change', codeChangeSubscription);

    // Subscribe to cursor changes
    const cursorChangeSubscription = this.client.subscribe(`/topic/room/${roomId}/cursor-change`, (message) => {
      const data = JSON.parse(message.body);
      this.handleMessage('cursor-change', data);
    });
    this.subscriptions.set('cursor-change', cursorChangeSubscription);

    // Subscribe to language changes
    const languageChangeSubscription = this.client.subscribe(`/topic/room/${roomId}/language-change`, (message) => {
      const data = JSON.parse(message.body);
      this.handleMessage('language-change', data);
    });
    this.subscriptions.set('language-change', languageChangeSubscription);

    // Subscribe to filename changes
    const filenameChangeSubscription = this.client.subscribe(`/topic/room/${roomId}/filename-change`, (message) => {
      const data = JSON.parse(message.body);
      this.handleMessage('filename-change', data);
    });
    this.subscriptions.set('filename-change', filenameChangeSubscription);

    // Subscribe to user events
    const userJoinedSubscription = this.client.subscribe(`/topic/room/${roomId}/user-joined`, (message) => {
      const data = JSON.parse(message.body);
      this.handleMessage('user-joined', data);
    });
    this.subscriptions.set('user-joined', userJoinedSubscription);

    const userLeftSubscription = this.client.subscribe(`/topic/room/${roomId}/user-left`, (message) => {
      const data = JSON.parse(message.body);
      this.handleMessage('user-left', data);
    });
    this.subscriptions.set('user-left', userLeftSubscription);
  }

  handleMessage(type, data) {
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(data);
    }
  }

  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  sendMessage(destination, message) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: destination,
      body: JSON.stringify(message)
    });
  }

  sendCodeChange(roomId, code) {
    this.sendMessage('/app/code-change', {
      roomId: roomId,
      code: code,
      timestamp: Date.now()
    });
  }

  sendCursorChange(roomId, cursor) {
    this.sendMessage('/app/cursor-change', {
      roomId: roomId,
      cursor: cursor
    });
  }

  sendLanguageChange(roomId, language) {
    this.sendMessage('/app/language-change', {
      roomId: roomId,
      language: language
    });
  }

  sendFilenameChange(roomId, filename) {
    this.sendMessage('/app/filename-change', {
      roomId: roomId,
      filename: filename
    });
  }

  disconnect() {
    if (this.client) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.messageHandlers.clear();

      // Deactivate the client
      this.client.deactivate();
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
