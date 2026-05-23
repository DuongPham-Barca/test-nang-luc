import { useRef, useState } from 'react'
import { generateAIReplies } from '../services/api.service'
import type { AIReplies } from '../types/reviews.interface'

export interface SelectedReply {
    tone: string
    text: string
}

type LoadingMode = 'generate' | 'regenerate' | null

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
    const [replies, setReplies] = useState<AIReplies | null>(null)
    const [selectedReply, setSelectedReply] = useState<SelectedReply | null>(null)
    const [error, setError] = useState('')
    const [loadingMode, setLoadingMode] = useState<LoadingMode>(null)
    const activeRequest = useRef<AbortController | null>(null)

    const loading = loadingMode !== null
    const generating = loadingMode === 'generate'
    const regenerating = loadingMode === 'regenerate'

    const generateReplies = async (force = false) => {
        activeRequest.current?.abort()

        const controller = new AbortController()
        activeRequest.current = controller

        setLoadingMode(force ? 'regenerate' : 'generate')
        setError('')

        if (force) {
            setReplies(null)
            setSelectedReply(null)
        }

        try {
            const data = await generateAIReplies(reviewId, {
                force,
                signal: controller.signal,
            })

            if (controller.signal.aborted) return

            setReplies(data.replies)

            const firstTone = Object.keys(data.replies)[0] as keyof AIReplies

            setSelectedReply({
                tone: firstTone,
                text: data.replies[firstTone],
            })
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