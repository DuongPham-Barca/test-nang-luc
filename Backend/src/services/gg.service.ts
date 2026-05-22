import axios from 'axios'
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

    const response = await axios.get(url, {
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

