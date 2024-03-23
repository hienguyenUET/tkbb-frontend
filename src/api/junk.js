import api from "../auth/api-setup"

const getJunks = async () => {
    const { data: response } = await api.get(`/api/v1/junk`);
    return response;
}

const deleteJunk = async (citation) => {
    const { data: response } = await api.delete(`/api/v1/junk/${citation}`);
    return response;
}

export {
    deleteJunk,
    getJunks
}
