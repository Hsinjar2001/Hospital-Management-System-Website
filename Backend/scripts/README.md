# Admin Scripts

This directory contains utility scripts for administrative tasks.

## Create Admin Account

### Usage

```bash
bun run create-admin
```

### What it does

- Creates a new admin account with predefined credentials
- Checks if an admin account already exists to prevent duplicates
- Uses proper password hashing through the User model hooks
- Provides detailed feedback during the process

### Default Admin Credentials

- **Email**: `admin@hospital.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Name**: Hospital Administrator

### Important Notes

⚠️ **Security Warning**: Change the default password immediately after first login!

### Features

- ✅ Duplicate prevention - won't create if admin already exists
- ✅ Proper error handling with detailed messages
- ✅ Database connection management
- ✅ Validation error reporting
- ✅ Clean exit codes for automation

### Error Handling

The script handles various error scenarios:
- Database connection issues
- Validation errors (email format, password length, etc.)
- Unique constraint violations
- General database errors

### Example Output

```
🔧 Starting admin account creation...
✅ Database connection established
🎉 Admin account created successfully!
📧 Email: admin@hospital.com
🔑 Password: admin123
👤 Name: Hospital Administrator
🆔 User ID: 1

⚠️ IMPORTANT: Please change the default password after first login!
🔌 Database connection closed
✅ Script completed
```