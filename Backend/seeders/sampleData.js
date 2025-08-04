const bcrypt = require('bcryptjs');
const { User, Patient, Doctor, Department } = require('../models');

const seedSampleData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // No sample departments - departments will be created through admin panel

    // Create sample admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      firstName: 'Hospital',
      lastName: 'Administrator',
      email: 'admin@hospital.com',
      password: hashedPassword,
      phone: '+1-555-0001',
      role: 'admin',
      gender: 'other',
      dateOfBirth: '1980-01-01',
      address: '123 Hospital Street',
      city: 'Medical City',
      state: 'Healthcare State',
      zipCode: '12345',
      country: 'USA',
      nationality: 'American',
      isActive: true,
      isVerified: true
    });

    console.log('✅ Admin user created successfully');

    // Create sample doctor users
    const doctorUsers = await User.bulkCreate([
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        password: await bcrypt.hash('doctor123', 12),
        phone: '+1-555-1001',
        role: 'doctor',
        gender: 'female',
        dateOfBirth: '1975-03-15',
        address: '456 Medical Avenue',
        city: 'Medical City',
        state: 'Healthcare State',
        zipCode: '12345',
        country: 'USA',
        nationality: 'American',
        isActive: true,
        isVerified: true
      },
      {
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        email: 'michael.chen@hospital.com',
        password: await bcrypt.hash('doctor123', 12),
        phone: '+1-555-1002',
        role: 'doctor',
        gender: 'male',
        dateOfBirth: '1978-07-22',
        address: '789 Health Boulevard',
        city: 'Medical City',
        state: 'Healthcare State',
        zipCode: '12345',
        country: 'USA',
        nationality: 'American',
        isActive: true,
        isVerified: true
      },
      {
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        password: await bcrypt.hash('doctor123', 12),
        phone: '+1-555-1003',
        role: 'doctor',
        gender: 'female',
        dateOfBirth: '1982-11-08',
        address: '321 Care Street',
        city: 'Medical City',
        state: 'Healthcare State',
        zipCode: '12345',
        country: 'USA',
        nationality: 'American',
        isActive: true,
        isVerified: true
      }
    ]);

    console.log('✅ Doctor users created successfully');

    // No sample doctors - doctors will be created through admin panel

    // Create sample patient users
    const patientUsers = await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        password: await bcrypt.hash('patient123', 12),
        phone: '+1-555-2001',
        role: 'patient',
        gender: 'male',
        dateOfBirth: '1985-05-15',
        address: '123 Patient Street',
        city: 'Patient City',
        state: 'Patient State',
        zipCode: '54321',
        country: 'USA',
        nationality: 'American',
        isActive: true,
        isVerified: true
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@email.com',
        password: await bcrypt.hash('patient123', 12),
        phone: '+1-555-2002',
        role: 'patient',
        gender: 'female',
        dateOfBirth: '1990-08-22',
        address: '456 Patient Avenue',
        city: 'Patient City',
        state: 'Patient State',
        zipCode: '54321',
        country: 'USA',
        nationality: 'American',
        isActive: true,
        isVerified: true
      }
    ]);

    console.log('✅ Patient users created successfully');

    // Create sample patients
    const patients = await Patient.bulkCreate([
      {
        userId: patientUsers[0].id,
        patientId: 'PAT001',
        bloodGroup: 'O+',
        maritalStatus: 'married',
        occupation: 'Software Engineer',
        emergencyContactName: 'Mary Smith',
        emergencyContactPhone: '+1-555-2101',
        emergencyContactRelationship: 'Spouse',
        emergencyContactAddress: '123 Patient Street',
        emergencyContactEmail: 'mary.smith@email.com',
        medicalHistory: 'No significant medical history',
        allergies: 'None known',
        currentMedications: 'None',
        insuranceProvider: 'HealthCare Plus',
        insurancePolicyNumber: 'HCP123456',
        communicationPreference: 'email',
        height: 175.5,
        weight: 75.0,
        smoker: false,
        alcoholConsumer: false,
        hasChronicConditions: false,
        takingMedications: false,
        isMinor: false,
        status: 'active'
      },
      {
        userId: patientUsers[1].id,
        patientId: 'PAT002',
        bloodGroup: 'A+',
        maritalStatus: 'single',
        occupation: 'Teacher',
        emergencyContactName: 'Robert Doe',
        emergencyContactPhone: '+1-555-2102',
        emergencyContactRelationship: 'Father',
        emergencyContactAddress: '789 Family Street',
        emergencyContactEmail: 'robert.doe@email.com',
        medicalHistory: 'Asthma since childhood',
        allergies: 'Peanuts, shellfish',
        currentMedications: 'Albuterol inhaler',
        insuranceProvider: 'MediCare Pro',
        insurancePolicyNumber: 'MCP789012',
        communicationPreference: 'phone',
        height: 165.0,
        weight: 60.0,
        smoker: false,
        alcoholConsumer: false,
        hasChronicConditions: true,
        takingMedications: true,
        isMinor: false,
        status: 'active'
      }
    ]);

    console.log('✅ Patients created successfully');
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@hospital.com / admin123');
    console.log('Doctor: sarah.johnson@hospital.com / doctor123');
    console.log('Patient: john.smith@email.com / patient123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedSampleData().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = seedSampleData;
