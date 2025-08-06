const { Appointment } = require('../models');

const createSampleAppointments = async () => {
  try {
    console.log('Creating sample appointments...');
    
    const appointments = await Appointment.bulkCreate([
      {
        appointment_id: 'APT001',
        patient_id: 2,
        doctor_id: 1,
        appointment_date: '2024-02-15',
        appointment_time: '10:00:00',
        appointment_type: 'consultation',
        status: 'scheduled',
        symptoms: 'Regular checkup',
        duration: 30,
        consultation_fee: 200.00
      },
      {
        appointment_id: 'APT002',
        patient_id: 2,
        doctor_id: 1,
        appointment_date: '2024-02-16',
        appointment_time: '14:30:00',
        appointment_type: 'follow-up',
        status: 'completed',
        symptoms: 'Follow-up consultation',
        duration: 30,
        consultation_fee: 150.00
      }
    ]);
    
    console.log(`✅ Created ${appointments.length} sample appointments`);
    console.log('Sample appointments created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample appointments:', error);
  }
};

if (require.main === module) {
  createSampleAppointments().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = createSampleAppointments;
