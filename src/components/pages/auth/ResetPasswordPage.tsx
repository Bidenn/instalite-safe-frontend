import React, { useState } from 'react';
import pic4 from '../../assets/images/login/pic4.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { storeResetPassword } from '../../../apis/AuthApi';
import Swal from 'sweetalert2';

interface FormData {
    password: string;
    confirmPassword: string;
}

const ResetPassword: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>(); // Token from URL

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { password, confirmPassword } = formData;

        if (!password || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please fill in all fields.',
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match. Please try again.',
            });
            return;
        }

        if (!validatePassword(password)) {
            Swal.fire({
                icon: 'warning',
                title: 'Weak Password',
                text: 'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await storeResetPassword(token || '', password); // API call with token and password
            Swal.fire({
                icon: 'success',
                title: 'Password Reset Successful',
                text: response.message || 'You can now log in with your new password.',
            });
            navigate('/login');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Failed to reset password. Please try again.',
            });
        } finally {
            setIsLoading(false);
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
                                <h1 className="title">Instalite - Reset Password</h1>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 input-group input-group-icon">
                                    <span className="input-group-text">
                                        <div className="input-icon">
                                            <i className="fas fa-lock"></i>
                                        </div>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control dz-password"
                                        placeholder="New Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3 input-group input-group-icon">
                                    <span className="input-group-text">
                                        <div className="input-icon">
                                            <i className="fas fa-lock"></i>
                                        </div>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control dz-password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block mb-3 btn-rounded"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Processing...' : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
