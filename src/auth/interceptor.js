import {useContext, useEffect} from "react"
import {AuthContext} from "./auth_context"
import api from "./api-setup"
import toast from "../toast"
import {navigate} from 'hookrouter';

const Interceptor = ({ children }) => {

	const authContext = useContext(AuthContext)
	let loadingToastId = '';

	api.interceptors.request.use(function (config) {
		config.headers['token'] = authContext.getJwtTokenFromLocalStorage()
		return config
	});
	api.interceptors.request.use(
		request => {
			loadingToastId = toast.info('Loading...', {
				toastId: 0
			})
			return request
		}
	)

	useEffect(() => {
		api.interceptors.response.use(
			response => {
				toast.dismiss(loadingToastId);
				if (response.status === 200) {
					toast.success(response.data.data, {
						autoClose: 3000
					});
				}
				return response;
			},
			error => {
				let message = ''
				if (error.response) {
					// if (error.response.status === 403) {
					// 	authContext.logout();
					// 	navigate('/login');
					// }
					message = error.response.data.error.message
				} else if (error.request) {
					message = error.request
				} else {
					message = error.message
				}
				toast.dismiss(loadingToastId)
				toast.error(
					message,
					{autoClose: 3000}
				)
				return Promise.reject(error)
			}
		)
	}, [])

	return children
}


export default Interceptor
