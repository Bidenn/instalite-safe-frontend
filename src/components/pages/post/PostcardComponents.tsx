import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/style.css';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Component for icons
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { deletePost } from '../../../apis/PostApi';

interface PostcardProps {
    userName: string;
    userImage: string;
    postContent: string;
    postCaption: string;
    postId: string;
    onClick?: () => void;
    likeCounts: string;
    commentCounts: string;
}

// Function to handle post deletion
const handleDeletePost = async (postId: string) => {
    try {
        const response = await deletePost(postId);

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

// PostcardHeader: Displays the user image and username
const PostcardHeader: React.FC<{ userName: string; userImage: string }> = ({ userName, userImage }) => {
    return (
        <div className="top-meta" style={{ marginBottom: 5 }}>
            <div className="d-flex justify-content-between align-items-start">
                <a href={`/profile/${userName}`} className="media media-40">
                    <img
                        className="rounded"
                        src={userImage ? `${userImage}` : nullPhoto}
                        alt="profile"
                    />
                </a>
                <div className="meta-content ms-2">
                    <p className="title mb-0 d-flex align-items-start">
                        <a href={`/profile/${userName}`} style={{ fontWeight: "bold", fontSize: 15, marginTop: 5 }}>
                            {userName}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

// PostcardContent: Displays the full image
const PostcardContent: React.FC<{ postContent: string }> = ({ postContent }) => {
    return (
        <div className="dz-media" style={{ marginBottom: 5 }}>
            <img src={postContent} alt="post" />
        </div>
    );
};

// PostcardFooter: Displays the post caption
const PostcardFooter: React.FC<{ postCaption: string, likeCounts: string, commentCounts: string }> = ({ postCaption, likeCounts, commentCounts }) => {
    const truncatedContent = postCaption.length > 100 ? `${postCaption.substring(0, 100)}...` : postCaption;

    return (
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
            </div>
            <p className="d-flex align-items-start">{truncatedContent}</p>
        </div>
    );
};

// Main Postcard component
const Postcard: React.FC<PostcardProps> = ({ userName, userImage, postContent, postCaption, postId, likeCounts, commentCounts }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/posts/${postId}`); // Navigate to PostDetail page
    };

    return (
        <div
            className="post-card"
            onClick={handleCardClick}
            style={{ cursor: "pointer" }}
        >
            {/* Postcard Header */}
            <PostcardHeader userName={userName} userImage={userImage ? `http://10.34.4.203:5001/users/${userImage}` : nullPhoto} />

            {/* Postcard Content */}
            <PostcardContent postContent={`http://10.34.4.203:5001/posts/${postContent}`} />

            {/* Postcard Footer */}
            <PostcardFooter postCaption={postCaption} likeCounts={likeCounts} commentCounts={commentCounts}/>
        </div>
    );
};

export default Postcard;
