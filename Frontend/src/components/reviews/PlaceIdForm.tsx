import { Download, Search } from 'lucide-react'

interface PlaceIdFormProps {
    placeId: string
    loading: boolean
    onPlaceIdChange: (placeId: string) => void
    onSubmit: () => void
}

const PlaceIdForm = ({
    placeId,
    loading,
    onPlaceIdChange,
    onSubmit,
}: PlaceIdFormProps) => (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div>
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                        <Download className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-semibold text-slate-950">Nhập Place ID</h2>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-500">
                    Nhập Google Place ID để lấy đánh giá từ Google Maps, sau đó tạo phản hồi AI và duyệt trong cùng một màn hình.
                </p>
            </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={placeId}
                        onChange={(event) => onPlaceIdChange(event.target.value)}
                        placeholder="Nhập Place ID..."
                        className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    />
                </div>

                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Đang lấy...' : 'Lấy reviews'}
                </button>
            </div>
        </div>
    </section>
)

export default PlaceIdForm
