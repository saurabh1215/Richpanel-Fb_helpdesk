// UserAuth.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserAuth = () => {
  // Get all parameters from the URL
  const params = useParams();

  const [url,setUrl] = useState('')

  // Log the entire URL and 'code' parameter when the component mounts
  useEffect(() => {
    // Log the entire URL

    console.log('Current URL:', window.location.href);

    setUrl(window.location.href)
    // Log the 'code' parameter
    console.log('Code parameter:', params.code);
  }, [params]);

  // Check if the 'code' parameter exists and display a message accordingly
  const renderMessage = () => {
    const code = params.code;

    if (code) {
      return <p>User successfully authenticated with code: {code}</p>;
    } else {
      return <p>Authentication failed. No code provided.</p>;
    }
  };

  return (
    <div>
      <h2>User Authentication</h2>
      {renderMessage()}
    </div>
  );
};

export default UserAuth;
