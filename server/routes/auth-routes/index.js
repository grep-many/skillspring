const express = require('express');
const {
    registerUser,
    loginUser
} = require('../../controllers/auth-contoller/index');
const authenticateMiddleware = require('../../middleware/auth-middleware')
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/check-auth', authenticateMiddleware, (req, res) => {
    try{

        const user = req.user;
    
        res.status(200).json({
            success: true,
            message: 'Authorized User',
            data: {
                user
            }
        })
    }catch  (err){
        console.log(err)
    }
})

module.exports = router;