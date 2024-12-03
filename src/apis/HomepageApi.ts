import axios, { AxiosError } from 'axios';

const API_URL = 'http://10.34.4.203:5001/api/homepage'; // Updated API endpoint

interface HomepageResponse {
    loggedUser: {
        username: string;
        profilePhoto: string | null;
    };
    mutualFriends: Array<{
        username: string;
        profilePhoto: string | null;
    }>;
    posts: Array<{
        id: number;
        caption: string;
        content: string;
        createdAt: string;
        username: string;
        profilePhoto: string | null;
    }>;
}

interface ErrorResponse {
    error: string;
}

/**
 * Fetch homepage data, including user details, mutual friends, and posts
 * @param token JWT token for authentication
 * @returns A promise resolving to either HomepageResponse or ErrorResponse
 */
export const fetchHomepageData = async (
    token: string
): Promise<HomepageResponse | ErrorResponse> => {
    try {
        const response = await axios.get<HomepageResponse>(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`, // Include token in the Authorization header
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to fetch homepage data.' };
    }
};
