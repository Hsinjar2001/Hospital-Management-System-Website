# Hospital Management System - Backend Tests

This directory contains comprehensive unit tests for the Hospital Management System backend API.

## Test Structure

```
tests/
├── README.md                 # This file
├── setup.js                  # Test setup and global utilities
├── authController.test.js    # Authentication controller tests
└── ...                       # Additional test files
```

## Running Tests

### Prerequisites
Make sure you have Jest installed:
```bash
npm install --save-dev jest supertest
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file (auth controller)
npm run test:auth

# Run tests matching a pattern
npx jest --testNamePattern="login"
```

## Test Coverage

The tests aim to achieve:
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

## Auth Controller Tests

### Test Cases Covered

#### 1. **register** function
- ✅ Successfully register a new user
- ✅ Return error if user already exists
- ✅ Handle validation errors
- ✅ Handle unique constraint errors
- ✅ Handle server errors

#### 2. **login** function
- ✅ Successfully login user
- ✅ Return error if user not found
- ✅ Return error if user is inactive
- ✅ Return error if password is invalid
- ✅ Handle server errors

#### 3. **getMe** function
- ✅ Return current user successfully
- ✅ Handle server errors

#### 4. **updateProfile** function
- ✅ Update user profile successfully
- ✅ Return error if user not found
- ✅ Handle server errors

#### 5. **changePassword** function
- ✅ Change password successfully
- ✅ Return error if user not found
- ✅ Return error if current password is incorrect
- ✅ Handle server errors

#### 6. **forgotPassword** function
- ✅ Send password reset token successfully
- ✅ Return error if user not found
- ✅ Handle server errors

#### 7. **resetPassword** function
- ✅ Reset password successfully
- ✅ Return error if token is invalid
- ✅ Return error if user not found
- ✅ Return error if token is expired

#### 8. **logout** function
- ✅ Logout successfully
- ✅ Handle server errors

## Doctor Controller Tests

### Test Cases Covered

#### 1. **createDoctor** function
- ✅ Successfully create a new doctor
- ✅ Return error if user already exists
- ✅ Return error if doctor ID already exists
- ✅ Return error if department not found
- ✅ Handle server errors

#### 2. **getAllDoctors** function
- ✅ Get all doctors successfully
- ✅ Handle server errors

#### 3. **getDoctorById** function
- ✅ Get doctor by ID successfully
- ✅ Return error if doctor not found
- ✅ Handle server errors

#### 4. **updateDoctor** function
- ✅ Update doctor successfully
- ✅ Return error if doctor not found
- ✅ Handle server errors

#### 5. **deleteDoctor** function
- ✅ Delete doctor successfully
- ✅ Return error if doctor not found
- ✅ Handle server errors

#### 6. **getDoctorStats** function
- ✅ Get doctor statistics successfully
- ✅ Handle server errors

## Patient Controller Tests

### Test Cases Covered

#### 1. **createPatient** function
- ✅ Successfully create a new patient
- ✅ Return error if user already exists
- ✅ Handle server errors

#### 2. **getAllPatients** function
- ✅ Get all patients successfully
- ✅ Handle server errors

#### 3. **getPatientById** function
- ✅ Get patient by ID successfully
- ✅ Return error if patient not found
- ✅ Handle server errors

#### 4. **updatePatient** function
- ✅ Update patient successfully
- ✅ Return error if patient not found
- ✅ Handle server errors

#### 5. **deletePatient** function
- ✅ Delete patient successfully
- ✅ Return error if patient not found
- ✅ Handle server errors

#### 6. **getPatientStats** function
- ✅ Get patient statistics successfully
- ✅ Handle server errors

#### 7. **searchPatients** function
- ✅ Search patients successfully
- ✅ Return empty array if no patients found
- ✅ Handle server errors

## Test Utilities

### Global Mocks
- `mockRequest(overrides)` - Creates mock request object
- `mockResponse()` - Creates mock response object with chained methods

### Environment Variables
Tests use `.env.test` file with test-specific configurations:
- `NODE_ENV=test`
- `JWT_SECRET=test-jwt-secret`
- `SUPPRESS_LOGS=true`

## Mocking Strategy

### External Dependencies
- **Models**: Mocked using `jest.mock('../models')`
- **JWT**: Mocked using `jest.mock('jsonwebtoken')`
- **Bcrypt**: Mocked using `jest.mock('bcryptjs')`

### Database Operations
All database operations are mocked to avoid actual database calls during testing.

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: All code paths are tested including error scenarios
4. **Assertions**: Comprehensive assertions verify both success and error cases
5. **Cleanup**: Mocks are cleared between tests using `jest.clearAllMocks()`

## Adding New Tests

When adding new test files:

1. Create test file with `.test.js` extension
2. Follow the existing naming convention
3. Import required dependencies and mock them
4. Use `describe` blocks to group related tests
5. Use `beforeEach` for test setup
6. Include both success and error test cases
7. Aim for high test coverage

## Example Test Structure

```javascript
describe('ControllerName', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('functionName', () => {
    it('should handle success case', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle error case', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines and will:
- Fail if coverage thresholds are not met
- Provide detailed error reporting
- Generate coverage reports in multiple formats

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure all dependencies are installed
2. **Timeout errors**: Increase timeout in jest.config.js
3. **Mock issues**: Check that mocks are properly cleared between tests
4. **Coverage issues**: Add tests for uncovered code paths
