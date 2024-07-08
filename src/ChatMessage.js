import React, { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Avatar from './Avatar';

const ChatMessage = ({ username, onLogout, socket, hasExited }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!hasExited) {
      socket.emit('join', username);

      socket.on("welcome", (data) => { 
        console.log("Welcome message from server:", data);
      });

      socket.on('msg', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('notification', (notification) => {
        setNotifications((prevNotifications) => {
          if (!prevNotifications.includes(notification)) {
            return [...prevNotifications, notification];
          }
          return prevNotifications;
        });
      });
    }

    return () => {
      if (!hasExited) {
        socket.emit('logout', username);
        socket.off("welcome");
        socket.off("msg");
        socket.off("notification");
      }
    };
  }, [username, socket, hasExited]);

  const sendMsg = () => {
    if (input.trim()) {
      socket.emit('msg', { user: username, text: input });
      setInput('');
    }
  };

  const handleExit = () => {
    socket.emit('logout', username);
    onLogout();
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) {
      return '';
    }
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diff = now - messageDate;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return 'now';
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} min ago`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)} h ago`;
    } else {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return messageDate.toLocaleDateString(undefined, options);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <FaPaperPlane className="text-3xl" />
          <h1 className="text-lg font-semibold">Chatup</h1>
        </div>
        <button
          className="text-white p-2 rounded-lg bg-gray-700 hover:bg-gray-600 focus:outline-none"
          onClick={handleExit}
        >
          Exit
        </button>
      </header>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {notifications.map((notification, index) => (
            <div className="text-center text-yellow-500" key={index}>
              {notification}
            </div>
          ))}
          {messages.map((msg, index) => (
            <div className={`flex ${msg.user === username ? 'justify-end' : 'justify-start'}`} key={index}>
              <div className={`max-w-96 flex flex-col overflow-hidden ${msg.user === username ? 'flex-row-reverse' : ''}`}>
                <div className={`py-2 px-4 ${msg.user === username ?  'rounded-l-lg rounded-t-lg bg-white text-slate-800' : 'bg-slate-500 text-white rounded-r-lg rounded-t-lg '}`}>
                  <pre className="text-sm my-1 py-1"> {msg.text}</pre>
                  <hr />
                  <small className="msg-footer text-black">
                    {formatTimeAgo(msg.timestamp)}
                  </small>
                </div>
                <div className={` m-1 flex w-ful ${msg.user === username ? 'justify-end' : 'justify-start'}`}>

                <Avatar
  username={msg.user}
  styleClass={"w-10 h-10"}
/>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send Message Input */}
      <footer className="bg-gray-800 p-4 shadow-md">
        <div className="flex items-center h-16">
          <textarea
            placeholder="Type your message..."
            className="flex-1 py-2 px-4 border border-gray-600 rounded-md text-gray-200 bg-gray-700 focus:outline-none resize-none"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="h-full ml-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none" onClick={sendMsg}>
            <FaPaperPlane />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatMessage;
