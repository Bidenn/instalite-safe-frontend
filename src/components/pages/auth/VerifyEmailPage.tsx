import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { verifyEmail } from '../../../apis/AuthApi';

const VerifyEmail: React.FC = () => {
    const { encodedToken } = useParams<{ encodedToken: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const verifyEmailPayload = async () => {
            if (!encodedToken) {
                setStatus('error');
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Request',
                    text: 'No payload provided. Please check your email and try again.',
                });
                return;
            }

            try {
                const response = await verifyEmail(encodedToken);

                if (response.success = true) {
                    setStatus('success');
                    Swal.fire({
                        icon: 'success',
                        title: 'Email Verified!',
                        text: 'Your email has been successfully verified. You can now log in.',
                        timer: 3000,
                    });

                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    Swal.fire({
                        icon: 'error',
                        title: 'Verification Failed',
                        text: response.error || 'Something went wrong. Please try again later.',
                    });
                }
            } catch (error) {
                console.error('Verification error:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: 'An error occurred during verification. Please try again later.',
                });
                setStatus('error');
            }
        };

        verifyEmailPayload();
    }, [encodedToken, navigate]);

    return (
        <div className="verify-email-page">
            <h1 className="title text-center">
                {status === 'loading'
                    ? 'Verifying Email...'
                    : status === 'success'
                    ? 'Verification Successful'
                    : 'Verification Failed'}
            </h1>
        </div>
    );
};

export default VerifyEmail;
