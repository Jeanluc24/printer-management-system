const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  consumerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'consumers',
      key: 'id'
    },
    field: 'consumer_id'
  },
  items: {
    type: DataTypes.JSON, // SQLite will store this as JSON string
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;