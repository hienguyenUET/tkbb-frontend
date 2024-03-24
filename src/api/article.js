import api from "../auth/api-setup";
import toast from "./../toast"

const deleteArticle = async (aid) => {
    const { data: response } = await api.delete(`/api/v1/articles/${aid}`);
    return response;
}

const reloadArticle = async (aid) => {
    const { data: response } = await api.get(`/api/v1/articles/reload/${aid}`);
    return response;
}

const crawlArticleData = async (yearWindow) => {
    const { data: response } = await api.post('/api/v1/articles/crawling', { yearWindow });

    return response
}

const getArticles = async () => {
    const { data: response } = await api.get('/api/v1/articles')

    return response
}

const updateArticles = async (body, id) => {
    const { data: response } = await api.put(`/api/v1/articles/${id}`, body)

    // toast.success("Update diachicongbo for article successfully", { autoClose: 3000 })

    return response
}

const queryArticles = async (criteria) => {
    const { data: response } = await api.post('/api/v1/articles/query', criteria);
    return response;
}
const queryDupplicatedArticles = async () => {
    const { data: response } = await api.get('/api/v1/articles/dedup');
    return response;
}

export {
    deleteArticle,
    reloadArticle,
    crawlArticleData,
    getArticles,
    queryArticles,
    queryDupplicatedArticles,
    updateArticles
}
