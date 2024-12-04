import axios from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_BASE_URL = `${apiUrl}/api/profile`; // Update with your API base URL

const getAuthToken = (): string | null => {
    return localStorage.getItem('token'); // Retrieve token stored as 'token' in localStorage
};

// Fetch profile data for editing
export const fetchProfileDataForEdit = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/edit`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to fetch profile data for editing');
    }
};

// Fetch profile data and posts for profile page
export const fetchProfileWithPosts = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to fetch profile with posts');
    }
};

// Update user profile data
export const updateProfileData = async (formData: FormData) => {
    try {
        const token = getAuthToken();

        const response = await axios.put(`${API_BASE_URL}/update`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to send profile data');
    }
};

// Check username availability
export const checkUsernameAvailability = async (username: string) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/check-username`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { username },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to check username availability');
    }
};

// Fetch public profile data and posts for profile page
export const fetchPublicProfileWithPosts = async (username: string) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/public/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to fetch profile with posts');
    }
};

export const searchUsername = async (username: string) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/search/${username}`, {
            params: { username },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to search for username');
    }
};


