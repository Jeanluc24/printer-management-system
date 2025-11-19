const httpStatus = require("http-status");
const { ConsumerModel, OrdersModel } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

class ConsumerService {
    static async RegisterConsumer(user, body) {
        const { name, email, mobile, dob, address } = body;

        const checkExist = await ConsumerModel.findOne({
            where: { email, userId: user }
        });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Consumer Already in Record");
        }

        await ConsumerModel.create({
            name, email, mobile, dob, address, userId: user
        });

        return {
            msg: "Consumer Added :)"
        };
    }

    static async DeleteConsumer(user, id) {
        const checkExist = await ConsumerModel.findOne({
            where: { id, userId: user }
        });

        if (!checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Consumer Not Found in Record");
        }

        await checkExist.destroy(); // Sequelize way to delete
        await OrdersModel.destroy({ where: { consumerId: id } });

        return {
            msg: "Consumer Deleted :)"
        };
    }

    static async getById(user, id) {
        const checkExist = await ConsumerModel.findOne({
            where: { id, userId: user }
        });

        console.log({ user, id });

        if (!checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Consumer Not Found in Record");
        }

        return {
            user: checkExist
        };
    }

    static async GetAllUser(user, page = 1, query = '') {
        const limit = 10;
        const offset = (Number(page) - 1) * limit;

        const whereClause = {
            userId: user,
            [Op.or]: [
                { name: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
                { address: { [Op.like]: `%${query}%` } },
                { mobile: { [Op.like]: `%${query}%` } }
            ]
        };

        const data = await ConsumerModel.findAll({
            where: whereClause,
            attributes: ['name', 'email', 'mobile'],
            offset,
            limit
        });

        const totalConsumer = await ConsumerModel.count({ where: whereClause });
        const hasMore = offset + limit < totalConsumer;

        return {
            users: data,
            more: hasMore
        };
    }

    static async updateById(user, body, id) {
        const { name, email, mobile, dob, address } = body;

        const checkExist = await ConsumerModel.findByPk(id);

        if (!checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Consumer Not Found");
        }

        if (checkExist.email !== email) {
            const checkExistEmail = await ConsumerModel.findOne({
                where: { email, userId: user }
            });

            if (checkExistEmail) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Consumer Email Already in Another Record");
            }
        }

        await ConsumerModel.update(
            { name, email, mobile, dob, address },
            { where: { id } }
        );

        return {
            msg: "Consumer Update :)"
        };
    }

    static async GetUserForSearch(user) {
        const data = await ConsumerModel.findAll({
            where: { userId: user },
            attributes: ['name', 'dob']
        });

        return {
            users: data
        };
    }

    static async DashboardData(user) {
        const consumers = await ConsumerModel.count({ where: { userId: user } });
        
        const orders = await OrdersModel.findAll({
            where: { userId: user },
            attributes: ['items']
        });

        const arr = orders.map((order) => {
            return order.items.map((item) => item.price);
        });

        return {
            consumers,
            orders: orders.length,
            sell: arr.length > 0 ? arr.flat(2).reduce((a, c) => a + c, 0) : 0
        };
    }
}

module.exports = ConsumerService;