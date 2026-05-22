import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()
const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY as string
)

export const generateAIReplies = async (
    reviewText: string
) => {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash',
        })

        const prompt = `
      You are a professional hotel customer support assistant.

      Customer review:
      "${reviewText}"

      Generate 3 responses:

      1. standard
      2. friendly
      3. recovery

      Return ONLY valid JSON:

      {
        "standard": "...",
        "friendly": "...",
        "recovery": "..."
      }
    `

        const result = await model.generateContent(prompt)

        const response = result.response

        const text = response.text()

        // Gemini đôi khi trả markdown
        const cleanText = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()

        return JSON.parse(cleanText)
    } catch (error) {
        console.error('Gemini Error:', error)

        throw error
    }
}