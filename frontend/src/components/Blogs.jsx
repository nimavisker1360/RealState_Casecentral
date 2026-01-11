
import { BLOGS } from "../constant/data";
import { FaHeadset, FaListCheck, FaUserTie, FaBuilding, FaCalendarCheck, FaWhatsapp, FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const navigate = useNavigate();
  
  const ctaItems = [
    {
      icon: <FaHeadset />,
      title: "Free Consultation",
      description: "Get expert advice on your property needs",
      link: "/consultants",
    },
    {
      icon: <FaListCheck />,
      title: "Today's Price List",
      description: "Updated prices for all available properties",
      link: "/today",
    },
    {
      icon: <FaUserTie />,
      title: "Contact Advisor",
      description: "Speak with our experienced real estate advisors",
      link: "/consultants",
    },
    {
      icon: <FaBuilding />,
      title: "Similar Properties",
      description: "Explore properties that match your criteria",
      link: "/listing",
    },
    {
      icon: <FaCalendarCheck />,
      title: "In-Person Visit",
      description: "Schedule a property viewing at your convenience",
      link: "/consultants",
    },
  ];

  return (
    <section className="max-padd-container overflow-x-hidden">
      <div className="py-16 xl:py-28 rounded-3xl">
        <span className="medium-18">Stay Updated with the Latest News!</span>
        <h2 className="h2">Our Expert Blogs</h2>
        {/* container */}
        <div
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
           xl:grid-cols-4 mt-24"
        >
          {BLOGS.map((blog) => (
            <div
              key={blog.title}
              className="rounded-3xl border-8 border-primary shadow-sm overflow-hidden relative"
            >
              <img src={blog.image} alt="" />
              {/* overlay */}
              <div className="absolute top-0 left-0 h-full w-full bg-black/25"></div>
              <div className="absolute bottom-3 left-3 text-white text-[15px]">
                <h3 className="font-[600] text-[16px] pr-4 leading-5">{blog.title}</h3>
                <h4 className="medium-14 pb-3 pt-1">{blog.category}</h4>
                <button className="bg-white rounded-xl font-[500] text-[15px] text-tertiary px-3 py-1">
                  continue reading
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 xl:mt-28 bg-primary rounded-3xl overflow-hidden">
          {/* Main CTA Container */}
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Content */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium w-fit mb-6">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                Ready to Take Action?
              </span>
              <h2 className="h2 !mb-4">What's Your Next Step?</h2>
              <p className="text-gray-30 text-base leading-relaxed mb-8">
                Whether you're buying your dream home in Istanbul or investing in property, 
                we're here to guide you every step of the way.
              </p>

              {/* CTA Items List */}
              <div className="space-y-4 mb-8">
                {ctaItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(item.link)}
                    className="group flex items-center gap-4 bg-white p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flexCenter text-secondary text-xl group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-tertiary">{item.title}</h4>
                      <p className="text-sm text-gray-30">{item.description}</p>
                    </div>
                    <FaArrowRight className="text-gray-20 group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - WhatsApp CTA */}
            <div className="bg-tertiary p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full"></div>
              
              <div className="relative z-10 text-center">
                {/* WhatsApp Icon */}
                <div className="w-24 h-24 bg-[#25D366] rounded-3xl flexCenter mx-auto mb-8 shadow-lg shadow-[#25D366]/30">
                  <FaWhatsapp className="text-white text-5xl" />
                </div>
                
                <h3 className="text-white bold-28 mb-4">Chat With Us on WhatsApp</h3>
                <p className="text-white/60 mb-8 max-w-sm mx-auto">
                  Get instant responses and personalized property recommendations directly on WhatsApp
                </p>
                
                {/* WhatsApp Button */}
                <a 
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/30 hover:-translate-y-1"
                >
                  <FaWhatsapp className="text-2xl" />
                  Start Chat Now
                </a>
                
                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-8 text-white/40 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online Now
                  </span>
                  <span>•</span>
                  <span>Replies in minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="bg-secondary/10 px-8 sm:px-12 py-6">
            <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-4">
              <div className="flex items-center gap-8 flex-wrap justify-center">
                <div className="text-center">
                  <h4 className="bold-24 text-tertiary">500+</h4>
                  <p className="text-sm text-gray-30">Happy Clients</p>
                </div>
                <div className="w-px h-10 bg-gray-20/30 hidden sm:block"></div>
                <div className="text-center">
                  <h4 className="bold-24 text-tertiary">24/7</h4>
                  <p className="text-sm text-gray-30">Support Available</p>
                </div>
                <div className="w-px h-10 bg-gray-20/30 hidden sm:block"></div>
                <div className="text-center">
                  <h4 className="bold-24 text-tertiary">100%</h4>
                  <p className="text-sm text-gray-30">Satisfaction Rate</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/consultants')}
                className="btn-secondary rounded-xl"
              >
                Get Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
