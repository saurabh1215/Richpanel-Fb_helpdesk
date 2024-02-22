import { useState, useEffect } from 'react';
import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import ContactList from '../../components/ContactList';
import Conversations from '../../components/Conversations';
import './Dashboard.css';
import { ReactComponent as ConversationIcon } from '../../Assets/inbox.svg';
import { ReactComponent as PeopleIcon } from '../../Assets/users.svg';
import { ReactComponent as MoneyIcon } from '../../Assets/chart.svg';
import { ReactComponent as ProfileIcon } from '../../Assets/users.svg';
import { ReactComponent as Menu } from '../../Assets/burger-list-menu-navigation-svgrepo-com.svg';
import Logo from '../../Assets/logo.jpeg';
import UserDetails from '../UserDetails';

const Dashboard = () => {

  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  

  const updateMessages = (newMessages) => {
    setMessages(newMessages);
  };

  const fetchData = async () => {
    try {
      const token = window.localStorage.getItem('auth-token');
      console.log(token);
      const headers = {
        'auth-token': `${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch list of conversations
      const conversationsResponse = await axios.get('http://localhost:8000/user/fetch-conversation', { headers });
      // console.log(conversationsResponse);
      const conversationList = conversationsResponse.data.userConversation;
      console.log('this is conv list',conversationList);

      // Extract senders from conversations
      const senderList = conversationList.map(conversation => ({
        sender_id: conversation.sender_id,
        first_name: conversation.first_name,
        last_name: conversation.last_name,
        sender_message: conversation.sender_message,
        profile_pic: conversation.profile_pic,
        message_type: conversation.message_type,
        status_type: conversation.status_type,
      }));
      console.log(senderList);

      setContacts(senderList);
      setMessages(senderList)
      console.log('loggin',senderList);

      console.log('selected contact',selectedContact);
      if (selectedContact) {
        // Fetch messages for the selected contact
        const messagesResponse = await axios.get(`http://localhost:8000/user/messages/${selectedContact.sender_id}`, { headers });
        console.log(messagesResponse,'message response');
        setMessages(messagesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleContactClick = (contact) => {
    console.log('sender id',contact);
    setSelectedContact(contact, () => {
      // Fetch messages for the selected contact when a contact is clicked
      fetchData();
    });
  };
  useEffect(() => {
    fetchData();
  },[])
  useEffect(() => {
    // fetchData();
    const socket = io('http://localhost:3001');

    socket.on('new-message', (data) => {
      // Update messages when a new message is received
      setMessages((prevMessages) => [...prevMessages, data]);

      // Update contacts if the sender is not in the current list
      setContacts(prevContacts => {
        if (!prevContacts.some(contact => contact.sender_id === data.sender_id)) {
          return [...prevContacts, {
            sender_id: data.sender_id,
            first_name: data.first_name,
            last_name: data.last_name,
            sender_message: data.sender_message,
            message_type: data.message_type,
            status_type: data.status_type,
            profile_pic:data.profile_pic,
          }];
        } else {
          return prevContacts.map(contact =>
            contact.sender_id === data.sender_id
              ? { ...contact, sender_message: data.sender_message, message_type: data.message_type, status_type: data.status_type }
              : contact
          );
        }
        
      });
      console.log(contacts);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedContact, contacts]);



  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div className="navbar-top">
          <img src={Logo} alt="RichPanel Logo" style={{ width: '40px', height: '40px', marginTop: '15px' }} />
          <ConversationIcon style={{ width: '40px', height: '40px', fill: 'white' }} />
          <PeopleIcon style={{ width: '40px', height: '40px', fill: 'white' }} />
          <MoneyIcon style={{ width: '40px', height: '40px', fill: 'white' }} />
        </div>
        <div className="navbar-bottom">
          <ProfileIcon style={{ width: '40px', height: '40px', fill: 'white' }} />
        </div>
      </div>
      <div className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
          <div style={{marginLeft:'10px', marginTop: '5px'}}>
            <Menu style={{ alignItems: 'center', width: '20px', height: '20px' }} />
          </div>
          <div style={{ alignItems: 'center', marginLeft: '20px' }}>
            <h2>Conversations</h2>
          </div>
        </div>
        <div>
            <ContactList contacts={contacts} onContactClick={handleContactClick} />
        </div>
      </div>
      <div className="main-content">
        {selectedContact ? (
          <>
            <Conversations messages={messages} updateMessages={updateMessages} firstName={selectedContact.first_name}
              lastName={selectedContact.last_name} />
            <UserDetails
              firstName={selectedContact.first_name}
              lastName={selectedContact.last_name}
              email={selectedContact.email}
              profile_pic={selectedContact.profile_pic}
            />
          </>

        ) : (
          <div className="select-contact-message">Select a contact to start a conversation.</div>
        )}
      </div>
    </div>
  );
}


export default Dashboard