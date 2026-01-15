import { Link, useNavigate, useLocation } from "react-router-dom";
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "../constant/data";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation to sections
  const handleLinkClick = (link) => {
    if (link === "About Us") {
      if (location.pathname === "/") {
        // Already on home page, just scroll to about section
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to home page first, then scroll to about
        navigate("/");
        setTimeout(() => {
          const aboutSection = document.getElementById("about");
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  // Helper to get icon based on label
  const getIcon = (label) => {
    if (label.toLowerCase().includes("address"))
      return (
        <MdLocationOn className="text-[#06a84e] text-xl flex-shrink-0 mt-0.5" />
      );
    if (
      label.toLowerCase().includes("number") ||
      label.toLowerCase().includes("phone")
    )
      return <MdPhone className="text-[#06a84e] text-xl flex-shrink-0" />;
    if (label.toLowerCase().includes("email"))
      return <MdEmail className="text-[#06a84e] text-xl flex-shrink-0" />;
    return null;
  };

  return (
    <footer className="max-padd-container mb-4 overflow-x-hidden">
      {/* Main Footer */}
      <div className="bg-[#1e2a38] rounded-tr-3xl rounded-tl-3xl pt-10 sm:pt-14 xl:pt-16 pb-10 px-6 sm:px-10 lg:px-16">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
          <div className="max-w-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Explore real estate opportunities with us
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Through technology-driven marketing methods, a continuously
              evolving team structure, and a global investment network, we aim
              to be an institution that offers investors the most accurate
              opportunities.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-start gap-4">
            {SOCIALS.links.map((link) => (
              <Link
                to="/"
                key={link.id}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#06a84e] transition-colors"
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>

        <hr className="border-white/10 mb-10" />

        {/* Bottom Section - Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <Link to={"/"} className="inline-block mb-4">
              <img
                src={logo}
                alt="HB International"
                className="h-12 object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              The vision of HB Gayrimenkul INTERNATIONAL is to be a leading
              brand that elevates real estate consultancy to a new level in
              Türkiye and international markets.
            </p>
          </div>

          {/* Footer Links */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-5">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    {link === "About Us" ? (
                      <button
                        onClick={() => handleLinkClick(link)}
                        className="text-white/50 text-sm hover:text-[#06a84e] transition-colors cursor-pointer"
                      >
                        {link}
                      </button>
                    ) : (
                      <Link
                        to="/"
                        className="text-white/50 text-sm hover:text-[#06a84e] transition-colors"
                      >
                        {link}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              {FOOTER_CONTACT_INFO.title}
            </h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_CONTACT_INFO.links.map((link) => (
                <li key={link.label} className="flex gap-3 items-start">
                  {getIcon(link.label)}
                  <div>
                    <p className="text-white/40 text-xs mb-1">{link.label}</p>
                    <p className="text-white text-sm">{link.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#151f2b] py-4 px-6 sm:px-10 rounded-b-3xl flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-white/50 text-sm">
          © 2025 HB International Gayrimenkul
        </span>
        <span className="text-white/50 text-sm">All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;

const FooterColumn = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="font-semibold text-white whitespace-nowrap">{title}</h4>
      {children}
    </div>
  );
};

FooterColumn.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
