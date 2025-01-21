import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../services/localstorage.js";
import { useSession } from "../context/SessionContext.jsx";

const SOCKET_URL = "http://localhost:1337";

const ChatInterface = ({ username, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessions, setSessions] = useState([]);
  const [sessionName, setSessionName] = useState("default");
  const [isQuickChatVisible, setIsQuickChatVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { createSession } = useSession();

  useEffect(() => {
    const storedSessions = getFromLocalStorage("chatSessions") || [];
    setSessions(storedSessions);

    const lastAccessedSession = getFromLocalStorage("lastAccessedSession");
    const initialSession =
      lastAccessedSession ||
      (storedSessions.length > 0
        ? storedSessions[storedSessions.length - 1]
        : "default");
    setSessionName(initialSession);

    const storedMessages =
      getFromLocalStorage(`chatMessages_${sessionName}`) || [];
    setMessages(storedMessages);

    socketRef.current = io(SOCKET_URL);
    socketRef.current.on("message", (msg) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { ...msg, sender: "Server" }];
        saveToLocalStorage(`chatMessages_${sessionName}`, updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [sessionName]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") {
      alert("Message cannot be empty!");
      return;
    }

    const newMessage = {
      text: inputMessage,
      sender: username,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      saveToLocalStorage(`chatMessages_${sessionName}`, updatedMessages);
      return updatedMessages;
    });

    socketRef.current.emit("user-msg", newMessage);
    setInputMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const startNewSession = () => {
    const newSession = prompt("Enter a new session name:");
    if (newSession) {
      createSession(newSession);
      setSessions((prevSessions) => {
        const updatedSessions = [...prevSessions, newSession];
        saveToLocalStorage("chatSessions", updatedSessions);
        return updatedSessions;
      });
      setSessionName(newSession);
      saveToLocalStorage("lastAccessedSession", newSession);
      setMessages([]);
      saveToLocalStorage(`chatMessages_${newSession}`, []);
    }
  };

  const loadSession = (session) => {
    setSessionName(session);
    saveToLocalStorage("lastAccessedSession", session);
    const storedMessages = getFromLocalStorage(`chatMessages_${session}`) || [];
    setMessages(storedMessages);
  };

  const toggleQuickChat = () => {
    setIsQuickChatVisible((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`flex justify-between items-center p-4 shadow-lg ${
          isDarkMode ? "bg-blue-800" : "bg-blue-600"
        }`}
      >
        <button
          onClick={toggleQuickChat}
          className={`ml-4 p-3 bg-gradient-to-r ${
            isDarkMode
              ? "from-blue-700 to-blue-500"
              : "from-blue-400 to-blue-300"
          } text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg`}
        >
          Open Quick Chat
        </button>
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-800"
            } transition duration-200 hover:shadow-lg`}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={onLogout}
            className="ml-4 px-4 py-2 font-semibold text-sm bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Quick Chat */}
      {isQuickChatVisible && (
        <div
          className={`transition-transform duration-300 ease-in-out fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex flex-col p-4 overflow-auto`}
        >
          <h2 className="text-lg font-bold text-white">Chat Sessions</h2>
          <button
            onClick={startNewSession}
            className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            New Session
          </button>
          {sessions.map((session, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-300 rounded text-white"
              onClick={() => loadSession(session)}
            >
              {session}
            </div>
          ))}
          <button onClick={toggleQuickChat} className="mt-4 text-white">
            Close
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        className={`flex-grow overflow-auto p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start chatting!
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === username ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div className="max-w-sm">
              {message.sender !== username && message.sender !== "Server" && (
                <div className="text-sm font-bold text-gray-600 mb-1">
                  {message.sender}
                </div>
              )}
              <div
                className={`relative p-4 rounded-lg shadow-lg transition duration-200 ${
                  message.sender === username
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : `${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-900"
                      } rounded-tl-none`
                }`}
                style={{ width: "300px" }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    {message.sender === username ? "You" : message.sender}
                  </span>
                  <span className="text-xs text-gray-400">
                    {message.timestamp}
                  </span>
                </div>
                <div className="mt-1">{message.text}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className={`p-4 shadow-md border-t ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={`flex-grow mr-2 p-3 rounded-full border ${
              isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white"
            }`}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className={`px-4 py-2 font-semibold rounded-full ${
              inputMessage.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-800 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
