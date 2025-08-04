const { User, Doctor, Department } = require('../models');
const doctorController = require('../controllers/doctorController');

// Mock the models
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
  },
  Doctor: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Department: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  }
}));

describe('Doctor Controller', () => {
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

  describe('createDoctor', () => {
    const validDoctorData = {
      firstName: 'Dr. John',
      lastName: 'Smith',
      email: 'dr.john@hospital.com',
      phone: '1234567890',
      dateOfBirth: '1980-01-01',
      gender: 'male',
      address: '123 Medical St',
      doctorId: 'DOC001',
      departmentId: 1,
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      licenseNumber: 'MD12345',
      medicalDegree: 'MD - Harvard Medical School',
      yearsOfExperience: 15,
      employmentType: 'full-time',
      consultationFee: 200.00,
      availability: 'available'
    };

    it('should create a new doctor successfully', async () => {
      req.body = validDoctorData;

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock Doctor.findOne to return null (doctor doesn't exist)
      Doctor.findOne.mockResolvedValue(null);

      // Mock Department.findByPk to return valid department
      Department.findByPk.mockResolvedValue({
        id: 1,
        name: 'Cardiology',
        isActive: true
      });

      // Mock User.create to return new user
      const mockUser = {
        id: 1,
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'dr.john@hospital.com',
        role: 'doctor',
        isActive: true
      };
      User.create.mockResolvedValue(mockUser);

      // Mock Doctor.create to return new doctor
      const mockDoctor = {
        id: 1,
        userId: 1,
        doctorId: 'DOC001',
        departmentId: 1,
        specialty: 'Cardiology',
        consultationFee: 200.00
      };
      Doctor.create.mockResolvedValue(mockDoctor);

      // Mock Doctor.findByPk for response
      Doctor.findByPk.mockResolvedValue({
        ...mockDoctor,
        user: mockUser,
        department: { id: 1, name: 'Cardiology' }
      });

      await doctorController.createDoctor(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: validDoctorData.email } });
      expect(Doctor.findOne).toHaveBeenCalledWith({ where: { doctorId: validDoctorData.doctorId } });
      expect(Department.findByPk).toHaveBeenCalledWith(validDoctorData.departmentId);
      expect(User.create).toHaveBeenCalled();
      expect(Doctor.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Doctor created successfully',
        data: expect.objectContaining({
          doctor: expect.any(Object)
        })
      });
    });

    it('should return error if user already exists', async () => {
      req.body = validDoctorData;

      // Mock User.findOne to return existing user
      User.findOne.mockResolvedValue({ id: 1, email: validDoctorData.email });

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User with this email already exists'
      });
    });

    it('should return error if doctor ID already exists', async () => {
      req.body = validDoctorData;

      User.findOne.mockResolvedValue(null);
      Doctor.findOne.mockResolvedValue({ id: 1, doctorId: validDoctorData.doctorId });

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Doctor with this ID already exists'
      });
    });

    it('should return error if department not found', async () => {
      req.body = validDoctorData;

      User.findOne.mockResolvedValue(null);
      Doctor.findOne.mockResolvedValue(null);
      Department.findByPk.mockResolvedValue(null);

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Department not found'
      });
    });

    it('should handle server errors', async () => {
      req.body = validDoctorData;

      User.findOne.mockRejectedValue(new Error('Database error'));

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error creating doctor'
      });
    });
  });

  describe('getAllDoctors', () => {
    it('should get all doctors successfully', async () => {
      const mockDoctors = [
        {
          id: 1,
          doctorId: 'DOC001',
          specialty: 'Cardiology',
          user: { firstName: 'Dr. John', lastName: 'Smith' },
          department: { name: 'Cardiology' }
        },
        {
          id: 2,
          doctorId: 'DOC002',
          specialty: 'Neurology',
          user: { firstName: 'Dr. Jane', lastName: 'Doe' },
          department: { name: 'Neurology' }
        }
      ];

      Doctor.findAll.mockResolvedValue(mockDoctors);

      await doctorController.getAllDoctors(req, res);

      expect(Doctor.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: User,
            as: 'user',
            attributes: expect.any(Array)
          },
          {
            model: Department,
            as: 'department',
            attributes: expect.any(Array)
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { doctors: mockDoctors }
      });
    });

    it('should handle server errors', async () => {
      Doctor.findAll.mockRejectedValue(new Error('Database error'));

      await doctorController.getAllDoctors(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error fetching doctors'
      });
    });
  });

  describe('getDoctorById', () => {
    it('should get doctor by ID successfully', async () => {
      req.params.id = '1';

      const mockDoctor = {
        id: 1,
        doctorId: 'DOC001',
        specialty: 'Cardiology',
        user: { firstName: 'Dr. John', lastName: 'Smith' },
        department: { name: 'Cardiology' }
      };

      Doctor.findByPk.mockResolvedValue(mockDoctor);

      await doctorController.getDoctorById(req, res);

      expect(Doctor.findByPk).toHaveBeenCalledWith('1', {
        include: expect.any(Array)
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { doctor: mockDoctor }
      });
    });

    it('should return error if doctor not found', async () => {
      req.params.id = '999';

      Doctor.findByPk.mockResolvedValue(null);

      await doctorController.getDoctorById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Doctor not found'
      });
    });

    it('should handle server errors', async () => {
      req.params.id = '1';

      Doctor.findByPk.mockRejectedValue(new Error('Database error'));

      await doctorController.getDoctorById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error fetching doctor'
      });
    });
  });

  describe('updateDoctor', () => {
    const updateData = {
      specialty: 'Interventional Cardiology',
      consultationFee: 250.00,
      availability: 'available'
    };

    it('should update doctor successfully', async () => {
      req.params.id = '1';
      req.body = updateData;

      const mockDoctor = {
        id: 1,
        doctorId: 'DOC001',
        update: jest.fn().mockResolvedValue(true)
      };

      const updatedDoctor = {
        id: 1,
        doctorId: 'DOC001',
        specialty: 'Interventional Cardiology',
        consultationFee: 250.00,
        user: { firstName: 'Dr. John', lastName: 'Smith' }
      };

      Doctor.findByPk.mockResolvedValueOnce(mockDoctor).mockResolvedValueOnce(updatedDoctor);

      await doctorController.updateDoctor(req, res);

      expect(Doctor.findByPk).toHaveBeenCalledWith('1');
      expect(mockDoctor.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Doctor updated successfully',
        data: { doctor: updatedDoctor }
      });
    });

    it('should return error if doctor not found', async () => {
      req.params.id = '999';
      req.body = updateData;

      Doctor.findByPk.mockResolvedValue(null);

      await doctorController.updateDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Doctor not found'
      });
    });

    it('should handle server errors', async () => {
      req.params.id = '1';
      req.body = updateData;

      Doctor.findByPk.mockRejectedValue(new Error('Database error'));

      await doctorController.updateDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error updating doctor'
      });
    });
  });

  describe('deleteDoctor', () => {
    it('should delete doctor successfully', async () => {
      req.params.id = '1';

      const mockDoctor = {
        id: 1,
        doctorId: 'DOC001',
        userId: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      const mockUser = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      Doctor.findByPk.mockResolvedValue(mockDoctor);
      User.findByPk.mockResolvedValue(mockUser);

      await doctorController.deleteDoctor(req, res);

      expect(Doctor.findByPk).toHaveBeenCalledWith('1');
      expect(mockDoctor.destroy).toHaveBeenCalled();
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Doctor deleted successfully'
      });
    });

    it('should return error if doctor not found', async () => {
      req.params.id = '999';

      Doctor.findByPk.mockResolvedValue(null);

      await doctorController.deleteDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Doctor not found'
      });
    });

    it('should handle server errors', async () => {
      req.params.id = '1';

      Doctor.findByPk.mockRejectedValue(new Error('Database error'));

      await doctorController.deleteDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error deleting doctor'
      });
    });
  });

  describe('getDoctorStats', () => {
    it('should get doctor statistics successfully', async () => {
      Doctor.count.mockResolvedValueOnce(50) // total doctors
                  .mockResolvedValueOnce(45) // active doctors
                  .mockResolvedValueOnce(5); // inactive doctors

      await doctorController.getDoctorStats(req, res);

      expect(Doctor.count).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalDoctors: 50,
          activeDoctors: 45,
          inactiveDoctors: 5
        }
      });
    });

    it('should handle server errors', async () => {
      Doctor.count.mockRejectedValue(new Error('Database error'));

      await doctorController.getDoctorStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error fetching doctor statistics'
      });
    });
  });
});
