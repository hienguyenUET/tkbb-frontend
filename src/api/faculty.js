import api from "../auth/api-setup";

const getFaculties = async () => {
    const { data: response } = await api.get('/api/v1/faculty/faculties');
    return response
}

export {
    getFaculties
}
