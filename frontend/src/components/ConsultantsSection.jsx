import { useNavigate } from "react-router-dom";
import useConsultants from "../hooks/useConsultants";
import { MdArrowForward, MdLocationOn } from "react-icons/md";
import { Loader } from "@mantine/core";

const ConsultantsSection = () => {
  const { data: consultants, isLoading, isError } = useConsultants();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="max-padd-container py-16">
        <div className="flexCenter h-40">
          <Loader color="green" />
        </div>
      </section>
    );
  }

  if (isError || !consultants || consultants.length === 0) {
    return null;
  }

  // Show max 2 consultants on homepage, rest in "+X more"
  const displayConsultants = consultants.slice(0, 2);
  const moreCount = consultants.length - 2;

  // Get the 3rd consultant image for the blur effect
  const thirdConsultant = consultants[2];

  return (
    <section className="max-padd-container py-16 xl:py-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Left Side - Text (Transparent/Simple) */}
        <div className="lg:w-[400px] flex-shrink-0">
          <div className="mb-2">
            <span className="text-red-500 font-semibold">Casa</span>
            <span className="text-gray-900 font-semibold">Central™ Selling</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Looking to sell? Find a trusted expert.
          </h2>
          
          <p className="text-gray-600 mb-2">
            We matched you with <span className="font-semibold">{consultants.length} agents</span> in{" "}
            <span className="inline-flex items-center gap-1">
              <MdLocationOn className="text-gray-500" />
              <span>Your Area</span>
            </span>
          </p>
          
          <p className="text-gray-500 text-sm mb-8">
            Enter your address to review and compare agents.
          </p>
          
          <button
            onClick={() => navigate("/consultants")}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors group"
          >
            Compare agents
            <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Side - Agent Cards */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="flex gap-6 items-start">
            {displayConsultants.map((consultant) => (
              <div
                key={consultant.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => navigate("/consultants")}
              >
                {/* Circular Avatar */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 group-hover:shadow-xl transition-shadow">
                  <img
                    src={consultant.image || "https://via.placeholder.com/150?text=Agent"}
                    alt={consultant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="font-bold text-gray-900 text-center text-lg">
                  {consultant.name}
                </h3>
                
                {/* Company/Title */}
                <p className="text-gray-500 text-sm text-center">
                  {consultant.title}
                </p>
                
                {/* License/Specialty */}
                <p className="text-gray-400 text-xs text-center mb-4">
                  {consultant.specialty}
                </p>

                {/* Stats Row */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{consultant.experience}</p>
                    <p className="text-gray-400 text-xs">Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{consultant.deals} sales</p>
                    <p className="text-gray-400 text-xs">In past year</p>
                  </div>
                </div>
              </div>
            ))}

            {/* More Agents Card */}
            {moreCount > 0 && (
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => navigate("/consultants")}
              >
                {/* Blurred Avatar with +X overlay */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                  <img
                    src={thirdConsultant?.image || "https://via.placeholder.com/150?text=Agent"}
                    alt="More agents"
                    className="w-full h-full object-cover blur-sm"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white/60 flexCenter flex-col">
                    <span className="text-3xl font-bold text-secondary">+{moreCount}</span>
                  </div>
                </div>

                {/* Text */}
                <p className="font-bold text-gray-900 text-center text-lg">more agents</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <div className="mt-16 pt-10 border-t border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Discover how we can help</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/listing?type=sale")}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:border-gray-900 hover:bg-gray-50 transition-colors"
          >
            Buying
          </button>
          <button
            onClick={() => navigate("/listing?type=rent")}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:border-gray-900 hover:bg-gray-50 transition-colors"
          >
            Renting
          </button>
          <button
            onClick={() => navigate("/consultants")}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:border-gray-900 hover:bg-gray-50 transition-colors"
          >
            Selling
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConsultantsSection;
