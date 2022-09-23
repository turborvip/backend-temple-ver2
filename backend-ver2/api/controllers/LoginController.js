require('dotenv').config();
// const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const moment = require('moment');

var refreshTokens = {} ; // tao mot object refreshTokens

const postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await Users.findOne({ username: username });
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const accessToken = jwt.sign({ data:user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60' });
                const refreshToken = jwt.sign({ data:user }, process.env.SECRET_REFRESH, { expiresIn: '120'})

                refreshTokens[refreshToken] = {user, accessToken, refreshToken,msg: 'Login was success'}

                return res.status(200).json({user, accessToken, refreshToken,msg: 'Login was success'});
            } else {
                return res.status(401).json({msg: 'Password was wrong!' });
            }
        } else {
            return res.status(401).json({msg: 'Username was wrong!' });
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: 500, error: error, res: false });
    }
};

const getNewToken = (req,res) => {
    const {refreshToken,user} = req.body
    // if refresh token exists
    if(refreshToken && (refreshToken in refreshTokens)) {
        const accessToken = jwt.sign({ data:user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60' });
        // update the token in the list
        refreshTokens[refreshToken].token = accessToken

        res.status(200).json({accessToken, msg:'create new token'});        
    } else {
        res.status(404).json({msg:'Invalid request'});        
    }
}

module.exports = {
    postLogin,
    getNewToken
} 