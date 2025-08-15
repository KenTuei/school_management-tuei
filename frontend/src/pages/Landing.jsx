import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // make sure to npm install react-icons

const Landing = () => {
  const navigate = useNavigate();
  const scrollContainer = useRef(null);

  // Example top students data
  const topStudents = [
    { grade: "1", name: "John Doe", image: "/students/student1.jpg" },
    { grade: "2", name: "Jane Smith", image: "/students/student2.jpg" },
    { grade: "3", name: "Alice Johnson", image: "/students/student3.jpg" },
    { grade: "4", name: "Bob Williams", image: "/students/student4.jpg" },
    { grade: "5", name: "Emma Brown", image: "/students/student5.jpg" },
    { grade: "6", name: "Liam Davis", image: "/students/student6.jpg" },
    { grade: "7", name: "Olivia Miller", image: "/students/student7.jpg" },
    { grade: "8", name: "Noah Wilson", image: "/students/student8.jpg" },
  ];

  const galleryImages = [
    "/gallery/school1.jpg",
    "/gallery/school2.jpg",
    "/gallery/school3.jpg",
    "/gallery/school4.jpg",
  ];

  // Optional: auto-scroll effect
  useEffect(() => {
    const container = scrollContainer.current;
    let scrollAmount = 0;
    const interval = setInterval(() => {
      if (container) {
        container.scrollLeft += 1;
        scrollAmount += 1;
        if (scrollAmount >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-animated-gradient text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <h1
          className="text-3xl font-bold cursor-pointer hover:text-gray-200 transition transform hover:scale-105"
          onClick={() => navigate("/")}
        >
          SchoolMgmt
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-full shadow-lg hover:scale-105 transition transform duration-300"
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-indigo-700 transition duration-300"
          >
            Explore More
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
          Manage Your School Efficiently
        </h2>
        <p className="text-lg md:text-2xl mb-8 opacity-80 max-w-2xl animate-fadeIn-delay">
          Track students, parents, subjects, grades, and fees—all in one place.
          Simple, fast, and reliable.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-400 font-bold px-8 py-3 rounded-full text-lg hover:scale-105 transform shadow-xl transition duration-300"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-indigo-700 transition duration-300"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="bg-indigo-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 text-center">
          <div className="p-6 bg-indigo-800 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
            <p>
              To provide quality education, nurture creativity, and empower students
              to excel academically and socially.
            </p>
          </div>
          <div className="p-6 bg-indigo-800 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p>
              To be a leading institution recognized for excellence, innovation, and
              holistic student development.
            </p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-6 text-center max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-6">About Us</h3>
        <p className="opacity-80">
          Our school has been nurturing young minds for over 20 years, focusing on
          academic excellence, moral values, and extracurricular achievements.
        </p>
      </section>

      {/* Top Performing Students Carousel */}
      <section className="bg-indigo-800 py-16 px-6 relative z-10">
        <h3 className="text-3xl font-bold text-center mb-10">Top Performing Students</h3>

        <div className="relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={() =>
              scrollContainer.current.scrollBy({ left: -250, behavior: "smooth" })
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-indigo-900 p-2 rounded-full shadow-lg hover:bg-indigo-700 z-20"
          >
            <FaChevronLeft className="text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() =>
              scrollContainer.current.scrollBy({ left: 250, behavior: "smooth" })
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-900 p-2 rounded-full shadow-lg hover:bg-indigo-700 z-20"
          >
            <FaChevronRight className="text-white" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainer}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-10"
          >
            {topStudents.map((student, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-60 bg-indigo-900 p-4 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <img
                  src={student.image}
                  alt={student.name}
                  className="rounded-full w-24 h-24 mx-auto mb-3 object-cover"
                />
                <h4 className="font-bold text-center">{student.name}</h4>
                <p className="opacity-80 text-center">Grade {student.grade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10">Gallery</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="rounded-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            />
          ))}
        </div>
      </section>

      {/* Message from Head Teacher */}
      <section className="bg-indigo-900 py-16 px-6 flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-8">
        <img
          src="/principal.jpg"
          alt="Head Teacher"
          className="rounded-full w-40 h-40 object-cover"
        />
        <div>
          <h3 className="text-2xl font-bold mb-3">Message from the Head Teacher</h3>
          <p className="opacity-80">
            "Welcome to our school. We are dedicated to providing a nurturing
            environment where every student can thrive academically and socially."
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 py-10 px-6 text-center text-sm opacity-80">
        <p>Location: 123 School St, Nairobi, Kenya</p>
        <p>Contact: +254 700 000 000 | info@schoolmgmt.com</p>
        <p>&copy; 2025 School Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
