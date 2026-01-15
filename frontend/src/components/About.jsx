import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";

const About = () => {
  const { t } = useTranslation();

  // Define the statistics with translations
  const statistics = [
    { label: t("about.happyClients"), value: 12 },
    { label: t("about.differentCities"), value: 3 },
    { label: t("about.projectCompleted"), value: 45 },
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const top = aboutSection.getBoundingClientRect().top;
        const isVisible = top < window.innerHeight - 100;
        setIsVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="about"
      className="max-padd-container py-16 xl:py-28 overflow-x-hidden"
    >
      {/* Container */}
      <div className="flex flex-col xl:flex-row gap-10">
        {/* Left side - Property Cards Design */}
        <div
          className={`flex-1 relative min-h-[400px] sm:min-h-[480px] flex items-center justify-center ${
            isVisible ? "animate-about-slide-left" : "opacity-0"
          }`}
        >
          {/* Background Cards (stacked effect) */}
          <div className="absolute top-8 right-4 w-[240px] sm:w-[280px] h-[320px] sm:h-[380px] bg-white rounded-3xl shadow-lg transform rotate-6 opacity-60"></div>
          <div className="absolute top-4 right-8 w-[240px] sm:w-[280px] h-[320px] sm:h-[380px] bg-white rounded-3xl shadow-lg transform rotate-3 opacity-80"></div>

          {/* Main Property Card */}
          <div className="relative w-[240px] sm:w-[280px] bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
            {/* Property Image */}
            <div className="relative h-[160px] sm:h-[180px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60"
                alt="Modern Home"
                className="w-full h-full object-cover"
              />
              {/* Carousel dots */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span className="w-2 h-2 rounded-full bg-white/50"></span>
                <span className="w-2 h-2 rounded-full bg-white/50"></span>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                $695,000
              </div>
              <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-2 text-xs sm:text-sm text-gray-600">
                <span className="text-[#06a84e] font-semibold">4</span> bd
                <span className="text-gray-300">|</span>
                <span className="text-[#06a84e] font-semibold">3</span> ba
                <span className="text-gray-300">|</span>
                <span className="text-[#06a84e] font-semibold">3,102</span> sqft
                <span className="text-gray-300">|</span>
                <span>{t("about.houseForSale")}</span>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full w-3/4"></div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full w-1/2"></div>
            </div>
          </div>

          {/* Floating Labels */}
          {/* Budget Label */}
          <div
            className={`absolute top-8 sm:top-12 -left-2 sm:left-0 bg-white rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl flex items-center gap-2 sm:gap-3 z-20 ${
              isVisible ? "animate-float" : ""
            }`}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a4d3e] flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-gray-900">
                {t("about.recommendedHomes")}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500">
                {t("about.basedOnBudget")}
              </div>
            </div>
          </div>

          {/* Location Label */}
          <div
            className={`absolute top-28 sm:top-36 -left-4 sm:-left-2 bg-white rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl flex items-center gap-2 sm:gap-3 z-20 ${
              isVisible ? "animate-float-delayed" : ""
            }`}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-gray-900">
                {t("about.recommendedHomes")}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500">
                {t("about.basedOnLocation")}
              </div>
            </div>
          </div>

          {/* Floating animation styles */}
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            .animate-float-delayed {
              animation: float 3s ease-in-out infinite;
              animation-delay: 1.5s;
            }
          `}</style>
        </div>
        {/* Right side */}
        <div className="flex-1 flex justify-center flex-col text-left">
          <span
            className={`medium-18 ${
              isVisible ? "animate-about-slide-right" : "opacity-0"
            }`}
            style={{ animationDelay: "0.1s" }}
          >
            {t("about.unveilingJourney")}
          </span>
          <h2
            className={`h2 ${
              isVisible ? "animate-about-slide-right" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            {t("about.commitmentTitle")}
          </h2>
          <p
            className={`py-5 ${
              isVisible ? "animate-about-slide-right" : "opacity-0"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            {t("about.missionText")}
          </p>
          {/* Statistics Container */}
          <div className="flex flex-wrap gap-4">
            {statistics.map((statistic, index) => (
              <div
                key={index}
                className={`bg-primary p-4 rounded-lg ${
                  isVisible ? "animate-about-pop" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-1">
                  <CountUp
                    start={isVisible ? 0 : null}
                    end={statistic.value}
                    duration={10}
                    delay={3}
                  >
                    {({ countUpRef }) => (
                      <h3
                        ref={countUpRef}
                        className="text-2xl font-semibold "
                      ></h3>
                    )}
                  </CountUp>
                  <h4 className="bold-22">k+</h4>
                </div>
                <p className="text-gray-600">{statistic.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
