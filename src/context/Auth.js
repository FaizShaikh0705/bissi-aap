import React, { useEffect, useState } from 'react';
import fire from '../config/Fire';
import Loader from '../common/Loader/Loader';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fire.auth().onAuthStateChanged(user => {
      if (user) {
        const userEmail = user.email;
        if (userEmail) {
          if (userEmail === 'faizshaikh0705@gmail.com') {
            setUserRole('admin');
          } else {
            setUserRole('user');
          }
        } else {
          console.error("User email is undefined");
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loader />
  }


  return (
    <AuthContext.Provider
      value={{
        currentUser, userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
