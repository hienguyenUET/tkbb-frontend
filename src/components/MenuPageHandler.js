import AuthUtils, { ROLE } from '../auth/AuthUtils'
import * as MenuComponents from './MenuPages'

const MenuPageHandler = () => {
	const { getUserRoleID } = AuthUtils()
	const pages = [
		{
			component: MenuComponents.soLieuThongKe,
			rolePermissionIds: [ROLE.ANONYMOUS.ID, ROLE.RESEARCHER.ID, ROLE.DEPARTMENT.ID, ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.canBoNghienCuuPage,
			rolePermissionIds: [ROLE.ANONYMOUS.ID, ROLE.RESEARCHER.ID, ROLE.DEPARTMENT.ID, ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.phanLoaiBaiBaoPage,
			rolePermissionIds: [ROLE.RESEARCHER.ID, ROLE.DEPARTMENT.ID, ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.danhMucBaiBaoPage,
			rolePermissionIds: [ROLE.ANONYMOUS.ID, ROLE.RESEARCHER.ID, ROLE.DEPARTMENT.ID, ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.kiemTraTrungLapPage,
			rolePermissionIds: [ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.quanLyLoaiCongBoPage,
			rolePermissionIds: [ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.capNhatDanhSachCongBoPage,
			rolePermissionIds: [ROLE.RESEARCHER.ID, ROLE.DEPARTMENT.ID, ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.loiLayDuLieuPage,
			rolePermissionIds: [ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		},
		{
			component: MenuComponents.theoDoiLayDuLieuPage,
			rolePermissionIds: [ROLE.CONTENT_ADMIN.ID, ROLE.ADMIN.ID]
		}
	]

	return (
		<ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
			{pages.filter(page => page.rolePermissionIds.includes(getUserRoleID())).map(
				page => (
					page.component()
				))}
		</ul>
	);
}

export default MenuPageHandler