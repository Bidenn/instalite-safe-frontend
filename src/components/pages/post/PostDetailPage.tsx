import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import p1 from '../../assets/images/post/pic1.png';
import u1 from '../../assets/images/avatar/NullUserPhoto.png';
import { deletePost } from '../../../apis/PostApi';

const PostDetail: React.FC = () => {
    const { postId } = useParams();

    const userName = "Username"; // Replace with dynamic username
    const likeCounts = 10; // Replace with dynamic likes count
    const commentCounts = 5; // Replace with dynamic comments count

    const handleDeletePost = async (postId: string) => {
        try {
            const response = await deletePost(postId); // Panggil API deletePost
    
            if (response.error) {
                alert(`Failed to delete post: ${response.error}`);
            } else {
                alert("Post deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred while deleting the post.");
        }
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
                            <a href={`/profile/${userName}`} className="media media-40" style={{ marginRight: 3, marginLeft: 5 }}>
                                <img className="rounded-circle" src={u1} alt="User profile" style={{ width: 30, height: 30 }} />
                            </a>
                            <div className="meta-content">
                                <p className="title mb-0" style={{ fontWeight: 'normal', fontSize: 12, lineHeight: '1.2' }}>
                                    <a href={`/profile/${userName}`}>{userName}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="dz-media">
                        <img src={p1} alt="Post content" style={{ width: '100%', borderRadius: 0 }} />
                    </div>
                    <div className="container pt-1">
                        <div className="post-card" style={{ width: '100%', borderRadius: 0 }}>
                            <div className="post-footer">
                                <div className="post-meta-btn d-flex align-items-center mt-0">
                                    <button
                                        className="action-btn d-flex align-items-center me-3"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            padding: 0,
                                            color: '#000',
                                        }}
                                    >
                                        <i className="fa-regular fa-heart"></i>
                                        <span style={{ fontSize: 14, marginLeft: 5, fontWeight: 'normal' }}>{likeCounts}</span>
                                    </button>
                                    <a
                                        href="/comments"
                                        className="action-btn d-flex align-items-center"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                    >
                                        <i className="fa-solid fa-comment"></i>
                                        <span style={{ fontSize: 14, marginLeft: 5, fontWeight: 'normal' }}>{commentCounts}</span>
                                    </a>
                                    <a
                                        href="javascript:void(0);"
                                        className="action-btn d-flex align-items-center me-3"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                    </a>
                                </div>

                                <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 0, marginTop: 8, textAlign: 'left' }}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus massa sagittis, placerat magna vitae, accumsan nunc. Fusce vel convallis elit. Sed in mattis massa. Sed sollicitudin, nunc eu tincidunt auctor, lorem augue lacinia velit, at dapibus est nunc quis tortor. Nam in risus nec odio placerat consequat venenatis mattis quam. Cras imperdiet, urna id porttitor aliquam, eros justo scelerisque libero, non iaculis enim mi in neque. Maecenas varius, dui et faucibus mattis, neque tortor sollicitudin ligula, at facilisis arcu est id elit. Nullam ligula orci, mollis ut lorem laoreet, tempor accumsan dolor. Sed quis libero vel leo pretium molestie eu a ipsum. Cras cursus sollicitudin luctus. Morbi nec erat hendrerit, commodo tortor sed, luctus nisl. Donec sollicitudin risus eu sollicitudin pretium. Morbi sed metus eget dolor pretium congue et vel dui. Phasellus consequat at ligula suscipit accumsan. Praesent vitae dui lobortis libero convallis fringilla nec congue libero. Donec faucibus finibus nunc, non fringilla nunc posuere sit amet.
                                </p>
                            </div>
                        </div>

                        <div className="comment-card mt-4">
                            <ul className="dz-comments-list">
                                {['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus massa sagittis, placerat magna vitae, accumsan nunc.', 'Second comment', 'Third comment'].map((comment, index) => (
                                    <li key={index} style={{ marginBottom: 20 }}>
                                        <div className="list-content d-flex" style={{ alignItems: 'flex-start' }}>
                                            <img
                                                src={u1}
                                                alt="User"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    marginRight: 8,
                                                }}
                                            />
                                            <div>
                                                <h6 className="font-12 mb-1" style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2, textAlign:'left' }}>
                                                    Commenter Name {index + 1}
                                                </h6>
                                                <p className="mb-0" style={{ fontSize: 12, color: '#666', lineHeight: 1.3, textAlign:'left' }}>
                                                    {comment}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
                                <input type="text" className="form-control" placeholder="Add a Comments..." />
                            </form>
                        </div>
                        <a href="javascript:void(0);" className="send-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21.4499 11.11L3.44989 2.11C..."></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PostDetail;
