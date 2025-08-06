import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Phone, Mail, Calendar, User } from 'lucide-react';
import { doctorsAPI } from '../../services/api';
import { toast } from 'sonner';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const loadDoctors = async (page = 1, search = '', department = '', specialty = '') => {
    try {
      setLoading(true);
      let response;
      
      if (search) {
        response = await doctorsAPI.search(search);
      } else {
        const params = {
          page,
          limit: 12,
          department,
          specialty,
          availability: 'available'
        };
        response = await doctorsAPI.getAll(params);
      }
      
      if (response.status === 'success') {
        setDoctors(response.data.doctors || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(response.data.pagination?.currentPage || 1);
      } else {
        toast.error('Failed to load doctors');
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Error loading doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors(currentPage, searchTerm, selectedDepartment, selectedSpecialty);
  }, [currentPage, searchTerm, selectedDepartment, selectedSpecialty]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDoctors(1, searchTerm, selectedDepartment, selectedSpecialty);
  };

  const handleBookAppointment = (doctorId) => {
    window.location.href = `/patient/appointments/book?doctorId=${doctorId}`;
  };

  const DoctorCard = ({ doctor }) => {
    const user = doctor.user || {};
    const department = doctor.department || {};
    
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            
            <p className="text-sm text-gray-600 mb-1">
              {doctor.specialty}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{department.name}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="w-4 h-4 mr-1" />
              <span>{doctor.experience} years experience</span>
            </div>
            
            {doctor.consultationFee && (
              <div className="text-sm font-medium text-green-600 mb-3">
                Consultation Fee: ${doctor.consultationFee}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.8 (124 reviews)</span>
              </div>
              
              <button
                onClick={() => handleBookAppointment(doctor.id)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
        
        {doctor.bio && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 line-clamp-2">
              {doctor.bio}
            </p>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.languages && doctor.languages.map((language, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {language}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
          <p className="text-gray-600">Search and book appointments with our qualified doctors</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search doctors by name, specialty, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="dermatology">Dermatology</option>
                </select>
                
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specialties</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="neurologist">Neurologist</option>
                  <option value="orthopedic surgeon">Orthopedic Surgeon</option>
                  <option value="pediatrician">Pediatrician</option>
                  <option value="dermatologist">Dermatologist</option>
                </select>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {doctors.length > 0 ? `Found ${doctors.length} doctors` : 'No doctors found'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {doctors.length === 0 && !loading && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or browse all doctors.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;