import { NavLink, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
// icons
import { MdHomeWork, MdSell, MdHome } from "react-icons/md";
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";
import { MdPermContactCalendar } from "react-icons/md";
import { MdAddHome } from "react-icons/md";
import useAdmin from "../hooks/useAdmin";
import useAuthCheck from "../hooks/useAuthCheck";

const Navbar = ({ containerStyles }) => {
  const { isAdmin, loading } = useAdmin();
  const { validateLogin } = useAuthCheck();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      navigate("/admin");
    }
  };

  // Check if current filter is active
  const searchParams = new URLSearchParams(location.search);
  const currentFilter = searchParams.get("type");

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

      {/* Sale Filter Button */}
      <NavLink
        to={"/listing?type=sale"}
        className={() =>
          currentFilter === "sale"
            ? "flexCenter gap-x-1 rounded-full px-3 py-1 bg-green-500 text-white"
            : "flexCenter gap-x-1 rounded-full px-3 py-1 bg-green-100 text-green-700 hover:bg-green-500 hover:text-white transition-colors"
        }
      >
        <MdSell />
        <div>Satılık</div>
      </NavLink>

      {/* Rent Filter Button */}
      <NavLink
        to={"/listing?type=rent"}
        className={() =>
          currentFilter === "rent"
            ? "flexCenter gap-x-1 rounded-full px-3 py-1 bg-blue-500 text-white"
            : "flexCenter gap-x-1 rounded-full px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-500 hover:text-white transition-colors"
        }
      >
        <MdHome />
        <div>Kiralık</div>
      </NavLink>

      <NavLink
        to={"mailto:inquiries.codeatusman@gmail.com"}
        className="flexCenter gap-x-1 rounded-full px-2 py-1"
      >
        <MdPermContactCalendar />
        <div>Contact</div>
      </NavLink>
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
};

export default Navbar;
