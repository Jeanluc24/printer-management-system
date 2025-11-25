const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/db.config');

// Import your models - adjust paths based on your actual model files
// Check your src/models folder for the exact model names
const User = sequelize.models.users || require('./src/models/User');
const Profile = sequelize.models.profiles || require('./src/models/Profile');
const Consumer = sequelize.models.consumers || require('./src/models/Consumer');
const Order = sequelize.models.orders || require('./src/models/Order');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@printer.com',
      password: hashedPassword
    });
    console.log('✅ Admin created: admin@printer.com / admin123\n');

    // Create Regular User
    console.log('👤 Creating regular user...');
    const userPassword = await bcrypt.hash('user123', 10);
    
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@printer.com',
      password: userPassword
    });
    console.log('✅ User created: john@printer.com / user123\n');

    // Create Sample Data based on your tables
    console.log('📦 Creating sample data...');
    
    // Add sample consumers, orders, or profiles based on your models
    // Uncomment and adjust based on your actual schema
    
    /*
    await Consumer.create({
      name: 'Sample Consumer',
      email: 'consumer@example.com'
    });

    await Order.create({
      userId: admin.id,
      status: 'pending',
      total: 100.00
    });
    */

    console.log('✅ Sample data created\n');

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

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();