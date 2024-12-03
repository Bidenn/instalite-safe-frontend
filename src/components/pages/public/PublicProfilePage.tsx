import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/css/style.css';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import Menubar from '../shared/Menubar';
import { fetchPublicProfileWithPosts } from '../../../apis/ProfileApi'; 

interface UserData {
    username?: string;
    fullName?: string;
    profilePhoto?: string;
    career?: string;
    bio?: string;
}

interface PostData {
    id: string;
    content: string;
    caption: string;
}

const PublicProfile: React.FC = () => {
    const { username } = useParams();
    const [user, setUser] = useState<UserData>({
        username: '',
        fullName: '',
        profilePhoto: '',
        career: '',
        bio: '',
    });

    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else if (username) {
            const loadUserData = async () => {
                try {
                    const data = await fetchPublicProfileWithPosts(username); // Fetch profile data for the given username
    
                    console.log(data);

                    if (data.profile) {
                        setUser({
                            username: data.profile.user.username,
                            fullName: data.profile.fullName,
                            profilePhoto: data.profile.profilePhoto,
                            career: data.profile.career,
                            bio: data.profile.bio,
                        });
    
                        setPosts(data.posts ?? []); // Assign posts if available
                    } else if ('error' in data) {
                        setError(data.error); // If there's an error from the API
                    } else {
                        setError('Unexpected data structure.'); // Catch unexpected structures
                    }
                } catch (error) {
                    console.error('Failed to fetch user data with posts:', error);
                    setError('An error occurred while fetching data.');
                }
            };
            loadUserData();
        }
    }, [token, username, navigate]);

    const handleFollowUser = () => {
        // Add follow/unfollow logic here if needed
        console.log(`Follow button clicked for user: ${user.username}`);
    };

    const handleUnfollowUser = () => {
        // Add follow/unfollow logic here if needed
        console.log(`Follow button clicked for user: ${user.username}`);
    };

    return (
        <div className="page-wraper header-fixed">
            <header className="header">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/Home" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Profile</h4>
                        </div>
                    </div>
                </div>
            </header>

            <div className="page-content">
                <div className="container profile-area">
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile">
                        <div className="main-profile">
                            <div className="left-content">
                                <span>@{user.username}</span>
                                <h5 className="mt-1">{user.fullName ?? ''}</h5>
                                <h6 className="text-primary font-w400">{user.career ?? ''}</h6>
                            </div>
                            <div className="right-content">
                                <div className="upload-box">
                                    <img src={ user.profilePhoto ? `http://10.34.4.203:5001/users/${user.profilePhoto}` : nullPhoto } alt="profile"/>
                                </div>
                            </div>
                        </div>
                        <div className="info">
                            <h6>Bio</h6>
                            <p>{user.bio ?? 'No details provided'}</p>
                        </div>

                        {/* Follow Button */}
                    </div>

                    <div className="content-section">
                        <div className="dz-lightgallery style-2">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <a key={post.id} className="gallery-box" href={`/post-detail/${post.id}`}>
                                        <img
                                            src={`http://10.34.4.203:5001/posts/${post.content}`}
                                            alt="user post"
                                        />
                                    </a>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Menubar />
        </div>
    );
};

export default PublicProfile;
