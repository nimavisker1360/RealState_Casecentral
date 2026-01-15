import { useNavigate } from "react-router-dom";
import {
  MdOutlineBed,
  MdOutlineBathtub,
  MdOutlineGarage,
  MdSell,
  MdHome,
  MdEmail,
} from "react-icons/md";
import { FaHeart, FaRegHeart, FaWhatsapp } from "react-icons/fa";
import PropTypes from "prop-types";
import { useContext } from "react";
import UserDetailContext from "../context/UserDetailContext";
import { useMutation } from "react-query";
import { toFav } from "../utils/api";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

const PropertyCard = ({ property, onCardClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const isForSale = property.propertyType === "sale" || !property.propertyType;

  const isFavorite = userDetails?.favourites?.includes(property.id);

  const { mutate: toggleFav } = useMutation({
    mutationFn: () => toFav(property.id, user?.email, userDetails?.token),
    onSuccess: () => {
      if (isFavorite) {
        setUserDetails((prev) => ({
          ...prev,
          favourites: prev.favourites.filter((id) => id !== property.id),
        }));
        toast.success("Removed from favorites");
      } else {
        setUserDetails((prev) => ({
          ...prev,
          favourites: [...prev.favourites, property.id],
        }));
        toast.success("Added to favorites");
      }
    },
  });

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login first");
      return;
    }
    toggleFav();
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(property.id);
    } else {
      navigate(`/listing/${property.id}`);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi, I'm interested in the property: ${
        property.title
      } - ₺${property.price.toLocaleString()}`
    );
    window.open(`https://wa.me/905551234567?text=${message}`, "_blank");
  };

  return (
    <div
      className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        {/* Property Image */}
        <div className="relative w-[280px] h-[180px] flex-shrink-0">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
          />
          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                isForSale ? "bg-green-500 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {isForSale ? <MdSell size={12} /> : <MdHome size={12} />}
              {isForSale ? "For Sale" : "For Rent"}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {property.title}
              </h3>
              <p className="text-sm text-gray-500">
                {property.address}, {property.city}, {property.country}
              </p>
            </div>
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isFavorite ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Price */}
          <div className="mt-2">
            <span className="text-2xl font-bold text-green-600">
              ₺{property.price.toLocaleString()}
            </span>
            {!isForSale && (
              <span className="text-sm text-gray-500 ml-1">/mo</span>
            )}
          </div>

          {/* Facilities */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MdOutlineBed className="w-4 h-4" />
              <span>{property.facilities?.bedrooms || 0} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <MdOutlineBathtub className="w-4 h-4" />
              <span>{property.facilities?.bathrooms || 0} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <MdOutlineGarage className="w-4 h-4" />
              <span>{property.facilities?.parkings || 0} Garage</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {property.description}
          </p>

          {/* Contact Buttons */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#25D366] rounded-lg hover:bg-[#1da851] transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/listing/${property.id}`);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MdEmail className="w-4 h-4" />
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    propertyType: PropTypes.string,
    facilities: PropTypes.shape({
      bedrooms: PropTypes.number,
      bathrooms: PropTypes.number,
      parkings: PropTypes.number,
    }),
  }).isRequired,
  onCardClick: PropTypes.func,
};

export default PropertyCard;
