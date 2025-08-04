const { User, Patient } = require('../models');
const patientController = require('../controllers/patientController');

// Mock the models
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
  },
  Patient: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
}));

describe('Patient Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 1, role: 'admin' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };


    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('createPatient', () => {
    const validPatientData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: '123 Main St, City, State',
      bloodGroup: 'O+'
    };

    it('should create a new patient successfully', async () => {
      req.body = validPatientData;

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock User.create to return new user
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'patient',
        isActive: true
      };
      User.create.mockResolvedValue(mockUser);

      // Mock Patient.create to return new patient
      const mockPatient = {
        id: 1,
        userId: 1,
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        bloodGroup: 'O+',
        phone: '1234567890',
        address: '123 Main St, City, State'
      };
      Patient.create.mockResolvedValue(mockPatient);

      // Mock Patient.findByPk for response
      Patient.findByPk.mockResolvedValue({
        ...mockPatient,
        user: mockUser
      });

      await patientController.createPatient(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: validPatientData.email } });
      expect(User.create).toHaveBeenCalledWith({
        firstName: validPatientData.firstName,
        lastName: validPatientData.lastName,
        email: validPatientData.email,
        phone: validPatientData.phone,
        dateOfBirth: validPatientData.dateOfBirth,
        gender: validPatientData.gender,
        address: validPatientData.address,
        role: 'patient',
        isActive: true
      });
      expect(Patient.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        fullName: 'John Doe',
        dateOfBirth: validPatientData.dateOfBirth,
        gender: validPatientData.gender,
        bloodGroup: validPatientData.bloodGroup,
        phone: validPatientData.phone,
        address: validPatientData.address
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Patient created successfully',
        data: expect.objectContaining({
          patient: expect.any(Object)
        })
      });
    });

    it('should return error if user already exists', async () => {
      req.body = validPatientData;

      // Mock User.findOne to return existing user
      User.findOne.mockResolvedValue({ id: 1, email: validPatientData.email });

      await patientController.createPatient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User with this email already exists'
      });
    });

    it('should handle server errors', async () => {
      req.body = validPatientData;

      User.findOne.mockRejectedValue(new Error('Database error'));

      await patientController.createPatient(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error creating patient'
      });
    });
  });

  describe('getAllPatients', () => {
    it('should get all patients successfully', async () => {
      const mockPatients = [
        {
          id: 1,
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01',
          gender: 'male',
          user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        },
        {
          id: 2,
          fullName: 'Jane Smith',
          dateOfBirth: '1985-05-15',
          gender: 'female',
          user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
        }
      ];

      Patient.findAll.mockResolvedValue(mockPatients);

      await patientController.getAllPatients(req, res);

      expect(Patient.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: User,
            as: 'user',
            attributes: expect.any(Array)
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { patients: mockPatients }
      });
    });

    it('should handle server errors', async () => {
      Patient.findAll.mockRejectedValue(new Error('Database error'));

      await patientController.getAllPatients(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error fetching patients'
      });
    });
  });

  describe('getPatientById', () => {
    it('should get patient by ID successfully', async () => {
      req.params.id = '1';

      const mockPatient = {
        id: 1,
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
      };

      Patient.findByPk.mockResolvedValue(mockPatient);

      await patientController.getPatientById(req, res);

      expect(Patient.findByPk).toHaveBeenCalledWith('1', {
        include: expect.any(Array)
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { patient: mockPatient }
      });
    });

    it('should return error if patient not found', async () => {
      req.params.id = '999';

      Patient.findByPk.mockResolvedValue(null);

      await patientController.getPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Patient not found'
      });
    });

    it('should handle server errors', async () => {
      req.params.id = '1';

      Patient.findByPk.mockRejectedValue(new Error('Database error'));

      await patientController.getPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error fetching patient'
      });
    });
  });

  describe('updatePatient', () => {
    const updateData = {
      phone: '9876543210',
      address: '456 New Address St',
      bloodGroup: 'A+'
    };

    it('should update patient successfully', async () => {
      req.params.id = '1';
      req.body = updateData;

      const mockPatient = {
        id: 1,
        fullName: 'John Doe',
        update: jest.fn().mockResolvedValue(true)
      };

      const updatedPatient = {
        id: 1,
        fullName: 'John Doe',
        phone: '9876543210',
        address: '456 New Address St',
        bloodGroup: 'A+',
        user: { firstName: 'John', lastName: 'Doe' }
      };

      Patient.findByPk.mockResolvedValueOnce(mockPatient).mockResolvedValueOnce(updatedPatient);

      await patientController.updatePatient(req, res);

      expect(Patient.findByPk).toHaveBeenCalledWith('1');
      expect(mockPatient.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Patient updated successfully',
        data: { patient: updatedPatient }
      });
    });

    it('should return error if patient not found', async () => {
      req.params.id = '999';
      req.body = updateData;

      Patient.findByPk.mockResolvedValue(null);

      await patientController.updatePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Patient not found'
      });
    });

    it('should handle server errors', async () => {
      req.params.id = '1';
      req.body = updateData;

      Patient.findByPk.mockRejectedValue(new Error('Database error'));

      await patientController.updatePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error updating patient'
      });
    });
  });

  describe('deletePatient', () => {
    it('should delete patient successfully', async () => {
      req.params.id = '1';

      const mockPatient = {
        id: 1,
        fullName: 'John Doe',
        userId: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      const mockUser = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      Patient.findByPk.mockResolvedValue(mockPatient);
      User.findByPk.mockResolvedValue(mockUser);

      await patientController.deletePatient(req, res);

      expect(Patient.findByPk).toHaveBeenCalledWith('1');
      expect(mockPatient.destroy).toHaveBeenCalled();
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Patient deleted successfully'
      });
    });

    it('should return error if patient not found', async () => {
      req.params.id = '999';

      Patient.findByPk.mockResolvedValue(null);

      await patientController.deletePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Patient not found'
      });
    });

    it('should handle server errors', async () => {
      req.params.id = '1';

      Patient.findByPk.mockRejectedValue(new Error('Database error'));

      await patientController.deletePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error deleting patient'
      });
    });
  });

  describe('getPatientStats', () => {
    it('should get patient statistics successfully', async () => {
      Patient.count.mockResolvedValueOnce(100) // total patients
                   .mockResolvedValueOnce(95)  // active patients
                   .mockResolvedValueOnce(5);  // inactive patients

      await patientController.getPatientStats(req, res);

      expect(Patient.count).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalPatients: 100,
          activePatients: 95,
          inactivePatients: 5
        }
      });
    });

    it('should handle server errors', async () => {
      Patient.count.mockRejectedValue(new Error('Database error'));

      await patientController.getPatientStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error fetching patient statistics'
      });
    });
  });

  describe('searchPatients', () => {
    it('should search patients successfully', async () => {
      req.query.search = 'John';

      const mockPatients = [
        {
          id: 1,
          fullName: 'John Doe',
          user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        },
        {
          id: 2,
          fullName: 'John Smith',
          user: { firstName: 'John', lastName: 'Smith', email: 'johnsmith@example.com' }
        }
      ];

      Patient.findAll.mockResolvedValue(mockPatients);

      await patientController.searchPatients(req, res);

      expect(Patient.findAll).toHaveBeenCalledWith({
        include: expect.any(Array),
        where: expect.any(Object),
        order: [['createdAt', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { patients: mockPatients }
      });
    });

    it('should return empty array if no patients found', async () => {
      req.query.search = 'NonExistent';

      Patient.findAll.mockResolvedValue([]);

      await patientController.searchPatients(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { patients: [] }
      });
    });

    it('should handle server errors', async () => {
      req.query.search = 'John';

      Patient.findAll.mockRejectedValue(new Error('Database error'));

      await patientController.searchPatients(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error searching patients'
      });
    });
  });
});
