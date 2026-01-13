import {
  MdOutlineBed,
  MdOutlineBathtub,
  MdOutlineGarage,
  MdSell,
  MdHome,
} from "react-icons/md";
import { CgRuler } from "react-icons/cg";
import { FaRegClock } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import HeartBtn from "./HeartBtn";
import PropTypes from "prop-types";

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Item = ({ property }) => {
  const navigate = useNavigate();
  const isForSale = property.propertyType === "sale" || !property.propertyType;

  return (
    <div
      className="rounded-2xl p-5 bg-white cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`../listing/${property.id}`)}
    >
      <div className="pb-2 relative">
        <img src={property.image} alt={property.title} className="rounded-xl" />
        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`flexCenter gap-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
              isForSale ? "bg-green-500 text-white" : "bg-blue-500 text-white"
            }`}
          >
            {isForSale ? <MdSell size={14} /> : <MdHome size={14} />}
            {isForSale ? "For Sale" : "For Rent"}
          </span>
        </div>
        {/* like btn */}
        <div className="absolute top-4 right-6">
          <HeartBtn id={property?.id} />
        </div>
      </div>
      {/* City and Date Row */}
      <div className="flexBetween my-1">
        <h5 className="bold-16 text-secondary">{property.city}</h5>
        {property.updatedAt && (
          <span className="flexCenter gap-x-1 text-xs text-gray-30">
            <FaRegClock size={11} />
            {formatDate(property.updatedAt)}
          </span>
        )}
      </div>
      <h4 className="medium-18 line-clamp-1">{property.title}</h4>
      {/* info */}
      <div className="flex flex-wrap gap-2 py-2 text-sm">
        <div className="flexCenter gap-x-1 border-r border-slate-900/50 pr-2 font-[500]">
          <MdOutlineBed /> {property.facilities.bedrooms}
        </div>
        <div className="flexCenter gap-x-1 border-r border-slate-900/50 pr-2 font-[500]">
          <MdOutlineBathtub /> {property.facilities.bathrooms}
        </div>
        <div className="flexCenter gap-x-1 border-r border-slate-900/50 pr-2 font-[500]">
          <MdOutlineGarage /> {property.facilities.parkings}
        </div>
        <div className="flexCenter gap-x-1 font-[500]">
          <CgRuler /> 400
        </div>
      </div>
      <p className="pt-2 mb-4 line-clamp-2">{property.description}</p>
      <div className="flexBetween flex-wrap gap-2">
        <div className="bold-18 sm:bold-20">
          ₺{property.price.toLocaleString()}
          {!isForSale && (
            <span className="text-sm font-normal text-gray-500">/ay</span>
          )}
        </div>
        <Link to={`/`}>
          <button className="btn-secondary rounded-xl !px-4 sm:!px-5 !py-[7px] shadow-sm text-sm sm:text-base">
            View details
          </button>
        </Link>
      </div>
    </div>
  );
};

Item.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    city: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    propertyType: PropTypes.string,
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    facilities: PropTypes.shape({
      bedrooms: PropTypes.number,
      bathrooms: PropTypes.number,
      parkings: PropTypes.number,
    }),
  }).isRequired,
};

export default Item;
