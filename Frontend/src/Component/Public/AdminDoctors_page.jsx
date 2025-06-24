import React from 'react';
import './AdminDoctors_page.css'; // Link to the CSS file

// Import common assets
import PreclinicLogo from '../../assets/Homepage/logo.png'; // Assuming your logo is here

// Import doctor images from the new AdminDoctors_page_Image folder
import Doctor1 from '../../assets/AdminDoctors_page_Image/Doctor1.png'; //
import Doctor2 from '../../assets/AdminDoctors_page_Image/Doctor2.png'; //
import Doctor3 from '../../assets/AdminDoctors_page_Image/Doctor3.png'; //
import Doctor4 from '../../assets/AdminDoctors_page_Image/Doctor4.png'; //
import Doctor5 from '../../assets/AdminDoctors_page_Image/Doctor5.png'; //
import Doctor6 from '../../assets/AdminDoctors_page_Image/Doctor6.png'; //
import Doctor7 from '../../assets/AdminDoctors_page_Image/Doctor7.png'; //
import Doctor8 from '../../assets/AdminDoctors_page_Image/Doctor8.png'; //
import Doctor9 from '../../assets/AdminDoctors_page_Image/Doctor9.png'; //
import Doctor10 from '../../assets/AdminDoctors_page_Image/Doctor10.png'; //
import Doctor11 from '../../assets/AdminDoctors_page_Image/Doctor11.png'; //
import Doctor12 from '../../assets/AdminDoctors_page_Image/Doctor12.png'; //

// Import icons
import CalendarIcon from '../../assets/Homepage/Calender.png'; // Calendar icon

const doctorsData = [
    {
        id: 1,
        name: "Dr. Mick Thompson",
        specialty: "Cardiologist",
        image: Doctor1, // Using Doctor1.png
        availability: "Mon, 20 Jan 2025",
        price: 499
    },
    {
        id: 2,
        name: "Dr. Sarah Johnson",
        specialty: "Orthopedic Surgeon",
        image: Doctor2, // Using Doctor2.png
        availability: "Wed, 22 Jan 2025",
        price: 450
    },
    {
        id: 3,
        name: "Dr. Emily Carter",
        specialty: "Pediatrician",
        image: Doctor3, // Using Doctor3.png
        availability: "Fri, 24 Jan 2025",
        price: 300
    },
    {
        id: 4,
        name: "Dr. David Lee",
        specialty: "Gynecologist",
        image: Doctor4, // Using Doctor4.png
        availability: "Tue, 21 Jan 2025",
        price: 250
    },
    {
        id: 5,
        name: "Dr. Anna Kim",
        specialty: "Psychiatrist",
        image: Doctor5, // Using Doctor5.png
        availability: "Mon, 27 Jan 2025",
        price: 350
    },
    {
        id: 6,
        name: "Dr. John Smith",
        specialty: "Neurosurgeon",
        image: Doctor6, // Using Doctor6.png
        availability: "Thu, 30 Jan 2025",
        price: 499
    },
    {
        id: 7,
        name: "Dr. Lisa White",
        specialty: "Oncologist",
        image: Doctor7, // Using Doctor7.png
        availability: "Sat, 25 Jan 2025",
        price: 200
    },
    {
        id: 8,
        name: "Dr. Patricia Brown",
        specialty: "Pulmonologist",
        image: Doctor8, // Using Doctor8.png
        availability: "Sun, 01 Feb 2025",
        price: 450
    },
    {
        id: 9,
        name: "Dr. Rachel Green",
        specialty: "Urologist",
        image: Doctor9, // Using Doctor9.png
        availability: "Tue, 28 Jan 2025",
        price: 400
    },
    {
        id: 10,
        name: "Dr. Michael Smith",
        specialty: "Cardiologist",
        image: Doctor10, // Using Doctor10.png
        availability: "Thu, 05 Feb 2025",
        price: 300
    },
    {
        id: 11,
        name: "Dr. Sarah Johnson",
        specialty: "Surgeon",
        image: Doctor11, // Using Doctor11.png
        availability: "Mon, 09 Feb 2025",
        price: 500
    },
    {
        id: 12,
        name: "Dr. Adrian White",
        specialty: "Practitioner",
        image: Doctor12, // Using Doctor12.png
        availability: "Sat, 25 Jan 2025",
        price: 200
    }
];

const AdminDoctorsPage = () => {
    const totalDoctors = doctorsData.length; // Dynamic count based on data

    const handleFiltersClick = () => {
        console.log("Filters button clicked!");
        // Add logic for opening a filter sidebar/modal here
    };

    const handleNewDoctorClick = () => {
        console.log("New Doctor button clicked!");
        // Add logic for navigating to an "Add New Doctor" form here
    };

    const handleKebabMenuClick = (doctorId) => {
        console.log(`Kebab menu clicked for Doctor ID: ${doctorId}`);
        // Add logic for showing a dropdown menu (Edit, Delete, View Profile) here
    };

    return (
        <div className="admin-doctors-page-container">
            <div className="admin-doctors-header">
                <div className="header-left">
                    <h1>Doctor Grid</h1>
                    <span className="total-doctors">Total Doctors: {totalDoctors}</span> {/* Total doctors count */}
                </div>
                <div className="header-right">
                    <button className="filters-button" onClick={handleFiltersClick}>
                        <span className="filter-icon">⚙️</span> Filters {/* Filters button */}
                    </button>
                    <button className="new-doctor-button" onClick={handleNewDoctorClick}>
                        <span className="plus-icon">+</span> New Doctor {/* New Doctor button */}
                    </button>
                </div>
            </div>

            <div className="doctor-grid">
                {doctorsData.map(doctor => (
                    <div className="doctor-card" key={doctor.id}>
                        <div className="doctor-card-top">
                            <img src={doctor.image} alt={`Dr. ${doctor.name}`} className="doctor-avatar" />
                            <div className="kebab-menu" onClick={() => handleKebabMenuClick(doctor.id)}>
                                {/* Using unicode for 3 dots, replace with image if available */}
                                &#x22EE; {/* Vertical ellipsis for kebab menu */}
                            </div>
                        </div>
                        <div className="doctor-info">
                            <h3 className="doctor-name">{doctor.name}</h3> {/* Doctor name */}
                            <p className="doctor-specialty">{doctor.specialty}</p> {/* Doctor specialty */}
                            <p className="doctor-availability">Available: {doctor.availability}</p> {/* Doctor availability */}
                            <div className="doctor-price-row">
                                <span className="doctor-price">Starts From: ${doctor.price}</span> {/* Doctor price */}
                                <img src={CalendarIcon} alt="Calendar" className="calendar-icon" /> {/* Calendar icon */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDoctorsPage;