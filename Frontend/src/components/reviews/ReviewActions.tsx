import type { SelectedReply } from '../../hooks/useAIReplies'

interface ReviewActionsProps {
    regenerating: boolean
    approving: boolean
    selectedReply: SelectedReply | null
    onApprove: () => void
    onRegenerate: () => void
}

const ReviewActions = ({
    regenerating,
    approving,
    selectedReply,
    onApprove,
    onRegenerate,
}: ReviewActionsProps) => (
    <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
        <button
            onClick={onApprove}
            disabled={!selectedReply || approving || regenerating}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-green-600 px-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {approving ? 'Đang duyệt...' : 'Duyệt'}
        </button>

        <button
            onClick={onRegenerate}
            disabled={approving || regenerating}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 px-4 font-semibold text-cyan-700 transition hover:border-cyan-200 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {regenerating ? 'Đang sinh lại...' : 'Sinh lại'}
        </button>
    </div>
)

export default ReviewActions