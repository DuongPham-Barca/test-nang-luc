import type { ReactNode } from 'react'

interface StatCardProps {
    title: string
    value: number
    icon: ReactNode
    color: 'cyan' | 'amber' | 'green' | 'rose'
}

const colorMap = {
    cyan: 'text-cyan-700 bg-cyan-50',
    amber: 'text-amber-700 bg-amber-50',
    green: 'text-green-700 bg-green-50',
    rose: 'text-rose-700 bg-rose-50',
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
            </div>

            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${colorMap[color]}`}>
                {icon}
            </div>
        </div>
    </div>
)

export default StatCard
