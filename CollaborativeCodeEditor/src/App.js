import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import UsersList from './components/UsersList';
import FileExplorer from './components/FileExplorer';
import { Users, FileText, Play, Save, Share2 } from 'lucide-react';
import websocketService from './services/websocket';
import apiService from './services/api';
import './App.css';

function App() {
  const [code, setCode] = useState('// Welcome to Collaborative Code Editor\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('main.js');
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [executionResult, setExecutionResult] = useState(null);
  const debounceTimer = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get room ID from URL or generate a new one
        const urlParams = new URLSearchParams(window.location.search);
        const urlRoomId = urlParams.get('room') || Math.random().toString(36).substr(2, 9);
        setRoomId(urlRoomId);

        // Set current user
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          name: localStorage.getItem('username') || 'Anonymous',
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        };
        setCurrentUser(user);

        // Connect to WebSocket
        await websocketService.connect(urlRoomId, user);
        setConnected(true);

        // Load room data
        try {
          const roomData = await apiService.getRoom(urlRoomId);
          setCode(roomData.code || code);
          setLanguage(roomData.language || language);
          setFileName(roomData.fileName || fileName);
        } catch (error) {
          console.log('Room not found, creating new room');
        }

        // Load files
        try {
          const roomFiles = await apiService.getRoomFiles(urlRoomId);
          setFiles(roomFiles);
        } catch (error) {
          console.log('No files found for room');
        }

      } catch (error) {
        console.error('Failed to initialize app:', error);
        setConnected(false);
      }
    };

    initializeApp();

    // Cleanup on component unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  // Set up WebSocket message handlers
  useEffect(() => {
    websocketService.onMessage('room-state', (data) => {
      setCode(data.code);
      setLanguage(data.language);
      setFileName(data.fileName);
      setUsers(data.users || []);
    });

    websocketService.onMessage('code-change', (data) => {
      if (data.userId !== currentUser?.id) {
        setCode(data.code);
      }
    });

    websocketService.onMessage('cursor-change', (data) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === data.userId
            ? { ...user, cursor: data.cursor }
            : user
        )
      );
    });

    websocketService.onMessage('language-change', (data) => {
      setLanguage(data);
    });

    websocketService.onMessage('filename-change', (data) => {
      setFileName(data);
    });

    websocketService.onMessage('user-joined', (data) => {
      setUsers(prevUsers => [...prevUsers, data]);
    });

    websocketService.onMessage('user-left', (data) => {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== data));
    });
  }, [currentUser]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    
    // Debounce WebSocket messages to avoid spam
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      if (connected && roomId) {
        websocketService.sendCodeChange(roomId, newCode);
      }
    }, 300);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (connected && roomId) {
      websocketService.sendLanguageChange(roomId, newLanguage);
    }
  };

  const handleFilenameChange = (newFilename) => {
    setFileName(newFilename);
    if (connected && roomId) {
      websocketService.sendFilenameChange(roomId, newFilename);
    }
  };

  const handleSave = async () => {
    try {
      if (roomId) {
        await apiService.saveCode(roomId, {
          code,
          language,
          fileName
        });
        alert('Code saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save code:', error);
      alert('Failed to save code. Please try again.');
    }
  };

  const handleRun = async () => {
    try {
      if (roomId) {
        const result = await apiService.runCode(roomId, {
          code,
          language,
          fileName
        });
        setExecutionResult(result);
        console.log('Execution result:', result);
      }
    } catch (error) {
      console.error('Failed to run code:', error);
      setExecutionResult({ error: 'Failed to execute code' });
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <FileText className="logo-icon" />
            <span className="logo-text">CodeCollab</span>
          </div>
          <div className="file-info">
            <input 
              type="text" 
              value={fileName} 
              onChange={(e) => handleFilenameChange(e.target.value)}
              className="file-name-input"
            />
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
        
        <div className="header-right">
          <button onClick={handleSave} className="toolbar-btn save-btn">
            <Save size={16} />
            Save
          </button>
          <button onClick={handleRun} className="toolbar-btn run-btn">
            <Play size={16} />
            Run
          </button>
          <button onClick={handleShare} className="toolbar-btn share-btn">
            <Share2 size={16} />
            Share
          </button>
          <button 
            onClick={() => setShowUsers(!showUsers)} 
            className={`toolbar-btn users-btn ${showUsers ? 'active' : ''}`}
          >
            <Users size={16} />
            Users ({users.length})
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* File Explorer */}
        {showFiles && (
          <div className="sidebar left-sidebar">
            <FileExplorer onFileSelect={(file) => setFileName(file)} />
          </div>
        )}

        {/* Code Editor */}
        <div className="editor-container">
          <CodeEditor
            code={code}
            language={language}
            onChange={handleCodeChange}
            users={users}
          />
        </div>

        {/* Users Panel */}
        {showUsers && (
          <div className="sidebar right-sidebar">
            <UsersList users={users} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-item">Ln 1, Col 1</span>
          <span className="status-item">{language}</span>
          <span className="status-item">UTF-8</span>
        </div>
        <div className="status-right">
          <div className={`connection-status ${connected ? 'online' : 'offline'}`}>
            <div className="status-dot"></div>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
