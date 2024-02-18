import api from "../interceptor";

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