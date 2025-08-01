import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  Search,
  MoreHorizontal 
} from 'lucide-react';

const FileExplorer = ({ onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root', 'src']));
  const [selectedFile, setSelectedFile] = useState('main.js');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock file structure
  const fileStructure = {
    name: 'project-root',
    type: 'folder',
    id: 'root',
    children: [
      {
        name: 'src',
        type: 'folder',
        id: 'src',
        children: [
          { name: 'main.js', type: 'file', id: 'main.js', language: 'javascript' },
          { name: 'utils.js', type: 'file', id: 'utils.js', language: 'javascript' },
          { name: 'styles.css', type: 'file', id: 'styles.css', language: 'css' },
          { name: 'index.html', type: 'file', id: 'index.html', language: 'html' },
          {
            name: 'components',
            type: 'folder',
            id: 'components',
            children: [
              { name: 'Header.js', type: 'file', id: 'Header.js', language: 'javascript' },
              { name: 'Footer.js', type: 'file', id: 'Footer.js', language: 'javascript' },
              { name: 'Button.js', type: 'file', id: 'Button.js', language: 'javascript' }
            ]
          }
        ]
      },
      {
        name: 'public',
        type: 'folder',
        id: 'public',
        children: [
          { name: 'favicon.ico', type: 'file', id: 'favicon.ico', language: 'binary' },
          { name: 'robots.txt', type: 'file', id: 'robots.txt', language: 'text' }
        ]
      },
      { name: 'package.json', type: 'file', id: 'package.json', language: 'json' },
      { name: 'README.md', type: 'file', id: 'README.md', language: 'markdown' },
      { name: '.gitignore', type: 'file', id: '.gitignore', language: 'text' }
    ]
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file.id);
    onFileSelect(file.name);
  };

  const getFileIcon = (file) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? 
        <FolderOpen size={16} color="#fbbf24" /> : 
        <Folder size={16} color="#fbbf24" />;
    }
    return <FileText size={16} color="#8b9dc3" />;
  };

  const renderFileTree = (node, depth = 0) => {
    if (searchTerm && node.type === 'file' && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }

    return (
      <div key={node.id}>
        <div 
          className={`file-item ${node.type} ${selectedFile === node.id ? 'selected' : ''}`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              handleFileSelect(node);
            }
          }}
        >
          <div className="file-item-content">
            {node.type === 'folder' && (
              <span className="folder-arrow">
                {expandedFolders.has(node.id) ? 
                  <ChevronDown size={14} /> : 
                  <ChevronRight size={14} />
                }
              </span>
            )}
            {getFileIcon(node)}
            <span className="file-name">{node.name}</span>
          </div>
          <div className="file-actions">
            <MoreHorizontal size={14} className="more-actions" />
          </div>
        </div>
        
        {node.children && expandedFolders.has(node.id) && (
          <div className="folder-children">
            {node.children.map(child => renderFileTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h3>Explorer</h3>
        <div className="header-actions">
          <Plus size={16} className="action-btn" title="New File" />
        </div>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="file-tree">
        {renderFileTree(fileStructure)}
      </div>

      <style jsx>{`
        .file-explorer {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #1e1e1e;
          border-right: 1px solid #3e3e3e;
          min-width: 250px;
        }

        .explorer-header {
          padding: 16px;
          border-bottom: 1px solid #3e3e3e;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .explorer-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          cursor: pointer;
          color: #a0a0a0;
          transition: color 0.2s ease;
        }

        .action-btn:hover {
          color: #ffffff;
        }

        .search-container {
          padding: 12px 16px;
          border-bottom: 1px solid #3e3e3e;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 8px;
          color: #a0a0a0;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 6px 8px 6px 28px;
          background: #2d2d2d;
          border: 1px solid #3e3e3e;
          border-radius: 4px;
          color: #ffffff;
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: #4F46E5;
        }

        .search-input::placeholder {
          color: #a0a0a0;
        }

        .file-tree {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          user-select: none;
          font-size: 13px;
        }

        .file-item:hover {
          background: #2d2d2d;
        }

        .file-item.selected {
          background: #4F46E5;
          color: white;
        }

        .file-item-content {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }

        .folder-arrow {
          display: flex;
          align-items: center;
          color: #a0a0a0;
          width: 14px;
          justify-content: center;
        }

        .file-name {
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-item.selected .file-name {
          color: white;
        }

        .file-actions {
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .file-item:hover .file-actions {
          opacity: 1;
        }

        .more-actions {
          cursor: pointer;
          color: #a0a0a0;
          padding: 2px;
          border-radius: 2px;
        }

        .more-actions:hover {
          background: #3e3e3e;
          color: #ffffff;
        }

        .folder-children {
          border-left: 1px solid #3e3e3e;
          margin-left: 20px;
        }

        /* Scrollbar styling */
        .file-tree::-webkit-scrollbar {
          width: 6px;
        }

        .file-tree::-webkit-scrollbar-track {
          background: #1e1e1e;
        }

        .file-tree::-webkit-scrollbar-thumb {
          background: #3e3e3e;
          border-radius: 3px;
        }

        .file-tree::-webkit-scrollbar-thumb:hover {
          background: #4e4e4e;
        }
      `}</style>
    </div>
  );
};

export default FileExplorer;
