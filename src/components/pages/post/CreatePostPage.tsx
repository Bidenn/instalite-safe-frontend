import React, { useState, useEffect } from 'react';
import camlogo from '../../assets/images/gall.png';
import { storePost } from '../../../apis/PostApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreatePost: React.FC = () => {
    const [postContent, setPostContent] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            Swal.fire({
                title: 'Not Authenticated',
                text: 'Please log in to continue.',
                icon: 'warning',
                confirmButtonText: 'Login'
            }).then(() => navigate('/login'));
        }
    }, [navigate]);

    useEffect(() => {
        // Cleanup the object URL when the component is unmounted or image is updated
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostContent(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!token) {
            Swal.fire({
                title: 'Error!',
                text: 'Authentication token not found. Please log in.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (!selectedImage || !postContent.trim()) {
            Swal.fire({
                title: 'Incomplete Data',
                text: 'Please provide both an image and caption.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        const formData = new FormData();
        formData.append('caption', postContent.trim());
        formData.append('content', selectedImage);

        try {
            const response = await storePost(formData);

            if (response.error) {
                Swal.fire({
                    title: 'Failed!',
                    text: 'Failed to create post. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'Post created successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => navigate('/home'));
            }
        } catch (error) {
            console.error("Error creating post:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create post. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="page-wraper header-fixed">
            {/* Header */}
            <header className="header bg-white shadow-sm">
                <div className="container">
                    <div className="main-bar d-flex align-items-center justify-content-between">
                        <div className="left-content d-flex align-items-center">
                            <button className="back-btn me-3" onClick={() => navigate('/home')}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <h4 className="title mb-0">Create Post</h4>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <div className="page-content mt-1">
                <div className="container">
                    <div className="post-content-area">
                        {/* Image Upload Section */}
                        <div className="image-upload-container text-center">
                            {!imagePreview ? (
                                <label htmlFor="file-upload" className="image-upload-icon">
                                    <img src={camlogo} alt="Camera Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            ) : (
                                <div className="image-preview">
                                    <img
                                        src={imagePreview}
                                        alt="Selected Preview"
                                        className="img-fluid"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </div>
                        {/* Caption Input Section */}
                        <div className="caption-input mt-1 mb-3">
                            <textarea
                                className="form-control rounded shadow-sm"
                                value={postContent}
                                onChange={handlePostContentChange}
                                rows={10}
                                placeholder="Please write caption.."
                                style={{
                                    fontSize: '16px', // Normal font size
                                }}
                            />
                        </div>
                        <button onClick={handleSubmit} className="btn btn-primary">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
