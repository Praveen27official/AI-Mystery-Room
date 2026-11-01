import axios from 'axios';
const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 90000 });
export const errMsg = e => e.response?.data?.error || 'Network error. Please try again.';
export const createCase = (premise, difficulty, title) => http.post('/cases', { premise, difficulty, title }).then(r => r.data);
export const getCase = id => http.get(`/cases/${id}`).then(r => r.data);
export const discoverClue = (id, clueId) => http.post(`/cases/${id}/clues/${clueId}/discover`).then(r => r.data);
export const requestHint = id => http.post(`/cases/${id}/hints`).then(r => r.data);
export const accuse = (id, suspectId) => http.post(`/cases/${id}/accuse`, { suspectId }).then(r => r.data);
export const getResult = id => http.get(`/cases/${id}/result`).then(r => r.data);
