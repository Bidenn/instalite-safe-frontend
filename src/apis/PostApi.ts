import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/post`;

const getAuthToken = (): string | null => {
    return localStorage.getItem('token'); 
};

interface CreatePostResponse {
    error?: string;
    message?: string;
    success?: string;
}

interface ErrorResponse {
    error: string;
}

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

export const detailPost = async (postId: string) => {
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
        return response.data; 
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to fetch post details.' };
    }
};

export const toggleLikePost = async (postId: string) => {
    try {
        const token = getAuthToken();
        const response = await axios.post(`${API_URL}/toggle-like`, 
            { postId },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        );
        return response.data;
    } catch (error: any) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to like post.' };
    }
};

export const storeComment = async (postId: string, comment: string) => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.post(`${API_URL}/${postId}/comment`,
            { postId, comment },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        );
        return response.data;
    } catch (error: any) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to add comment.' };
    }
};


export const deleteComment = async (commentId: string) => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.delete(`${API_URL}/comment/${commentId}`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        );
        return response.data;
    } catch (error: any) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to delete comment.' };
    }
};