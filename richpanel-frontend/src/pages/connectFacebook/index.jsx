import React, { useEffect } from "react";
import './ConnectFacebook.css'

const ConnectFacebookPage = () => {
    const clientId = '2940293256107415';
    const redirectUri = 'http://localhost:8000/user/facelogin';

    const handleSubmit = async () => {
        try {
            const token = window.localStorage.getItem('auth-token');

            // const facebookOAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_show_list,read_page_mailboxes,pages_messaging,pages_messaging_subscriptions,page_events,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts,email`;
            const backendUrl = `http://localhost:8000/user/testLogin?token=${token}`
            // Redirect to the Facebook OAuth URL in the same window
            window.location.href = backendUrl;
        } catch (error) {
            console.error('Error connecting to Facebook:', error.message);
        }
    };



    return (
        <div className="center-container"> {/* Added a container for centering */}
            <div className="white-box"> {/* Added a white box for styling */}
                <div>
                    <h3>Facebook Page Integration</h3>
                </div>
                <div>
                    <button className="connect-button" onClick={handleSubmit}>
                        Connect to Facebook Page
                    </button>
                </div>
            </div>
        </div>
    );
    }

export default ConnectFacebookPage;
















