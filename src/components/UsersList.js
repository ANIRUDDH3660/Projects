import React from 'react';
import { User, Circle } from 'lucide-react';

const UsersList = ({ users }) => {
  return (
    <div className="users-list">
      <div className="users-header">
        <h3>Online Users</h3>
        <span className="users-count">{users.length}</span>
      </div>
      
      <div className="users-container">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <div className="user-avatar" style={{ backgroundColor: user.color }}>
              <User size={16} color="white" />
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-status">
                <Circle 
                  size={8} 
                  fill={user.color} 
                  color={user.color} 
                  className="status-indicator"
                />
                <span className="status-text">
                  Line {user.cursor.line}, Col {user.cursor.column}
                </span>
              </div>
            </div>
            {user.id === 1 && <span className="you-badge">You</span>}
          </div>
        ))}
      </div>

      <div className="users-actions">
        <button className="invite-btn">
          <span>Invite Others</span>
        </button>
      </div>

      <style jsx>{`
        .users-list {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #1e1e1e;
          border-left: 1px solid #3e3e3e;
        }

        .users-header {
          padding: 16px;
          border-bottom: 1px solid #3e3e3e;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .users-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .users-count {
          background: #4F46E5;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
        }

        .users-container {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          position: relative;
          transition: background-color 0.2s ease;
        }

        .user-item:hover {
          background: #2d2d2d;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #a0a0a0;
        }

        .status-indicator {
          flex-shrink: 0;
        }

        .status-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .you-badge {
          background: #10B981;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .users-actions {
          padding: 16px;
          border-top: 1px solid #3e3e3e;
        }

        .invite-btn {
          width: 100%;
          padding: 10px 16px;
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .invite-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .invite-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default UsersList;
