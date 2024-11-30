import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomepageHeader from './HomepageHeader';
import Story from './Story';
import Postcard from '../post/PostcardComponents';
import Menubar from '../shared/Menubar';

import { fetchHomepageData } from '../../../apis/HomepageApi';

const Homepage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]); // State to store posts
  const [error, setError] = useState<string | null>(null); // State for error message
  const [loggedUser, setLoggedUser] = useState<any>(null); // State to store logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        console.log('User not logged in');
        navigate('/login'); // Redirect to login if token is not found
        return;
      }

      try {
        const response = await fetchHomepageData(token); // Pass token to API function
        if ('error' in response) {
          setError(response.error); // Set error message
        } else {
          setPosts(response.posts); // Set posts
          setLoggedUser(response.loggedUser); // Set logged user details
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again later.');
      }
    };

    fetchPosts();
  }, [navigate]); // Dependency array includes navigate to handle navigation updates

  return (
    <div className="page-wraper header-fixed">
      {/* Header Section */}
      <HomepageHeader />

      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container p-b50">
            {/* Story Section */}
            {loggedUser && (
              <Story
                userName={loggedUser.username} // Pass username to Story component
                profilePhoto={loggedUser.profilePhoto} // Pass profilePhoto to Story component
              />
            )}

            {/* Display Posts */}
            {error && <div className="error-message">{error}</div>}
            {posts.length > 0 ? (
              posts.map((post) => (
                <Postcard
                  key={post.id}
                  postId={post.id}
                  userName={post.user.username}
                  userImage={post.user.profilePhoto}
                  postContent={post.content}
                  postCaption={post.caption}
                />
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Menubar Section */}
      <Menubar />
    </div>
  );
};

export default Homepage;
