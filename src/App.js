import React, { useState, useEffect } from 'react'

import './App.css';
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Junk from './pages/Junk'
import Menu from './components/Menu'
import Footer from './components/Footer'

import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Articles from './pages/Article'
import Publishcations from './pages/Publishcations'
import Category from './pages/Category'
import BlankPage from './pages/BlankPage'

import { AuthContext } from './context'

import { useRoutes, usePath } from 'hookrouter'


const routes = {
  '/': () => <BlankPage />,
  '/jobs': () => <Jobs />,
  '/dashboard': () => <Dashboard />,
  // '/login': () => <Login />,
  '/articles': () => <Articles />,
  '/junk': () => <Junk />,
  '/publishcations': () => <Publishcations />,
  '/category': () => <Category />
}

const App = props => {
  const match = useRoutes(routes)
  usePath()

  const [token, setToken] = useState(null)

  const login = async (jwt) => {
    setToken(jwt)

    localStorage.setItem(
      'token',
      jwt,
    )
  }

  const logout = () => {
    setToken(null)
  }

  useEffect(() => {
    login(localStorage.getItem('token'))
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout }}>
      {
        token ? 
        <div className="wrapper">
          <Header />
          <Menu />
          {match || <NotFound />}
          <Footer />
        </div> :
        <Login />
      }
    </AuthContext.Provider>
  );
}

export default App
