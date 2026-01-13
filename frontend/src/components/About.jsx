import { useEffect, useState } from "react";
import CountUp from "react-countup";
import aboutImg from "../assets/about.jpg";
import { RiDoubleQuotesL } from "react-icons/ri";

const About = () => {
  // Define the statistics
  const statistics = [
    { label: "Happy clients", value: 12 },
    { label: "Different cities", value: 3 },
    { label: "Project completed", value: 45 },
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
        {/* Left side */}
        <div className={`flex-1 relative ${isVisible ? 'animate-about-slide-left' : 'opacity-0'}`}>
          <img
            src={aboutImg}
            alt=""
            className="rounded-3xl rounded-tr-[80px] sm:rounded-tr-[155px] w-full max-w-[488px]"
          />
          <div className={`bg-white absolute bottom-4 sm:bottom-16 left-4 sm:left-16 max-w-[200px] sm:max-w-xs p-3 sm:p-4 rounded-lg flexCenter flex-col ${isVisible ? 'animate-about-pop' : 'opacity-0'}`}>
            <span className="relative bottom-6 sm:bottom-8 p-2 sm:p-3 shadow-md bg-white h-10 w-10 sm:h-12 sm:w-12 flex items-center rounded-full">
              <RiDoubleQuotesL className="text-xl sm:text-2xl" />
            </span>
            <p className="text-center relative bottom-2 sm:bottom-3 text-xs sm:text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
        {/* Right side */}
        <div className="flex-1 flex justify-center flex-col">
          <span className={`medium-18 ${isVisible ? 'animate-about-slide-right' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>Unveiling Our Journey</span>
          <h2 className={`h2 ${isVisible ? 'animate-about-slide-right' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            Our Commitment Crafting Extraordinary Real Estate Experiences
          </h2>
          <p className={`py-5 ${isVisible ? 'animate-about-slide-right' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis
            dolore expedita delectus in a eligendi explicabo laborum eveniet?
            Ratione modi et earum assumenda est vitae neque laborum fugiat unde
            expedita perferendis amet rem illum quis facere voluptatum culpa
            repudiandae natus provident porro, nihil fuga.
          </p>
          {/* Statistics Container */}
          <div className="flex flex-wrap gap-4">
            {statistics.map((statistic, index) => (
              <div key={index} className={`bg-primary p-4 rounded-lg ${isVisible ? 'animate-about-pop' : 'opacity-0'}`} style={{animationDelay: `${0.4 + index * 0.1}s`}}>
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
