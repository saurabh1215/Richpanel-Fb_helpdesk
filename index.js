const express = require('express');

const app = express();
const PORT=3000;

// Use express-session for session management


const session = require('express-session');
const axios = require('axios');

app.use(session({
    secret: 'e827aa6674cbf61baa485008fa95cb4e',
    resave: true,
    saveUninitialized: true,
  }));



// Facebook App credentials
const clientId = '1336663367050448';
const clientSecret = 'e827aa6674cbf61baa485008fa95cb4e';
const redirectUri = 'http://localhost:3000/user/authCode';

const facebookGraphApiBaseUrl = 'https://graph.facebook.com/v19.0';

var access_tokenn='';

var pageId='';

function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/');
  }

  
  // Redirect to Facebook for authentication
  app.get('/auth/facebook', (req, res) => {
    const authUrl = `${facebookGraphApiBaseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement,email,page_events,pages_manage_posts,read_page_mailboxes,pages_read_user_content,pages_messaging,pages_show_list`;
    res.redirect(authUrl);
  });

  app.get('/face',(req,res)=> {

    const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,read_page_mailboxes,pages_messaging,pages_messaging_subscriptions,page_events,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts,email`;
    res.redirect(url);
  })
  
  // Callback route after successful authentication
  app.get('/user/authCode', async (req, res) => {
    const { code } = req.query;
  
    try {
        console.log(code)
        // console.log(req)
      const response = await axios.get(`${facebookGraphApiBaseUrl}/oauth/access_token`, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: code,
        },
      });
      console.log(response.data)
      access_tokenn = response.data.access_token
      console.log(access_tokenn)
      // Store user access token in the session
      req.session.userAccessToken = response.data.access_token;
  
      // Redirect to the page to list conversations
      res.redirect('/page-id');
    } catch (error) {
      console.error('Error during Facebook authentication:', error.message);
      res.redirect('/');
    }
  });

  app.get('/page-id',async (req,res)=> {
    try {
      console.log(access_tokenn)
      const response = await axios.get(`${facebookGraphApiBaseUrl}/me/accounts`, {
        params: {
          access_token: 'EAApyLl8Q1ZAcBO1B0wS2Li5BeaIQsv6i8ZBiWVV8ZCGF2YeXUoPE1GmeYLOGZAin0SbRLkEcowCy1iZBHR10Tqh2rKBdnNIoZBY4run0k6g1V0VQbLzKiBET5ZA1FfohMTKDDBNxUT7Kmvvue5rYK7qXbdvJZCWUEyNZC4NB8ODL3TU7IwJ1ibKo9LKjpYLAyVPfYRXbSr20SYgxZACf99fTAPUDE1t7pWBXbkAZA1soMcdBFZCohedzGomZCXUrY2wZDZD'
     } });

      console.log(response.data)
      pageId = response.data.id;
      const category = response.data.category;
      const pagename = response.data.name;


      console.log(pageId);

      res.json({
        category,
        pagename,
        pageId
      })
    
    } catch (error) {
      console.log(error);
      throw error;
    }
  })
  
  // List conversations route
  app.get('/conversations', async (req, res) => {
    try {
      // Retrieve the user's pages
      const pagesResponse = await axios.get(`${facebookGraphApiBaseUrl}/me/accounts`, {
        params: {
          access_token: access_token
        },
      });
  
      // Assuming the user has at least one page
      const userPage = pagesResponse.data.data[0];
  
      // Retrieve conversations for the page
      const conversationsResponse = await axios.get(`${facebookGraphApiBaseUrl}/${userPage.id}/conversations`, {
        params: {
          access_token: userPage.access_token,
        },
      });
  
      const conversations = conversationsResponse.data.data;
  
      // Render the list of conversations
      res.json({ success: true, data: conversations });
    } catch (error) {
      console.error('Error retrieving conversations:', error.message);
      res.json({ success: false, error: 'Error retrieving conversations' });
    }
  });
  
  // Retrieve messages for a conversation route
  app.get('/messages/:conversationId', isAuthenticated, async (req, res) => {
    const { conversationId } = req.params;
  
    try {
      // Retrieve messages for the conversation
      const messagesResponse = await axios.get(`${facebookGraphApiBaseUrl}/${conversationId}/messages`, {
        params: {
          access_token: req.session.userAccessToken,
        },
      });
  
      const messages = messagesResponse.data.data;
  
      // Render the list of messages
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error('Error retrieving messages:', error.message);
      res.json({ success: false, error: 'Error retrieving messages' });
    }
  });
  
  // Reply to a message route
  app.post('/reply/:conversationId', isAuthenticated, async (req, res) => {
    const { conversationId } = req.params;
    const { message } = req.body;
  
    try {
      // Reply to the conversation
      await axios.post(`${facebookGraphApiBaseUrl}/${conversationId}/messages`, {
        message: message,
        access_token: req.session.userAccessToken,
      });
  
      res.json({ success: true, message: 'Reply sent successfully' });
    } catch (error) {
      console.error('Error replying to message:', error.message);
      res.json({ success: false, error: 'Error replying to message' });
    }
  });
  
  // Home route
  app.get('/', (req, res) => {
    res.send('<h1>Facebook Connect POC</h1><a href="/auth/facebook">Connect with Facebook</a>');
  });


app.get('/comments', async (req, res) => {
    try {
        const postsResponse = await axios.get(`${facebookGraphApiBaseUrl}/251139034744515/posts`, {
            params: { access_token: 'EAASZCsDEtZANABO4UJDwerYV23lxLpri2h1kpKaRMzUWZAcw20ADtJr6ZBhr10ctSILMOAbEa9UmrJtXAWZBD3N7PrDbCggIBNo2dwLxsv4ZCow62V2C8MjqMlWbroWZAYvUZCeTvGlki6A9RBONcE0G44RvZBXSZASIo3kZAWBa2Hgxf5aIvpF5KCzJhd7ZBZAT3TnEZD' }
        });

        const posts = postsResponse.data.data;
        console.log(posts)
        for (const post of posts) {
            const postId = post.id;
            await fetchAndReplyToComments(postId);
            console.log("\n");
        }

      return res.json({
        posts
      })
    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
})

async function fetchAndReplyToComments(postId) {
    try {
        const commentsResponse = await axios.get(`${facebookGraphApiBaseUrl}/${postId}/comments`, {
            params: { access_token: 'EAASZCsDEtZANABO4UJDwerYV23lxLpri2h1kpKaRMzUWZAcw20ADtJr6ZBhr10ctSILMOAbEa9UmrJtXAWZBD3N7PrDbCggIBNo2dwLxsv4ZCow62V2C8MjqMlWbroWZAYvUZCeTvGlki6A9RBONcE0G44RvZBXSZASIo3kZAWBa2Hgxf5aIvpF5KCzJhd7ZBZAT3TnEZD' }
        });

        const comments = commentsResponse.data.data;
        console.log(comments);
        for (const comment of comments) {
            const commentId = comment.id;
            const userId = comment.from.id;
            const message = 'Your reply message here.';

            console.log(comment)
        }

    } catch (error) {
        console.error('Error fetching or replying to comments:', error.message);
    }
}












// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
