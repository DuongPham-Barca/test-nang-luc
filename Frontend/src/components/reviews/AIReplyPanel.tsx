import { Copy, Wand2 } from 'lucide-react'
import type { AIReplies } from '../../types/reviews.interface'
import type { SelectedReply } from '../../hooks/useAIReplies'

interface AIReplyPanelProps {
    replies: AIReplies | null
    selectedReply: SelectedReply | null
    error: string
    loading: boolean
    onGenerateReplies: () => void
    onSelectReply: (reply: SelectedReply) => void
}

const AIReplyPanel = ({
    replies,
    selectedReply,
    error,
    loading,
    onGenerateReplies,
    onSelectReply,
}: AIReplyPanelProps) => (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50/70 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-semibold text-slate-950">
                <Wand2 className="h-4 w-4 text-cyan-700" />
                Trả lời AI
            </h3>

            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-200 bg-white text-slate-500 transition hover:text-slate-900">
                <Copy className="h-4 w-4" />
            </button>
        </div>

        {!replies ? (
            <button
                onClick={onGenerateReplies}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? 'Đang sinh AI...' : 'Sinh AI'}
            </button>
        ) : (
            <div className="space-y-3">
                {Object.entries(replies).map(([tone, text]) => (
                    <button
                        key={tone}
                        onClick={() => onSelectReply({ tone, text })}
                        className={`w-full rounded-lg border p-4 text-left text-sm transition ${selectedReply?.tone === tone
                            ? 'border-cyan-500 bg-white shadow-sm'
                            : 'border-slate-200 bg-white/70 hover:border-cyan-300'
                            }`}
                    >
                        <p className="mb-2 font-semibold capitalize text-cyan-800">
                            {tone}
                        </p>
                        <p className="leading-6 text-slate-700">{text}</p>
                    </button>
                ))}
            </div>
        )}

        {error && (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
            </p>
        )}
    </section>
)

export default AIReplyPanel
