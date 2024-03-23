import { createContext, useEffect, useState } from 'react';
import Interceptor from './interceptor';

export const AuthContext = createContext({
  isLoggedIn: false,
  getUsername: () => {
    console.log('getUsername')
  },
  getJwtTokenFromLocalStorage: () => {},
  setUserData: () => {},
  getUserData: () => {},
  setUsername: () => console.log('setUsername'),
  token: null,
  login: () => { },
  logout: () => { },
})

export function removeLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (jwt) => {
    if (isHavingJwtToken(jwt)) {
      setJwtTokenToLocalStorage(jwt);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false)
    };
  }
  const logout = () => {
    removeLocalStorage()
    setIsLoggedIn(false)
  }

  const isHavingJwtToken = (jwt) => {
    return !!jwt;
  }

  const setJwtTokenToLocalStorage = (jwt) => {
    localStorage.setItem('token', jwt)
  }

  const getJwtTokenFromLocalStorage = () => {
    return localStorage.getItem('token');
  }

  const setUserData = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData))
  }

  const getUserData = () => {
    return JSON.parse(localStorage.getItem("userData"));
  }

  const setUsername = (username) => {
    localStorage.setItem('username', username);
  }
  const getUsername = () => {
    return localStorage.getItem('username');
  }

  useEffect(() => {
    login(localStorage.getItem('token')).then(r => null)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, setUsername, getUsername,  getJwtTokenFromLocalStorage, setUserData, getUserData }}>
      <Interceptor>
        {children}
      </Interceptor>
    </AuthContext.Provider>
  )
}
