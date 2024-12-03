import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

interface RegisterResponse {
    error?: string;
    message?: string;
}

interface LoginResponse {
    token?: string; // Token will replace userId
    message?: string;
    error?: string;
}

interface VerifyResponse {
    success: boolean;
    message: string;
    error?: string;
}

interface ErrorResponse {
    error: string;
}

// Register
export const register = async (payload: { email: string; password: string }): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(`${API_URL}/register`, payload);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Registration failed.' };
    }
};

// Login
export const login = async (payload: { UsernameOrEmail: string; Password: string }): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${API_URL}/login`, payload);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { error: err.response?.data?.error || 'Login failed.' };
    }
};

// Logout
export const logout = async (token: string): Promise<void> => {
    try {
        await axios.post(`${API_URL}/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

// Email Verification
export const verifyEmail = async (encodedToken: string): Promise<VerifyResponse> => {
    try {
        const response = await axios.get(`${API_URL}/verify-email`, { params: { encodedToken } });
        return { success: true, message: response.data.message };
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { success: false, message: err.response?.data?.error || 'Email verification failed.' };
    }
};

// Request Reset Password
export const getResetPassword = async (email: string): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { email });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to send reset password email.' };
    }
};

// Store Reset Password
export const storeResetPassword = async (token: string, newPassword: string): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(`${API_URL}/reset-password/confirm`, { token, newPassword });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error || 'Failed to reset password.' };
    }
};

// Token Validation (optional - not in the backend routes provided)
export const validateToken = async (token: string): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_URL}/validate-token`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status === 200;
    } catch {
        return false;
    }
};
