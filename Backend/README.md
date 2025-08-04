# Hospital Management System - Backend

A comprehensive backend API for Hospital Management System built with Node.js, Express.js, PostgreSQL, and Sequelize ORM.

## 🚀 Features

- **Complete REST API** matching frontend functionality
- **User Management** - Patients, Doctors, Admin, Staff
- **Appointment System** - Booking, scheduling, management
- **Patient Records** - Comprehensive patient profiles
- **Doctor Management** - Profiles, schedules, availability
- **Department Management** - Hospital departments
- **Prescription System** - Digital prescriptions
- **Invoice & Billing** - Payment tracking
- **Review System** - Doctor ratings and reviews
- **Authentication & Authorization** - JWT-based security
- **File Upload** - Profile images and documents
- **Database Relations** - Proper foreign key relationships

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Update the `.env` file with your database credentials:
   ```env
   DB_NAME=Hospital_Management_System
   DB_USER=rajnish
   DB_PASSWORD=postgres
   DB_HOST=localhost
   PORT=5003
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database (if not exists)
   createdb Hospital_Management_System

   # Run the schema file (optional - Sequelize will create tables)
   psql -d Hospital_Management_System -f database_schema.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5003`

6. **Seed sample data (optional)**
   ```bash
   node seeders/sampleData.js
   ```

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Route controllers
│   ├── authController.js
│   ├── patientController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   ├── departmentController.js
│   ├── prescriptionController.js
│   ├── invoiceController.js
│   └── reviewController.js
├── middlewares/             # Custom middlewares
│   └── authMiddleware.js
├── models/                  # Sequelize models
│   ├── index.js            # Model associations
│   ├── User.js
│   ├── Patient.js
│   ├── Doctor.js
│   ├── Department.js
│   ├── Appointment.js
│   ├── Prescription.js
│   ├── Invoice.js
│   └── Review.js
├── routes/                  # API routes
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── doctorRoutes.js
│   ├── appointmentRoutes.js
│   ├── departmentRoutes.js
│   ├── prescriptionRoutes.js
│   ├── invoiceRoutes.js
│   └── reviewRoutes.js
├── uploads/                 # File uploads directory
├── database_schema.sql      # PostgreSQL schema
├── server.js               # Main server file
├── package.json
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Patients
- `GET /api/patients` - Get all patients (Admin/Doctor)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients/register` - Register new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (Admin)
- `GET /api/patients/search` - Search patients
- `GET /api/patients/:id/appointments` - Get patient appointments
- `GET /api/patients/:id/prescriptions` - Get patient prescriptions
- `GET /api/patients/:id/invoices` - Get patient invoices

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor (Admin)
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor (Admin)
- `GET /api/doctors/search` - Search doctors
- `GET /api/doctors/:id/appointments` - Get doctor appointments
- `GET /api/doctors/:id/schedule` - Get doctor schedule
- `PUT /api/doctors/:id/schedule` - Update doctor schedule
- `GET /api/doctors/:id/reviews` - Get doctor reviews

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/reschedule` - Reschedule appointment
- `PUT /api/appointments/:id/confirm` - Confirm appointment
- `PUT /api/appointments/:id/complete` - Complete appointment

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Admin)
- `PUT /api/departments/:id` - Update department (Admin)
- `DELETE /api/departments/:id` - Delete department (Admin)
- `GET /api/departments/:id/doctors` - Get department doctors

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/:id` - Get prescription by ID
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Admin**: Full access to all endpoints
- **Doctor**: Access to patient data, appointments, prescriptions
- **Patient**: Access to own data only
- **Staff**: Limited access based on requirements

## 📊 Database Schema

The database includes the following main tables:
- `users` - User accounts (patients, doctors, admin, staff)
- `patients` - Patient-specific information
- `doctors` - Doctor-specific information
- `departments` - Hospital departments
- `appointments` - Appointment bookings
- `prescriptions` - Medical prescriptions
- `invoices` - Billing and payments
- `reviews` - Doctor reviews and ratings

## 🚀 Deployment

1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   DB_HOST=your-production-db-host
   DB_NAME=your-production-db-name
   DB_USER=your-production-db-user
   DB_PASSWORD=your-production-db-password
   JWT_SECRET=your-very-secure-jwt-secret
   ```

2. **Database Migration**
   Run the `database_schema.sql` file on your production PostgreSQL instance.

3. **Start Production Server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

**Note**: This backend is designed to work seamlessly with the Hospital Management System frontend built with React, React Hook Form, and Tailwind CSS.
