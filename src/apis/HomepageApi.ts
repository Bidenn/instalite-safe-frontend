import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/homepage`;

interface HomepageResponse {
    loggedUser: {
        username: string;
        profilePhoto: string | null;
    };
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

export const fetchHomepageData = async (token: string): Promise<HomepageResponse | ErrorResponse> => {
    try {
        const response = await axios.get<HomepageResponse>(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to fetch homepage data.' };
    }
};
