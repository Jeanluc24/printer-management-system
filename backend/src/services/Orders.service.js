const httpStatus = require("http-status");
const { OrdersModel, ConsumerModel, UserModel } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

class OrderService {
    static async createOrder(user, body) {
        await OrdersModel.create({
            userId: user,
            consumerId: body.user,
            items: body.items
        });

        return {
            msg: "Order Created Successfully"
        };
    }

    static async getAllorders(user, page = 1, query = '') {
        const limit = 10;
        const offset = (Number(page) - 1) * limit;

        // For searching in JSON array items
        const whereClause = {
            userId: user
        };

        // If you need to search within items array
        if (query) {
            // SQLite JSON search - this is a workaround
            // You might need to adjust based on your needs
            whereClause.items = {
                [Op.like]: `%${query}%`
            };
        }

        const data = await OrdersModel.findAll({
            where: whereClause,
            include: [
                {
                    model: ConsumerModel,
                    as: 'consumer',
                    attributes: ['name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const documents = await OrdersModel.count({ where: whereClause });
        const hasMore = offset + limit < documents;

        return {
            data,
            hasMore
        };
    }

    static async deleteOrder(user, id) {
        const existOrder = await OrdersModel.findOne({
            where: { userId: user, id }
        });

        if (!existOrder) {
            throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");
        }

        await existOrder.destroy();

        return {
            msg: 'Order Delete Successfully'
        };
    }

    static async getInvoiceById(user, id) {
        const order = await OrdersModel.findOne({
            where: { userId: user, id },
            attributes: ['items', 'createdAt'],
            include: [
                {
                    model: ConsumerModel,
                    as: 'consumer',
                    attributes: ['name', 'email', 'address']
                },
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['name']
                }
            ]
        });

        if (!order) {
            throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");
        }

        return order;
    }
}

module.exports = OrderService;