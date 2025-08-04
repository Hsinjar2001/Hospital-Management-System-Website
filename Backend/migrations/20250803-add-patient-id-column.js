'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add patient_id column
      await queryInterface.addColumn('patients', 'patient_id', {
        type: Sequelize.STRING,
        allowNull: true, // Allow null initially
        unique: true
      });

      // Generate patient IDs for existing records
      const [results] = await queryInterface.sequelize.query(
        'SELECT id FROM patients WHERE patient_id IS NULL'
      );

      for (const patient of results) {
        await queryInterface.sequelize.query(
          `UPDATE patients SET patient_id = 'PAT-${Date.now()}-${patient.id}' WHERE id = ${patient.id}`
        );
      }

      // Make patient_id not null after populating existing records
      await queryInterface.changeColumn('patients', 'patient_id', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      });

      console.log('✅ Added patient_id column successfully');
    } catch (error) {
      console.log('⚠️ Migration may have already been applied:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('patients', 'patient_id');
      console.log('✅ Removed patient_id column successfully');
    } catch (error) {
      console.log('⚠️ Column may not exist:', error.message);
    }
  }
};
