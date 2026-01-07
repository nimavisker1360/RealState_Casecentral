import { NavLink, useNavigate } from "react-router-dom";
// icons
import { MdHomeWork } from "react-icons/md";
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";
import { MdPermContactCalendar } from "react-icons/md";
import { MdAddHome } from "react-icons/md";
import useAdmin from "../hooks/useAdmin";
import useAuthCheck from "../hooks/useAuthCheck";

const Navbar = ({ containerStyles }) => {
  const { isAdmin, loading } = useAdmin();
  const { validateLogin } = useAuthCheck();
  const navigate = useNavigate();

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      navigate("/admin");
    }
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
          isActive
            ? "active-link flexCenter gap-x-1 rounded-full px-2 py-1"
            : "flexCenter gap-x-1 rounded-full px-2 py-1"
        }
      >
        <RiCheckboxMultipleBlankFill />
        <div>Listing</div>
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

export default Navbar;
