import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5001/api/post';

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
        return { error: err.response?.data?.error || 'Post creation failed.' };
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
        return { error: err.response?.data?.error || 'Failed to delete post.' };
    }
};

// Like a post
export const likePost = async (postId: string): Promise<CreatePostResponse> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.post(`${API_URL}/${postId}/like`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to like post.' };
    }
};

// Unlike a post
export const unlikePost = async (postId: string): Promise<CreatePostResponse> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.delete(`${API_URL}/${postId}/like`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to unlike post.' };
    }
};

// Get the number of likes for a post
export const getPostLikes = async (postId: string): Promise<{ likeCount?: number; error?: string }> => {
    try {
        const response = await axios.get(`${API_URL}/${postId}/likes`);
        return response.data; // Should return { likeCount: number }
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to fetch like count.' };
    }
};

// Comment on a post
export const createComment = async (postId: string, content: string): Promise<{ message?: string; error?: string }> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.post(`${API_URL}/${postId}/comment`, { content }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to create comment.' };
    }
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<{ message?: string; error?: string }> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.delete(`${API_URL}/comment/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to delete comment.' };
    }
};

// Get all comments for a post
export const getPostComments = async (postId: string): Promise<{ comments?: any[]; error?: string }> => {
    try {
        const response = await axios.get(`${API_URL}/${postId}/comment`);
        return response.data; // Should return { comments: array }
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to fetch comments.' };
    }
};

// Get detailed post information
export const getPostDetail = async (postId: string): Promise<{ post?: any; error?: string; isLiked?: any; comments?:any }> => {
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
        return { error: err.response?.data?.error || 'Failed to fetch post details.' };
    }
};
