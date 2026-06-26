import api from './axios'

export const getTransactions = (page = 1) =>
    api.get('/transactions', { params: { page } })

export const getTransactionDetail = (referenceCode) =>
    api.get(`/transactions/${referenceCode}`)