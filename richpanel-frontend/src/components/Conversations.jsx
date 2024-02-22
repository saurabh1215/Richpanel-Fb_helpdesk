// Conversations.jsx
import React, { useState } from 'react';
import './index.css'; // Import your CSS file
import { InputText } from './inputText';
import axios from 'axios'

const Conversations = ({ messages, updateMessages, firstName, lastName }) => {
    const [inputMessage, setInputMessage] = useState('');
    console.log(messages,'in conv');
    const handleKeyPress = async (event) => {
      if (event.key === 'Enter' && inputMessage.trim() !== '') {
        const outgoingMessage = {
          _id: `m_${Date.now()}`,
          status_type: 'outgoing',
          sender_message: inputMessage,
        };

        try {
            // Make a POST request to your backend with the outgoing message and auth token in headers
            const token = window.localStorage.getItem('auth-token');
            const headers = {
              'auth-token': token,
              'Content-Type': 'application/json',
            };
            const senderId = messages[0].sender_id;
            console.log('this is sender id',senderId);
            // Assuming your backend endpoint for posting messages is 'http://localhost:8000/post-message'
            const response = await axios.post('http://localhost:8000/user/reply', { senderId, outgoingMessage },{ headers });
            console.log('data sent');
            // Check if the request was successful, you might want to handle errors accordingly
            if (response.status === 200) {
              // Update the messages state with the new message
              updateMessages([...messages, outgoingMessage]);
              // Clear the input field
              setInputMessage('');
            } else {
              console.error('Failed to post message. Server returned:', response.data);
            }
          } catch (error) {
            console.error('Error posting message:', error);
          }
  
        updateMessages([...messages, outgoingMessage]);
  
        setInputMessage('');
      }
    };
  
    return (
      <div className="conversations">
        <div className='message-heading'>
          <h2>{firstName} {lastName}</h2>
        </div>
        <div className="message-container">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message-${message.status_type === 'incoming' ? 'incoming' : 'outgoing'}`}
            >
              <div className={`profile-pic-wrapper-${message.status_type === 'incoming' ? 'incoming' : 'outgoing'}`}>
              {message.status_type === 'incoming' && (
              <div className={`profile-pic-wrapper-${message.status_type}`}>
                <img src={message.profile_pic} alt="Profile" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
              </div>
            )}              </div>
              <div className="message-content-wrapper">
                <p style={{ padding: '10px' }}>{message.sender_message}</p>
              </div>
            </div>
          ))}
        </div>
  
        <div className="text-message">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            name="text"
            id="text"
            placeholder="Enter a message to send"
            style={{ borderRadius: '5px', borderRadius: '5px', width: '100%', paddingTop: '10px', paddingBottom: '10px', borderColor: '#6396c1' }}
          />
        </div>
      </div>
    );
  };
  
  export default Conversations;