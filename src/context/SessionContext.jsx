// SessionContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localstorage.js';

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(getFromLocalStorage("chatSessions") || []);
  const [currentSession, setCurrentSession] = useState("");

  const createSession = (sessionName) => {
    if (!sessions.includes(sessionName)) {
      const updatedSessions = [...sessions, sessionName];
      setSessions(updatedSessions);
      saveToLocalStorage("chatSessions", updatedSessions);
    }
  };

  const loadSession = (sessionName) => {
    setCurrentSession(sessionName);
  };

  const clearCurrentSession = () => {
    setCurrentSession("");
  };

  return (
    <SessionContext.Provider value={{ sessions, currentSession, createSession, loadSession, clearCurrentSession }}>
      {children}
    </SessionContext.Provider>
  );
};
