const mongoose = require('mongoose');
const validator = require('validator');
const jwt =  require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = new mongoose.Schema({
    name : {
        type: String,
        required : [true, "Name Cannot be Empty"]
    },
    email : {
        type : String,
        required : [true, "E-Mail Cannot be Empty"],
        validate : [validator.isEmail,"Please enter valid email"],
        unique : true,
        lowercase: true
    },
    password : {
        type: String,
        required : true,
        minlength : [8,"Password length must be at least 8 character long"],
        maxlength : [128,"Password length must be less than 128 character long"]
    },
    token : {
        type: String,
        default:""
    },
    page_id : {
        type: String,
        default: "",
    },
    page_access_token: {
        type : String,
        default:"",
    },
    auth_code : {
        type: String,
        default:"",
    }
},{
    timestamps: true
});

userModel.pre('save', async function() {
    const user = this;
    if(!user.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
});

userModel.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password)

}
userModel.methods.generatAuthToken = function () {
    const token  = jwt.sign({ _id : this._id }, process.env.JWT_SECRET,{expiresIn: '1d'});
    return token;
}


const user = mongoose.model("userModel",userModel);
module.exports = {
    user,
};

