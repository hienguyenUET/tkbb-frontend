import api from "../interceptor"
import toast from "./../toast"

const createPublishcation = async (body) => {
    const { data: response } = await api.post('/api/v1/diachicongbo', body)

    toast.success("Create diachicongbo successfully", { autoClose: 3000 })

    return response
}

const getPublishcation = async () => {
    const { data: response } = await api.get('/api/v1/diachicongbo')

    return response
}

const deletePublishcation = async (id) => {
    const { data: response } = await api.delete(`/api/v1/diachicongbo/${id}`)

    toast.success("Delete diachicongbo successfully", { autoClose: 3000 })

    return response
}

const updatePublishcation = async (body, id) => {
    const { data: response } = await api.put(`/api/v1/diachicongbo/${id}`, body)

    toast.success("Update diachicongbo successfully", { autoClose: 3000 })

    return response
}

export {
    createPublishcation,
    getPublishcation,
    deletePublishcation,
    updatePublishcation,
}