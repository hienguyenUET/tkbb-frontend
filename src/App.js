import React from 'react'
import './App.css';
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Junk from './pages/Junk'

import Login from './pages/Login'

import Articles from './pages/Article'
import Category from './pages/Category'
import Report from './pages/Report'
import DeDup from './pages/DeDup'
import Update from './pages/Update'
import Overview from './pages/Overview'
import Yearly from './pages/Yearly'
import ByFaculty from './pages/ByFaculty'
import ByUser from './pages/ByUser'
import PaperList from './pages/PaperList'
import Scholars from './pages/Scholars'
import { AuthProvider } from './auth/auth_context'
import { useRoutes, usePath } from 'hookrouter'
import Home from './components/Home';
import AccountManagement from "./pages/account-management/AccountManagement";

const routes = {
  '/': () => <Yearly />,
  '/jobs': () => <Jobs />,
  '/dashboard': () => <Dashboard />,
  '/articles': () => <Articles />,
  '/junk': () => <Junk />,
  '/category': () => <Category />,
  '/report': () => <Report />,
  '/dedup': () => <DeDup />,
  '/update': () => <Update />,
  '/overview': () => <Overview />,
  '/yearly': () => <Yearly />,
  '/byfaculty': () => <ByFaculty />,
  '/byuser': () => <ByUser />,
  '/paperlist': () => <PaperList />,
  '/scholars': () => <Scholars />,
  '/login': () => <Login />,
  '/account-management': () => <AccountManagement/>
}

const App = () => {
  const match = useRoutes(routes)
  const path = usePath()

  return (
    <AuthProvider>
      <Home
        match={match}
        path={path}>
      </Home>
    </AuthProvider>
  );
}

export default App
