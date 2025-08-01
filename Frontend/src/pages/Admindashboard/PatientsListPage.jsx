// pages/Admindashboard/PatientsListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientsListPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);

  // Sample patients data
  const samplePatients = [
    {
      id: 'PAT-2024-001',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      age: 34,
      gender: 'Male',
      bloodGroup: 'O+',
      status: 'Active',
      primaryDoctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      lastVisit: '2024-01-15',
      registrationDate: '2020-03-15',
      totalAppointments: 24,
      pendingBills: 850.00,
      profileImage: null
    },
    {
      id: 'PAT-2024-002',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 987-6543',
      dateOfBirth: '1985-12-22',
      age: 39,
      gender: 'Female',
      bloodGroup: 'A+',
      status: 'Active',
      primaryDoctor: 'Dr. Michael Wilson',
      department: 'Orthopedics',
      lastVisit: '2024-01-18',
      registrationDate: '2019-08-10',
      totalAppointments: 18,
      pendingBills: 0,
      profileImage: null
    },
    {
      id: 'PAT-2024-003',
      firstName: 'Robert',
      lastName: 'Brown',
      fullName: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '+1 (555) 456-7890',
      dateOfBirth: '2018-03-10',
      age: 6,
      gender: 'Male',
      bloodGroup: 'B+',
      status: 'Active',
      primaryDoctor: 'Dr. Emily Davis',
      department: 'Pediatrics',
      lastVisit: '2024-01-12',
      registrationDate: '2018-03-15',
      totalAppointments: 32,
      pendingBills: 120.00,
      profileImage: null
    },
    {
      id: 'PAT-2024-004',
      firstName: 'Lisa',
      lastName: 'Anderson',
      fullName: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 321-0987',
      dateOfBirth: '1978-09-30',
      age: 45,
      gender: 'Female',
      bloodGroup: 'AB-',
      status: 'Inactive',
      primaryDoctor: 'Dr. James Miller',
      department: 'Dermatology',
      lastVisit: '2023-11-20',
      registrationDate: '2021-01-08',
      totalAppointments: 8,
      pendingBills: 0,
      profileImage: null
    },
    {
      id: 'PAT-2024-005',
      firstName: 'David',
      lastName: 'Wilson',
      fullName: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 654-3210',
      dateOfBirth: '1965-07-14',
      age: 59,
      gender: 'Male',
      bloodGroup: 'O-',
      status: 'Active',
      primaryDoctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      lastVisit: '2024-01-20',
      registrationDate: '2015-05-20',
      totalAppointments: 56,
      pendingBills: 1200.00,
      profileImage: null
    },
    {
      id: 'PAT-2024-006',
      firstName: 'Maria',
      lastName: 'Garcia',
      fullName: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 789-0123',
      dateOfBirth: '1992-11-08',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A-',
      status: 'Active',
      primaryDoctor: 'Dr. Anna Rodriguez',
      department: 'Gynecology',
      lastVisit: '2024-01-16',
      registrationDate: '2022-02-14',
      totalAppointments: 12,
      pendingBills: 350.00,
      profileImage: null
    },
    {
      id: 'PAT-2024-007',
      firstName: 'Michael',
      lastName: 'Johnson',
      fullName: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      phone: '+1 (555) 012-3456',
      dateOfBirth: '1988-04-25',
      age: 36,
      gender: 'Male',
      bloodGroup: 'B-',
      status: 'Active',
      primaryDoctor: 'Dr. Robert Chen',
      department: 'Neurology',
      lastVisit: '2024-01-14',
      registrationDate: '2020-09-12',
      totalAppointments: 28,
      pendingBills: 0,
      profileImage: null
    },
    {
      id: 'PAT-2024-008',
      firstName: 'Sarah',
      lastName: 'Taylor',
      fullName: 'Sarah Taylor',
      email: 'sarah.taylor@email.com',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '2010-12-03',
      age: 14,
      gender: 'Female',
      bloodGroup: 'O+',
      status: 'Active',
      primaryDoctor: 'Dr. Emily Davis',
      department: 'Pediatrics',
      lastVisit: '2024-01-17',
      registrationDate: '2010-12-15',
      totalAppointments: 42,
      pendingBills: 75.00,
      profileImage: null
    }
  ];

  // Load patients
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPatients(samplePatients);
        setFilteredPatients(samplePatients);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // Filter and sort patients
  useEffect(() => {
    let filtered = patients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status.toLowerCase() === statusFilter);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(patient => patient.gender.toLowerCase() === genderFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(patient => patient.department === departmentFilter);
    }

    // Age range filter
    if (ageRangeFilter !== 'all') {
      filtered = filtered.filter(patient => {
        const age = patient.age;
        switch (ageRangeFilter) {
          case 'child': return age < 18;
          case 'adult': return age >= 18 && age < 65;
          case 'senior': return age >= 65;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'age':
          aValue = a.age;
          bValue = b.age;
          break;
        case 'lastVisit':
          aValue = new Date(a.lastVisit);
          bValue = new Date(b.lastVisit);
          break;
        case 'registrationDate':
          aValue = new Date(a.registrationDate);
          bValue = new Date(b.registrationDate);
          break;
        default:
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [patients, searchTerm, statusFilter, genderFilter, departmentFilter, ageRangeFilter, sortBy, sortOrder]);

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get age category
  const getAgeCategory = (age) => {
    if (age < 18) return 'Child';
    if (age < 65) return 'Adult';
    return 'Senior';
  };

  // Calculate statistics
  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'Active').length,
    inactive: patients.filter(p => p.status === 'Inactive').length,
    children: patients.filter(p => p.age < 18).length,
    adults: patients.filter(p => p.age >= 18 && p.age < 65).length,
    seniors: patients.filter(p => p.age >= 65).length,
    totalPendingBills: patients.reduce((sum, p) => sum + p.pendingBills, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage patient records and information
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/patients/add')}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Children</p>
              <p className="text-2xl font-bold text-gray-900">{stats.children}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Bills</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalPendingBills.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Gynecology">Gynecology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
            <select
              value={ageRangeFilter}
              onChange={(e) => setAgeRangeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ages</option>
              <option value="child">Children (0-17)</option>
              <option value="adult">Adults (18-64)</option>
              <option value="senior">Seniors (65+)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setGenderFilter('all');
                setDepartmentFilter('all');
                setAgeRangeFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Patients List ({filteredPatients.length} patients)
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="lastVisit">Last Visit</option>
                  <option value="registrationDate">Registration Date</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demographics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : currentPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No patients found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/patients/${patient.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          {patient.profileImage ? (
                            <img 
                              src={patient.profileImage} 
                              alt={patient.fullName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-white text-sm font-bold">
                              {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                          <div className="text-sm text-gray-500">{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.phone}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.age} years • {patient.gender}</div>
                      <div className="text-sm text-gray-500">Blood: {patient.bloodGroup}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.primaryDoctor}</div>
                      <div className="text-sm text-gray-500">{patient.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{patient.totalAppointments} total visits</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                      {patient.pendingBills > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          ${patient.pendingBills} pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/patients/${patient.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/patients/edit/${patient.id}`);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/appointments/add', { state: { patientId: patient.id } });
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Schedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, filteredPatients.length)} of {filteredPatients.length} patients
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsListPage;
