import React, {useContext} from 'react'
import { A } from 'hookrouter'
import { AuthContext } from '../auth/auth_context';

const Menu = () => {
  const authContext = useContext(AuthContext);
  const smallStyle={
    fontSize: '0.85rem',
    paddingLeft: '2rem'
  }
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
            {authContext.isLoggedIn?<div className="image">
              <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User"/>
            </div>:<div style={{width: '34px', height: '34px'}}></div>}
            <div className="info">
              {authContext.isLoggedIn?(<A href="/" className="d-block">{authContext.getUsername()}</A>) : (<A href="/login" className="d-block"><i className="nav-icon fas fa-sign-in-alt" /><span style={{marginLeft:'0.5em'}}>Login</span></A>)}
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-2">
          {authContext.isLoggedIn? (
            authContext.getRole() === 'admin'? (
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li className="nav-item has-treeview">
                  <A href="#" className="nav-link" style={{color:'#FFFFCC', fontWeight:"bold"}}>
                    <i className="nav-icon fas fa-chart-pie" />
                    <p>
                      Số liệu thống kê
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </A>
                  <ul className='nav nav-treeview'>
                    <li className="nav-item" style={smallStyle}>
                      <A href="/yearly" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Thống kê theo năm
                        </p>
                      </A>
                    </li>
                    <li className="nav-item" style={smallStyle}>
                      <A href="/byfaculty" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Thống kê theo đơn vị
                        </p>
                      </A>
                    </li>
                    {/*
                    <li className="nav-item" style={smallStyle}>
                      <A href="/byuser" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Tổng hợp theo cán bộ
                        </p>
                      </A>
                    </li>
                    */}
                    <li className="nav-item" style={smallStyle}>
                      <A href="/overview" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Thống kê chi tiết
                        </p>
                      </A>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <A href="/dashboard" className="nav-link">
                    <i className="nav-icon fas fa-users" />
                    <p>Cán bộ nghiên cứu</p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/articles" className="nav-link">
                    <i className="nav-icon fas fa-newspaper" />
                    <p>
                      Phân loại bài báo
                    </p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/report" className="nav-link">
                  {/*<A href="/paperlist" className="nav-link">*/}
                    <i className="nav-icon fas fa-file-alt" />
                    <p>
                      Danh mục bài báo
                    </p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/dedup" className="nav-link">
                    <i className="nav-icon fas fa-file-alt" />
                    <p>
                      Kiểm tra trùng lặp
                    </p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/category" className="nav-link">
                    <i className="nav-icon fas fa-layer-group" />
                    <p>
                      Quản lý loại công bố
                    </p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/update" className="nav-link">
                    <i className="nav-icon fas fa-database" />
                    <p>
                      Cập nhật ds công bố
                    </p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/junk" className="nav-link">
                    <i className="nav-icon fas fa-bug" />
                    <p>
                      Lỗi lấy dữ liệu
                    </p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/jobs" className="nav-link">
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p>Theo dõi lấy dữ liệu</p>
                  </A>
                </li>
              </ul>
            ):(
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li className="nav-item has-treeview">
                  <A href="#" className="nav-link" style={{color:'#FFFFCC', fontWeight:"bold"}}>
                    <i className="nav-icon fas fa-chart-pie" />
                    <p>
                      Số liệu thống kê
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </A>
                  <ul className='nav nav-treeview'>
                    <li className="nav-item" style={smallStyle}>
                      <A href="/yearly" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Thống kê theo năm
                        </p>
                      </A>
                    </li>
                    <li className="nav-item" style={smallStyle}>
                      <A href="/byfaculty" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Thống kê theo đơn vị
                        </p>
                      </A>
                    </li>
                    {/*
                    <li className="nav-item" style={smallStyle}>
                      <A href="/byuser" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Tổng hợp theo cán bộ
                        </p>
                      </A>
                    </li>
                    */}
                    <li className="nav-item" style={smallStyle}>
                      <A href="/overview" className="nav-link" style={{color:'#FFFFCC'}}>
                        <p>
                          Thống kê chi tiết
                        </p>
                      </A>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  {/*<A href="/report" className="nav-link">*/}
                  <A href="/paperlist" className="nav-link">
                    <i className="nav-icon fas fa-file-alt" />
                    <p>
                      Danh mục bài báo
                    </p>
                  </A>
                </li>
                <li className="nav-item">
                  <A href="/dedup" className="nav-link">
                    <i className="nav-icon fas fa-file-alt" />
                    <p>
                      Kiểm tra trùng lặp
                    </p>
                  </A>
                </li>
              </ul>
            )
          ): (
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item has-treeview">
                <A href="#" className="nav-link" style={{color:'#FFFFCC', fontWeight:"bold"}}>
                  <i className="nav-icon fas fa-chart-pie" />
                  <p>
                    Số liệu thống kê
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </A>
                <ul className='nav nav-treeview'>
                  <li className="nav-item" style={smallStyle}>
                    <A href="/yearly" className="nav-link" style={{color:'#FFFFCC'}}>
                      <p>
                        Thống kê theo năm
                      </p>
                    </A>
                  </li>
                  <li className="nav-item" style={smallStyle}>
                    <A href="/byfaculty" className="nav-link" style={{color:'#FFFFCC'}}>
                      <p>
                        Thống kê theo đơn vị
                      </p>
                    </A>
                  </li>
                  {/*
                  <li className="nav-item" style={smallStyle}>
                    <A href="/byuser" className="nav-link" style={{color:'#FFFFCC'}}>
                      <p>
                        Tổng hợp theo cán bộ
                      </p>
                    </A>
                  </li>
                  */}
                  <li className="nav-item" style={smallStyle}>
                    <A href="/overview" className="nav-link" style={{color:'#FFFFCC'}}>
                      <p>
                        Thống kê chi tiết
                      </p>
                    </A>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <A href="/paperlist" className="nav-link">
                  <i className="nav-icon fas fa-file-alt" />
                  <p>
                    Danh mục bài báo
                  </p>
                </A>
              </li>
              <li className="nav-item">
                  <A href="/scholars" className="nav-link">
                    <i className="nav-icon fas fa-users" />
                    <p>Cán bộ nghiên cứu</p>
                  </A>
              </li>
            </ul>
          )}
          </nav>
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  )
}


export default Menu
