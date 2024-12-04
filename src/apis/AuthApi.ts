import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/auth`; 

interface RegisterResponse {
    error?: string;
    message?: string;
}

interface LoginResponse {
    token?: string; // Token will replace userId
    message?: string;
    error?: string;
}

interface ErrorResponse {
    error: string;
}

export const register = async (payload: { email: string; password: string }): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(`${API_URL}/register`, payload);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Registration failed.' }; // Use `||` for fallback
    }
};

export const login = async (payload: { usernameOrEmail: string; password: string }): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${API_URL}/login`, payload);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Login failed.' }; // Use `||` for fallback
    }
};

export const logout = async (token: string): Promise<void> => {
    try {
        await axios.post(
            `${API_URL}/logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
