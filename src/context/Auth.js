import React, { useEffect, useState } from 'react';
import fire from '../config/Fire';
import Loader from '../common/Loader/Loader';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fire.auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        const userEmail = user.email;
        if (userEmail === 'faizshaikh0705@gmail.com') {
          setUserRole('admin');
          console.log("admin is online", user)
        } else {
          setUserRole('user');
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });
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
