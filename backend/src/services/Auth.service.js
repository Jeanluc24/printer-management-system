const httpStatus = require("http-status");
const { UserModel, ProfileModel } = require("../models");
const ApiError = require("../utils/ApiError");
const { generatoken } = require("../utils/Token.utils");
const axios = require("axios");
const { Op } = require("sequelize");

class AuthService {
    static async RegisterUser(body) {
        const { email, password, name, token } = body;

       /* const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
            params: {
                secret: process.env.CAPTCHA_SCREATE_KEY,
                response: token,
            }
        });

        const data = await response.data;

        if (!data.success) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
        }
*/
        // Sequelize: findOne with where clause
        const checkExist = await UserModel.findOne({ where: { email } });
        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "User Already Registered");
        }

        // Sequelize: create returns the instance directly
        const user = await UserModel.create({
            email, password, name
        });

        const tokend = generatoken(user);
        const refresh_token = generatoken(user, '2d');
        
        await ProfileModel.create({
            userId: user.id, // Changed from user._id to user.id
            refresh_token
        });

        return {
            msg: "User Register Successfully",
            token: tokend
        };
    }

    static async LoginUser(body) {
        const { email, password, token } = body;

        /*const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
            params: {
                secret: process.env.CAPTCHA_SCREATE_KEY,
                response: token,
            }
        });

        const data = await response.data;

        if (!data.success) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
        }*/

        const checkExist = await UserModel.findOne({ where: { email } });
        if (!checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
        }

        if (password !== checkExist.password) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Credentials");
        }

        const tokend = generatoken(checkExist);

        return {
            msg: "User Login Successfully",
            token: tokend
        };
    }

    static async ProfileService(user) {
        // Sequelize: findByPk with attributes (replaces select)
        const checkExist = await UserModel.findByPk(user, {
            attributes: ['name', 'email']
        });

        if (!checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
        }

        return {
            msg: "Data fetched",
            user: checkExist
        };
    }
}

module.exports = AuthService;