import React, { useState, useEffect } from 'react';
import { fetchUserDataWithoutPosts, updateUserData, checkUsernameAvailability } from '../../../apis/UserApi'; // Adjust the path accordingly

const EditProfile: React.FC<{ token: string }> = ({ token }) => {
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [career, setCareer] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null); // for profile photo upload
    const [error, setError] = useState<string | null>(null);

    // Fetch user data without posts on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await fetchUserDataWithoutPosts(token);
                if ('error' in result) {
                    // Handle error response
                    setError(result.error || null); // Ensure we pass either a string or null
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
        const value = e.target.value;
        setUsername(value);

        if (value.length > 2) {
            const result = await checkUsernameAvailability(value);
            setIsAvailable(result.available);
        } else {
            setIsAvailable(null);
        }
    };

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setProfilePhoto(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) {
            setError('Username is required');
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
            const result = await updateUserData(token, formData);
            if (result.error) throw new Error(result.error);

            alert('Profile updated successfully!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to update profile');
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={handleUsernameChange} />
                {isAvailable === null ? null : isAvailable ? (
                    <span style={{ color: 'green' }}>Username is available</span>
                ) : (
                    <span style={{ color: 'red' }}>Username is taken</span>
                )}
            </div>

            <div>
                <label>Full Name:</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
                <label>Bio:</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div>
                <label>Career:</label>
                <input type="text" value={career} onChange={(e) => setCareer(e.target.value)} />
            </div>

            <div>
                <label>Profile Photo:</label>
                <input type="file" onChange={handleProfilePhotoChange} />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Save Profile</button>
        </form>
    );
};

export default EditProfile;
