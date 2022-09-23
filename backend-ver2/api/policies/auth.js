const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let authorizationHeader = req.headers.authorization;
    let token = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    if (token == null) {
        return res.json({ auth: false });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            err = {
                name: 'JsonWebTokenError',
                message: 'jwt signature is required or expired',
            }
            console.log("err", err)
            return res.json({ auth: false });
        }
        req.auth = true;
        req.dataUser = data;
        req.token = token;
        next();
    });
};
