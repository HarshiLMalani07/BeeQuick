import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  locationId: string | null;
  setLocationId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ userId, setUserId, locationId, setLocationId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface AuthContextProps {
//   userId: string | null;
//   setUserId: React.Dispatch<React.SetStateAction<string | null>>;
//   locationId: string | null;
//   setLocationId: React.Dispatch<React.SetStateAction<string | null>>;
//   token: string | null;
//   setToken: React.Dispatch<React.SetStateAction<string | null>>;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [userId, setUserId] = useState<string | null>(null);
//   const [locationId, setLocationId] = useState<string | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   return (
//     <AuthContext.Provider value={{ userId, setUserId, locationId, setLocationId, token, setToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
