import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";


const Auth = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(username, password);
    } else {
      onRegister(username, email, password);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 mt-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-3xl font-extrabold text-center mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          Welcome to Quick Chat
        </h1>
        <p className={`text-center mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Connect and communicate seamlessly with others in real-time.
        </p>
        <h3 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {isLogin ? "Login" : "Sign Up"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} htmlFor="username">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'border-gray-300'}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="mt-4">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email ID"
                  className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'border-gray-300'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mt-4">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Password</label>
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'border-gray-300'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between mt-6">
              <button className={`w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </div>
          </div>
        </form>
        <p className={`mt-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <a
            href="#"
            className="text-blue-600 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Sign Up" : " Login"}
          </a>
        </p>
        <div className="mt-4 text-center">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
