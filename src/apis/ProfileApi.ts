import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/profile'; // Update with your API base URL

const getAuthToken = (): string | null => {
    return localStorage.getItem('token'); // Retrieve token stored as 'token' in localStorage
};

// Fetch profile data for editing
export const fetchProfileDataForEdit = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/edit`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to fetch profile data for editing');
    }
};

// Fetch profile data and posts for profile page
export const fetchProfileWithPosts = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to fetch profile with posts');
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
        throw new Error(error.response?.data?.error || 'Failed to send profile data');
    }
};

// Check username availability
export const checkUsernameAvailability = async (username: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/check-username`, {
            params: { username },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to check username availability');
    }
};
