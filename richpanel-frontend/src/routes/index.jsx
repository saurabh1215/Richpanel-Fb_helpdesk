import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../pages/login';
import SignUp from '../pages/signup';
import ConnectFacebookPage from '../pages/connectFacebook/';
import Dashboard from '../pages/Dashboard';
import UserAuth from '../pages/UserAuth';

const AppRoutes = () => {
    // const location = useLocation();

    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="face" element={<ConnectFacebookPage/>} />
                <Route path="dashboard" element={<Dashboard/>} />
                <Route path="userAuthToken" element={<UserAuth/>}/>

            </Routes>
        </div>
    );
};

export default AppRoutes;
