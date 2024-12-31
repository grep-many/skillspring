const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../../config/envConfig')

const registerUser = async (req, res) => {
    const { userName, userEmail, password, role } = req.body;

    const existingUser = await User.findOne({
        $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists!",
        });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            userEmail,
            role,
            password: hashPassword,
        });

        console.log(newUser)

        await newUser.save();

        const checkUser = await User.findOne({ userEmail });

        const accessToken = jwt.sign({
            _id: checkUser._id,
            userName: checkUser.userName,
            userEmail: checkUser.userEmail,
            role: checkUser.role
        }, jwtSecret, { expiresIn: '24h' });

        res.status(200).json({
            success: true,
            message: 'Signed Up Successfully!',
            data: {
                accessToken,
                user: {
                    _id: checkUser._id,
                    userName: checkUser.userName,
                    userEmail: checkUser.userEmail,
                    role: checkUser.role
                }
            }
        })

    } catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    try{

        const { userEmail, password } = req.body;
    
        const checkUser = await User.findOne({ userEmail });
    
        if (!checkUser || !(await bcrypt.compare(password, checkUser?.password))) {
            res.status(!checkUser?404:401).json({
                success: false,
                message: 'Invalid Credentials!'
            })
        }
    
        if(checkUser){
            const accessToken = jwt.sign({
                _id: checkUser._id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role
            }, jwtSecret, { expiresIn: '24h' });
            
            res.status(200).json({
                success: true,
                message: 'Logged in Successfully!',
                data: {
                    accessToken,
                    user: {
                        _id: checkUser._id,
                        userName: checkUser.userName,
                        userEmail: checkUser.userEmail,
                        role: checkUser.role
                    }
                }
            })
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    registerUser,
    loginUser
};