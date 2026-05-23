import { CheckCircle, Clock, XCircle } from 'lucide-react'
import type { ReviewStatus } from '../types/reviews.interface'

export const getStatusMeta = (status: ReviewStatus) => {
    if (status === 'resolved') {
        return {
            label: 'Đã duyệt',
            badgeClass: 'bg-green-50 text-green-700',
            softClass: 'bg-green-50 text-green-700',
            icon: <CheckCircle className="h-4 w-4" />,
            smallIcon: <CheckCircle className="h-3.5 w-3.5" />,
        }
    }

    if (status === 'rejected') {
        return {
            label: 'Từ chối',
            badgeClass: 'bg-rose-50 text-rose-700',
            softClass: 'bg-rose-50 text-rose-700',
            icon: <XCircle className="h-4 w-4" />,
            smallIcon: <XCircle className="h-3.5 w-3.5" />,
        }
    }

    return {
        label: 'Chờ duyệt',
        badgeClass: 'bg-amber-50 text-amber-700',
        softClass: 'bg-amber-50 text-amber-700',
        icon: <Clock className="h-4 w-4" />,
        smallIcon: <Clock className="h-3.5 w-3.5" />,
    }
}
