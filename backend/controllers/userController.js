const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const createToken = (id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
  
    return jwt.sign({ id }, jwtkey, { expiresIn: "30d" });
};

// #desc   ->  Register new User
// #route  ->  POST /api/users
// #access ->  Public
const registerUser = asyncHandler(async (req , res)=>{
    const {name , email , password} = req.body

    if (!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    // checking existing user
    const userExists = await User.findOne({email});
    if (userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    // HASHING PASSWORD USING BCRYPT
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)

    //Create user
    const user = await User.create({
        name , email , password : hashedPassword
    })

    if (user){
        res.status(201).json({
            _id : user.id ,
            name : user.name,
            email: user.email,
            token: createToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Data')
    }

})

// #desc   ->  login User
// #route  ->  POST /api/users/login
// #access ->  Public
const loginUser = asyncHandler(async (req , res)=>{
    const {email , password} = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please fill all fields')
    }

    const userExists = await User.findOne({email})

    if (!userExists){
        res.status(400)
        throw new Error('Logged in user not found!')
    }

    const correctPassword = await bcrypt.compare(password , userExists.password)

    if (!correctPassword){
        res.status(401)
        throw new Error('Email and password are not matching');
    }

    // generating web token
    const token = createToken(userExists._id)

    res.status(200).json({id : userExists._id , name: userExists.name , email: userExists.email , token:token}) 
})

// #desc   ->  get user data
// #route  ->  GET /api/users/me
// #access ->  Private
const getMe = asyncHandler(async (req , res)=>{
    
    try {
        const {_id , name , email } = await User.findById(req.user.id);

        res.status(200).json({
            message : "User data display",
            id : _id , 
            name : name , 
            email : email ,
        })
        
    } catch (error) {
        console.log("Get me function error" + error)
    }
    
    
})

module.exports = {

    registerUser,
    loginUser,
    getMe,
    
}