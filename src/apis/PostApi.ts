import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/post`;

// Helper function to retrieve the token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token'); // Retrieve token stored as 'token' in localStorage
};

interface CreatePostResponse {
    error?: string;
    message?: string;
    success?: string;
}

interface ErrorResponse {
    error: string;
}

// Store a new post
export const storePost = async (formData: FormData): Promise<CreatePostResponse> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.post(`${API_URL}/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Post creation failed.' };
    }
};

interface DeletePostResponse {
    error?: string;
    message?: string;
}

// Delete a post
export const deletePost = async (postId: string): Promise<DeletePostResponse> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.delete(`${API_URL}/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to delete post.' };
    }
};

// Get detailed post information
export const getPostDetail = async (postId: string): Promise<{ post?: any; error?: string; logged?: any; comments?:any }> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.get(`${API_URL}/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Should include post details, user profile info, comments, likes, etc.
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to fetch post details.' };
    }
};
