import { useContext, useEffect } from "react"
import { AuthContext } from "./auth_context"
import api from "./interceptor"
import toast from "../toast"
import { navigate } from 'hookrouter';

const AxiosErrorHandling = ({ children }) => {

	const authContext = useContext(AuthContext)
	let loadingToastId = ''
	api.interceptors.request.use(function (config) {
		config.headers['token'] = authContext.getJwtTokenFromLocalStorage()
		return config
	});

	api.interceptors.request.use(
		request => {
			loadingToastId = toast.info('Loading...', {
				toastId: authContext.getJwtTokenFromLocalStorage()
			})
			return request
		}
	)

	api.interceptors.response.use(
		success => {
			toast.dismiss(loadingToastId)
			return success
		},
		error => {
			let message = ''
			if (error.response) {
				if (error.response.status === 403) {
					authContext.logout();
					navigate('/login');
				}
				message = error.response.data.error.message
			} else if (error.request) {
				message = error.request
			} else {
				message = error.message
			}
			toast.dismiss(loadingToastId)
			toast.error(
				message,
				{ autoClose: 3000 }
			)
			return Promise.reject(error)
		}
	)
	return children
}


export default AxiosErrorHandling