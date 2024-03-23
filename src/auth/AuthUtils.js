import { useContext } from "react";
import { AuthContext } from "./auth_context";

export const ROLE = {
	ANONYMOUS: {
		ID: 0,
		NAME: "ANONYMOUS"
	},
	ADMIN: {
		ID: 1,
		NAME: "ADMIN"
	},
	CONTENT_ADMIN: {
		ID: 2,
		NAME: "CONTENT_ADMIN"
	},
	DEPARTMENT: {
		ID: 3,
		NAME: "DEPARTMENT"
	},
	RESEARCHER: {
		ID: 4,
		NAME: "RESEARCHER"
	},
}

export const AuthUtils = () => {
	const authContext = useContext(AuthContext);
	const getUserRoleID = () => {
		if (!authContext.isLoggedIn || !authContext.getUserData().role) {
			return ROLE.ANONYMOUS.ID;
		}
		return authContext.getUserData().role.id;
	}
	const isAdminAccount = () => {
		return getUserRoleID() === ROLE.ADMIN.ID;
	}

	const isContentAdminAccount = () => {
		return getUserRoleID() === ROLE.CONTENT_ADMIN.ID;
	}

	const isDepartmentAccount = () => {
		return getUserRoleID() === ROLE.DEPARTMENT.ID;
	}

	const isResearcherAccount = () => {
		return getUserRoleID() === ROLE.RESEARCHER.ID;
	}

	return {
		getUserRoleID,
		isAdminAccount,
		isContentAdminAccount,
		isDepartmentAccount,
		isResearcherAccount
	}
}

export default AuthUtils
