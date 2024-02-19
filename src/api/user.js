import api from "../auth/interceptor"

const createUsers = async (body) => {
    const { data: response } = await api.post('/api/v1/users', body)

    return response
}

const getUsers = async () => {
    console.log(localStorage.getItem('token'))

    const { data: response } = await api.get('/api/v1/users')

    return response;
}

const uploadUsers = async (file) => {

    const formData = new FormData()

    formData.append('users', file)

    const { data: response } = await api.post(
        '/api/v1/users/importing',
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data;' }
        }
    )

    return response
}

const crawlUsers = async (id, yearWindow = -1) => {
    const { data: response } = await api.post(`/api/v1/articles/crawling/user/${id}`, { yearWindow: yearWindow })

    return response
}

const updateUser = async (id, user) => {
    const { data: response } = await api.put(`/api/v1/users/${id}`, user);
    return response;
}

const deleteUser = async (uid) => {
    const { data: response } = await api.delete(`/api/v1/users/${uid}`)

    return response
}

export {
    createUsers,
    getUsers,
    uploadUsers,
    crawlUsers,
    updateUser,
    deleteUser
}