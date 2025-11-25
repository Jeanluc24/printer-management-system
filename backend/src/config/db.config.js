const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const ConnectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Export both ConnectDB and sequelize
module.exports = {
  sequelize,
  ConnectDB
};