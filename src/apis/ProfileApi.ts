import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/profile'; // Update with your API base URL

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
export const updateProfileData = async (
    token: string,
    profileData: {
        username?: string;
        fullName?: string;
        bio?: string;
        career?: string;
        profilePhoto?: File | null; // Optional profile photo
    }
) => {
    try {
        const formData = new FormData();
        if (profileData.username) formData.append('username', profileData.username);
        if (profileData.fullName) formData.append('fullName', profileData.fullName);
        if (profileData.bio) formData.append('bio', profileData.bio);
        if (profileData.career) formData.append('career', profileData.career);
        if (profileData.profilePhoto) formData.append('profilePhoto', profileData.profilePhoto);

        const response = await axios.put(`${API_BASE_URL}/update`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to update profile');
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
