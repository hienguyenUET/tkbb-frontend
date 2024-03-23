import api from "../auth/api-setup"
import toast from "./../toast"

const login = async ({ username, password }) => {
    const { data: response } = await api.post('/api/v1/login', {
        username,
        password,
    }).catch((error) => {
        console.log(error);
    })

    toast.success("Login successfully", { autoClose: 1000 })

    return response
}

export default login
