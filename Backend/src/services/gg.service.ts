import axios from 'axios'

export interface GooglePlaceError extends Error {
    status?: number
    code?: string
}

const createGooglePlaceError = (
    message: string,
    status?: number,
    code?: string,
) => {
    const error = new Error(message) as GooglePlaceError
    error.status = status
    error.code = code

    return error
}

interface GoogleReview {
    name?: string
    relativePublishTimeDescription?: string
    rating?: number
    text?: {
        text?: string
        languageCode?: string
    }
    publishTime?: string
    authorAttribution?: {
        displayName?: string
        uri?: string
        photoUri?: string
    }
}

export const fetchGooglePlaceReviews = async (placeId: string) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
        throw new Error('Missing GOOGLE_MAPS_API_KEY')
    }

    const url = `https://places.googleapis.com/v1/places/${placeId}`

    let response

    try {
        response = await axios.get(url, {
            headers: {
                'X-Goog-Api-Key': apiKey,

                'X-Goog-FieldMask':
                    'id,displayName,rating,reviews',

                'Accept-Language': 'vi',
            },

            params: {
                languageCode: 'vi',
                regionCode: 'VN',
            },
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw createGooglePlaceError(
                'Place ID not found',
                404,
                'PLACE_NOT_FOUND',
            )
        }

        throw error
    }

    const place = response.data

    const reviews = (place.reviews || []) as GoogleReview[]

    return reviews.map((review) => ({
        placeId,
        placeName: place.displayName?.text || '',
        authorName:
            review.authorAttribution?.displayName || 'Anonymous',
        rating: review.rating || 0,
        reviewText: review.text?.text || '',
        reviewTime: review.publishTime || null,
        status: 'pending',
        createdAt: new Date(),
    }))
}

