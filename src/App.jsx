import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import ChatInterface from './components/ChatInterface';
import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from './services/localstorage.js';

const API_URL = 'https://quick-chat-backend-i1ya.onrender.com';

const App = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const savedUser = getFromLocalStorage('user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleRegister = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/local/register`, {
        username,
        email,
        password,
      });
      const { jwt, user } = response.data;
      setUser(user);
      saveToLocalStorage('user', user);
      saveToLocalStorage('token', jwt);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/local`, {
        identifier: username,
        password,
      });
      const { jwt, user } = response.data;
      setUser(user);
      saveToLocalStorage('user', user);
      saveToLocalStorage('token', jwt);
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please check your credentials.'); // Set error message for user feedback
    }
  };

  const handleLogout = () => {
    setUser(null);
    removeFromLocalStorage('user');
    removeFromLocalStorage('token');
    closeWebSocket();
  };

  return (
    <div className="App">
      {errorMessage && <div className="text-red-600">{errorMessage}</div>} {/* Display error messages */}
      {user ? (
        <ChatInterface
          username={user.username}
          onLogout={handleLogout}
          sendMessage={(message) => sendMessage({ text: message, sender: user.username })}
        />
      ) : (
        <Auth onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
};

export default App;
