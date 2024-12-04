import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { fetchProfileDataForEdit, updateProfileData, checkUsernameAvailability } from '../../../apis/ProfileApi';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC<{ token: string }> = ({ token }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [career, setCareer] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(nullPhoto);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await fetchProfileDataForEdit();
                setEmail(result.user.email ?? '');
                setUsername(result.user.username ?? '');
                setFullName(result.fullName ?? '');
                setBio(result.aboutMe ?? '');
                setCareer(result.career ?? '');
            } catch (err) {
                setError('Failed to fetch user data');
            }
        };
        fetchProfile();
    }, [token]);

    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const isValid = /^[a-z0-9._]*$/.test(value);

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Username',
                text: 'Username can only contain lowercase letters, numbers, dots, and underscores.',
            });
            return;
        }

        setUsername(value);
        if (value.length > 2) {
            try {
                const result = await checkUsernameAvailability(value);
                setIsAvailable(result.available);
            } catch {
                setIsAvailable(null);
            }
        } else {
            setIsAvailable(null);
        }
    };

    const handleChangeProfilePhoto = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File',
                text: 'Please upload a valid image file.',
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: 'Image size should not exceed 5MB.',
            });
            return;
        }

        setProfilePhoto(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Username is required.',
            });
            return;
        }

        try {
            const profileData = new FormData();
            profileData.append('username', username);
            profileData.append('fullName', fullName);
            profileData.append('bio', bio);
            profileData.append('career', career);
            if (profilePhoto) profileData.append('profilePhoto', profilePhoto);

            await updateProfileData(profileData);

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile has been updated successfully.',
                confirmButtonText: 'Go to Profile',
            }).then(() => navigate('/profile'));
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update profile. Please try again.',
            });
        }
    };

    return (
        <div className="page-wrapper header-fixed">
            <header className="header bg-white">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/profile" className="back-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </a>
                        </div>
                        <div className="mid-content">
                            <h4 className="title mb-0">Edit Profile</h4>
                        </div>
                        <div className="right-content">
                            <a href="/profile" className="text-dark font-20">						
                                <i className="fa-solid fa-check"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-content">
                <div className="container">
                    <div className="edit-profile">
                        <div className="profile-image">
                            <img src={imagePreview} alt="Profile" className="media media-100 rounded-circle" />
                            <a href="#" onClick={handleChangeProfilePhoto}>
                                Change Profile Photo
                            </a>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={email}
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                                {isAvailable === null ? null : isAvailable ? (
                                    <span style={{ color: 'green' }}>Username is available</span>
                                ) : (
                                    <span style={{ color: 'red' }}>Username is taken</span>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Career"
                                    value={career}
                                    onChange={(e) => setCareer(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    placeholder="About Me"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
