import {A} from 'hookrouter'
import {smallStyle} from './Menu'

export const soLieuThongKe = () => {
	return <li className="nav-item has-treeview" key="so-lieu-thong-ke">
		<A href="#" className="nav-link" style={{ color: '#FFFFCC', fontWeight: "bold" }}>
			<i className="nav-icon fas fa-chart-pie" />
			<p>
				Số liệu thống kê
				<i className="right fas fa-angle-left"></i>
			</p>
		</A>
		<ul className='nav nav-treeview'>
			<li className="nav-item" style={smallStyle}>
				<A href="/yearly" className="nav-link" style={{ color: '#FFFFCC' }}>
					<p>
						Thống kê theo năm
					</p>
				</A>
			</li>
			<li className="nav-item" style={smallStyle}>
				<A href="/byfaculty" className="nav-link" style={{ color: '#FFFFCC' }}>
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
				<A href="/overview" className="nav-link" style={{ color: '#FFFFCC' }}>
					<p>
						Thống kê chi tiết
					</p>
				</A>
			</li>
		</ul>
	</li>
}

export const canBoNghienCuuPage = () => {
	return <li className="nav-item">
		<A href="/dashboard" className="nav-link">
			<i className="nav-icon fas fa-users" />
			<p>Cán bộ nghiên cứu</p>
		</A>
	</li>
}

export const phanLoaiBaiBaoPage = () => {
	return <li className="nav-item">
		<A href="/articles" className="nav-link">
			<i className="nav-icon fas fa-newspaper" />
			<p>
				Phân loại bài báo
			</p>
		</A>
	</li>
}

export const danhMucBaiBaoPage = () => {
	return <li className="nav-item">
		<A href="/report" className="nav-link">
			{/*<A href="/paperlist" className="nav-link">*/}
			<i className="nav-icon fas fa-file-alt" />
			<p>
				Danh mục bài báo
			</p>
		</A>
	</li>
}

export const kiemTraTrungLapPage = () => {
	return <li className="nav-item">
		<A href="/dedup" className="nav-link">
			<i className="nav-icon fas fa-file-alt" />
			<p>
				Kiểm tra trùng lặp
			</p>
		</A>
	</li>
}

export const quanLyLoaiCongBoPage = () => {
	return <li className="nav-item">
		<A href="/category" className="nav-link">
			<i className="nav-icon fas fa-layer-group" />
			<p>
				Quản lý loại công bố
			</p>
		</A>
	</li>
}

export const capNhatDanhSachCongBoPage = () => {
	return <li className="nav-item">
		<A href="/update" className="nav-link">
			<i className="nav-icon fas fa-database" />
			<p>
				Cập nhật ds công bố
			</p>
		</A>
	</li>
}

export const loiLayDuLieuPage = () => {
	return <li className="nav-item">
		<A href="/junk" className="nav-link">
			<i className="nav-icon fas fa-bug" />
			<p>
				Lỗi lấy dữ liệu
			</p>
		</A>
	</li>
}

export const theoDoiLayDuLieuPage = () => {
	return <li className="nav-item">
		<A href="/jobs" className="nav-link">
			<i className="nav-icon fas fa-tachometer-alt" />
			<p>Theo dõi lấy dữ liệu</p>
		</A>
	</li>
}

export const quanLyNguoiDungPage = () => {
	return <li className="nav-item">
		<A href="/user-management" className="nav-link">
			<i className="nav-icon fas fa-user"/>
			<p>Quản lý người dùng</p>
		</A>
	</li>
}
