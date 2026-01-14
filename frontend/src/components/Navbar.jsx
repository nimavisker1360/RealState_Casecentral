import { NavLink, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
// icons
import {
  MdHomeWork,
  MdSell,
  MdHome,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";
import { MdPermContactCalendar } from "react-icons/md";
import { MdAddHome } from "react-icons/md";
import { FaLandmark, FaHome, FaBriefcase } from "react-icons/fa";
import useAdmin from "../hooks/useAdmin";
import useAuthCheck from "../hooks/useAuthCheck";

// Property categories
const propertyCategories = [
  { value: "residential", label: "Residential", icon: FaHome },
  { value: "commercial", label: "Commercial", icon: FaBriefcase },
  { value: "land", label: "Land", icon: FaLandmark },
];

const Navbar = ({ containerStyles, onContactClick }) => {
  const { isAdmin, loading } = useAdmin();
  const { validateLogin } = useAuthCheck();
  const navigate = useNavigate();
  const location = useLocation();
  const [saleDropdownOpen, setSaleDropdownOpen] = useState(false);
  const [rentDropdownOpen, setRentDropdownOpen] = useState(false);

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
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
    setRentDropdownOpen(false);
  };

  return (
    <nav className={`${containerStyles}`}>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          isActive
            ? "active-link flexCenter gap-x-1 rounded-full px-2 py-1"
            : "flexCenter gap-x-1 rounded-full px-2 py-1"
        }
      >
        <MdHomeWork />
        <div>Home</div>
      </NavLink>
      <NavLink
        to={"/listing"}
        className={({ isActive }) =>
          isActive && !currentFilter
            ? "active-link flexCenter gap-x-1 rounded-full px-2 py-1"
            : "flexCenter gap-x-1 rounded-full px-2 py-1"
        }
      >
        <RiCheckboxMultipleBlankFill />
        <div>Listing</div>
      </NavLink>

      {/* Sale Filter Button with Dropdown */}
      <div
        className="relative group"
        onMouseEnter={() => setSaleDropdownOpen(true)}
        onMouseLeave={() => setSaleDropdownOpen(false)}
      >
        <NavLink
          to={"/listing?type=sale"}
          className={() =>
            currentFilter === "sale"
              ? "flexCenter gap-x-1 rounded-full px-3 py-1 bg-green-500 text-white"
              : "flexCenter gap-x-1 rounded-full px-3 py-1 bg-green-100 text-green-700 hover:bg-green-500 hover:text-white transition-colors"
          }
        >
          <MdSell />
          <div>For Sale</div>
          <MdKeyboardArrowDown
            className={`transition-transform ${
              saleDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </NavLink>

        {/* Sale Dropdown */}
        {saleDropdownOpen && (
          <div className="absolute top-full left-0 pt-2 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[180px]">
              {propertyCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive =
                  currentFilter === "sale" && currentCategory === cat.value;
                return (
                  <div
                    key={cat.value}
                    onClick={() => handleCategoryClick("sale", cat.value)}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-green-500 text-white"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    <IconComponent size={14} />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Rent Filter Button with Dropdown */}
      <div
        className="relative group"
        onMouseEnter={() => setRentDropdownOpen(true)}
        onMouseLeave={() => setRentDropdownOpen(false)}
      >
        <NavLink
          to={"/listing?type=rent"}
          className={() =>
            currentFilter === "rent"
              ? "flexCenter gap-x-1 rounded-full px-3 py-1 bg-blue-500 text-white"
              : "flexCenter gap-x-1 rounded-full px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-500 hover:text-white transition-colors"
          }
        >
          <MdHome />
          <div>For Rent</div>
          <MdKeyboardArrowDown
            className={`transition-transform ${
              rentDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </NavLink>

        {/* Rent Dropdown */}
        {rentDropdownOpen && (
          <div className="absolute top-full left-0 pt-2 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[180px]">
              {propertyCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive =
                  currentFilter === "rent" && currentCategory === cat.value;
                return (
                  <div
                    key={cat.value}
                    onClick={() => handleCategoryClick("rent", cat.value)}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <IconComponent size={14} />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onContactClick}
        className="flexCenter gap-x-1 rounded-full px-2 py-1 hover:text-secondary transition-colors"
      >
        <MdPermContactCalendar />
        <div>Contact</div>
      </button>
      {/* Only show Add Property for admins */}
      {!loading && isAdmin && (
        <div
          onClick={handleAddPropertyClick}
          className="cursor-pointer flexCenter gap-x-1 rounded-full px-2 py-1 hover:bg-secondary hover:text-white transition-colors"
        >
          <MdAddHome />
          <div>Add Property</div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  containerStyles: PropTypes.string,
  onContactClick: PropTypes.func,
};

export default Navbar;
