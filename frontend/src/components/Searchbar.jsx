import { FaLocationDot } from "react-icons/fa6";
import PropTypes from "prop-types";

const Searchbar = ({ filter, setFilter }) => {
  return (
    <div className="flexBetween pl-4 sm:pl-6 h-[3rem] sm:h-[3.3rem] bg-white w-full max-w-full sm:max-w-[366px] rounded-full ring-1 ring-slate-500/5">
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search address or city..."
        className="bg-transparent border-none outline-none w-full text-sm sm:text-base"
      />
      <FaLocationDot className="relative right-3 sm:right-4 text-lg sm:text-xl hover:text-secondary flex-shrink-0" />
    </div>
  );
};

Searchbar.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};

export default Searchbar;
