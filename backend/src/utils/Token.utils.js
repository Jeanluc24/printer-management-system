const jwt = require("jsonwebtoken");
const { PUBLIC_DATA } = require("../../constant");

exports.generatoken = (user, expire = '1d') => {
    // Changed from user._id to user.id for Sequelize
    const token = jwt.sign(
        { userid: user.id }, 
        PUBLIC_DATA.jwt_auth, 
        { expiresIn: expire }
    );
    return token;
}

exports.validateToken = (token) => {
    const tokens = jwt.verify(token, PUBLIC_DATA.jwt_auth);
    return tokens;
}