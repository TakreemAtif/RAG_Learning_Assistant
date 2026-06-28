import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const chatWithRAG = async (query) => {
    const response = await api.post('/chat', { query });
    return response.data;
};

export const getDocuments = async () => {
    const response = await api.get('/documents');
    return response.data;
};

export default api;
