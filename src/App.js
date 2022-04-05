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
//import Publishcations from './pages/Publishcations'
import Category from './pages/Category'
import Report from './pages/Report'
import DeDup from './pages/DeDup'
import BlankPage from './pages/BlankPage'
import Update from './pages/Update'
import Overview from './pages/Overview'
import Yearly from './pages/Yearly'
import ByFaculty from './pages/ByFaculty'
import ByUser from './pages/ByUser'

import { AuthContext } from './context'

import { useRoutes, usePath } from 'hookrouter'

const routes = {
  '/': () => <Yearly />,
  '/jobs': () => <Jobs />,
  '/dashboard': () => <Dashboard />,
  // '/login': () => <Login />,
  '/articles': () => <Articles />,
  '/junk': () => <Junk />,
  //'/publishcations': () => <Publishcations />,
  '/category': () => <Category />,
  '/report': () => <Report />,
  '/dedup': () => <DeDup />,
  '/update': () => <Update />,
  '/overview': () => <Overview />,
  '/yearly': () => <Yearly />,
  '/byfaculty': () => <ByFaculty />,
  '/byuser': () => <ByUser />
}

const App = props => {
  const match = useRoutes(routes)
  usePath()

  const [token, setToken] = useState(null)

  const login = async (jwt) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
  }

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.remoteItem('username');
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
    <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout, setUsername, getUsername, setRole, getRole }}>
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
