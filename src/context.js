import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    getUsername: () => {
      console.log('getUsername')
    },
    setUsername: () => console.log('setUsername'),
    token: null,
    login: () => {},
    logout: () => {},
})
