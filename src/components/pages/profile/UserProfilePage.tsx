import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/style.css';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import Menubar from '../shared/Menubar';
import { fetchUserDataWithPosts } from '../../../apis/UserApi'; 

interface UserData {
    username?: string;
    fullName?: string;
    profilePhoto?: string;
    aboutMe?: string;
    career?: string;
}

interface PostData {
    id: string;
    content: string;
    caption: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserData>({
        username: '',
        fullName: '',
        profilePhoto: '',
        aboutMe: '',
        career: '',
    });

    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            const loadUserData = async () => {
                try {
                    const data = await fetchUserDataWithPosts(token);
    
                    console.log(data); 
    
                    if ('username' in data) {
                        setUser({
                            username: data.username,
                            fullName: data.fullName,
                            profilePhoto: data.profilePhoto,
                            aboutMe: data.aboutMe,
                            career: data.career,
                        });
    
                        setPosts(data.posts || []); // Assign posts if available
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
    }, [token, navigate]);    

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="page-wraper header-fixed">
            <header className="header">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/home" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Profile</h4>
                        </div>
                        <div className="right-content">
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
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
                                <h5 className="mt-1">{user.fullName || 'Full Name'}</h5>
                                <h6 className="text-primary font-w400">{user.career || 'Career'}</h6>
                            </div>
                            <div className="right-content">
                                <div className="upload-box">
                                    <img
                                        src={
                                            user.profilePhoto
                                                ? `http://localhost:5000/users/${user.profilePhoto}`
                                                : nullPhoto
                                        }
                                        alt="profile"
                                    />
                                    <button className="upload-btn" onClick={() => navigate('edit')}>
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="info">
                            <h6>About Me</h6>
                            <p>{user.aboutMe || 'No details provided'}</p>
                        </div>
                    </div>
                    <div className="contant-section">
                        <div className="title-bar my-2">
                            <h6 className="mb-0">My Posts</h6>
                        </div>
                        <div className="dz-lightgallery style-2">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <a key={post.id} className="gallery-box" href={`/post-detail/${post.id}`}>
                                        <img
                                            src={`http://localhost:5000/posts/${post.content}`}
                                            alt="user post"
                                        />
                                    </a>
                                ))
                            ) : (
                                <p>No posts available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Menubar />
        </div>
    );
};

export default Profile;
