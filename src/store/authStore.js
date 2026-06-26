import { create } from 'zustand'
import { login, logout, register } from '../api/auth'

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    register: async (data) => {
        const res = await register(data)
        const { user, token } = res.data
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
    },

    login: async (data) => {
        const res = await login(data)
        const { user, token } = res.data
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
    },

    logout: async () => {
        await logout()
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
    },
}))

export default useAuthStore