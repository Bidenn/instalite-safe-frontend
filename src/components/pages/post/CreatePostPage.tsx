import React, { useState, useEffect } from 'react';
import camlogo from '../../assets/images/cam-logo-removed.png';
import { storePost } from '../../../apis/PostApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const CreatePost: React.FC = () => {
    const [postContent, setPostContent] = useState<string>(''); // Caption
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Image
    const [token, setToken] = useState<string | null>(null); // Token
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the token from localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken); // Store token in state
        } else {
            alert('User not authenticated. Please log in.');
            navigate('/login'); // Redirect to login page if no token is found
        }
    }, [navigate]);

    // Handle caption change
    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostContent(e.target.value);
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedImage(file);
    };

    // Handle form submission
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

        if (!selectedImage || !postContent) {
            Swal.fire({
                title: 'Error!',
                text: 'Please provide both an image and caption.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        const formData = new FormData();
        formData.append('caption', postContent); // Attach caption
        formData.append('content', selectedImage); // Attach image file

        try {
            const response = await storePost(formData); // Send formData with token
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
                }).then(() => {
                    navigate('/Home'); // Redirect after success
                });
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
            <header className="header bg-white">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/home" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Create Post</h4>
                        </div>
                        <div className="mid-content"></div>
                        <div className="right-content">
                            <button onClick={handleSubmit} className="post-btn">POST</button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="page-content">
                <div className="container">
                    <div className="post-content-area">
                        {/* Image Upload */}
                        <div className="image-upload-container text-center">
                            {!selectedImage && (
                                <label htmlFor="file-upload" className="image-upload-icon">
                                    <img src={camlogo} alt="Camera Logo" style={{ maxWidth: '100px' }} />
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            )}

                            {selectedImage && (
                                <div className="image-preview mt-3">
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Selected Preview"
                                        className="img-fluid"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Caption Input */}
                        <div className="caption-input mt-3">
                            <textarea
                                className="form-control"
                                placeholder="Enter a caption..."
                                value={postContent}
                                onChange={handlePostContentChange}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
