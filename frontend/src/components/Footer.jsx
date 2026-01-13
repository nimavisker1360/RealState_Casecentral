import { Link } from "react-router-dom";
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "../constant/data";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="max-padd-container mb-4 overflow-x-hidden">
      <div className="bg-primary rounded-tr-3xl rounded-tl-3xl pt-8 sm:pt-12 xl:pt-20 pb-8 px-4 sm:px-6 lg:px-12">
        <h3 className="h3 text-xl sm:text-2xl md:text-3xl">Explore real estate opportunities with us?</h3>
        <p className="text-sm sm:text-base">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni,
          ducimus iste?
        </p>
        <hr className="my-6 sm:my-8 bg-slate-900/30 h-[2px]" />
        {/* container */}
        <div
          className="flex justify-between flex-wrap gap-6 sm:gap-2"
        >
          <div className="max-w-full sm:max-w-sm w-full sm:w-auto">
            <Link to={"/"} className="flex items-center gap-x-2">
              <img src={logo} alt="HB International" className="h-10 sm:h-12 object-contain" />
            </Link>
            <p className="py-4 text-sm sm:text-base">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla
              recusandae voluptatibus excepturi nostrum cum delectus repellat?
            </p>
            <div className="flex items-center pl-3 sm:pl-6 h-[3rem] sm:h-[3.3rem] bg-white w-full max-w-full sm:max-w-[366px] rounded-full ring-1 ring-slate-500/5">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-none outline-none flex-1 min-w-0 text-sm sm:text-base"
              />
              <button className="btn-secondary rounded-full relative right-[0.2rem] sm:right-[0.33rem] text-xs sm:text-base !px-3 sm:!px-7 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex justify-between flex-wrap gap-8">
            {FOOTER_LINKS.map((col) => (
              <FooterColumn key={col.title} title={col.title}>
                <ul className="flex flex-col gap-4 regular-14 text-gray-20">
                  {col.links.map((link) => (
                    <Link to="/" key={link}>
                      {link}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}
            <div className="flex flex-col gap-5">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link
                    to="/"
                    key={link.label}
                    className="flex gap-4 md:flex-col lg:flex-row"
                  >
                    <p>{link.label}:</p>
                    <p className="bold-15">{link.value}</p>
                  </Link>
                ))}
              </FooterColumn>
            </div>
            <div className="flex ">
              <FooterColumn title={SOCIALS.title}>
                <ul className="flex gap-4">
                  {SOCIALS.links.map((link) => (
                    <Link to="/" key={link.id} className="text-xl">
                      {link.icon}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
      </div>
      {/* copyrights */}
      <p className="text-white bg-tertiary medium-14 py-2 px-4 sm:px-8 rounded-b-3xl flexBetween text-xs sm:text-sm">
        <span>2024 HB International Gayrimenkul</span>
        <span>All rights reserved</span>
      </p>
    </footer>
  );
};

export default Footer;

const FooterColumn = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap">{title}</h4>
      {children}
    </div>
  );
};

FooterColumn.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
