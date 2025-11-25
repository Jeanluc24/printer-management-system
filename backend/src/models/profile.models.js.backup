const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Profile = sequelize.define('Profile', {
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
  refresh_token: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  tableName: 'profiles',
  timestamps: true
});

module.exports = Profile;