import React, { useState } from 'react';
import pic4 from '../../assets/images/login/pic4.jpg';
import { useNavigate } from 'react-router-dom';
import { getResetPassword } from '../../../apis/AuthApi';
import Swal from 'sweetalert2';

interface FormData {
    email: string;
}

const ResetPassword: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ email: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

        if (!formData.email) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please enter your email.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await getResetPassword(formData.email); // Call your reset password API
            Swal.fire({
                icon: 'success',
                title: 'Email Sent',
                text: response.message ?? 'Check your email for reset instructions.',
            });
            navigate('/login'); // Redirect to login after success
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error ?? 'Failed to send reset email. Please try again.',
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
                                            {/* Add SVG Icon here */}
                                        </div>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block mb-3 btn-rounded"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send Email'}
                                </button>
                            </form>
                            <div className="d-flex align-items-center justify-content-center">
                                <a href="/login" className="text-light text-center d-block">
                                    Already have an account?
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
