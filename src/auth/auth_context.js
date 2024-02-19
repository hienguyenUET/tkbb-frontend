import { createContext, useEffect, useState } from 'react';
import AxiosErrorHandling from './axios_error_handling';

export const AuthContext = createContext({
  isLoggedIn: false,
  getUsername: () => {
    console.log('getUsername')
  },
  setUsername: () => console.log('setUsername'),
  token: null,
  login: () => { },
  logout: () => { },
})

export function removeLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
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
    return jwt ? true : false;
  }

  const setJwtTokenToLocalStorage = (jwt) => {
    localStorage.setItem('token', jwt)
  }

  const setUsername = (username) => {
    localStorage.setItem('username', username);
  }
  const getUsername = () => {
    return localStorage.getItem('username');
  }
  const setRole = (role) => {
    localStorage.setItem('role', role)
  }
  const getRole = (role) => {
    return localStorage.getItem('role');
  }
  useEffect(() => {
    login(localStorage.getItem('token'))
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, setUsername, getUsername, setRole, getRole }}>
      <AxiosErrorHandling>
        {children}
      </AxiosErrorHandling>
    </AuthContext.Provider>
  )
}