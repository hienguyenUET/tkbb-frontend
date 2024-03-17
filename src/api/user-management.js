import api from "../auth/interceptor";

const ROUTE_LINK = 'user-management'

export const getAccountList = async (category) => {
    const { data: response } = await api.get(`/api/v1/${ROUTE_LINK}/search`, category);
    return response;
}

