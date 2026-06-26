import api from './axios'

export const getWallet = () => api.get('/wallet')
export const topUp = (data) => api.post('/wallet/topup', data)
export const transfer = (data) => api.post('/wallet/transfer', data)