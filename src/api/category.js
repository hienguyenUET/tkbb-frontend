import api from "../interceptor";

const createCategory = async (category) => {
    const { data: response } = await api.post(`/api/v1/category`, category);
    return response;
}
const getCategories = async () => {
    const { data: response } = await api.get('/api/v1/category');
    return response;

}
const updateCategory = async (id, category) => {
    const { data: response } = await api.put(`/api/v1/category/${id}`, category);
    return response;
}
const deleteCategory = async (id) => {
    const { data: response } = await api.delete(`/api/v1/category/${id}`);
    return response;
}

export {
    getCategories,
    deleteCategory,
    updateCategory,
    createCategory,
}