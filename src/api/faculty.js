import api from "../auth/interceptor";

const getFaculties = async () => {
    const { data: response } = await api.get('/api/v1/users/faculties');
    return response
}

export {
    getFaculties
}