const bcrypt = require('bcryptjs');
const { User } = require('../models');
const sequelize = require('../config/database');

const createAdminAccount = async () => {
  try {
    console.log('🔧 Starting admin account creation...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    const adminEmail = 'admin@hospital.com';
    
    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin account already exists with email:', adminEmail);
      console.log('Admin ID:', existingAdmin.id);
      console.log('Admin Name:', existingAdmin.getFullName());
      return;
    }
    
    const adminData = {
      firstName: 'Hospital',
      lastName: 'Administrator',
      email: adminEmail,
      password: 'admin123',
      phone: '+1-555-0001',
      role: 'admin',
      isActive: true,
      gender: 'other',
      dateOfBirth: '1980-01-01',
      address: '123 Hospital Street, Medical City'
    };
    
    const adminUser = await User.create(adminData);
    
    console.log('🎉 Admin account created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Name:', adminUser.getFullName());
    console.log('🆔 User ID:', adminUser.id);
    console.log('\n⚠️ IMPORTANT: Please change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation errors:');
      error.errors.forEach(err => {
        console.error(`- ${err.path}: ${err.message}`);
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Email already exists in the database');
    }
    
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
};

if (require.main === module) {
  createAdminAccount()
    .then(() => {
      console.log('✅ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = createAdminAccount;