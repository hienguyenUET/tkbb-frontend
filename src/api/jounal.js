import api from "../auth/interceptor"

const uploadJournalList = async (variant, file) => {
    const formData = new FormData()

    formData.append(variant, file)

    const { data: response } = await api.post(
        '/api/v1/update/' + variant,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data;' }
        }
    )

    return response
}

const findJournal = async (venue) => {
    const { data: response } = await api.post('/api/v1/update/lookup', { venue });
    return response
}

export {
    uploadJournalList,
    findJournal
}