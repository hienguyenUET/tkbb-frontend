import api from "../interceptor"
import toast from "./../toast"

const login = async ({ username, password }) => {
    const { data: response } = await api.post('/api/v1/login', {
        username,
        password,
    })

    toast.success("Login successfully", { autoClose: 1000 })

    return response
}

export default login