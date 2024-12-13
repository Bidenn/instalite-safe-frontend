import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostDetail, deletePost } from '../../../apis/PostApi'; // Add the new like/unlike APIs
import Swal from 'sweetalert2'; // Import SweetAlert2

import u1 from '../../assets/images/avatar/NullUserPhoto.png';

const PostDetail: React.FC = () => {
    const { postId } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
    const [post, setPost] = useState<any>(null);
    const [photo, setPhoto] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [logged, setLogged] = useState<any>(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const loadPostDetail = async () => {
            try {
                const data = await getPostDetail(postId!);
                const authorProfile = data.post.authorProfile.profilePhoto;
                const logged = data.logged;

                setPost(data.post);
                setPhoto(authorProfile);
                setLogged(logged);

            } catch (err) {
                console.error('Failed to fetch post details:', err);
                setError('An error occurred while fetching post details.');
            }
        };

        loadPostDetail();
    }, [postId, token, navigate]);

    const handleDeletePost = async () => {
        if (!postId) return;

        try {
            const response = await deletePost(postId);

            if (response.error) {
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to delete post: ${response.error}`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'Post deleted successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/home'); // Redirect after deletion
                });
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            Swal.fire({
                title: 'Error!',
                text: "An error occurred while deleting the post.",
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="page-wrapper header-fixed">
            <header className="header">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/home" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Instalite</h4>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className="page-content"
                style={{
                    overflowY: 'auto',
                    height: 'calc(100vh - 60px)',
                    paddingBottom: '50px',
                }}
            >
                <div className="content-inner pt-0">
                    <div className="container p-0 mt-2 ml-1">
                        <div className="top-meta d-flex justify-content-start align-items-center mb-2">
                            <a
                                href={`/profile/${post.author.username}`}
                                className="media media-40"
                                style={{ marginRight: 3, marginLeft: 5 }}
                            >
                                <img
                                    className="rounded-circle"
                                    src={photo ? `${apiUrl}/users/${photo}` : u1}
                                    alt="User profile"
                                    style={{ width: 30, height: 30 }}
                                />
                            </a>
                            <div className="meta-content">
                                <p className="title mb-0" style={{ fontWeight: 'normal', fontSize: 12, lineHeight: '1.2' }}>
                                    <a href={`/profile/${post.author.username}`}>{post.author.username}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="dz-media">
                        <img src={`${apiUrl}/posts/${post.content}`} alt="Post content" style={{ width: '100%', borderRadius: 0 }} />
                    </div>
                    <div className="container" style={{ paddingLeft: 0, paddingTop: 5, paddingBottom: 0 }}>
                        <div className="post-card" style={{ width: '100%', borderRadius: 0 }}>
                            <div className="post-footer">
                                <div className="post-meta-btn d-flex align-items-center mt-0">
                                    <a
                                        href="#"
                                        className="action-btn d-flex align-items-center"
                                        style={{ textDecoration: 'none', color: 'red' }}
                                    >
                                        <i className="fa-solid fa-heart"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="action-btn d-flex align-items-center"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                    >
                                        <i className="fa-solid fa-comment"></i>
                                    </a>
                                    <button
                                        onClick={handleDeletePost}
                                        className="action-btn d-flex align-items-center me-3"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#000',
                                        }}
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                    {/* {post.userId === logged && (
                                        <button
                                            onClick={handleDeletePost}
                                            className="action-btn d-flex align-items-center me-3"
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#000',
                                            }}
                                        >
                                            <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container pt-0">
                        <div className="post-card" style={{ width: '100%', borderRadius: 0 }}>
                            <div className="post-footer">
                                <div
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        marginBottom: 0,
                                        textAlign: 'left',
                                        wordBreak: 'break-word', // Ensures long text wraps properly
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            marginRight: 8, // Add space between username and caption
                                            display: 'inline', // Ensure username is inline with the caption
                                        }}
                                    >
                                        {post.author.username}
                                    </span>
                                    <span>
                                        {post.caption}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer fixed border-top">
                <div className="container py-2">
                    <div className="commnet-footer">
                        <div className="d-flex align-items-center flex-1">
                            <div className="media media-40 rounded-circle">
                                <img src={u1} alt="/" />
                            </div>
                            <form className="flex-1">
                                <input type="text" className="form-control" placeholder="Add a Comments..." disabled />
                            </form>
                        </div>
                        <a href="javascript:void(0);" className="send-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21.4499 11.11L3.44989 2.11C3.27295 2.0187 3.07279 1.9823 2.87503 2.00546C2.67728 2.02862 2.49094 2.11029 2.33989 2.24C2.18946 2.37064 2.08149 2.54325 2.02982 2.73567C1.97815 2.9281 1.98514 3.13157 2.04989 3.32L4.99989 12L2.09989 20.68C2.05015 20.8267 2.03517 20.983 2.05613 21.1362C2.07852 21.2894 2.13645 21.4371 2.21816 21.5528C2.29987 21.6686 2.40698 21.7455 2.52489 21.7698C2.64269 21.7941 2.75919 21.7633 2.85989 21.6801L21.8599 12.6801C22.0265 12.5591 22.057 12.3353 21.9315 12.1407C21.8059 11.9461 21.5299 11.8861 21.4499 11.11Z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PostDetail;
