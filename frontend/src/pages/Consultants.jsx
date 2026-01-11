import { useState } from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaStar,
  FaLinkedin,
  FaUserTie,
  FaGlobe,
  FaBriefcase,
  FaHandshake,
} from "react-icons/fa6";
import { MdVerified, MdClose } from "react-icons/md";
import { Loader } from "@mantine/core";
import useConsultants from "../hooks/useConsultants";

const Consultants = () => {
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const { data: consultants, isLoading, isError } = useConsultants();

  // Calculate stats
  const totalDeals = consultants?.reduce((sum, c) => sum + (c.deals || 0), 0) || 0;
  const averageRating = consultants?.length 
    ? (consultants.reduce((sum, c) => sum + (c.rating || 0), 0) / consultants.length).toFixed(1) 
    : 0;
  const avgExperience = consultants?.length
    ? Math.round(consultants.reduce((sum, c) => {
        const years = parseInt(c.experience) || 0;
        return sum + years;
      }, 0) / consultants.length)
    : 0;

  if (isLoading) {
    return (
      <section className="max-padd-container my-[99px] flexCenter min-h-[50vh]">
        <div className="text-center">
          <Loader color="green" size="lg" />
          <p className="text-gray-30 mt-4">Danışmanlar yükleniyor...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="max-padd-container my-[99px] flexCenter min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-500">Danışmanlar yüklenirken bir hata oluştu.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-padd-container my-[99px] overflow-x-hidden">
      {/* Header Section */}
      <div className="text-center mb-16">
        <span className="medium-18">Our Expert Team</span>
        <h1 className="h2">Meet Our Property Consultants</h1>
        <p className="text-gray-30 max-w-2xl mx-auto">
          Our team of experienced real estate professionals is here to guide you
          through every step of your property journey.
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-secondary rounded-xl flexCenter">
            <FaUserTie className="text-white text-xl" />
          </div>
          <div>
            <h3 className="bold-20 text-tertiary">{consultants?.length || 0}+</h3>
            <p className="text-gray-30 text-sm">Expert Advisors</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-secondary rounded-xl flexCenter">
            <FaHandshake className="text-white text-xl" />
          </div>
          <div>
            <h3 className="bold-20 text-tertiary">{totalDeals.toLocaleString()}+</h3>
            <p className="text-gray-30 text-sm">Successful Deals</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-secondary rounded-xl flexCenter">
            <FaStar className="text-white text-xl" />
          </div>
          <div>
            <h3 className="bold-20 text-tertiary">{averageRating}</h3>
            <p className="text-gray-30 text-sm">Average Rating</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-secondary rounded-xl flexCenter">
            <FaBriefcase className="text-white text-xl" />
          </div>
          <div>
            <h3 className="bold-20 text-tertiary">{avgExperience}+</h3>
            <p className="text-gray-30 text-sm">Years Experience</p>
          </div>
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="bg-primary rounded-3xl p-6 sm:p-10 lg:p-14">
        {!consultants || consultants.length === 0 ? (
          <div className="text-center py-12">
            <FaUserTie className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-30">Henüz kayıtlı danışman bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((consultant) => (
              <div 
                key={consultant.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedConsultant(consultant)}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={consultant.image || "https://via.placeholder.com/400x400?text=No+Image"}
                    alt={consultant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {/* Availability Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        consultant.available
                          ? "bg-secondary text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          consultant.available ? "bg-white animate-pulse" : "bg-gray-300"
                        }`}
                      ></span>
                      {consultant.available ? "Available" : "Busy"}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-full shadow-sm">
                      <FaStar className="text-amber-500 text-sm" />
                      <span className="font-bold text-sm text-tertiary">{consultant.rating}</span>
                    </div>
                  </div>

                  {/* Name on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="bold-18 text-white flex items-center gap-2">
                      {consultant.name}
                      <MdVerified className="text-secondary" />
                    </h3>
                    <p className="text-secondary text-sm font-medium">{consultant.title}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Specialty */}
                  <p className="text-gray-30 text-sm mb-4 line-clamp-2">{consultant.specialty}</p>

                  {/* Languages */}
                  <div className="flex items-center gap-2 mb-4">
                    <FaGlobe className="text-secondary text-sm" />
                    <span className="text-sm text-gray-50 font-medium">
                      {consultant.languages?.join(" • ") || "No languages specified"}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-5 py-3 px-4 bg-primary rounded-xl">
                    <div className="text-center">
                      <p className="font-bold text-tertiary">{consultant.deals || 0}+</p>
                      <p className="text-xs text-gray-30">Deals</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="text-center">
                      <p className="font-bold text-tertiary">{consultant.experience}</p>
                      <p className="text-xs text-gray-30">Experience</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="text-center">
                      <p className="font-bold text-tertiary">{consultant.reviews || 0}</p>
                      <p className="text-xs text-gray-30">Reviews</p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${consultant.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flexCenter gap-2 bg-tertiary text-white py-3 rounded-xl hover:bg-tertiary/90 transition-colors font-medium"
                    >
                      <FaPhone />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${consultant.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flexCenter gap-2 bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#20bd5a] transition-colors font-medium"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 bg-tertiary rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="flex-1 p-8 sm:p-12 lg:p-16">
            <span className="medium-18 text-secondary">Need Help Choosing?</span>
            <h2 className="h2 text-white !mb-4">Get Matched With The Perfect Advisor</h2>
            <p className="text-white/60 mb-8 max-w-md">
              Tell us about your property needs and we'll connect you with the ideal consultant based on your requirements.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-secondary !bg-secondary !ring-secondary">
                Request Callback
              </button>
              <a 
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-medium px-7 py-[10px] rounded-lg hover:bg-[#20bd5a] transition-colors"
              >
                <FaWhatsapp className="text-lg" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
          
          {/* Right Side - Contact Info */}
          <div className="lg:w-80 bg-white/5 p-8 sm:p-12 flex flex-col justify-center">
            <h4 className="text-white font-semibold mb-6">Quick Contact</h4>
            <div className="space-y-4">
              <a href="tel:+901234567890" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-lg flexCenter">
                  <FaPhone className="text-secondary" />
                </div>
                <span>+90 123 456 7890</span>
              </a>
              <a href="mailto:info@casacentral.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-lg flexCenter">
                  <FaEnvelope className="text-secondary" />
                </div>
                <span>info@casacentral.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Consultant Detail Modal */}
      {selectedConsultant && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flexCenter p-4"
          onClick={() => setSelectedConsultant(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedConsultant.image || "https://via.placeholder.com/400x400?text=No+Image"}
                alt={selectedConsultant.name}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tertiary via-tertiary/20 to-transparent"></div>
              <button
                onClick={() => setSelectedConsultant(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flexCenter text-white hover:bg-white/30 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="bold-24 text-white flex items-center gap-2">
                      {selectedConsultant.name}
                      <MdVerified className="text-secondary" />
                    </h2>
                    <p className="text-secondary font-medium">{selectedConsultant.title}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg">
                    <FaStar className="text-amber-500" />
                    <span className="font-bold">{selectedConsultant.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Bio */}
              <p className="text-gray-30 mb-6">{selectedConsultant.bio}</p>

              {/* Info */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-primary rounded-xl p-3 text-center">
                  <p className="bold-18 text-tertiary">{selectedConsultant.experience}</p>
                  <p className="text-xs text-gray-30">Experience</p>
                </div>
                <div className="bg-primary rounded-xl p-3 text-center">
                  <p className="bold-18 text-tertiary">{selectedConsultant.deals || 0}+</p>
                  <p className="text-xs text-gray-30">Deals</p>
                </div>
                <div className="bg-primary rounded-xl p-3 text-center">
                  <p className="bold-18 text-tertiary">{selectedConsultant.reviews || 0}</p>
                  <p className="text-xs text-gray-30">Reviews</p>
                </div>
              </div>

              {/* Specialty */}
              <div className="mb-4">
                <h4 className="font-semibold text-tertiary text-sm mb-2">Specialty</h4>
                <p className="text-gray-30 text-sm">{selectedConsultant.specialty}</p>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <h4 className="font-semibold text-tertiary text-sm mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConsultant.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedConsultant.phone}`}
                  className="flexCenter gap-2 bg-tertiary text-white py-3.5 rounded-xl hover:bg-tertiary/90 transition-colors font-medium"
                >
                  <FaPhone />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${selectedConsultant.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flexCenter gap-2 bg-[#25D366] text-white py-3.5 rounded-xl hover:bg-[#20bd5a] transition-colors font-medium"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${selectedConsultant.email}`}
                  className="flexCenter gap-2 bg-primary text-tertiary py-3.5 rounded-xl hover:bg-secondary hover:text-white transition-colors font-medium"
                >
                  <FaEnvelope />
                  Email
                </a>
                <a
                  href={selectedConsultant.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flexCenter gap-2 bg-primary text-tertiary py-3.5 rounded-xl hover:bg-[#0077B5] hover:text-white transition-colors font-medium"
                >
                  <FaLinkedin />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Consultants;
