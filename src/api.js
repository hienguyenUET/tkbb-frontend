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
//            localStorage.removeItem('token')
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

    toast.success("Login successfully", { autoClose: 1000 })

    return response
}

const createUsers = async (body) => {
    const { data: response } = await instance.post('/api/v1/users', body)

    return response
}

const getUsers = async () => {
    console.log(localStorage.getItem('token'))

    const { data: response } = await instance.get('/api/v1/users')

    return response;
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

const deleteArticle = async (aid) => {
    const { data: response } = await instance.delete(`/api/v1/articles/${aid}`);
    return response;
}

const reloadArticle = async (aid) => {
    const { data: response } = await instance.get(`/api/v1/articles/reload/${aid}`);
    return response;
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
    
    toast.success("Update diachicongbo for article successfully", { autoClose: 3000 })

    return response
}

const createPublishcation = async (body) => {
    const { data: response } = await instance.post('/api/v1/diachicongbo', body)

    toast.success("Create diachicongbo successfully", { autoClose: 3000 })
    
    return response
}

const getPublishcation = async () => {
    const { data: response } = await instance.get('/api/v1/diachicongbo')
    
    return response
}

const deletePublishcation = async (id) => {
    const { data: response } = await instance.delete(`/api/v1/diachicongbo/${id}`)
    
    toast.success("Delete diachicongbo successfully", { autoClose: 3000 })

    return response
}

const updatePublishcation = async (body, id) => {
    const { data: response } = await instance.put(`/api/v1/diachicongbo/${id}`, body)

    toast.success("Update diachicongbo successfully", { autoClose: 3000 })
    
    return response
}

const crawlUsers = async (id) => {
    const { data: response } = await instance.post(`/api/v1/articles/crawling/user/${id}`)

    return response
}

const updateUser = async (id, user) => {
    const { data: response } = await instance.put(`/api/v1/users/${id}`, user);
    return response;
}

const getJunks = async () => {
    const { data: response } = await instance.get(`/api/v1/junk`);
    return response;
}

const deleteJunk = async (citation) => {
    const { data: response } = await instance.delete(`/api/v1/junk/${citation}`);
    return response;
}

const createCategory = async (category) => {
    const { data: response } = await instance.post(`/api/v1/category`, category);
    return response;
}
const getCategories = async () => {
    const { data: response } = await instance.get('/api/v1/category');
    return response;
}
const updateCategory = async (id, category) => {
    const { data: response } = await instance.put(`/api/v1/category/${id}`, category);
    return response;
}
const deleteCategory = async (id) => {
    const { data: response } = await instance.delete(`/api/v1/category/${id}`);
    return response;
}
const queryArticles = async (criteria) => {
    const { data: response } = await instance.post('/api/v1/articles/query', criteria);
    return response;
}
const getFaculties = async () => {
    const { data: response } = await instance.get('/api/v1/users/faculties');
    return response
}

const uploadJournalList = async (variant, file) => {
    const formData = new FormData()

    formData.append(variant, file)

    const { data: response } = await instance.post(
        '/api/v1/update/' + variant, 
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data;'}
        }
    )

    return response
}

const findJournal = async (venue) => {
    const { data: response } = await instance.post('/api/v1/update/lookup', {venue});
    return response
}
export {
    login,
    getUsers,
    uploadUsers,
    deleteUser,
    deleteArticle,
    reloadArticle,
    crawArticleData,
    getArticles,
    createPublishcation,
    getPublishcation,
    deletePublishcation,
    updateArticles,
    updatePublishcation,
    createUsers,
    updateUser,
    crawlUsers,
    getJunks,
    deleteJunk,
    getCategories,
    deleteCategory,
    updateCategory,
    createCategory,
    queryArticles,
    getFaculties,
    uploadJournalList,
    findJournal
}
