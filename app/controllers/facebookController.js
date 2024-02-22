const axios = require('axios');
require('../models/userModel');
require('../models/userConversation')
const User = require('mongoose').model('userModel');
const mongoose = require('mongoose');
const userConversation = require('mongoose').model('userConversationModel')
const url = require('url');
const jwt = require('jsonwebtoken');


const path = require('path')
const io = require('../../config/socket');

const fetchConv =async (userId) => {
    try {
      const conv = await userConversation.find({user_id:userId})
      return conv

    } catch(error) {
      throw error
    }
}

const fetchDetail = async(req,res,next) => {

  try {

    const requestData = req.body;
    const userId = requestData.userID;
    const userConversation = await fetchConv(userId);
    return res.json({
      userConversation
    })

  } catch(error) {
    next(error)
  }
}


const facebookLogin = async(req,res,next) => {
  // Retrieve the user ID from the query parameters
  console.log('print');
  const token = req.query.token;
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const userId = decoded._id
  const redirectUrl = 'http://localhost:8000/user/authCode';
  console.log(userId);
  // Include the user ID in the redirect URL
  const redirectUri = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectUrl}&scope=pages_show_list,read_page_mailboxes,pages_messaging,pages_messaging_subscriptions,page_events,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts,email&state=${userId}`;

  res.redirect(redirectUri);
}

const facebookAccessToken = async(req,res,next)=> {

    try {
        console.log('in')

        const auth_code = req.query.code;
        const userId = req.query.state;
        // const userId = user_id.id
        // console.log(auth_code);
        // console.log(userId);
        const requestData = req.body;
        // const auth_code = requestData.auth_code;
        const user = await User.findById(userId);
        console.log(user);
        user.auth_code = auth_code;
        await user.save();
        console.log(process.env.FACEBOOK_GRAPH_URI)
        const response = await axios.get(`${process.env.FACEBOOK_GRAPH_URI}/oauth/access_token`, {
            params: {
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              redirect_uri: process.env.REDIRECT_URI,
              code: auth_code,
            },
          });

        
          console.log(response)
        

        access_token = response.data.access_token
        console.log(access_token);
        user.token = access_token;
        user.save();

        const getUserPagesUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${access_token}`;
        const pageResponse = await axios.get(getUserPagesUrl);

        const userPages = pageResponse.data.data;

        const pageAccessToken = userPages.length > 0 ? userPages[0].access_token : null;

        user.page_id=userPages[0].id;
        if(pageAccessToken) {
          user.page_access_token=pageAccessToken;
          user.save();
        }
        console.log(user);
        res.redirect('http://localhost:3000/dashboard')
        res.json({
            access_token,
            pageAccessToken
        })
    } catch(error) {
        console.error('Error in Facebook API request:', error);
        next(error);
    }
}

const facebookWebhook = async(req,res,next) => {

    try {

        const hubVerifyToken = req.query['hub.verify_token'];
        const hubChallenge = req.query['hub.challenge'];

        // Check if the verification token matches
        if (hubVerifyToken === 'RICHPANEL') {
            // Respond with the challenge to complete the verification
            res.status(200).send(hubChallenge);
        } else {
            // Verification failed
            res.status(403).end();
        }
    } catch(error) {
        next(error)

    }
}


const incomingFacebookWebhook = async(req,res,next) => {

    try {
        const body = req.body;
        handleWebhookEvent(body);
          
        res.status(200).send('EVENT_RECEIVED');

    
    } catch(error) {
        next(error)

    }
}

const handleWebhookEvent = async (body) => {

    console.log(body)
    const recipientId = body.entry.id;
    console.log(body.entry.changes)
    if (body.object === 'page') {
        for (const entry of body.entry) {
          console.log(body.object);
            if (entry.changes) {
                for (const change of entry.changes) {
                    if (change.field === 'feed' && change.value) {
                        const post = change.value;
                        if(post.item==='comment') {
                            console.log('The comment Received is',post.message);
                            console.log('Received a new post:', post);

                            // handleComment(post);

                            
                            const pageId = body.entry[0].id;
                            console.log(pageId);
                            const user = await User.findOne({page_id: pageId})
                            const userId = user.id
                            const access_token = user.page_access_token;

                            const senderId = post.from.id;
                            const apiUrl = `https://graph.facebook.com/${senderId}`;
                            const params = {
                              fields: 'id,first_name,last_name,profile_pic,email',
                              access_token: access_token,
                            };

                            const response = await axios.get(apiUrl, { params });

                            const commentData = new userConversation({
                              user_id: userId,
                              sender_id: senderId,
                              sender_message: post.message,
                              page_id: body.entry.id,
                              message_type: 'comment',
                              status_type: 'incoming',
                              first_name:response.data.first_name,
                              last_name:response.data.last_name,
                              profile_pic:response.data.profile_pic,
                              sender_email:response.data.email
                            })

                            await commentData.save();

                            
                            const messageToSend = commentData;
                            console.log(messageToSend)
                            io.emit('new-message', messageToSend);

                        
                        }
                        // Now you can handle the post, for example, send a reply or perform any other actions.
                    }
                }
            }

            else if (entry.messaging) {
                console.log(entry.messaging)
                for (const message of entry.messaging) {
                    if (message.sender && message.recipient) {
                      
                        console.log('in')
                        const pageId = message.recipient.id;
                        console.log(pageId);
                        if(message.sender.id ===pageId)
                          return;
                        const user = await User.findOne({page_id: pageId})
                        const userId = user.id
                        // const userId = user_id.id
                        console.log(userId);
                        // await handleMessage(message,userId);
                        const access_token = user.page_access_token;
                        // https://graph.facebook.com/7276557955756953?fields=first_name,last_name,profile_pic,email&access_token="
                        // const userDetails = await axios.get()
                        
                        // console.log(process.env.FACEBOOK_GRAPH_URI)
                        const senderId = message.sender.id;
                        console.log(access_token);
                        const apiUrl = `https://graph.facebook.com/${senderId}`;
                        const params = {
                          fields: 'id,first_name,last_name,profile_pic,email',
                          access_token: access_token,
                        };

                        const response = await axios.get(apiUrl, { params });

                        // Output the user details
                        console.log('User Details:', response.data);

                        // const conversation = await userConversation.find({user_id: userId}

                        const newConversation = new userConversation({
                            user_id: userId,
                            sender_id : senderId,
                            sender_message: message.message.text,
                            reciever_id: message.recipient.id,
                            status_type: 'incoming',
                            first_name: response.data.first_name,
                            last_name: response.data.last_name,
                            sender_email: response.data.email,
                            profile_pic: response.data.profile_pic,
                            message_type: 'message'

                        })
                        await newConversation.save()
                        const conversation = await userConversation.find({user_id: userId})
                        // conversation.push(newConversation);
                        console.log(conversation);
                        // console.log(response);
                        // message.sender.first_name = {'first_name':response.data.first_name};
                        // message.sender.last_name = {'second_name':response.data.last_name};
                        // message.sender.email = {'email':response.data.email};
                        // message.sender.profile_pic = {'profile_pic':response.data.profile_pic};

                        // const messageToSend = JSON.stringify({ type: 'message', data: message });
                        // console.log(messageToSend)
                        io.emit('new-message', newConversation);
                        // broadcast(messageToSend);
                        // Now you can handle the post, for example, send a reply or perform any other actions.
                    }
                }
            }
        }
    }

};
  


const replyToUser = async(req,res)=> {

    try { 

        const requestData = req.body;
        const userId = requestData.userID
        const user = await User.findById(userId);

        console.log(requestData);

        const senderId = requestData.senderId;
        const message = requestData.outgoingMessage.sender_message;
        const pageAccessToken = user.page_access_token;
        const pageId = user.page_id;
        // console.log('inside reply');
        // console.log(pageAccessToken);
        // console.log(message);
        // console.log(senderId);

        await replyUserMessage(senderId,message,pageAccessToken,pageId,userId);

        res.json({
            message
        })
    } catch(error) {
        next(error);

    }
}

const replyUserMessage = async (senderId, message,pageAccessToken,pageId,userId) => {
    const apiEndpoint = 'https://graph.facebook.com/v19.0/me/messages';
  
    const requestBody = {
      messaging_type: 'RESPONSE',
      recipient: {
        id: senderId,
      },
      message: {
        text: message,
      },
    };
  
    const params = {
      access_token: pageAccessToken,
    };
  
    try {
      const response = await axios.post(apiEndpoint, requestBody, { params });
      const user = new userConversation({
        sender_id:senderId,
        reciever_id:pageId,
        sender_message: message,
        status_type:'outgoing',
        user_id:userId
      })
      await user.save()
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error.response.data);
    }
  };

module.exports = {
    facebookAccessToken,
    facebookWebhook,
    incomingFacebookWebhook,
    replyToUser,
    //handleLogin,
    facebookLogin,
    //fetchList,
    fetchDetail,
    //updateMessage
}