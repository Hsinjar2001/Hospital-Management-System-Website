const bcrypt = require('bcryptjs');
const { User, Patient, Doctor, Department, Appointment } = require('../models');

const seedSampleData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data to prevent duplicate key violations
    await Appointment.destroy({ where: {} });
    await Doctor.destroy({ where: {} });
    await Patient.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Department.destroy({ where: {} });
    console.log('🗑️ Cleared existing data');

    // No sample departments - departments will be created through admin panel

    // Create sample admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      first_name: 'Hospital',
      last_name: 'Administrator',
      email: 'admin@hospital.com',
      password: hashedPassword,
      phone: '+1-555-0001',
      role: 'admin',
      gender: 'other',
      date_of_birth: '1980-01-01',
      address: '123 Hospital Street',
      city: 'Medical City',
      state: 'Healthcare State',
      zip_code: '12345',
      country: 'USA',
      nationality: 'American',
      is_active: true,
      is_verified: true
    });

    console.log('✅ Admin user created successfully');

    // Create sample doctor users
    const doctorUsers = await User.bulkCreate([
      {
        first_name: 'Dr. Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        password: await bcrypt.hash('doctor123', 12),
        phone: '+1-555-1001',
        role: 'doctor',
        gender: 'female',
        date_of_birth: '1975-03-15',
        address: '456 Medical Avenue',
        city: 'Medical City',
        state: 'Healthcare State',
        zip_code: '12345',
        country: 'USA',
        nationality: 'American',
        is_active: true,
        is_verified: true
      },
      {
        first_name: 'Dr. Michael',
        last_name: 'Chen',
        email: 'michael.chen@hospital.com',
        password: await bcrypt.hash('doctor123', 12),
        phone: '+1-555-1002',
        role: 'doctor',
        gender: 'male',
        date_of_birth: '1978-07-22',
        address: '789 Health Boulevard',
        city: 'Medical City',
        state: 'Healthcare State',
        zip_code: '12345',
        country: 'USA',
        nationality: 'American',
        is_active: true,
        is_verified: true
      },
      {
        first_name: 'Dr. Emily',
        last_name: 'Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        password: await bcrypt.hash('doctor123', 12),
        phone: '+1-555-1003',
        role: 'doctor',
        gender: 'female',
        date_of_birth: '1982-11-08',
        address: '321 Care Street',
        city: 'Medical City',
        state: 'Healthcare State',
        zip_code: '12345',
        country: 'USA',
        nationality: 'American',
        is_active: true,
        is_verified: true
      }
    ]);

    console.log('✅ Doctor users created successfully');

    // Create sample departments
    const departments = await Department.bulkCreate([
      {
        name: 'Cardiology',
        description: 'Heart and cardiovascular system care'
      },
      {
        name: 'Neurology',
        description: 'Brain and nervous system disorders'
      },
      {
        name: 'Pediatrics',
        description: 'Medical care for infants, children, and adolescents'
      }
    ]);

    console.log('✅ Departments created successfully');

    // Create sample doctors
    const doctors = await Doctor.bulkCreate([
      {
        user_id: doctorUsers[0].id,
        doctor_id: 'DOC001',
        department_id: departments[0].id,
        license_number: 'LIC001',
        specialty: 'Cardiology',
        qualifications: 'MD - Harvard Medical School, Fellowship in Interventional Cardiology',
        experience: 10
      },
      {
        user_id: doctorUsers[1].id,
        doctor_id: 'DOC002',
        department_id: departments[1].id,
        license_number: 'LIC002',
        specialty: 'Neurology',
        qualifications: 'MD - Johns Hopkins, Residency in Neurology',
        experience: 8
      },
      {
        user_id: doctorUsers[2].id,
        doctor_id: 'DOC003',
        department_id: departments[2].id,
        license_number: 'LIC003',
        specialty: 'Pediatrics',
        qualifications: 'MD - Stanford Medical School, Board Certified Pediatrician',
        experience: 12
      }
    ]);

    console.log('✅ Doctors created successfully');

    // Create sample patient users
    const patientUsers = await User.bulkCreate([
      {
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@email.com',
        password: await bcrypt.hash('patient123', 12),
        phone: '+1-555-2001',
        role: 'patient',
        gender: 'male',
        date_of_birth: '1985-05-15',
        address: '123 Patient Street',
        city: 'Patient City',
        state: 'Patient State',
        zip_code: '54321',
        country: 'USA',
        nationality: 'American',
        is_active: true,
        is_verified: true
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@email.com',
        password: await bcrypt.hash('patient123', 12),
        phone: '+1-555-2002',
        role: 'patient',
        gender: 'female',
        date_of_birth: '1990-08-22',
        address: '456 Patient Avenue',
        city: 'Patient City',
        state: 'Patient State',
        zip_code: '54321',
        country: 'USA',
        nationality: 'American',
        is_active: true,
        is_verified: true
      }
    ]);

    console.log('✅ Patient users created successfully');

    // Create sample patients
    const patients = await Patient.bulkCreate([
      {
        user_id: patientUsers[0].id,
        full_name: 'John Smith',
        date_of_birth: '1985-05-15',
        gender: 'male',
        blood_group: 'O+',
        phone: '+1-555-2001',
        address: '123 Patient Street, Patient City, Patient State 54321'
      },
      {
        user_id: patientUsers[1].id,
        full_name: 'Jane Doe',
        date_of_birth: '1990-08-22',
        gender: 'female',
        blood_group: 'A+',
        phone: '+1-555-2002',
        address: '456 Patient Avenue, Patient City, Patient State 54321'
      }
    ]);

    console.log('✅ Patients created successfully');

    // Create sample appointments
    const appointments = await Appointment.bulkCreate([
      {
        appointment_id: 'APT001',
        patient_id: patients[0].id,
        doctor_id: doctors[0].id,
        department_id: departments[0].id,
        appointment_date: '2024-02-15',
        appointment_time: '10:00:00',
        appointment_type: 'consultation',
        patient_type: 'existing',
        priority: 'normal',
        status: 'scheduled',
        symptoms: 'Chest pain and shortness of breath',
        duration: 30,
        consultation_fee: 200.00,
        payment_status: 'pending'
      },
      {
        appointment_id: 'APT002',
        patient_id: patients[1].id,
        doctor_id: doctors[1].id,
        department_id: departments[1].id,
        appointment_date: '2024-02-16',
        appointment_time: '14:30:00',
        appointment_type: 'follow-up',
        patient_type: 'existing',
        priority: 'normal',
        status: 'scheduled',
        symptoms: 'Headaches and dizziness',
        duration: 30,
        consultation_fee: 180.00,
        payment_status: 'pending'
      },
      {
        appointment_id: 'APT003',
        patient_id: patients[0].id,
        doctor_id: doctors[2].id,
        department_id: departments[2].id,
        appointment_date: '2024-02-17',
        appointment_time: '09:00:00',
        appointment_type: 'routine',
        patient_type: 'existing',
        priority: 'low',
        status: 'scheduled',
        symptoms: 'Regular checkup for child',
        duration: 45,
        consultation_fee: 150.00,
        payment_status: 'pending'
      }
    ]);

    console.log('✅ Appointments created successfully');
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
