import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getWallet, topUp, transfer } from '../api/wallet'
import { getTransactions } from '../api/transactions'
import {
    Eye, EyeOff, Plus, Send, LogOut, ArrowUpRight, ArrowDownLeft,
    ChevronRight, TrendingUp, History, User, X, CheckCircle2, AlertCircle
} from 'lucide-react'

export default function DashboardPage() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const [wallet, setWallet] = useState(null)
    const [recentTransactions, setRecentTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showBalance, setShowBalance] = useState(() => {
        const saved = localStorage.getItem('show_balance')
        return saved !== 'false'
    })

    // Modals visibility state
    const [activeModal, setActiveModal] = useState(null) // 'topup' | 'transfer' | null

    const [topUpForm, setTopUpForm] = useState({ amount: '', description: '' })
    const [transferForm, setTransferForm] = useState({ recipient_email: '', amount: '', description: '' })

    const [topUpError, setTopUpError] = useState(null)
    const [transferError, setTransferError] = useState(null)
    const [topUpSuccess, setTopUpSuccess] = useState(null)
    const [transferSuccess, setTransferSuccess] = useState(null)

    const [topUpLoading, setTopUpLoading] = useState(false)
    const [transferLoading, setTransferLoading] = useState(false)

    const toggleBalance = () => {
        setShowBalance(prev => {
            localStorage.setItem('show_balance', String(!prev))
            return !prev
        })
    }

    const fetchDashboardData = async () => {
        try {
            const [walletRes, trxRes] = await Promise.all([
                getWallet(),
                getTransactions(1)
            ])
            setWallet(walletRes.data.data)
            // Save only the top 3 transactions
            setRecentTransactions((trxRes.data.data || []).slice(0, 3))
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const handleTopUpSubmit = async (e) => {
        e.preventDefault()
        setTopUpError(null)
        setTopUpSuccess(null)
        setTopUpLoading(true)
        try {
            const res = await topUp(topUpForm)
            setTopUpSuccess(res.data.message || 'Top up berhasil')
            setTopUpForm({ amount: '', description: '' })
            fetchDashboardData()
            setTimeout(() => {
                setActiveModal(null)
                setTopUpSuccess(null)
            }, 1500)
        } catch (err) {
            setTopUpError(err.response?.data?.message || 'Top up gagal')
        } finally {
            setTopUpLoading(false)
        }
    }

    const handleTransferSubmit = async (e) => {
        e.preventDefault()
        setTransferError(null)
        setTransferSuccess(null)
        setTransferLoading(true)
        try {
            const res = await transfer(transferForm)
            setTransferSuccess(res.data.message || 'Transfer berhasil')
            setTransferForm({ recipient_email: '', amount: '', description: '' })
            fetchDashboardData()
            setTimeout(() => {
                setActiveModal(null)
                setTransferSuccess(null)
            }, 1500)
        } catch (err) {
            setTransferError(err.response?.data?.message || 'Transfer gagal')
        } finally {
            setTransferLoading(false)
        }
    }

    const formatRupiah = (amount) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)

    const getTrxTypeDetails = (type) => {
        if (type === 'topup') return { label: 'Top Up', icon: <Plus size={16} className="text-blue-400" />, bg: 'bg-blue-500/10 border border-blue-500/20' }
        if (type === 'transfer_out') return { label: 'Send', icon: <ArrowUpRight size={16} className="text-red-400" />, bg: 'bg-red-500/10 border border-red-500/20' }
        return { label: 'Receive', icon: <ArrowDownLeft size={16} className="text-green-400" />, bg: 'bg-green-500/10 border border-green-500/20' }
    }

    return (
        <div className="flex flex-col min-h-full pb-8 relative animate-slide-up">
            {/* Header / Navbar */}
            <header className="px-6 py-4 flex justify-between items-center border-b border-dark-border/40 bg-dark-bg/85 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-semibold text-xs">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                    </div>
                    <div>
                        <p className="text-[10px] text-dark-text-muted">Halo, Selamat Datang</p>
                        <h2 className="text-xs font-semibold text-white -mt-0.5">{user}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/transactions"
                        className="p-2 rounded-lg bg-dark-surface hover:bg-dark-surface/80 border border-dark-border text-dark-text-muted hover:text-white transition-all"
                        title="Riwayat"
                    >
                        <History size={16} />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            <div className="px-6 py-6 space-y-6">
                {/* Balance Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-[#3a66ff] to-[#1e4cd6] text-white p-6 shadow-[0_8px_30px_rgb(46,91,255,0.25)]">
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-white/80 tracking-wide uppercase">Total Balance</p>
                            {loading ? (
                                <div className="h-9 w-32 bg-white/20 rounded-md animate-pulse mt-2"></div>
                            ) : (
                                <h1 className="text-3xl font-extrabold tracking-tight mt-1.5 font-mono">
                                    {showBalance ? formatRupiah(wallet?.balance ?? 0) : '••••••••'}
                                </h1>
                            )}
                        </div>
                        <button
                            onClick={toggleBalance}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
                        >
                            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Stats & Growth */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                        <span className="text-white/60">Currency: <strong className="text-white font-mono">{wallet?.currency ?? 'IDR'}</strong></span>
                        <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                            <TrendingUp size={12} className="text-emerald-300" />
                            <span className="text-emerald-300">+12.4%</span>
                            <span className="text-white/70 font-normal">bulan ini</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Send & Top Up) */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setActiveModal('topup')}
                        className="flex items-center justify-center gap-2.5 bg-dark-card border border-dark-border hover:border-brand/40 py-3.5 px-4 rounded-xl text-sm font-semibold text-white hover:bg-dark-surface/50 active:scale-[0.97] transition-all cursor-pointer shadow-sm shadow-black/10"
                    >
                        <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                            <Plus size={16} />
                        </div>
                        <span className="text-xs">Top Up</span>
                    </button>

                    <button
                        onClick={() => setActiveModal('transfer')}
                        className="flex items-center justify-center gap-2.5 bg-dark-card border border-dark-border hover:border-brand/40 py-3.5 px-4 rounded-xl text-sm font-semibold text-white hover:bg-dark-surface/50 active:scale-[0.97] transition-all cursor-pointer shadow-sm shadow-black/10"
                    >
                        <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                            <Send size={15} />
                        </div>
                        <span className="text-xs">Send</span>
                    </button>
                </div>

                {/* Recent Transactions List */}
                <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-white tracking-wider uppercase">Recent Transactions</h3>
                        <Link to="/transactions" className="text-xs text-brand font-semibold flex items-center gap-0.5 hover:underline">
                            <span>Lihat Semua</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-14 bg-dark-card/50 border border-dark-border rounded-xl animate-pulse shimmer"></div>
                            ))}
                        </div>
                    ) : recentTransactions.length === 0 ? (
                        <div className="glass-card p-6 rounded-xl text-center space-y-2 border border-dark-border/40">
                            <p className="text-xs text-dark-text-muted">Belum ada transaksi</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {recentTransactions.map((trx) => {
                                const { label, icon, bg } = getTrxTypeDetails(trx.type)
                                return (
                                    <Link
                                        to={`/transactions/${trx.reference_code}`}
                                        key={trx.id}
                                        className="flex items-center justify-between p-3.5 bg-dark-card/50 hover:bg-dark-card border border-dark-border hover:border-dark-border/80 rounded-xl transition-all active:scale-[0.99] group shadow-sm shadow-black/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                                                {icon}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-white group-hover:text-brand transition-colors">{label}</p>
                                                <p className="text-[10px] text-dark-text-muted mt-0.5 font-mono">{trx.reference_code}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`text-xs font-bold font-mono ${trx.type === 'transfer_out' ? 'text-red-400' : 'text-green-400'}`}>
                                                {trx.type === 'transfer_out' ? '-' : '+'}{formatRupiah(trx.amount)}
                                            </p>
                                            <p className="text-[9px] text-dark-text-muted mt-0.5">
                                                {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short'
                                                })}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Up Modal Overlay */}
            {activeModal === 'topup' && (
                <div className="absolute inset-0 bg-dark-bg/90 backdrop-blur-sm z-50 flex flex-col justify-end">
                    <div className="glass-card rounded-t-3xl border-t border-dark-border p-6 space-y-4 animate-slide-up">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Up Balance</h3>
                            <button
                                onClick={() => { setActiveModal(null); setTopUpError(null); setTopUpSuccess(null); }}
                                className="p-1 rounded-lg bg-dark-surface border border-dark-border text-dark-text-muted hover:text-white cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {topUpError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle size={14} className="shrink-0" />
                                <p>{topUpError}</p>
                            </div>
                        )}
                        {topUpSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle2 size={14} className="shrink-0" />
                                <p>{topUpSuccess}</p>
                            </div>
                        )}

                        <form onSubmit={handleTopUpSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300">Nominal Pengisian (IDR)</label>
                                <input
                                    type="number"
                                    placeholder="Contoh: 50000"
                                    value={topUpForm.amount}
                                    onChange={(e) => setTopUpForm({ ...topUpForm, amount: e.target.value })}
                                    className="w-full bg-dark-surface border border-dark-border text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/35 transition-all font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300">Catatan / Deskripsi</label>
                                <input
                                    type="text"
                                    placeholder="Opsional"
                                    value={topUpForm.description}
                                    onChange={(e) => setTopUpForm({ ...topUpForm, description: e.target.value })}
                                    className="w-full bg-dark-surface border border-dark-border text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/35 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={topUpLoading}
                                className="w-full bg-brand hover:bg-brand/95 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {topUpLoading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Konfirmasi Top Up'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Transfer Modal Overlay */}
            {activeModal === 'transfer' && (
                <div className="absolute inset-0 bg-dark-bg/90 backdrop-blur-sm z-50 flex flex-col justify-end">
                    <div className="glass-card rounded-t-3xl border-t border-dark-border p-6 space-y-4 animate-slide-up">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Send Money</h3>
                            <button
                                onClick={() => { setActiveModal(null); setTransferError(null); setTransferSuccess(null); }}
                                className="p-1 rounded-lg bg-dark-surface border border-dark-border text-dark-text-muted hover:text-white cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {transferError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle size={14} className="shrink-0" />
                                <p>{transferError}</p>
                            </div>
                        )}
                        {transferSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle2 size={14} className="shrink-0" />
                                <p>{transferSuccess}</p>
                            </div>
                        )}

                        <form onSubmit={handleTransferSubmit} className="space-y-3.5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300">Email Penerima</label>
                                <input
                                    type="email"
                                    placeholder="penerima@email.com"
                                    value={transferForm.recipient_email}
                                    onChange={(e) => setTransferForm({ ...transferForm, recipient_email: e.target.value })}
                                    className="w-full bg-dark-surface border border-dark-border text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/35 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300">Jumlah Transfer (IDR)</label>
                                <input
                                    type="number"
                                    placeholder="Contoh: 10000"
                                    value={transferForm.amount}
                                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                                    className="w-full bg-dark-surface border border-dark-border text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/35 transition-all font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300">Pesan / Catatan</label>
                                <input
                                    type="text"
                                    placeholder="Opsional"
                                    value={transferForm.description}
                                    onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                                    className="w-full bg-dark-surface border border-dark-border text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/35 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={transferLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-650 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {transferLoading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Kirim Uang Sekarang'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}