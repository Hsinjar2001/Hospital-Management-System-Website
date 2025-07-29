// pages/Home/Home_page.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home_page = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Hero slider data
  const heroSlides = [
    {
      id: 1,
      title: "Excellence in Healthcare",
      subtitle: "Your Health, Our Priority",
      description: "Providing world-class medical care with state-of-the-art facilities and compassionate healthcare professionals dedicated to your well-being.",
      image: "/api/placeholder/1200/600",
      buttonText: "Book Appointment",
      buttonAction: () => navigate('/auth/register')
    },
    {
      id: 2,
      title: "24/7 Emergency Care",
      subtitle: "Always Here When You Need Us",
      description: "Round-the-clock emergency services with advanced trauma care and immediate medical attention for critical situations.",
      image: "/api/placeholder/1200/600",
      buttonText: "Emergency Contact",
      buttonAction: () => window.open('tel:+1-555-911-HELP')
    },
    {
      id: 3,
      title: "Advanced Medical Technology",
      subtitle: "Cutting-Edge Healthcare Solutions",
      description: "Equipped with the latest medical technology and diagnostic equipment to provide accurate diagnoses and effective treatments.",
      image: "/api/placeholder/1200/600",
      buttonText: "Learn More",
      buttonAction: () => navigate('/about')
    }
  ];

  // Sample statistics
  const sampleStats = {
    totalPatients: 50000,
    doctorsCount: 150,
    departments: 25,
    yearsOfService: 15,
    successfulSurgeries: 10000,
    satisfactionRate: 98
  };

  // Services data
  const services = [
    {
      id: 1,
      title: "Cardiology",
      description: "Complete heart care with advanced cardiac procedures and preventive treatments.",
      icon: "❤️",
      features: ["ECG", "Angioplasty", "Heart Surgery", "Cardiac Rehabilitation"]
    },
    {
      id: 2,
      title: "Neurology",
      description: "Comprehensive brain and nervous system care with expert neurological treatments.",
      icon: "🧠",
      features: ["Brain Scans", "Stroke Care", "Epilepsy Treatment", "Neurosurgery"]
    },
    {
      id: 3,
      title: "Orthopedics",
      description: "Bone, joint, and muscle care including sports medicine and rehabilitation.",
      icon: "🦴",
      features: ["Joint Replacement", "Fracture Care", "Sports Medicine", "Physical Therapy"]
    },
    {
      id: 4,
      title: "Pediatrics",
      description: "Specialized medical care for infants, children, and adolescents.",
      icon: "👶",
      features: ["Vaccinations", "Growth Monitoring", "Pediatric Surgery", "Child Development"]
    },
    {
      id: 5,
      title: "Emergency Medicine",
      description: "24/7 emergency care with rapid response and critical care services.",
      icon: "🚨",
      features: ["Trauma Care", "Critical Care", "Emergency Surgery", "Ambulance Service"]
    },
    {
      id: 6,
      title: "Radiology",
      description: "Advanced imaging services for accurate diagnosis and treatment planning.",
      icon: "📡",
      features: ["MRI", "CT Scan", "X-Ray", "Ultrasound"]
    }
  ];

  // Doctors data
  const featuredDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15+ years",
      rating: 4.9,
      image: "/api/placeholder/300/300",
      education: "MD from Harvard Medical School",
      awards: ["Best Cardiologist 2023", "Patient Choice Award"]
    },
    {
      id: 2,
      name: "Dr. Michael Wilson",
      specialty: "Neurologist",
      experience: "12+ years",
      rating: 4.8,
      image: "/api/placeholder/300/300",
      education: "MD from Johns Hopkins",
      awards: ["Excellence in Neurology", "Research Award 2022"]
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      experience: "10+ years",
      rating: 4.9,
      image: "/api/placeholder/300/300",
      education: "MD from Stanford University",
      awards: ["Best Pediatrician", "Community Service Award"]
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      condition: "Cardiac Surgery Patient",
      review: "The cardiac team saved my life. The care was exceptional, and the staff was incredibly supportive throughout my recovery.",
      rating: 5,
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Maria Garcia",
      condition: "Maternity Patient",
      review: "From prenatal care to delivery, the team provided outstanding support. My baby and I received the best possible care.",
      rating: 5,
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Robert Johnson",
      condition: "Orthopedic Patient",
      review: "After my knee replacement surgery, I'm back to playing tennis. The rehabilitation program was excellent.",
      rating: 5,
      image: "/api/placeholder/100/100"
    }
  ];

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats(sampleStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">HealthCare+</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#home" className="text-blue-600 hover:text-blue-800 px-3 py-2 text-sm font-medium">Home</a>
                  <a href="#services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Services</a>
                  <a href="#doctors" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Doctors</a>
                  <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">About</a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Contact</a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <button
                  onClick={() => navigate('/auth/login')}
                  className="text-blue-600 hover:text-blue-800 px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth/register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden mt-16">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})` 
                }}
              >
                <div className="relative h-full flex items-center justify-center text-center text-white">
                  <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-light mb-6">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <button
                      onClick={slide.buttonAction}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors transform hover:scale-105"
                    >
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">{stats.totalPatients?.toLocaleString()}</div>
              <div className="text-blue-200 mt-2">Patients Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.doctorsCount}</div>
              <div className="text-blue-200 mt-2">Expert Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.departments}</div>
              <div className="text-blue-200 mt-2">Departments</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.yearsOfService}</div>
              <div className="text-blue-200 mt-2">Years of Service</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.successfulSurgeries?.toLocaleString()}</div>
              <div className="text-blue-200 mt-2">Successful Surgeries</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.satisfactionRate}%</div>
              <div className="text-blue-200 mt-2">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services with state-of-the-art facilities and expert medical professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section id="doctors" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of experienced healthcare professionals dedicated to providing exceptional medical care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-w-1 aspect-h-1">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                  <p className="text-gray-600 mb-2">{doctor.experience} experience</p>
                  <p className="text-sm text-gray-600 mb-3">{doctor.education}</p>
                  
                  <div className="flex items-center mb-3">
                    {renderStars(Math.floor(doctor.rating))}
                    <span className="ml-2 text-gray-600">{doctor.rating}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {doctor.awards.map((award, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                        {award}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real patients about their healthcare experience with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.condition}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-gray-700 leading-relaxed">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">24/7 Emergency Services</h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              In case of medical emergency, our dedicated team is available round the clock to provide immediate care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Hotline</h3>
              <p className="text-2xl font-bold">+1-555-911-HELP</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Room</h3>
              <p className="text-red-100">Main Hospital Building<br />Ground Floor</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Response Time</h3>
              <p className="text-red-100">Average 8 minutes<br />emergency response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">HealthCare+</h3>
              <p className="text-gray-300 mb-4">
                Providing exceptional healthcare services with compassion, innovation, and excellence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#services" className="text-gray-300 hover:text-white">Services</a></li>
                <li><a href="#doctors" className="text-gray-300 hover:text-white">Doctors</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Emergency Care</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Surgery</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Cardiology</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Pediatrics</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Radiology</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">123 Healthcare Ave, Medical City, MC 12345</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300">+1 (555) 123-CARE</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">info@healthcareplus.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 HealthCare+ Hospital Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home_page;
