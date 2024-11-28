import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Homepage from './components/pages/home/Homepage';
import Register from './components/pages/auth/RegisterPage';
import Login from './components/pages/auth/LoginPage';
import UserProfile from './components/pages/profile/UserProfilePage';
import CreatePost from './components/pages/post/CreatePostPage';
import EditProfile from './components/pages/profile/EditProfilePage';
import PostDetail from './components/pages/post/PostDetailPage';
import ProtectedRoute from './components/utils/ProtectedRoute';
import IdleTimer from './components/utils/IdleTimer';
import VerifyEmail from './components/pages/auth/VerifyEmailPage';
import CreateProfile from './components/pages/profile/CreateProfilePage';

function App() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage or other storage

    return (
        <div className="App">
            <Router>
                <IdleTimer>
                    <Routes>
                        {/* Redirect root to login */}
                        <Route path="/" element={<Navigate to="/login" replace />} />

                        {/* Public Routes */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verify-email/:encodedToken" element={<VerifyEmail />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Homepage />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/create-post" element={<CreatePost />} />
                            <Route path="/profile/edit" element={<EditProfile token={token!} />} /> {/* Passing token here */}
                            <Route path="/post-detail" element={<PostDetail />} />
                        </Route>

                        {/* Non-protected Route for creating profile */}
                        <Route path="/create-profile" element={<CreateProfile token={token!} />} /> {/* Passing token here */}
                    </Routes>
                </IdleTimer>
            </Router>
        </div>
    );
}

export default App;
