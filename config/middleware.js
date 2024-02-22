const jwt = require('jsonwebtoken');
const User = require('mongoose').model('userModel')

const isAuthenticated = async (req,res,next) => {
    try {
        let token = "";
        // console.log(req.headers.cookie);
        console.log(req.headers)

        if(req.headers.cookie){
            token = req.headers.cookie.split('=')[1]
        } else if (req.headers['auth-token']){
            // console.log('this..',req.headers['auth-token']);
            token = req.headers['auth-token']
        } else return res.status(403).json({"success":false,"message":"Access denied"});
        if (!token) return res.status(403).json({"success":false,"message":"Access denied"});

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if(!user) 
            return res.status(404).json({
                "success":true,
                "message":"User Not Found"
            })
        req.body.userID = decoded._id

       next(); 
    } catch(error) {
        throw error
    }
}

module.exports =  {isAuthenticated}
