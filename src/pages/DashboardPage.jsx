import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getWallet, topUp, transfer } from '../api/wallet'

export default function DashboardPage() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const [wallet, setWallet] = useState(null)
    const [loading, setLoading] = useState(true)

    const [topUpForm, setTopUpForm] = useState({ amount: '', description: '' })
    const [transferForm, setTransferForm] = useState({ recipient_email: '', amount: '', description: '' })

    const [topUpError, setTopUpError] = useState(null)
    const [transferError, setTransferError] = useState(null)
    const [topUpSuccess, setTopUpSuccess] = useState(null)
    const [transferSuccess, setTransferSuccess] = useState(null)

    const [topUpLoading, setTopUpLoading] = useState(false)
    const [transferLoading, setTransferLoading] = useState(false)

    const fetchWallet = async () => {
        try {
            const res = await getWallet()
            setWallet(res.data.data)
        } catch {
            setWallet(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWallet()
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const handleTopUp = async (e) => {
        e.preventDefault()
        setTopUpError(null)
        setTopUpSuccess(null)
        setTopUpLoading(true)
        try {
            const res = await topUp(topUpForm)
            setTopUpSuccess(res.data.message || 'Top up berhasil')
            setTopUpForm({ amount: '', description: '' })
            fetchWallet()
        } catch (err) {
            setTopUpError(err.response?.data?.message || 'Top up gagal')
        } finally {
            setTopUpLoading(false)
        }
    }

    const handleTransfer = async (e) => {
        e.preventDefault()
        setTransferError(null)
        setTransferSuccess(null)
        setTransferLoading(true)
        try {
            const res = await transfer(transferForm)
            setTransferSuccess(res.data.message || 'Transfer berhasil')
            setTransferForm({ recipient_email: '', amount: '', description: '' })
            fetchWallet()
        } catch (err) {
            setTransferError(err.response?.data?.message || 'Transfer gagal')
        } finally {
            setTransferLoading(false)
        }
    }

    const formatRupiah = (amount) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-bold text-blue-600">WalletApp</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.name}</span>
                    <Link to="/transactions" className="text-sm text-blue-600 hover:underline">
                        Riwayat
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
                {/* Saldo */}
                <div className="bg-blue-600 text-white rounded-xl p-6">
                    <p className="text-sm opacity-80">Saldo Kamu</p>
                    {loading ? (
                        <p className="text-3xl font-bold mt-1">Memuat...</p>
                    ) : (
                        <p className="text-3xl font-bold mt-1">{formatRupiah(wallet?.balance ?? 0)}</p>
                    )}
                    <p className="text-xs opacity-60 mt-1">{wallet?.currency ?? 'IDR'}</p>
                </div>

                {/* Top Up */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 mb-4">Top Up</h2>

                    {topUpError && (
                        <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-3">{topUpError}</div>
                    )}
                    {topUpSuccess && (
                        <div className="bg-green-100 text-green-600 text-sm p-3 rounded mb-3">{topUpSuccess}</div>
                    )}

                    <form onSubmit={handleTopUp} className="space-y-3">
                        <input
                            type="number"
                            placeholder="Jumlah (IDR)"
                            value={topUpForm.amount}
                            onChange={(e) => setTopUpForm({ ...topUpForm, amount: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Deskripsi (opsional)"
                            value={topUpForm.description}
                            onChange={(e) => setTopUpForm({ ...topUpForm, description: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={topUpLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {topUpLoading ? 'Memproses...' : 'Top Up'}
                        </button>
                    </form>
                </div>

                {/* Transfer */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 mb-4">Transfer</h2>

                    {transferError && (
                        <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-3">{transferError}</div>
                    )}
                    {transferSuccess && (
                        <div className="bg-green-100 text-green-600 text-sm p-3 rounded mb-3">{transferSuccess}</div>
                    )}

                    <form onSubmit={handleTransfer} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email penerima"
                            value={transferForm.recipient_email}
                            onChange={(e) => setTransferForm({ ...transferForm, recipient_email: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Jumlah (IDR)"
                            value={transferForm.amount}
                            onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Deskripsi (opsional)"
                            value={transferForm.description}
                            onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={transferLoading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                            {transferLoading ? 'Memproses...' : 'Transfer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}