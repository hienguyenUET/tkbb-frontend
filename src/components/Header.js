import React, { useContext } from 'react'
import { AuthContext } from '../context'
import { A } from 'hookrouter'

const Header = props => {
  const authContext = useContext(AuthContext)

  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <A className="nav-link" data-widget="pushmenu" href="/" role="button"><i className="fas fa-bars" /></A>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <A href="/" className="nav-link">Home</A>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item d-none d-sm-inline-block">
            <A href="/" onClick={authContext.logout} className="nav-link">Logout</A>
          </li>
        </ul>
      </nav>
    </div>
  )
}


export default Header
