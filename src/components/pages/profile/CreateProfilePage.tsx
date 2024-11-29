import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { fetchUserDataWithoutPosts, updateUserData, checkUsernameAvailability } from '../../../apis/UserApi'; // Adjust the path accordingly
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import { useNavigate } from 'react-router-dom';

const CreateProfile: React.FC<{ token: string }> = ({ token }) => {
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [career, setCareer] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null); // for profile photo upload
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview state

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await fetchUserDataWithoutPosts(token);
                if ('error' in result) {
                    // Handle error response
                    setError(result.error || null);
                } else {
                    // Type-safe access to properties
                    setUsername(result.username);
                    setFullName(result.fullName);
                    setBio(result.aboutMe || '');
                    setCareer(result.career || '');
                }
            } catch (err) {
                setError('Failed to fetch user data');
            }
        };
        fetchProfile();
    }, [token]);

    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Convert input to lowercase
        const value = e.target.value.toLowerCase();
    
        // Validate that the username only contains allowed characters
        const isValid = /^[a-z0-9._]*$/.test(value); // Adjusted regex to lowercase only
        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Username',
                text: 'Username can only contain lowercase alphabets, numbers, dots, and underscores.',
            });
            return; // Prevent further processing
        }
    
        setUsername(value);
    
        if (value.length > 2) {
            const result = await checkUsernameAvailability(value);
            setIsAvailable(result.available);
        } else {
            setIsAvailable(null);
        }
    };

    const handleChangeProfilePhoto = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePhoto(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username is required',
            });
            return;
        }

        // Prepare form data for profile update
        const formData = new FormData();
        formData.append('username', username);
        formData.append('fullName', fullName);
        formData.append('bio', bio);
        formData.append('career', career);
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        }

        try {
            const result = await updateUserData(formData);
            if (result.error) throw new Error(result.error);

            // SweetAlert success notification
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile has been updated successfully!',
                confirmButtonText: 'Go to Profile',
            }).then(() => navigate('/profile')); // Navigate after success
        } catch (err: unknown) {
            if (err instanceof Error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Failed to update profile',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unknown Error',
                    text: 'An unknown error occurred',
                });
            }
        }
    };

    return (
        <div className="page-wraper header-fixed">
            <header className="header bg-white">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            {/* <a href="#" className="back-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </a> */}
                            <h4 className="title mb-0">Create Profile</h4>
                        </div>
                        <div className="mid-content"></div>
                        <div className="right-content">
                            {/* <a href="#" className="text-dark font-20">
                                <i className="fa-solid fa-check"></i>
                            </a> */}
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-content">
                <div className="container">
                    <div className="edit-profile">
                        <div className="profile-image">
                            <div className="media media-100 rounded-circle">
                                <img src={imagePreview || nullPhoto} alt="Profile" />
                            </div>
                            <a href="javascript:void(0);" onClick={handleChangeProfilePhoto}>Change profile photo</a>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3 input-group input-mini">
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </div>
                            {isAvailable === null ? null : isAvailable ? (
                                    <span style={{ color: 'green' }}>Username is available</span>
                                ) : (
                                    <span style={{ color: 'red' }}>Username is taken</span>
                                )}
                            <div className="mb-3 input-group input-mini">
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 input-group input-mini">
                                <input
                                    type="text"
                                    name="career"
                                    className="form-control"
                                    placeholder="Career"
                                    value={career}
                                    onChange={(e) => setCareer(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 input-group input-mini">
                                <textarea
                                    name="bio"
                                    className="form-control"
                                    placeholder="About Me"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProfile;
