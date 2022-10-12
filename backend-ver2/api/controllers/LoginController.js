require('dotenv').config();
// const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const moment = require('moment');

var refreshTokens = [] ; // tao mot object refreshTokens

const postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await Users.findOne({ username: username });
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const accessToken = jwt.sign({ data:user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
                const refreshToken = jwt.sign({ data:user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'})

                refreshTokens.push(refreshToken);

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
    const {refreshToken} = req.body
    // if refresh token exists
    if(refreshToken && (refreshTokens.includes(refreshToken))) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
            if (err) {
                return res.status(403).json({ refreshToken: false, msg:'Authorization failed - Refresh token expired' });
            }
            const accessToken = jwt.sign({ data:data.data }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
            res.status(200).json({accessToken, msg:'Create new token'});        
        });
    } else {
        res.status(404).json({refreshToken:false, msg:'Refresh Token not found'});        
    }
}

module.exports = {
    postLogin,
    getNewToken
} 