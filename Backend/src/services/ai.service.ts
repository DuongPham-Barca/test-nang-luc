import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

export interface AIReplies {
    standard: string
    friendly: string
    recovery: string
}

export interface AIProviderError extends Error {
    status?: number
    code?: string
    retryDelay?: string | null
}

interface GeminiErrorDetail {
    retryDelay?: string
}

interface GeminiError extends Error {
    status?: number
    errorDetails?: GeminiErrorDetail[]
}

const createAIProviderError = (
    message: string,
    status?: number,
    code?: string,
    retryDelay?: string | null,
) => {
    const error = new Error(message) as AIProviderError
    error.status = status
    error.code = code
    error.retryDelay = retryDelay

    return error
}

const getRetryDelay = (error: GeminiError) => {
    return error.errorDetails
        ?.find((detail) => detail?.retryDelay)
        ?.retryDelay || null
}

const stripJsonCodeFence = (content: string) => {
    return content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
}

const parseAIReplies = (content: string): AIReplies => {
    const cleanContent = stripJsonCodeFence(content)
    let parsed: unknown

    try {
        parsed = JSON.parse(cleanContent)
    } catch {
        throw createAIProviderError('Gemini returned invalid JSON')
    }

    if (!parsed || typeof parsed !== 'object') {
        throw createAIProviderError('Gemini response is not a JSON object')
    }

    const replies = parsed as Partial<AIReplies>

    if (
        typeof replies.standard !== 'string' ||
        typeof replies.friendly !== 'string' ||
        typeof replies.recovery !== 'string'
    ) {
        throw createAIProviderError('Gemini response does not match expected reply format')
    }

    return {
        standard: replies.standard.trim(),
        friendly: replies.friendly.trim(),
        recovery: replies.recovery.trim(),
    }
}

export const generateAIReplies = async (
    reviewText: string,
): Promise<AIReplies> => {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        throw createAIProviderError('Missing GEMINI_API_KEY', 500, 'missing_api_key')
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash',
        })

        const prompt = `
You are a professional hotel customer support assistant.

Customer review:
"${reviewText}"

Generate exactly 3 Vietnamese responses for this review:
1. standard: professional and concise
2. friendly: warm and personable
3. recovery: apologetic and solution-oriented for negative experiences

Return only valid JSON with this shape:
{
  "standard": "...",
  "friendly": "...",
  "recovery": "..."
}
`

        const result = await model.generateContent(prompt)
        const content = result.response.text()

        return parseAIReplies(content)
    } catch (error) {
        const geminiError = error as GeminiError

        if (geminiError.status === 429) {
            throw createAIProviderError(
                geminiError.message,
                429,
                'GEMINI_QUOTA_EXCEEDED',
                getRetryDelay(geminiError),
            )
        }

        console.error('Gemini Error:', error)

        throw error
    }
}
