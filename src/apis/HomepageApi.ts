import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/home'; // Your API endpoint

interface HomepageResponse {
  message: string;
  posts: any[];
  loggedUser: string;
}

interface ErrorResponse {
  error: string;
}

// Update the function to include token-based authentication
export const fetchHomepagePosts = async (token: string): Promise<HomepageResponse | ErrorResponse> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    return { error: err.response?.data?.error || 'Failed to fetch posts.' };
  }
};
