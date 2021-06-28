import axios from 'axios'
import toast from './toast';


const instance = axios.create({
    //baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    }
})

let loadingToastId = ''

instance.interceptors.request.use(
    request => {
        loadingToastId = toast.info('Loading...')
        return request
    }
)

instance.interceptors.request.use(function (config) {
    config.headers['token'] = localStorage.getItem('token')

    return config
});

instance.interceptors.response.use(
    success => {
        toast.dismiss(loadingToastId)
        return success
    },
    error => {
        let message = ''

        if (error.response) {
            message = error.response.data.error.message
        } else if (error.request) {
            message = error.request
        } else {
            message = error.message
        }

        if (error.response?.status) {
            localStorage.removeItem('token')
        }

        toast.dismiss(loadingToastId)

        toast.error(
            message,
            { autoClose: 3000 }
        )

        return Promise.reject(error)
    }
)

const login = async ({ username, password }) => {
    const {data: response} = await instance.post('/api/v1/login', {
        username,
        password,
    })

    toast.success("Login successfully", { autoClose: 3000 })

    return response
}

const createUsers = async (body) => {
    const { data: response } = await instance.post('/api/v1/users', body)

    return response
}

const getUsers = async () => {
    console.log(localStorage.getItem('token'))

    const { data: response } = await instance.get('/api/v1/users')

    return response
}

const uploadUsers = async (file) => {

    const formData = new FormData()

    formData.append('users', file)

    const { data: response } = await instance.post(
        '/api/v1/users/importing', 
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data;'}
        }
    )

    return response
}

const deleteUser = async (uid) => {
    const { data: response } = await instance.delete(`/api/v1/users/${uid}`)

    return response
}

const crawArticleData = async () => {
    const { data: response } = await instance.post('/api/v1/articles/crawling')

    return response
}

const getArticles = async () => {
    const { data: response } = await instance.get('/api/v1/articles')

    return response
}

const updateArticles = async (body, id) => {
    const { data: response } = await instance.put(`/api/v1/articles/${id}`, body)
    
    toast.success("Update publishcation for article successfully", { autoClose: 3000 })

    return response
}

const createPublishcation = async (body) => {
    const { data: response } = await instance.post('/api/v1/publishcation', body)

    toast.success("Create publishcation successfully", { autoClose: 3000 })
    
    return response
}

const getPublishcation = async () => {
    const { data: response } = await instance.get('/api/v1/publishcation')
    
    return response
}

const deletePublishcation = async (id) => {
    const { data: response } = await instance.delete(`/api/v1/publishcation/${id}`)
    
    toast.success("Delete publishcation successfully", { autoClose: 3000 })

    return response
}

const updatePublishcation = async (body, id) => {
    const { data: response } = await instance.put(`/api/v1/publishcation/${id}`, body)

    toast.success("Update publishcation successfully", { autoClose: 3000 })
    
    return response
}

const crawlUsers = async (id) => {
    const { data: response } = await instance.post(`/api/v1/articles/crawling/user/${id}`)

    return response
}

export {
    login,
    getUsers,
    uploadUsers,
    deleteUser,
    crawArticleData,
    getArticles,
    createPublishcation,
    getPublishcation,
    deletePublishcation,
    updateArticles,
    updatePublishcation,
    createUsers,
    crawlUsers,
}
