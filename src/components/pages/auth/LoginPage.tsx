import React, { useState } from 'react';
import pic4 from '../../assets/images/login/pic4.jpg';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../apis/AuthApi';
import { fetchProfileDataForEdit } from '../../../apis/ProfileApi';
import Swal from 'sweetalert2';

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
    
        const loginResponse = await login(formData);

        try {
            if (loginResponse.message === "Login successful" && loginResponse.token) {
                localStorage.setItem('token', loginResponse.token);
    
                const userResponse = await fetchProfileDataForEdit(loginResponse.token);
    
                if ('error' in userResponse) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: userResponse.error || 'Failed to fetch user data.',
                    });
                    return;
                }
    
                const username = userResponse.user.username;
    
                if (username) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome back!',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => navigate('/home'));
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'New Account Detected',
                        text: 'Please complete your profile.',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => navigate('/create-profile'));
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: loginResponse.error ?? 'Invalid username or password.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'An unexpected error occurred. Please try again.',
            });
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
