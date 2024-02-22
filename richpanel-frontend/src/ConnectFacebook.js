// ConnectFacebook.js
import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const ConnectFacebook = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authToken = params.get('auth_token');

    if (authToken) {
      // Handle successful authentication
      console.log('Authentication successful. Token:', authToken);
      // You can redirect to another page or perform other actions here
      // For example, you might redirect to '/dashboard'
      history.push('/dashboard');
    } else {
      // Handle authentication failure
      console.error('Authentication failed.');
      // You might want to redirect to an error page or show an error message
    }
  }, [location.search, history]);

  return (
    <div>
      {/* Optionally, you can display a loading message or UI here */}
      Authenticating...
    </div>
  );
};

export default ConnectFacebook;
