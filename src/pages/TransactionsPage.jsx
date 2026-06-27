import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTransactions } from '../api/transactions'
import { ChevronLeft, Search, Calendar, Plus, ArrowUpRight, ArrowDownLeft, SlidersHorizontal } from 'lucide-react'

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([])
    const [pagination, setPagination] = useState(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('all') // 'all', 'topup', 'transfer_out', 'transfer_in'

    const fetchTransactions = async (p) => {
        setLoading(true)
        try {
            const res = await getTransactions(p)
            setTransactions(res.data.data)
            setPagination(res.data.meta)
        } catch {
            setTransactions([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions(page)
    }, [page])

    const formatRupiah = (amount) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)

    const getTrxTypeDetails = (type) => {
        if (type === 'topup') return { label: 'Top Up', icon: <Plus size={14} className="text-blue-400" />, bg: 'bg-blue-500/10 border border-blue-500/20 text-blue-400' }
        if (type === 'transfer_out') return { label: 'Transfer Keluar', icon: <ArrowUpRight size={14} className="text-red-400" />, bg: 'bg-red-500/10 border border-red-500/20 text-red-400' }
        return { label: 'Transfer Masuk', icon: <ArrowDownLeft size={14} className="text-green-400" />, bg: 'bg-green-500/10 border border-green-500/20 text-green-400' }
    }

    // Client-side filtering on top of fetched page transactions
    const filteredTransactions = transactions.filter((trx) => {
        const matchesSearch = 
            trx.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trx.description && trx.description.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesType = selectedType === 'all' || trx.type === selectedType

        return matchesSearch && matchesType
    })

    return (
        <div className="flex flex-col min-h-full pb-8 animate-slide-up">
            {/* Navbar */}
            <nav className="px-6 py-4 flex items-center gap-4 border-b border-dark-border/40 bg-dark-bg/85 backdrop-blur-md sticky top-0 z-30">
                <Link 
                    to="/dashboard" 
                    className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-dark-text-muted hover:text-white transition-all active:scale-95"
                >
                    <ChevronLeft size={18} />
                </Link>
                <div>
                    <p className="text-[10px] text-dark-text-muted">Kembali ke Beranda</p>
                    <h1 className="text-xs font-bold text-white uppercase tracking-wider -mt-0.5">Riwayat Transaksi</h1>
                </div>
            </nav>

            <div className="px-6 py-6 space-y-5">
                {/* Search & Filter UI */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-text-muted" />
                        <input
                            type="text"
                            placeholder="Cari referensi atau deskripsi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-card border border-dark-border text-white rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/35 transition-all placeholder:text-gray-600 shadow-inner"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        <span className="text-dark-text-muted p-1 text-[10px] uppercase font-bold shrink-0 flex items-center gap-1 mr-1">
                            <SlidersHorizontal size={11} />
                            Filter:
                        </span>
                        {[
                            { value: 'all', label: 'Semua' },
                            { value: 'topup', label: 'Top Up' },
                            { value: 'transfer_out', label: 'Keluar' },
                            { value: 'transfer_in', label: 'Masuk' },
                        ].map((pill) => (
                            <button
                                key={pill.value}
                                onClick={() => setSelectedType(pill.value)}
                                className={`text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                                    selectedType === pill.value
                                        ? 'bg-brand text-white shadow-sm shadow-brand/20'
                                        : 'bg-dark-card border border-dark-border text-dark-text-muted hover:text-white'
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-dark-card/50 border border-dark-border rounded-xl animate-pulse shimmer"></div>
                        ))}
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="glass-card p-10 rounded-xl text-center space-y-2 border border-dark-border/40">
                        <p className="text-xs text-dark-text-muted">Tidak ada transaksi yang cocok</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredTransactions.map((trx) => {
                            const { label, icon, bg } = getTrxTypeDetails(trx.type)
                            return (
                                <Link
                                    to={`/transactions/${trx.reference_code}`}
                                    key={trx.id}
                                    className="flex items-center justify-between p-4 bg-dark-card/50 hover:bg-dark-card border border-dark-border hover:border-dark-border/80 rounded-xl transition-all active:scale-[0.99] group shadow-sm shadow-black/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                                            {icon}
                                        </div>
                                        <div>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${bg}`}>
                                                {label}
                                            </span>
                                            <p className="text-xs font-semibold text-white mt-1 group-hover:text-brand transition-colors">
                                                {trx.description || 'Transaksi Tanpa Deskripsi'}
                                            </p>
                                            <p className="text-[10px] text-dark-text-muted font-mono mt-0.5">{trx.reference_code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-bold font-mono ${trx.type === 'transfer_out' ? 'text-red-400' : 'text-green-400'}`}>
                                            {trx.type === 'transfer_out' ? '-' : '+'}{formatRupiah(trx.amount)}
                                        </p>
                                        <div className="flex items-center gap-1 text-[9px] text-dark-text-muted mt-1 justify-end">
                                            <Calendar size={10} />
                                            <span>
                                                {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-between items-center bg-dark-card border border-dark-border p-2.5 rounded-xl mt-6">
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-3 py-1.5 text-[11px] font-bold bg-dark-surface border border-dark-border rounded-lg disabled:opacity-40 hover:bg-dark-surface/80 text-white cursor-pointer active:scale-95 transition-all"
                        >
                            Sebelumnya
                        </button>
                        <span className="text-xs font-semibold text-dark-text-muted font-mono">
                            Hal {pagination.current_page} / {pagination.last_page}
                        </span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === pagination.last_page}
                            className="px-3 py-1.5 text-[11px] font-bold bg-dark-surface border border-dark-border rounded-lg disabled:opacity-40 hover:bg-dark-surface/80 text-white cursor-pointer active:scale-95 transition-all"
                        >
                            Berikutnya
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}