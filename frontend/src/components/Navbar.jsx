import { NavLink, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// icons
import {
  MdHomeWork,
  MdSell,
  MdKeyboardArrowDown,
  MdBusiness,
  MdLocationCity,
  MdPublic,
} from "react-icons/md";
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";
import { MdPermContactCalendar } from "react-icons/md";
import { MdAddHome } from "react-icons/md";
import { FaLandmark, FaHome, FaBriefcase } from "react-icons/fa";
import useAdmin from "../hooks/useAdmin";
import useAuthCheck from "../hooks/useAuthCheck";

const Navbar = ({ containerStyles, onContactClick, closeMenu }) => {
  const { t } = useTranslation();
  const { isAdmin, loading } = useAdmin();
  const { validateLogin } = useAuthCheck();
  const navigate = useNavigate();
  const location = useLocation();
  const [saleDropdownOpen, setSaleDropdownOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);

  // Property categories with translations
  const propertyCategories = [
    { value: "residential", label: t("categories.residential"), icon: FaHome },
    {
      value: "commercial",
      label: t("categories.commercial"),
      icon: FaBriefcase,
    },
    { value: "land", label: t("categories.land"), icon: FaLandmark },
  ];

  // Project types with translations
  const projectTypes = [
    {
      value: "LocalProject",
      label: t("nav.localProjects"),
      icon: MdLocationCity,
    },
    {
      value: "international",
      label: t("nav.internationalProjects"),
      icon: MdPublic,
    },
  ];

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      closeMenu && closeMenu();
      navigate("/admin");
    }
  };

  // Check if current filter is active
  const searchParams = new URLSearchParams(location.search);
  const currentFilter = searchParams.get("type");
  const currentCategory = searchParams.get("category");

  const handleCategoryClick = (type, category) => {
    navigate(`/listing?type=${type}&category=${category}`);
    setSaleDropdownOpen(false);
    setProjectsDropdownOpen(false);
    closeMenu && closeMenu();
  };

  const toggleSaleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaleDropdownOpen(!saleDropdownOpen);
    setProjectsDropdownOpen(false);
  };

  const toggleProjectsDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectsDropdownOpen(!projectsDropdownOpen);
    setSaleDropdownOpen(false);
  };

  const handleProjectClick = (projectType) => {
    navigate(`/listing?projectType=${projectType}`);
    setProjectsDropdownOpen(false);
    closeMenu && closeMenu();
  };

  return (
    <nav
      className={`${containerStyles} flex flex-col md:flex-row md:items-center`}
    >
      {/* Home */}
      <NavLink
        to={"/"}
        onClick={() => closeMenu && closeMenu()}
        className={({ isActive }) =>
          `flex items-center justify-between w-full md:w-auto px-4 py-4 md:px-2 md:py-1 border-b md:border-b-0 border-gray-300 hover:bg-gray-50 md:hover:bg-transparent transition-colors ${
            isActive
              ? "text-blue-600 font-semibold md:active-link"
              : "text-gray-800"
          }`
        }
      >
        <div className="flex items-center gap-3">
          <MdHomeWork size={20} />
          <span>{t("nav.home")}</span>
        </div>
      </NavLink>

      {/* Listing */}
      <NavLink
        to={"/listing"}
        onClick={() => closeMenu && closeMenu()}
        className={({ isActive }) =>
          `flex items-center justify-between w-full md:w-auto px-4 py-4 md:px-2 md:py-1 border-b md:border-b-0 border-gray-300 hover:bg-gray-50 md:hover:bg-transparent transition-colors ${
            isActive && !currentFilter
              ? "text-blue-600 font-semibold md:active-link"
              : "text-gray-800"
          }`
        }
      >
        <div className="flex items-center gap-3">
          <RiCheckboxMultipleBlankFill size={20} />
          <span>{t("nav.listing")}</span>
        </div>
      </NavLink>

      {/* For Sale with Dropdown */}
      <div
        className="w-full md:w-auto md:relative md:group"
        onMouseEnter={() =>
          window.innerWidth >= 768 && setSaleDropdownOpen(true)
        }
        onMouseLeave={() =>
          window.innerWidth >= 768 && setSaleDropdownOpen(false)
        }
      >
        <div
          className={`flex items-center justify-between w-full px-4 py-4 md:px-3 md:py-1 border-b md:border-b-0 border-gray-300 cursor-pointer hover:bg-green-50 md:hover:bg-transparent transition-colors ${
            currentFilter === "sale"
              ? "text-green-600 font-semibold md:bg-green-500 md:text-white"
              : "text-gray-800 md:bg-green-100 md:text-green-700 md:hover:bg-green-500 md:hover:text-white"
          }`}
          onClick={(e) => {
            // On mobile: toggle dropdown
            if (window.innerWidth < 768) {
              toggleSaleDropdown(e);
            } else {
              // On desktop: navigate
              closeMenu && closeMenu();
              navigate("/listing?type=sale");
            }
          }}
        >
          <div className="flex items-center gap-3 md:gap-1">
            <MdSell size={20} />
            <span>{t("nav.forSale")}</span>
          </div>
          <MdKeyboardArrowDown
            size={20}
            className={`transition-transform duration-300 ${
              saleDropdownOpen ? "rotate-180" : ""
            }`}
            onClick={(e) => {
              if (window.innerWidth < 768) {
                toggleSaleDropdown(e);
              }
            }}
          />
        </div>

        {/* Sale Dropdown */}
        {saleDropdownOpen && (
          <div className="md:absolute md:top-full md:left-0 md:z-50 bg-white md:shadow-lg md:border md:border-gray-100">
            {propertyCategories.map((cat) => {
              const IconComponent = cat.icon;
              const isActive =
                currentFilter === "sale" && currentCategory === cat.value;
              return (
                <div
                  key={cat.value}
                  onClick={() => handleCategoryClick("sale", cat.value)}
                  className={`flex items-start gap-3 px-8 md:px-4 py-3 md:py-2 cursor-pointer transition-colors border-b md:border-b-0 border-gray-300 last:border-b-0 ${
                    isActive
                      ? "bg-green-100 text-green-700 font-medium md:bg-green-500 md:text-white"
                      : "text-green-700 hover:bg-green-50 md:hover:bg-green-50 md:hover:text-green-600"
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="text-sm md:text-sm font-medium">
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Projects with Dropdown */}
      <div
        className="w-full md:w-auto md:relative md:group"
        onMouseEnter={() =>
          window.innerWidth >= 768 && setProjectsDropdownOpen(true)
        }
        onMouseLeave={() =>
          window.innerWidth >= 768 && setProjectsDropdownOpen(false)
        }
      >
        <div
          className={`flex items-center justify-between w-full px-4 py-4 md:px-3 md:py-1 border-b md:border-b-0 border-gray-300 cursor-pointer hover:bg-blue-50 md:hover:bg-transparent transition-colors ${
            searchParams.get("projectType")
              ? "text-blue-600 font-semibold md:bg-blue-500 md:text-white"
              : "text-gray-800 md:bg-blue-100 md:text-blue-700 md:hover:bg-blue-500 md:hover:text-white"
          }`}
          onClick={(e) => {
            // On mobile: toggle dropdown
            if (window.innerWidth < 768) {
              toggleProjectsDropdown(e);
            } else {
              // On desktop: toggle dropdown instead of navigate
              toggleProjectsDropdown(e);
            }
          }}
        >
          <div className="flex items-center gap-3 md:gap-1">
            <MdBusiness size={20} />
            <span>{t("nav.projects")}</span>
          </div>
          <MdKeyboardArrowDown
            size={20}
            className={`transition-transform duration-300 ${
              projectsDropdownOpen ? "rotate-180" : ""
            }`}
            onClick={(e) => {
              toggleProjectsDropdown(e);
            }}
          />
        </div>

        {/* Projects Dropdown */}
        {projectsDropdownOpen && (
          <div className="md:absolute md:top-full md:left-0 md:z-50 bg-blue-50 md:bg-white md:shadow-lg md:border md:border-gray-100 md:min-w-[200px]">
            {projectTypes.map((project) => {
              const IconComponent = project.icon;
              const isActive =
                searchParams.get("projectType") === project.value;
              return (
                <div
                  key={project.value}
                  onClick={() => handleProjectClick(project.value)}
                  className={`flex items-center gap-3 px-8 md:px-4 py-3 md:py-2 cursor-pointer transition-colors border-b md:border-b-0 border-gray-300 last:border-b-0 ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium md:bg-blue-500 md:text-white"
                      : "text-blue-700 hover:bg-blue-50 md:hover:bg-blue-50 md:hover:text-blue-600"
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="text-sm md:text-sm font-medium whitespace-nowrap">
                    {project.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact */}
      <button
        onClick={onContactClick}
        className="flex items-center justify-between w-full md:w-auto px-4 py-4 md:px-2 md:py-1 border-b md:border-b-0 border-gray-300 hover:bg-gray-50 md:hover:bg-transparent md:hover:text-secondary transition-colors text-gray-800"
      >
        <div className="flex items-center gap-3">
          <MdPermContactCalendar size={20} />
          <span>{t("nav.contact")}</span>
        </div>
      </button>

      {/* Add Property - Admin Only */}
      {!loading && isAdmin && (
        <div
          onClick={handleAddPropertyClick}
          className="flex items-center justify-between w-full md:w-auto px-4 py-4 md:px-2 md:py-1 border-b md:border-b-0 border-gray-300 cursor-pointer hover:bg-gray-50 md:hover:bg-secondary md:hover:text-white transition-colors text-gray-800"
        >
          <div className="flex items-center gap-3">
            <MdAddHome size={20} />
            <span>{t("nav.addProperty")}</span>
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  containerStyles: PropTypes.string,
  onContactClick: PropTypes.func,
  closeMenu: PropTypes.func,
};

export default Navbar;
