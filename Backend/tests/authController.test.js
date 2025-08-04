const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const authController = require('../controllers/authController');

// Mock the models
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  }
}));

// Mock jwt
jest.mock('jsonwebtoken');

// Mock bcrypt
jest.mock('bcryptjs');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      role: 'patient'
    };

    it('should register a new user successfully', async () => {
      req.body = validUserData;

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock User.create to return new user
      const mockUser = {
        id: 1,
        ...validUserData,
        isActive: true
      };
      User.create.mockResolvedValue(mockUser);

      // Mock jwt.sign
      jwt.sign.mockReturnValue('mock-token');

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: validUserData.email } });
      expect(User.create).toHaveBeenCalledWith(validUserData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: mockUser.id,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            phone: mockUser.phone,
            role: mockUser.role,
            isActive: mockUser.isActive
          },
          token: 'mock-token'
        }
      });
    });

    it('should return error if user already exists', async () => {
      req.body = validUserData;

      // Mock User.findOne to return existing user
      User.findOne.mockResolvedValue({ id: 1, email: validUserData.email });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User with this email already exists'
      });
    });

    it('should handle validation errors', async () => {
      req.body = validUserData;

      User.findOne.mockResolvedValue(null);
      
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [
        { message: 'Email is required' },
        { message: 'Password must be at least 6 characters' }
      ];
      
      User.create.mockRejectedValue(validationError);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation error',
        details: ['Email is required', 'Password must be at least 6 characters']
      });
    });

    it('should handle unique constraint errors', async () => {
      req.body = validUserData;

      User.findOne.mockResolvedValue(null);
      
      const uniqueError = new Error('Unique constraint error');
      uniqueError.name = 'SequelizeUniqueConstraintError';
      
      User.create.mockRejectedValue(uniqueError);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email already exists'
      });
    });

    it('should handle server errors', async () => {
      req.body = validUserData;

      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(new Error('Database error'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error registering user',
        details: 'Database error'
      });
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123'
    };

    it('should login user successfully', async () => {
      req.body = loginData;

      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: loginData.email,
        phone: '1234567890',
        role: 'patient',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        update: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
      expect(mockUser.update).toHaveBeenCalledWith({ lastLoginAt: expect.any(Date) });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: mockUser.id,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            phone: mockUser.phone,
            role: mockUser.role,
            isActive: mockUser.isActive,
            lastLoginAt: expect.any(Date)
          },
          token: 'mock-token'
        }
      });
    });

    it('should return error if user not found', async () => {
      req.body = loginData;

      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should return error if user is inactive', async () => {
      req.body = loginData;

      const mockUser = {
        id: 1,
        email: loginData.email,
        isActive: false
      };

      User.findOne.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Account is deactivated'
      });
    });

    it('should return error if password is invalid', async () => {
      req.body = loginData;

      const mockUser = {
        id: 1,
        email: loginData.email,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should handle server errors', async () => {
      req.body = loginData;

      User.findOne.mockRejectedValue(new Error('Database error'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error logging in'
      });
    });
  });

  describe('getMe', () => {
    it('should return current user successfully', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'patient'
      };

      User.findByPk.mockResolvedValue(mockUser);

      await authController.getMe(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockUser }
      });
    });

    it('should handle server errors', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      await authController.getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error getting user profile'
      });
    });
  });

  describe('updateProfile', () => {
    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '9876543210',
      gender: 'female',
      address: '123 Main St'
    };

    it('should update user profile successfully', async () => {
      req.body = updateData;

      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        update: jest.fn().mockResolvedValue(true)
      };

      const updatedUser = {
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '9876543210',
        gender: 'female',
        address: '123 Main St'
      };

      User.findByPk.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);

      await authController.updateProfile(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.user.id);
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    });

    it('should return error if user not found', async () => {
      req.body = updateData;

      User.findByPk.mockResolvedValue(null);

      await authController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found'
      });
    });

    it('should handle server errors', async () => {
      req.body = updateData;

      User.findByPk.mockRejectedValue(new Error('Database error'));

      await authController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error updating profile',
        details: 'Database error'
      });
    });
  });

  describe('changePassword', () => {
    const passwordData = {
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123'
    };

    it('should change password successfully', async () => {
      req.body = passwordData;

      const mockUser = {
        id: 1,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };

      User.findByPk.mockResolvedValue(mockUser);

      await authController.changePassword(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.user.id);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(passwordData.currentPassword);
      expect(mockUser.password).toBe(passwordData.newPassword);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password changed successfully'
      });
    });

    it('should return error if user not found', async () => {
      req.body = passwordData;

      User.findByPk.mockResolvedValue(null);

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found'
      });
    });

    it('should return error if current password is incorrect', async () => {
      req.body = passwordData;

      const mockUser = {
        id: 1,
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findByPk.mockResolvedValue(mockUser);

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Current password is incorrect'
      });
    });

    it('should handle server errors', async () => {
      req.body = passwordData;

      User.findByPk.mockRejectedValue(new Error('Database error'));

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error changing password'
      });
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordData = {
      email: 'john@example.com'
    };

    it('should send password reset token successfully', async () => {
      req.body = forgotPasswordData;

      const mockUser = {
        id: 1,
        email: forgotPasswordData.email,
        update: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('reset-token');

      await authController.forgotPassword(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: forgotPasswordData.email } });
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      expect(mockUser.update).toHaveBeenCalledWith({
        passwordResetToken: 'reset-token',
        passwordResetExpires: expect.any(Date)
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset email sent',
        data: {
          resetToken: 'reset-token'
        }
      });
    });

    it('should return error if user not found', async () => {
      req.body = forgotPasswordData;

      User.findOne.mockResolvedValue(null);

      await authController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User with this email not found'
      });
    });

    it('should handle server errors', async () => {
      req.body = forgotPasswordData;

      User.findOne.mockRejectedValue(new Error('Database error'));

      await authController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error processing forgot password request'
      });
    });
  });

  describe('resetPassword', () => {
    const resetPasswordData = {
      token: 'valid-reset-token',
      newPassword: 'newpassword123'
    };

    it('should reset password successfully', async () => {
      req.body = resetPasswordData;

      const mockUser = {
        id: 1,
        passwordResetExpires: new Date(Date.now() + 3600000), // 1 hour from now
        save: jest.fn().mockResolvedValue(true)
      };

      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await authController.resetPassword(req, res);

      expect(jwt.verify).toHaveBeenCalledWith(resetPasswordData.token, process.env.JWT_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.password).toBe(resetPasswordData.newPassword);
      expect(mockUser.passwordResetToken).toBeNull();
      expect(mockUser.passwordResetExpires).toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset successfully'
      });
    });

    it('should return error if token is invalid', async () => {
      req.body = resetPasswordData;

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error resetting password'
      });
    });

    it('should return error if user not found', async () => {
      req.body = resetPasswordData;

      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(null);

      await authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid reset token'
      });
    });

    it('should return error if token is expired', async () => {
      req.body = resetPasswordData;

      const mockUser = {
        id: 1,
        passwordResetExpires: new Date(Date.now() - 3600000) // 1 hour ago (expired)
      };

      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Reset token has expired'
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await authController.logout(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully'
      });
    });

    it('should handle server errors', async () => {
      // Mock console.error to avoid test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Force an error by making res.json throw
      res.json.mockImplementation(() => {
        throw new Error('Server error');
      });

      await authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      consoleSpy.mockRestore();
    });
  });
});
