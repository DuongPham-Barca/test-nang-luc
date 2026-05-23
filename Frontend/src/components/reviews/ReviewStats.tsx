import {
    CheckCircle,
    Clock,
    MessageSquare,
    Star,
    XCircle,
} from 'lucide-react'
import StatCard from '../StatCard'
import type { Review } from '../../types/reviews.interface'

interface ReviewStatsProps {
    reviews: Review[]
}

const ReviewStats = ({ reviews }: ReviewStatsProps) => {
    const pending = reviews.filter((review) => review.status === 'pending').length
    const resolved = reviews.filter((review) => review.status === 'resolved').length
    const rejected = reviews.filter((review) => review.status === 'rejected').length
    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : '0.0'

    return (
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Tổng reviews" value={reviews.length} icon={<MessageSquare />} color="cyan" />
            <StatCard title="Chờ duyệt" value={pending} icon={<Clock />} color="amber" />
            <StatCard title="Đã duyệt" value={resolved} icon={<CheckCircle />} color="green" />
            <StatCard title="Bị từ chối" value={rejected} icon={<XCircle />} color="rose" />

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                <div className="flex h-full items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
                        <Star className="h-6 w-6 fill-yellow-400" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-500">Điểm trung bình</p>
                        <p className="mt-1 text-3xl font-bold text-slate-950">
                            {averageRating}
                            <span className="text-base font-medium text-slate-400"> /5.0</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReviewStats
