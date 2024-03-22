import api from "../auth/interceptor";

const ROUTE_LINK = 'user-management'

export const getAccountList = async () => {
    const {data: response} = await api.get(`/api/v1/${ROUTE_LINK}/search`);
    return response;
}

export const addNewAccount = async (addAccountForm): Promise<any> => {
    const {status: response} = await api.post(`/api/v1/${ROUTE_LINK}/new-account`, addAccountForm);
    return response;
}

export const updateAccount = async (updateAccountForm): Promise<any> => {
    const {status: response} = await api.put(`/api/v1/${ROUTE_LINK}/update-account`, updateAccountForm);
    return response;
}

export const deleteAccount = async (id): Promise<any> => {
    const {status: response} = await api.delete(`/api/v1/${ROUTE_LINK}/delete-account/${id}`);
    return response;
}

export const getRoleList = async () => {
    const {data: response} = await api.get(`/api/v1/${ROUTE_LINK}/role/search`);

    return response;
}
