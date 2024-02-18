import React, { useContext } from 'react'
import { AuthContext } from '../context'
import { A } from 'hookrouter'

const Header = () => {
  const authContext = useContext(AuthContext)

  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <A className="nav-link" data-widget="pushmenu" href="" role="button"><i className="fas fa-bars" /></A>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <A href="/" className="nav-link">Công bố khoa học của cán bộ Trường ĐH Công nghệ, ĐHQGHN (thống kê từ Google Scholar)</A>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item d-none d-sm-inline-block">
            {authContext.isLoggedIn?
            <A href="/" onClick={authContext.logout} className="nav-link">
                  <i className="nav-icon fas fa-sign-out-alt" /><span style={{marginLeft:'0.5em'}}>Logout</span>
            </A>
            :
            <A href='/login' className="nav-link"><i className="nav-icon fas fa-sign-in-alt" /><span style={{marginLeft:'0.5em'}}>Login</span></A>}
          </li>
        </ul>
      </nav>
    </div>
  )
}


export default Header
