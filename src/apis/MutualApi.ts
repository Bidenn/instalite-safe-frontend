import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5001/api/mutual';

// Helper function to retrieve the token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token'); // Retrieve token stored as 'token' in localStorage
};

interface APIResponse {
    error?: string;
    message?: string;
}

// Send a follow request to another user
export const sendFollowRequest = async (followedId: string): Promise<APIResponse> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.post(
            `${API_URL}/send`,
            { followedId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { error: err.response?.data?.error || 'Failed to send follow request.' };
    }
};

// View all pending follow requests for the authenticated user
export const viewPendingRequests = async (): Promise<{ requests: any[]; error?: string }> => {
    const token = getAuthToken();
    if (!token) {
        return { requests: [], error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.get(`${API_URL}/pending`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { requests: response.data };
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { requests: [], error: err.response?.data?.error || 'Failed to retrieve pending requests.' };
    }
};

// Accept a follow request from another user
export const acceptFollowRequest = async (followerId: string): Promise<APIResponse> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.put(
            `${API_URL}/accept`,
            { followerId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { error: err.response?.data?.error || 'Failed to accept follow request.' };
    }
};

// Reject a follow request from another user
export const rejectFollowRequest = async (followerId: string): Promise<APIResponse> => {
    const token = getAuthToken();
    if (!token) {
        return { error: 'User is not authenticated. Please log in.' };
    }

    try {
        const response = await axios.delete(`${API_URL}/reject`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { followerId },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { error: err.response?.data?.error || 'Failed to reject follow request.' };
    }
};
