// pages/Admindashboard/DepartmentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const DepartmentPage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Sample departments data
  const sampleDepartments = [
    {
      id: 'DEPT-001',
      name: 'Cardiology',
      description: 'Specialized care for heart and cardiovascular system conditions',
      head: 'Dr. Sarah Johnson',
      headId: 'DOC-001',
      totalDoctors: 8,
      totalPatients: 245,
      totalBeds: 25,
      availableBeds: 5,
      status: 'active',
      location: 'Wing A, Floor 2',
      phone: '+1 (555) 201-0001',
      email: 'cardiology@hospital.com',
      budget: 250000,
      revenue: 450000,
      establishedDate: '2010-01-15',
      operatingHours: '24/7',
      emergencyServices: true,
      specialties: ['Interventional Cardiology', 'Electrophysiology', 'Heart Failure'],
      equipment: ['ECG Machines', 'Cardiac Catheterization Lab', 'Echocardiography'],
      createdAt: '2010-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'DEPT-002',
      name: 'Neurology',
      description: 'Comprehensive neurological care for brain and nervous system disorders',
      head: 'Dr. Michael Wilson',
      headId: 'DOC-002',
      totalDoctors: 6,
      totalPatients: 189,
      totalBeds: 20,
      availableBeds: 8,
      status: 'active',
      location: 'Wing B, Floor 3',
      phone: '+1 (555) 201-0002',
      email: 'neurology@hospital.com',
      budget: 200000,
      revenue: 320000,
      establishedDate: '2012-03-20',
      operatingHours: '8:00 AM - 8:00 PM',
      emergencyServices: true,
      specialties: ['Stroke Care', 'Epilepsy', 'Movement Disorders'],
      equipment: ['MRI Scanner', 'EEG Machines', 'Neurological Testing Equipment'],
      createdAt: '2012-03-20T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'DEPT-003',
      name: 'Orthopedics',
      description: 'Musculoskeletal care including bones, joints, and spine treatment',
      head: 'Dr. Emily Davis',
      headId: 'DOC-003',
      totalDoctors: 10,
      totalPatients: 312,
      totalBeds: 30,
      availableBeds: 12,
      status: 'active',
      location: 'Wing C, Floor 1-2',
      phone: '+1 (555) 201-0003',
      email: 'orthopedics@hospital.com',
      budget: 300000,
      revenue: 520000,
      establishedDate: '2008-06-10',
      operatingHours: '6:00 AM - 10:00 PM',
      emergencyServices: true,
      specialties: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery'],
      equipment: ['X-Ray Machines', 'Arthroscopy Equipment', 'Physical Therapy'],
      createdAt: '2008-06-10T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'DEPT-004',
      name: 'Pediatrics',
      description: 'Specialized medical care for infants, children, and adolescents',
      head: 'Dr. James Miller',
      headId: 'DOC-004',
      totalDoctors: 12,
      totalPatients: 428,
      totalBeds: 35,
      availableBeds: 15,
      status: 'active',
      location: 'Wing D, Floor 1-3',
      phone: '+1 (555) 201-0004',
      email: 'pediatrics@hospital.com',
      budget: 180000,
      revenue: 280000,
      establishedDate: '2005-09-01',
      operatingHours: '24/7',
      emergencyServices: true,
      specialties: ['Neonatal Care', 'Pediatric Surgery', 'Child Development'],
      equipment: ['Pediatric Monitors', 'Incubators', 'Child-friendly Equipment'],
      createdAt: '2005-09-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'DEPT-005',
      name: 'Emergency Medicine',
      description: 'Critical emergency and trauma care services available 24/7',
      head: 'Dr. Anna Rodriguez',
      headId: 'DOC-005',
      totalDoctors: 15,
      totalPatients: 156,
      totalBeds: 40,
      availableBeds: 8,
      status: 'active',
      location: 'Ground Floor, Main Building',
      phone: '+1 (555) 201-0005',
      email: 'emergency@hospital.com',
      budget: 400000,
      revenue: 600000,
      establishedDate: '2000-01-01',
      operatingHours: '24/7',
      emergencyServices: true,
      specialties: ['Trauma Care', 'Critical Care', 'Emergency Surgery'],
      equipment: ['Trauma Bay', 'Resuscitation Equipment', 'Emergency OR'],
      createdAt: '2000-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'DEPT-006',
      name: 'Radiology',
      description: 'Advanced medical imaging and diagnostic services',
      head: 'Dr. Robert Chen',
      headId: 'DOC-006',
      totalDoctors: 4,
      totalPatients: 89,
      totalBeds: 0,
      availableBeds: 0,
      status: 'maintenance',
      location: 'Basement Level, Imaging Center',
      phone: '+1 (555) 201-0006',
      email: 'radiology@hospital.com',
      budget: 150000,
      revenue: 220000,
      establishedDate: '2015-11-20',
      operatingHours: '6:00 AM - 12:00 AM',
      emergencyServices: false,
      specialties: ['CT Scans', 'MRI', 'Ultrasound', 'X-Ray'],
      equipment: ['MRI Machine', 'CT Scanner', 'Ultrasound Machines', 'Digital X-Ray'],
      createdAt: '2015-11-20T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  // Sample doctors for dropdown
  const availableDoctors = [
    { id: 'DOC-001', name: 'Dr. Sarah Johnson' },
    { id: 'DOC-002', name: 'Dr. Michael Wilson' },
    { id: 'DOC-003', name: 'Dr. Emily Davis' },
    { id: 'DOC-004', name: 'Dr. James Miller' },
    { id: 'DOC-005', name: 'Dr. Anna Rodriguez' },
    { id: 'DOC-006', name: 'Dr. Robert Chen' },
    { id: 'DOC-007', name: 'Dr. Lisa Thompson' },
    { id: 'DOC-008', name: 'Dr. David Lee' }
  ];

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDepartments(sampleDepartments);
        setFilteredDepartments(sampleDepartments);
      } catch (error) {
        console.error('Error loading departments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  // Filter departments
  useEffect(() => {
    let filtered = departments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(dept => dept.status === statusFilter);
    }

    setFilteredDepartments(filtered);
  }, [departments, searchTerm, statusFilter]);

  // Handle department submission (Add/Edit)
  const onSubmit = async (data) => {
    try {
      if (selectedDepartment) {
        // Edit existing department
        const updatedDepartment = {
          ...selectedDepartment,
          ...data,
          updatedAt: new Date().toISOString()
        };
        setDepartments(departments.map(dept => 
          dept.id === selectedDepartment.id ? updatedDepartment : dept
        ));
        setShowEditModal(false);
        alert('✅ Department updated successfully!');
      } else {
        // Add new department
        const newDepartment = {
          id: `DEPT-${String(departments.length + 1).padStart(3, '0')}`,
          ...data,
          totalPatients: 0,
          revenue: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setDepartments([newDepartment, ...departments]);
        setShowAddModal(false);
        alert('✅ Department created successfully!');
      }
      reset();
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Error saving department:', error);
      alert('❌ Failed to save department. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (department) => {
    setSelectedDepartment(department);
    // Populate form with existing data
    Object.keys(department).forEach(key => {
      setValue(key, department[key]);
    });
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      setDepartments(departments.filter(dept => dept.id !== departmentId));
      alert('✅ Department deleted successfully!');
    }
  };

  // Handle status change
  const handleStatusChange = (departmentId, newStatus) => {
    setDepartments(departments.map(dept => 
      dept.id === departmentId 
        ? { ...dept, status: newStatus, updatedAt: new Date().toISOString() }
        : dept
    ));
    alert(`✅ Department status updated to ${newStatus}`);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total statistics
  const totalStats = {
    totalDepartments: departments.length,
    activeDepartments: departments.filter(d => d.status === 'active').length,
    totalDoctors: departments.reduce((sum, dept) => sum + dept.totalDoctors, 0),
    totalPatients: departments.reduce((sum, dept) => sum + dept.totalPatients, 0),
    totalBeds: departments.reduce((sum, dept) => sum + dept.totalBeds, 0),
    availableBeds: departments.reduce((sum, dept) => sum + dept.availableBeds, 0),
    totalRevenue: departments.reduce((sum, dept) => sum + dept.revenue, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage hospital departments and their operations
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Department
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalDepartments}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Departments</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.activeDepartments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalDoctors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(totalStats.totalRevenue / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bed Occupancy Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bed Occupancy Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalStats.totalBeds}</div>
            <div className="text-sm text-gray-600">Total Beds</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{totalStats.availableBeds}</div>
            <div className="text-sm text-gray-600">Available Beds</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{totalStats.totalBeds - totalStats.availableBeds}</div>
            <div className="text-sm text-gray-600">Occupied Beds</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Occupancy Rate</span>
            <span className="text-sm font-medium">
              {Math.round(((totalStats.totalBeds - totalStats.availableBeds) / totalStats.totalBeds) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full" 
              style={{ width: `${Math.round(((totalStats.totalBeds - totalStats.availableBeds) / totalStats.totalBeds) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Departments</label>
            <input
              type="text"
              placeholder="Search by name, head, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500">No departments found matching your criteria.</p>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <div key={department.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{department.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{department.description}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(department.status)}`}>
                    {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Department Head:</span>
                    <span className="font-medium text-gray-900">{department.head}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{department.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Doctors:</span>
                    <span className="font-medium text-gray-900">{department.totalDoctors}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Patients:</span>
                    <span className="font-medium text-gray-900">{department.totalPatients}</span>
                  </div>
                  {department.totalBeds > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Beds Available:</span>
                      <span className="font-medium text-gray-900">
                        {department.availableBeds}/{department.totalBeds}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium text-green-600">${department.revenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDepartment(department);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEdit(department)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                    <select
                      value={department.status}
                      onChange={(e) => handleStatusChange(department.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Department</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Department name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter department name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Head <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('headId', { required: 'Department head is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department Head</option>
                      {availableDoctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                    {errors.headId && (
                      <p className="text-red-500 text-sm mt-1">{errors.headId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('location', { required: 'Location is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Wing A, Floor 2"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="department@hospital.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operating Hours <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('operatingHours', { required: 'Operating hours are required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Operating Hours</option>
                      <option value="24/7">24/7</option>
                      <option value="8:00 AM - 8:00 PM">8:00 AM - 8:00 PM</option>
                      <option value="6:00 AM - 10:00 PM">6:00 AM - 10:00 PM</option>
                      <option value="6:00 AM - 12:00 AM">6:00 AM - 12:00 AM</option>
                      <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</option>
                    </select>
                    {errors.operatingHours && (
                      <p className="text-red-500 text-sm mt-1">{errors.operatingHours.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Doctors
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register('totalDoctors')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Beds
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register('totalBeds')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Beds
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register('availableBeds')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register('budget')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Established Date
                    </label>
                    <input
                      type="date"
                      {...register('establishedDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('status', { required: 'Status is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="closed">Closed</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialties (comma-separated)
                  </label>
                  <input
                    type="text"
                    {...register('specialties')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Interventional Cardiology, Electrophysiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment (comma-separated)
                  </label>
                  <input
                    type="text"
                    {...register('equipment')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ECG Machines, Cardiac Catheterization Lab"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('emergencyServices')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Emergency Services Available
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Department</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDepartment(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Same form as Add Modal but with pre-filled data */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Same form fields as Add Modal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Department name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('location', { required: 'Location is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedDepartment(null);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Department Details Modal */}
      {showDetailsModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{selectedDepartment.name} - Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department ID</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department Head</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.head}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.operatingHours}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDepartment.status)}`}>
                        {selectedDepartment.status.charAt(0).toUpperCase() + selectedDepartment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact & Statistics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Contact & Statistics</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Doctors</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.totalDoctors}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Patients</label>
                      <p className="text-sm text-gray-900">{selectedDepartment.totalPatients}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bed Capacity</label>
                      <p className="text-sm text-gray-900">
                        {selectedDepartment.availableBeds}/{selectedDepartment.totalBeds} available
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Budget</label>
                      <p className="text-sm text-gray-900">${selectedDepartment.budget?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Revenue</label>
                      <p className="text-sm text-green-600 font-medium">${selectedDepartment.revenue?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Services</label>
                      <p className="text-sm text-gray-900">
                        {selectedDepartment.emergencyServices ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                {selectedDepartment.specialties && selectedDepartment.specialties.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDepartment.specialties.map((specialty, index) => (
                        <span key={index} className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {selectedDepartment.equipment && selectedDepartment.equipment.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDepartment.equipment.map((item, index) => (
                        <span key={index} className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block font-medium text-gray-700">Established Date</label>
                    <p className="text-gray-900">
                      {selectedDepartment.establishedDate 
                        ? new Date(selectedDepartment.establishedDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Created</label>
                    <p className="text-gray-900">
                      {new Date(selectedDepartment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Last Updated</label>
                    <p className="text-gray-900">
                      {new Date(selectedDepartment.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => handleEdit(selectedDepartment)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Edit Department
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;
