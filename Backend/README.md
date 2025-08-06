# Hospital Management System - Backend

A simplified hospital management system backend with essential features.

## Features

- **User Management**: Registration, login, profile management
- **Appointments**: Create, view, update, delete appointments
- **Invoices**: Generate and manage billing
- **Reviews**: Patient feedback system

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcryptjs for password hashing

## Models

- **User**: Patients and doctors
- **Appointment**: Medical appointments
- **Invoice**: Billing information
- **Review**: Patient feedback

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update database configuration in `.env`

4. Run database migrations:
```bash
bun run migrate
```

5. Start the server:
```bash
bun run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/doctor/:doctor_id` - Get doctor appointments
- `GET /api/appointments/patient/:patient_id` - Get patient appointments

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/pay` - Mark invoice as paid

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:id` - Get review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PATCH /api/reviews/:id/approve` - Approve review
- `GET /api/reviews/doctor/:doctor_id` - Get doctor reviews
- `GET /api/reviews/patient/:patient_id` - Get patient reviews

## Scripts

- `bun run dev` - Start development server
- `bun run start` - Start production server
- `bun run migrate` - Run database migrations
- `bun run seed` - Run database seeders
