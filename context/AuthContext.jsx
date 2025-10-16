import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ userId, setUserId, locationId, setLocationId, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
