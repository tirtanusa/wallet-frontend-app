import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTransactions } from '../api/transactions'

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([])
    const [pagination, setPagination] = useState(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

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
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)

    const typeLabel = (type) => {
        if (type === 'topup') return { label: 'Top Up', color: 'text-blue-600 bg-blue-100' }
        if (type === 'transfer_out') return { label: 'Transfer Keluar', color: 'text-red-600 bg-red-100' }
        if (type === 'transfer_in') return { label: 'Transfer Masuk', color: 'text-green-600 bg-green-100' }
        return { label: type, color: 'text-gray-600 bg-gray-100' }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-bold text-blue-600">WalletApp</h1>
                <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
                    Kembali ke Dashboard
                </Link>
            </nav>

            <div className="max-w-2xl mx-auto py-8 px-4">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Riwayat Transaksi</h2>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Memuat...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Belum ada transaksi</p>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((trx) => {
                            const { label, color } = typeLabel(trx.type)
                            return (
                                <Link
                                    to={`/transactions/${trx.reference_code}`}
                                    key={trx.id}
                                    className="bg-white rounded-xl shadow px-5 py-4 flex justify-between items-center hover:shadow-md transition"
                                >
                                    <div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
                                            {label}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1">{trx.reference_code}</p>
                                        {trx.description && (
                                            <p className="text-xs text-gray-500 mt-0.5">{trx.description}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold text-sm ${trx.type === 'transfer_out' ? 'text-red-500' : 'text-green-600'}`}>
                                            {trx.type === 'transfer_out' ? '-' : '+'}{formatRupiah(trx.amount)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                        >
                            Sebelumnya
                        </button>
                        <span className="text-sm text-gray-500">
                            {pagination.current_page} / {pagination.last_page}
                        </span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === pagination.last_page}
                            className="px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                        >
                            Berikutnya
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}