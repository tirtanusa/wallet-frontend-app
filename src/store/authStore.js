import { create } from 'zustand'
import { login, logout, register } from '../api/auth'

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (data) => {
        const res = await login(data)
        const { user, token } = res.data.data  // ← res.data.data karena keduanya di dalam data
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
    },

    register: async (data) => {
        const res = await register(data)
        const { user, token } = res.data.data
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