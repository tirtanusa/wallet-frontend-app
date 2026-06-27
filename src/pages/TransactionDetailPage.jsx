import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTransactionDetail } from '../api/transactions'
import { ChevronLeft, Download, Calendar, CheckCircle2, AlertCircle, RefreshCw, Wallet, FileText } from 'lucide-react'

export default function TransactionDetailPage() {
    const { reference_code } = useParams()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getTransactionDetail(reference_code)
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
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)

    const getTrxTypeLabel = (type) => {
        if (type === 'topup') return 'Top Up'
        if (type === 'transfer_out') return 'Transfer Keluar'
        if (type === 'transfer_in') return 'Transfer Masuk'
        return type
    }

    const downloadReceipt = (trx) => {
        const textContent = `
=========================================
            PRECISION FINANCE
            BUKTI TRANSAKSI
=========================================
Waktu Transaksi : ${new Date(trx.created_at).toLocaleString('id-ID')}
ID Referensi    : ${trx.reference_code}
Kategori        : ${getTrxTypeLabel(trx.type)}
Metode          : Precision E-Wallet
Deskripsi       : ${trx.description || '-'}

Pihak Terkait   : ${trx.related_wallet?.user?.name || '-'}
Email Terkait   : ${trx.related_wallet?.user?.email || '-'}

-----------------------------------------
Jumlah Nominal  : ${formatRupiah(trx.amount)}
Status          : BERHASIL (SUCCESS)
-----------------------------------------

Simpan struk ini sebagai bukti transaksi 
yang sah dari Precision Finance.
=========================================
`;
        const element = document.createElement("a")
        const file = new Blob([textContent], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `Receipt-${trx.reference_code}.txt`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return (
        <div className="flex flex-col min-h-full pb-8 animate-slide-up">
            {/* Navbar */}
            <nav className="px-6 py-4 flex items-center gap-4 border-b border-dark-border/40 bg-dark-bg/85 backdrop-blur-md sticky top-0 z-30">
                <Link
                    to="/transactions"
                    className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-dark-text-muted hover:text-white transition-all active:scale-95"
                >
                    <ChevronLeft size={18} />
                </Link>
                <div>
                    <p className="text-[10px] text-dark-text-muted">Kembali ke Riwayat</p>
                    <h1 className="text-xs font-bold text-white uppercase tracking-wider -mt-0.5">Detail Transaksi</h1>
                </div>
            </nav>

            <div className="px-6 py-6 space-y-6">
                {loading ? (
                    <div className="h-64 bg-dark-card border border-dark-border rounded-xl animate-pulse shimmer"></div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {transactions.map((trx) => (
                            <div key={trx.id} className="relative bg-dark-card rounded-2xl p-6 shadow-xl space-y-6 overflow-hidden">
                                {/* Decorative circle cuts simulating physical receipt tickets */}
                                <div className="absolute -left-3 top-1/3 w-6 h-6 rounded-full bg-[#040508] border-r border-dark-border"></div>
                                <div className="absolute -right-3 top-1/3 w-6 h-6 rounded-full bg-[#040508] border-l border-dark-border"></div>

                                {/* Receipt Header */}
                                <div className="text-center space-y-2">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Transaksi Berhasil</h3>
                                        <p className="text-xs text-dark-text-muted mt-0.5 font-mono">{trx.reference_code}</p>
                                    </div>
                                </div>

                                {/* Large Amount Display */}
                                <div className="text-center bg-dark-surface/50 border border-dark-border/60 py-5 rounded-xl">
                                    <p className="text-[10px] text-dark-text-muted uppercase tracking-wider font-semibold">Jumlah Nominal</p>
                                    <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1 font-mono">
                                        {formatRupiah(trx.amount)}
                                    </h2>
                                </div>

                                {/* Transaction Details Table */}
                                <div className="space-y-4 pt-2">
                                    <h4 className="text-[10px] font-bold text-dark-text-muted uppercase tracking-wider border-b border-dark-border/40 pb-1.5">Informasi Pembayaran</h4>

                                    <div className="space-y-2.5">
                                        <Row label="Kategori" value={getTrxTypeLabel(trx.type)} />
                                        <Row label="Metode Pembayaran" value="Precision Wallet" />
                                        <Row
                                            label="Waktu Transaksi"
                                            value={new Date(trx.created_at).toLocaleString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        />
                                        <Row label="Saldo Sebelum" value={formatRupiah(trx.balance_before)} />
                                        <Row label="Saldo Sesudah" value={formatRupiah(trx.balance_after)} />
                                        {trx.description && <Row label="Deskripsi" value={trx.description} />}

                                        {trx.related_wallet && (
                                            <div className="border-t border-dark-border/30 pt-2.5 mt-2.5">
                                                <Row label="Pihak Penerima/Pengirim" value={trx.related_wallet.user?.name ?? '-'} />
                                                <Row label="Email Terkait" value={trx.related_wallet.user?.email ?? '-'} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Download Receipt Actions */}
                                <button
                                    onClick={() => downloadReceipt(trx)}
                                    className="w-full bg-brand text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border border-brand/20 shadow-[0_4px_12px_rgba(46,91,255,0.15)]"
                                >
                                    <Download size={14} />
                                    <span>Download Receipt</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between items-start text-xs">
            <span className="text-dark-text-muted">{label}</span>
            <span className="font-semibold text-white text-right max-w-[60%] truncate font-sans">{value}</span>
        </div>
    )
}