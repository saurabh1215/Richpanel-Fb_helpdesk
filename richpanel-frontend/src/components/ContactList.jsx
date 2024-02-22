import React from 'react';

const ContactList = ({ contacts, onContactClick }) => {
  // Extract unique contacts based on sender_id
  const uniqueContacts = Array.from(new Set(contacts.map(contact => contact.sender_id)))
    .map(senderId => contacts.find(contact => contact.sender_id === senderId));

  return (
    <div className="contact-list">
      {uniqueContacts.map(contact => (
        <div key={contact.sender_id} className="contact-item" onClick={() => onContactClick(contact)}>
          <div className="user-meta" style={{ padding: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div className="chat-svg" style={{ borderRadius: '5px', border: '1px solid black', padding: '10px' }}></div>
              <div style={{ paddingLeft: '10px' }}>
                <div className="sender-id">{contact.first_name} {contact.last_name}</div>
                <div className="message-type">{contact.message_type==='message' ?'Facebook DM' :'Facebook Post'}</div>
              </div>
            </div>
            <div className="message-info">
              <div className="sender-name" style={{paddingTop:'8px',paddingBottom:'8px'}}>{contact.sender_message?.slice(0, 20)}...</div>
              {/* <div className="status-type">{contact.status_type}</div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;

