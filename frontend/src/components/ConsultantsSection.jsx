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
            <span className="text-red-500 font-semibold">HB Gayrimenkul </span>
            <span className="text-gray-900 font-semibold">
              INTERNATIONAL™ Selling
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Looking to sell? Find a trusted expert.
          </h2>

          <p className="text-gray-600 mb-2">
            We matched you with{" "}
            <span className="font-semibold">{consultants.length} agents</span>{" "}
            in{" "}
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
                    src={
                      consultant.image ||
                      "https://via.placeholder.com/150?text=Agent"
                    }
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
                <div className="flex gap-6 justify-center">
                  <div className="text-center">
                    <p className="font-bold text-gray-900">
                      {consultant.experience}
                    </p>
                    <p className="text-gray-400 text-xs">Experience</p>
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
                    src={
                      thirdConsultant?.image ||
                      "https://via.placeholder.com/150?text=Agent"
                    }
                    alt="More agents"
                    className="w-full h-full object-cover blur-sm"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white/60 flexCenter flex-col">
                    <span className="text-3xl font-bold text-secondary">
                      +{moreCount}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <p className="font-bold text-gray-900 text-center text-lg">
                  more agents
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Listings Lease or Sell Faster Section */}
      <div className="mt-16 relative overflow-hidden rounded-2xl bg-[#1e2a38]">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="flex-1 p-8 lg:p-12 xl:p-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
              Our Listings Lease or Sell 14% Faster*
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
              {/* Right Audience */}
              <div>
                <div className="w-10 h-10 mb-4 text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">Right Audience</h3>
                <p className="text-white/60 text-sm">
                  96% of the Fortune 1000 search on our platform
                </p>
              </div>

              {/* Engage Prospects */}
              <div>
                <div className="w-10 h-10 mb-4 text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">Engage Prospects</h3>
                <p className="text-white/60 text-sm">
                  Stunning photography, videos and drone shots
                </p>
              </div>

              {/* More Opportunity */}
              <div>
                <div className="w-10 h-10 mb-4 text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">More Opportunity</h3>
                <p className="text-white/60 text-sm">
                  Find a tenant or buyer, faster than before
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/listing")}
              className="bg-[#06a84e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#058a41] transition-colors mb-8"
            >
              Explore Marketing Solutions
            </button>

            {/* Disclaimer */}
            <p className="text-white/40 text-xs">
              *Based on internal analysis comparing properties advertised on our
              platform to properties listed only on other sites.
            </p>
          </div>

          {/* Right Image */}
          <div className="lg:w-[45%] h-[300px] lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
              alt="Modern building at night"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultantsSection;
