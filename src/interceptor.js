import axios from "axios";
import { navigate } from 'hookrouter';
import { removeLocalStorage } from './context'
import toast from "./toast"

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    }
})

let loadingToastId = ''

api.interceptors.request.use(
    request => {
        loadingToastId = toast.info('Loading...')
        return request
    }
)

api.interceptors.request.use(function (config) {
    config.headers['token'] = localStorage.getItem('token')
    return config
});

api.interceptors.response.use(
    success => {
        toast.dismiss(loadingToastId)
        return success
    },
    error => {

        let message = ''
        if (error.response) {
            if (error.response.status === 403) {
                removeLocalStorage();
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

export default api