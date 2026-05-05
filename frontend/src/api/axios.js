import axios from 'axios';

const API = axios.create({
    // This automatically detects your website URL and adds /api
    baseURL: window.location.origin + '/api',
});

// Automatically attaches your login token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;