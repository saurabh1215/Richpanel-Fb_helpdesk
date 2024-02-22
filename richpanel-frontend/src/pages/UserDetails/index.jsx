// UserDetails.jsx
import React from 'react';
import { ReactComponent as CallSVG } from '../../Assets/call.svg';
import { ReactComponent as ProfileSVG } from '../../Assets/profile.svg';

const UserDetails = ({ firstName, lastName, email, profile_pic }) => {

    console.log(profile_pic);
  return (
    <div style={{backgroundColor:'#EFF2F7'}}>

        <div style={{display:'flex', flexDirection:'column', padding:'40px', backgroundColor:'#fff', margin:'8px', borderRadius:'10px'}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <img src={profile_pic} style={{width: '55px', height:'55px', borderRadius:'50%'}}/>
                <p>Name: {firstName} {lastName}</p>
            </div>

            <div style={{display:'flex', alignItems:'center', flexDirection:'row',justifyContent:'space-around'}}>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center',border: '2px solid black',borderRadius: '2px',paddingLeft: '10px',paddingRight: '10px'}}>
                    <div style={{alignItems:'center'}}>
                        <CallSVG style={{height:'15px',width:'15px'}}/>
                    </div>
                    <div style={{marginLeft: '10px'}}>
                        <p>Call</p>
                    </div>
                </div>

                <div style={{display:'flex', flexDirection:'row', alignItems:'center',border: '2px solid black',borderRadius: '2px',paddingLeft: '10px',paddingRight: '10px',marginLeft: '10px'}}>
                    <div style={{alignItems:'center'}}>
                        <ProfileSVG style={{height:'15px',width:'15px'}}/>
                    </div>
                    <div style={{marginLeft: '10px'}}>
                        <p>Profile</p>
                    </div>
                </div>
                
            </div>

        </div>

        <div style={{margin:'10px', backgroundColor:'#fff', borderRadius:'10px'}}>

            <div style={{margin:'10px', padding:'10px'}}>
                <div>

                    <h4>Customer Details</h4>

                </div>

                <div>
                    <p>Email: {email}</p>
                </div>

                <div>
                    <p>First Name: {firstName}</p>
                </div>

                <div>
                    <p>Last Name: {lastName}</p>
                </div>

                <div style={{paddingBottom: '10px'}}>
                    <a href='#' style={{color: '#6396c1', textDecoration: 'none',fontWeight: 'bold'}}>View more Details</a>
                </div>
            </div>

        </div>
    </div>
  );
};

export default UserDetails;
