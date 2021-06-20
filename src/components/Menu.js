import React, { } from 'react'
import { A } from 'hookrouter'

const Menu = props => {
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <A href="/" className="brand-link">
          <img src="/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">GS Classifier</span>
        </A>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <A href="/" className="d-block">Admin</A>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {/* Add icons to the links using the .nav-icon class
           with font-awesome or any other icon font library */}
              <li className="nav-item">
                <A href="/dashboard" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </A>
              </li>
              <li className="nav-item">
                <A href="/articles" className="nav-link">
                  <i className="nav-icon fas fa-newspaper" />
                  <p>
                    Articles
                  </p>
                </A>
              </li>
              <li className="nav-item">
                <A href="/publishcations" className="nav-link">
                  <i className="nav-icon fas fa-globe" />
                  <p>
                    Publishcations
                  </p>
                </A>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  )
}


export default Menu