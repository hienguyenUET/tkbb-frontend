import api from "../auth/api-setup"

const createUsers = async (body) => {
    const {data: response} = await api.post('/api/v1/users', body)

    return response
}

const getUsers = async (facultyId: number): Promise<any> => {
    const {data: response} = await api.get('/api/v1/users', {
        params: {
            facultyId: facultyId
        }
    })
    return response;
}

const getUserListForAddAccount = async () => {
    const {data: response} = await api.get('/api/v1/users/search/add-account')

    return response;
}

const uploadUsers = async (file) => {

    const formData = new FormData()

    formData.append('users', file)

    const {data: response} = await api.post(
        '/api/v1/users/importing',
        formData,
        {
            headers: {'Content-Type': 'multipart/form-data;'}
        }
    )

    return response
}

const crawlUsers = async (id, yearWindow = -1) => {
    const {data: response} = await api.post(`/api/v1/articles/crawling/user/${id}`, {yearWindow: yearWindow})

    return response
}

const updateUser = async (id, user) => {
    const {data: response} = await api.put(`/api/v1/users/${id}`, user);
    return response;
}

const deleteUser = async (uid) => {
    const {data: response} = await api.delete(`/api/v1/users/${uid}`)
    return response
}


export {
    createUsers,
    getUsers,
    uploadUsers,
    getUserListForAddAccount,
    crawlUsers,
    updateUser,
    deleteUser
}
