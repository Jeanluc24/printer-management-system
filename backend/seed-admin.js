const bcrypt = require('bcryptjs');

// Import sequelize and models
const { sequelize } = require('./src/config/db.config');
const User = require('./src/models/user.models');
const Profile = require('./src/models/profile.models');
const Consumer = require('./src/models/Consumer.models');
const Order = require('./src/models/Orders.models');

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@printer.com' } 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@printer.com');
      console.log('🔑 Password: admin123\n');
      await sequelize.close();
      process.exit(0);
    }

    // Create Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@printer.com',
      password: hashedPassword
    });
    console.log('✅ Admin created!\n');

    // Create Regular User
    console.log('👤 Creating regular user...');
    const userPassword = await bcrypt.hash('user123', 10);
    
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@printer.com',
      password: userPassword
    });
    console.log('✅ Regular user created!\n');

    // Create sample profiles (if your schema supports it)
    try {
      console.log('📝 Creating sample profiles...');
      await Profile.create({
        userId: admin.id,
        bio: 'System Administrator',
        phone: '+250788123456'
      });

      await Profile.create({
        userId: regularUser.id,
        bio: 'Regular User',
        phone: '+250788654321'
      });
      console.log('✅ Profiles created!\n');
    } catch (error) {
      console.log('⚠️  Could not create profiles (optional):', error.message, '\n');
    }

    // Create sample consumers (if applicable)
    try {
      console.log('🛒 Creating sample consumers...');
      await Consumer.create({
        name: 'Sample Consumer 1',
        email: 'consumer1@example.com',
        phone: '+250788111111'
      });

      await Consumer.create({
        name: 'Sample Consumer 2',
        email: 'consumer2@example.com',
        phone: '+250788222222'
      });
      console.log('✅ Consumers created!\n');
    } catch (error) {
      console.log('⚠️  Could not create consumers (optional):', error.message, '\n');
    }

    // Create sample orders (if applicable)
    try {
      console.log('📦 Creating sample orders...');
      const consumer = await Consumer.findOne();
      
      if (consumer) {
        await Order.create({
          consumerId: consumer.id,
          status: 'pending',
          total: 15000
        });

        await Order.create({
          consumerId: consumer.id,
          status: 'completed',
          total: 25000
        });
        console.log('✅ Orders created!\n');
      }
    } catch (error) {
      console.log('⚠️  Could not create orders (optional):', error.message, '\n');
    }

    console.log('════════════════════════════════════════');
    console.log('🎉 Database seeded successfully!');
    console.log('════════════════════════════════════════');
    console.log('\n📋 Login Credentials:\n');
    console.log('Admin Account:');
    console.log('  📧 Email: admin@printer.com');
    console.log('  🔑 Password: admin123\n');
    console.log('User Account:');
    console.log('  📧 Email: john@printer.com');
    console.log('  🔑 Password: user123\n');
    console.log('⚠️  Please change these passwords after first login!');
    console.log('════════════════════════════════════════\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('\nFull error details:', error.message);
    await sequelize.close();
    process.exit(1);
  }
};

seedDatabase();