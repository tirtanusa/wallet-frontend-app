import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { Mail, Lock, User, Wallet, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
    const { register } = useAuthStore()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (form.password !== form.password_confirmation) {
            setError('Konfirmasi password tidak cocok')
            return
        }

        setLoading(true)
        try {
            await register(form)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal. Coba email lain.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-full flex flex-col justify-between px-6 py-8 animate-slide-up">
            <div className="my-auto space-y-6">
                {/* Branding Logo */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/10 text-brand border border-brand/20 shadow-[0_0_15px_rgba(46,91,255,0.15)]">
                        <Wallet size={24} className="stroke-[1.75]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Precision Finance</h1>
                        <p className="text-xs text-dark-text-muted">Buat akun baru secara instan</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-card p-6 rounded-2xl space-y-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Buat Akun</h2>
                        <p className="text-xs text-dark-text-muted">Lengkapi data di bawah ini untuk memulai</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <p className="leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300 block">Nama Lengkap</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-text-muted" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full bg-dark-surface/50 border border-dark-border text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-gray-600"
                                    placeholder="Nama Anda"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300 block">Alamat Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-text-muted" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full bg-dark-surface/50 border border-dark-border text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-gray-600"
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300 block">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-text-muted" />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full bg-dark-surface/50 border border-dark-border text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300 block">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-text-muted" />
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full bg-dark-surface/50 border border-dark-border text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand/90 focus:ring-2 focus:ring-brand/45 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Buat Akun</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Login Link Footer */}
            <p className="text-xs text-center text-dark-text-muted mt-6">
                Sudah memiliki akun?{' '}
                <Link to="/login" className="text-brand font-semibold hover:underline">
                    Masuk
                </Link>
            </p>
        </div>
    )
}