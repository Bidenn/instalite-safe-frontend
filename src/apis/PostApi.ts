import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/post';

// Helper function to retrieve the token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token'); // Retrieve token stored as 'token' in localStorage
};

interface CreatePostResponse {
    error?: string;
    message?: string;
}

interface ErrorResponse {
    error: string;
}

// Store a new post
export const storePost = async (formData: FormData, token: string): Promise<CreatePostResponse> => {
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.post(`${API_URL}/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`, // Pass the token here
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Post creation failed.' };
    }
};

interface DeletePostResponse {
    error?: string;
    message?: string;
}

// Delete a post (only the poster can delete their post)
export const deletePost = async (postId: string): Promise<DeletePostResponse> => {
    const token = getAuthToken(); // Retrieve token from localStorage
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.delete(`${API_URL}/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Pass the token here
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to delete post.' };
    }
};
