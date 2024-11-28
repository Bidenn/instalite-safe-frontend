import axios, { AxiosResponse, AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/users';

interface UserData {
	profilePhoto?: string;
	username: string;
	fullName: string;
	career?: string;
	aboutMe?: string;
	message?: string;
	error?: string;
}

// API response type (with optional 'posts')
interface UserDataWithPosts extends UserData {
    posts?: any[]; // Optional posts field
}

type FetchResponse = UserDataWithPosts | { error: string };

export const fetchUserDataWithoutPosts = async (token: string): Promise<UserData | { error: string }> => {
	try {
		const response = await axios.get(`${API_URL}/profile/edit`, {
		headers: {
			Authorization: `Bearer ${token}`, // Send token in Authorization header
		},
		});

		return response.data; // Assuming the API returns the user data directly
	} catch (error) {
		const err = error as AxiosError<{ error: string }>;
		return { error: err.response?.data?.error || 'Failed to fetch user data without posts' };
	}
};

export const fetchUserDataWithPosts = async (token: string): Promise<FetchResponse> => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
        });

        return response.data; // This should return UserDataWithPosts or an error
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { error: err.response?.data?.error || 'Failed to fetch user data with posts' };
    }
};


export const updateUserData = async (token: string, formData: FormData): Promise<UserData | { error: string }> => {
	try {
		const response: AxiosResponse<UserData> = await axios.put(`${API_URL}/profile/update`, formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'multipart/form-data', // Required for file upload
		},
		});

		return response.data; // Assuming the API returns the updated user data
	} catch (error) {
		const err = error as AxiosError<{ error: string }>;
		return { error: err.response?.data?.error || 'Failed to update user data' };
	}
};

export const checkUsernameAvailability = async (username: string): Promise<{ available: boolean; error?: string }> => {
	try {
		const response = await axios.get(`${API_URL}/username/check`, {
		params: { username }, // Send username as a query parameter
		});

		return { available: response.data.available }; // Assuming `available` is returned
	} catch (error) {
		const err = error as AxiosError<{ error: string }>;
		return { available: false, error: err.response?.data?.error || 'Error checking username' };
	}
};
