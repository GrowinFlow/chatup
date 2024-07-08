import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ChatMessage from './ChatMessage'; // Assuming this component handles the chat interface

const socket = io("https://chatup-socket.vercel.app");

const App = () => {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [inputUsername, setInputUsername] = useState('');

  useEffect(() => {
    // Event listener for rejoin
    socket.on('rejoin', (username) => {
      console.log(`Rejoining as ${username}`);
      setUsername(username);
      setIsUsernameSet(true);
    });

    // Clean up on unmount or disconnect
    return () => {
      socket.off('rejoin');
    };
  }, []);

  const handleUsernameSubmit = () => {
    if (inputUsername.trim()) {
      setUsername(inputUsername);
      setIsUsernameSet(true);
      socket.emit('join', inputUsername); // Emit 'join' event when setting username
    }
  };

  const handleLogout = () => {
    socket.emit('logout', username);  // Notify server of logout
    setUsername('');
    setIsUsernameSet(false);
  };

  return (
    <div className="App w-full bg-gray-900 min-h-screen flex items-center justify-center">
      {!isUsernameSet && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-xl mb-4">Enter Your Username</h2>
            <input
              type="text"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
              placeholder="Username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
            />
            <button
              className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600"
              onClick={handleUsernameSubmit}
            >
              Enter Chat
            </button>
          </div>
        </div>
      )}

      {isUsernameSet && (
        <div className="container mx-auto">
          <ChatMessage username={username} onLogout={handleLogout} socket={socket} />
        </div>
      )}
    </div>
  );
};

export default App;
