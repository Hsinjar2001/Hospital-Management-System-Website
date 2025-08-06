const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctor', require('./routes/doctors'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Hospital Management System API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
