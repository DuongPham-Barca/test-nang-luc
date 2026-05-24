import { useRef, useState } from 'react'
import { generateAIReplies } from '../services/api.service'
import type { AIReplies } from '../types/reviews.interface'

export interface SelectedReply {
    tone: string
    text: string
}

type LoadingMode = 'generate' | 'regenerate' | null

interface CachedAIReplyState {
    replies: AIReplies
    selectedReply: SelectedReply
}

const replyCache = new Map<string, CachedAIReplyState>()
const pendingRequests = new Map<string, Promise<AIReplies>>()

const getAIErrorMessage = (error: unknown) => {
    const apiError = error as {
        response?: {
            status?: number
            data?: {
                retryDelay?: string
            }
        }
    }
    const retryDelay = apiError.response?.data?.retryDelay

    if (apiError.response?.status === 429) {
        return `Gemini đã hết quota. Vui lòng thử lại sau ${retryDelay || 'ít phút'} hoặc kiểm tra billing/quota API key.`
    }

    return 'Không thể sinh câu trả lời AI. Vui lòng thử lại.'
}

export const useAIReplies = (reviewId: string) => {
    const cachedState = replyCache.get(reviewId)
    const [replies, setReplies] = useState<AIReplies | null>(
        cachedState?.replies ?? null,
    )
    const [selectedReply, setSelectedReplyState] = useState<SelectedReply | null>(
        cachedState?.selectedReply ?? null,
    )
    const [error, setError] = useState('')
    const [loadingMode, setLoadingMode] = useState<LoadingMode>(null)
    const activeRequest = useRef<AbortController | null>(null)

    const loading = loadingMode !== null
    const generating = loadingMode === 'generate'
    const regenerating = loadingMode === 'regenerate'

    const saveRepliesToState = (nextReplies: AIReplies) => {
        const firstTone = Object.keys(nextReplies)[0] as keyof AIReplies
        const nextSelectedReply = {
            tone: firstTone,
            text: nextReplies[firstTone],
        }

        replyCache.set(reviewId, {
            replies: nextReplies,
            selectedReply: nextSelectedReply,
        })
        setReplies(nextReplies)
        setSelectedReplyState(nextSelectedReply)
    }

    const setSelectedReply = (reply: SelectedReply) => {
        setSelectedReplyState(reply)

        if (!replies) return

        replyCache.set(reviewId, {
            replies,
            selectedReply: reply,
        })
    }

    const generateReplies = async (force = false) => {
        if (activeRequest.current) return

        const controller = new AbortController()
        activeRequest.current = controller

        setLoadingMode(force ? 'regenerate' : 'generate')
        setError('')

        if (force) {
            replyCache.delete(reviewId)
            setReplies(null)
            setSelectedReplyState(null)
        }

        try {
            const pendingKey = force ? `${reviewId}:force` : reviewId
            let request = pendingRequests.get(pendingKey)

            if (!request) {
                request = generateAIReplies(reviewId, {
                    force,
                    signal: controller.signal,
                }).then((data) => data.replies)

                pendingRequests.set(pendingKey, request)
            }

            const nextReplies = await request

            if (controller.signal.aborted) return

            saveRepliesToState(nextReplies)
        } catch (error: unknown) {
            if (!controller.signal.aborted) {
                console.error(error)
                setError(getAIErrorMessage(error))
            }
        } finally {
            if (activeRequest.current === controller) {
                activeRequest.current = null
                setLoadingMode(null)
            }

            pendingRequests.delete(force ? `${reviewId}:force` : reviewId)
        }
    }

    return {
        replies,
        selectedReply,
        error,
        loading,
        generating,
        regenerating,
        generateReplies,
        setSelectedReply,
    }
}
