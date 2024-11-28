import React, { useState } from 'react';
import pic4 from '../../assets/images/login/pic4.jpg';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../apis/AuthApi';
import { fetchUserDataWithoutPosts } from '../../../apis/UserApi';

interface FormData {
    UsernameOrEmail: string;
    Password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        UsernameOrEmail: '',
        Password: '',
    });

    const [message, setMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Clear any previous message
    
        console.log('Form submitted with:', formData); // Debug: Log form data
    
        try {
            console.log('Attempting login...'); // Debug: Indicate login attempt
            const loginResponse = await login(formData);
            console.log('Login response:', loginResponse); // Debug: Log login response
    
            if (loginResponse.message === "Login successful" && loginResponse.token) {
                // Save the token to localStorage
                localStorage.setItem('token', loginResponse.token);
    
                const userResponse = await fetchUserDataWithoutPosts(loginResponse.token);
    
                if ('error' in userResponse) {
                    console.error('Error fetching user data:', userResponse.error); // Debug: Log user data fetch error
                    setMessage(userResponse.error || 'Failed to fetch user data.');
                    return;
                }
    
                const username = userResponse.username;
    
                // Navigate based on whether user data exists
                if (username) {
                    console.log('Navigating to /home'); // Debug: Indicate navigation
                    navigate('/home');
                } else {
                    console.log('Navigating to /create-profile'); // Debug: Indicate navigation
                    navigate('/create-profile');
                }
            } else {
                console.warn('Login failed:', loginResponse.error); // Debug: Log login failure
                setMessage(loginResponse.error ?? 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login or fetching user data:', error); // Debug: Catch unexpected errors
            setMessage('An unexpected error occurred. Please try again.');
        }
    };
    

    return (
        <div className="page-wraper">
            <div className="content-body">
                <div className="container vh-100">
                    <div className="welcome-area">
                        <div className="bg-image bg-image-overlay" style={{ backgroundImage: `url(${pic4})` }}></div>
                        <div className="join-area">
                            <div className="started">
                                <h1 className="title">Instalite - Login</h1>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 input-group input-group-icon">
                                    <span className="input-group-text">
                                        <div className="input-icon">
                                            {/* SVG Icon */}
                                        </div>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username or Email"
                                        name="UsernameOrEmail"
                                        value={formData.UsernameOrEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3 input-group input-group-icon">
                                    <span className="input-group-text">
                                        <div className="input-icon">
                                            {/* SVG Icon */}
                                        </div>
                                    </span>
                                    <input
                                        className="form-control dz-password"
                                        type={showPassword ? "text" : "password"}
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                    />
                                    <span 
                                        className="input-group-text show-pass" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-primary`}></i>
                                    </span>
                                </div>
                                {message && <p className="text-danger">{message}</p>}
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block mb-3 btn-rounded"
                                >
                                    Login
                                </button>
                            </form>
                            <div className="d-flex align-items-center justify-content-center">
                                <a href="/register" className="text-light text-center d-block">
                                    Don't have an account?
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
