import React, { useContext } from 'react'
import { A } from 'hookrouter'
import { AuthContext } from '../auth/auth_context';
import MenuPageHandler from './MenuPageHandler';

export const smallStyle = {
  fontSize: '0.85rem',
  paddingLeft: '2rem'
}

const Menu = () => {
  const authContext = useContext(AuthContext);
  // const { isAdminAccount } = AuthUtils();
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <A href="/" className="brand-link">
          <img src="/dist/img/logo.png" alt="UET Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">Research KPI</span>
        </A>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            {authContext.isLoggedIn ? <div className="image">
              <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User" />
            </div> : <div style={{ width: '34px', height: '34px' }}></div>}
            <div className="info">
              {authContext.isLoggedIn ? (<A href="/" className="d-block">{authContext.getUserData().name}</A>) : (<A href="/login" className="d-block"><i className="nav-icon fas fa-sign-in-alt" /><span style={{ marginLeft: '0.5em' }}>Login</span></A>)}
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <MenuPageHandler></MenuPageHandler>
          </nav>
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  )
}


export default Menu
