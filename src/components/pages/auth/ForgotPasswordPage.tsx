import React, { useState } from 'react';
import { register } from '../../../apis/AuthApi';
import { useNavigate } from 'react-router-dom';
import pic3 from '../../assets/images/login/pic3.jpg';
import CryptoJS from 'crypto-js';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        email: string;
        password: string;
    }>({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string>('');

    const ENCRYPTION_KEY = '2uxSRprNASvGCOIJ62YgcZuhL/J7H5D53OggEHiIcu6N/2s7CjwRzznX3Lvt/LW7'; // Update as needed

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            if (!validatePassword(value)) {
                setPasswordError(
                    'Password must include at least 8 characters, uppercase, lowercase, a number, and a special character.'
                );
            } else {
                setPasswordError('');
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Encrypt the form data
            const encryptedPayload = CryptoJS.AES.encrypt(
                JSON.stringify(formData),
                ENCRYPTION_KEY
            ).toString();
    
            // Call the register API with the encrypted payload
            const response = await register({ encryptedPayload });
    
            if (response.error) {
                setMessage(response.error);
            } else {
                setMessage('Registration successful! Verification email sent.');
                setFormData({ email: '', password: '' });
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('An error occurred while registering.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-body">
            <div className="container vh-100">
                <div className="welcome-area">
                    <div
                        className="bg-image bg-image-overlay"
                        style={{ backgroundImage: `url(${pic3})` }}
                    ></div>
                    <div className="join-area">
                        <div className="started">
                            <h1 className="title">Instalite - Register</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 input-group input-group-icon">
                                <span className="input-group-text">
                                    <div className="input-icon">
                                        <i className="far fa-envelope"></i>
                                    </div>
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {passwordError && (
                                    <small className="text-danger mt-2">{passwordError}</small>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block mb-3 btn-rounded"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                            <p className="text-light text-center">{message}</p>
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
    );
};

export default Register;
