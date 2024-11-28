import React from 'react';
import Postcard from './PostcardComponents';
import Menubar from '../shared/Menubar';

import p1 from '../../assets/images/post/pic1.png';
import u1 from '../../assets/images/avatar/NullUserPhoto.png';

const PostDetail: React.FC = () => {
    return (
        <div className="page-wraper header-fixed">
            <header className="header">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/profile" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Post Detail</h4>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-content">
                <div className="content-inner pt-0">
                    <div className="container p-b50">
                        <Postcard
                            userName="Lucas"
                            userImage={u1}
                            postContent={p1}
                            postCaption="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            postId="1"
                        />
                    </div>
                </div>
            </div>

            {/* Menubar Section */}
            <Menubar />
        </div>
    );
};

export default PostDetail;
