import { Star } from 'lucide-react'

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="mt-2 flex items-center gap-0.5 text-yellow-400">
        {Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${index < rating ? 'fill-yellow-400' : 'fill-slate-200 text-slate-200'}`}
            />
        ))}
    </div>
)

export default RatingStars
