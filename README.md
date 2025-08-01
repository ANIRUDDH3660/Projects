# 🚀 Collaborative Code Editor

A modern, real-time collaborative code editor built with React.js and Socket.IO. Features a sleek VS Code-inspired interface with multi-user editing capabilities.

## ✨ Features

- 🎨 **Modern Interface**: Clean, professional design inspired by VS Code
- 👥 **Real-time Collaboration**: Multiple users can edit code simultaneously
- 🎯 **Live Cursors**: See where other users are typing in real-time
- 📁 **File Explorer**: Navigate through project files with ease
- 🌈 **Syntax Highlighting**: Support for multiple programming languages
- 💾 **Auto-sync**: Changes are automatically synchronized across all users
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 🔧 **Multiple Languages**: JavaScript, TypeScript, Python, Java, C++, HTML, CSS, JSON

## 🛠️ Technologies Used

- **Frontend**: React.js, Monaco Editor
- **Backend**: Node.js, Express, Socket.IO
- **Styling**: CSS3 with modern design principles
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development environment**
   ```bash
   npm run dev
   ```
   This will start both the React development server (port 3000) and the Socket.IO server (port 5000).

3. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Open multiple tabs to see real-time collaboration in action!

### Alternative: Run Separately

If you prefer to run the client and server separately:

```bash
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the React app
npm start
```

## 📖 Usage

### Basic Usage

1. **Open the editor** in your browser
2. **Start coding** - begin typing in the Monaco editor
3. **Share the link** - copy the URL and share it with collaborators
4. **Collaborate** - watch as multiple users edit code in real-time

### Features Walkthrough

- **File Management**: Use the file explorer on the left to navigate files
- **Language Selection**: Choose your programming language from the dropdown
- **User Awareness**: See active users in the right panel
- **Save & Run**: Use the toolbar buttons to save or run your code
- **Real-time Sync**: All changes are automatically synchronized

### Keyboard Shortcuts

- `Ctrl+S` - Save file
- `F5` - Run code
- `Ctrl+/` - Toggle comment
- `Ctrl+D` - Select next occurrence
- `Alt+Up/Down` - Move line up/down

## 🏗️ Project Structure

```
collaborative-code-editor/
├── src/
│   ├── components/
│   │   ├── CodeEditor.js      # Monaco editor wrapper
│   │   ├── UsersList.js       # Active users panel
│   │   └── FileExplorer.js    # File navigation
│   ├── App.js                 # Main application component
│   ├── App.css                # Styling
│   └── index.js               # React entry point
├── server.js                  # Socket.IO server
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🎨 Customization

### Themes
The editor uses VS Code's dark theme by default. You can customize colors in `src/App.css`:

```css
:root {
  --primary-color: #4F46E5;    /* Primary purple */
  --success-color: #10B981;    /* Success green */
  --warning-color: #F59E0B;    /* Warning orange */
  --background: #1e1e1e;       /* Main background */
}
```

### Adding Languages
To add support for new programming languages, update the language options in `src/App.js`:

```javascript
<option value="rust">Rust</option>
<option value="go">Go</option>
<option value="php">PHP</option>
```

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Production

```bash
npm run build:deploy
```

This builds the React app and starts the production server.

## 📝 Development

### Available Scripts

- `npm start` - Runs React development server
- `npm run server` - Starts Socket.IO server only
- `npm run dev` - Runs both client and server concurrently
- `npm run build` - Builds for production
- `npm test` - Runs tests

## 🚀 Performance Optimizations

- **Debounced Updates**: Code changes are debounced to reduce server load
- **Efficient Rendering**: React optimizations prevent unnecessary re-renders
- **Memory Management**: Automatic cleanup of disconnected users
- **Responsive Design**: Mobile-optimized interface

## 🤝 Support

If you encounter any issues:
1. Check the browser console for errors
2. Ensure both client and server are running
3. Verify Socket.IO connection in Network tab
4. Try refreshing the page

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Coding! 🎯**
