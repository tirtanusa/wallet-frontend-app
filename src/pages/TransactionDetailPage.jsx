import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTransactionDetail } from '../api/transactions'

export default function TransactionDetailPage() {
    const { reference_code } = useParams()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getTransactionDetail(reference_code)
                // response bisa array (2 row) atau single object
                const data = res.data.data
                setTransactions(Array.isArray(data) ? data : [data])
            } catch (err) {
                setError(err.response?.data?.message || 'Transaksi tidak ditemukan')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [reference_code])

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
                <Link to="/transactions" className="text-sm text-blue-600 hover:underline">
                    Kembali ke Riwayat
                </Link>
            </nav>

            <div className="max-w-2xl mx-auto py-8 px-4">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Detail Transaksi</h2>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Memuat...</p>
                ) : error ? (
                    <div className="bg-red-100 text-red-600 text-sm p-4 rounded-xl">{error}</div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((trx) => {
                            const { label, color } = typeLabel(trx.type)
                            return (
                                <div key={trx.id} className="bg-white rounded-xl shadow p-6 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
                                            {label}
                                        </span>
                                        <p className="text-xs text-gray-400">{trx.reference_code}</p>
                                    </div>

                                    <div className="border-t pt-3 space-y-2">
                                        <Row label="Jumlah" value={formatRupiah(trx.amount)} />
                                        <Row label="Saldo Sebelum" value={formatRupiah(trx.balance_before)} />
                                        <Row label="Saldo Sesudah" value={formatRupiah(trx.balance_after)} />
                                        {trx.description && <Row label="Deskripsi" value={trx.description} />}
                                        {trx.related_wallet && (
                                            <Row label="Pihak Lain" value={trx.related_wallet.user?.name ?? '-'} />
                                        )}
                                        <Row
                                            label="Tanggal"
                                            value={new Date(trx.created_at).toLocaleString('id-ID')}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-700">{value}</span>
        </div>
    )
}