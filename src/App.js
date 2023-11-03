import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import PrivateRoute from './common/guards/PrivateRoute';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from './pages/SignUp/SignUp';
import Deposits from './pages/Deposits/Deposits';
import fire from './config/Fire';
import Loader from './common/Loader/Loader';
import './App.css';


function App() {
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
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/SignUp" component={SignUp} />
          <Route exact path="/home" component={Home} />

          {userRole ? (
            <Route exact path="/deposits" component={Deposits} />
          ) : null}

          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
