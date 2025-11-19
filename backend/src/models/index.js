const sequelize = require('../config/db.config');
const User = require('./user.models');
const Profile = require('./profile.models');
const Consumer = require('./Consumer.models');
const Order = require('./Orders.models');

// Define relationships
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Consumer, { foreignKey: 'userId', as: 'consumers' });
Consumer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Consumer.hasMany(Order, { foreignKey: 'consumerId', as: 'orders' });
Order.belongsTo(Consumer, { foreignKey: 'consumerId', as: 'consumer' });

// Export models
exports.UserModel = User;
exports.ProfileModel = Profile;
exports.ConsumerModel = Consumer;
exports.OrdersModel = Order;
exports.sequelize = sequelize;