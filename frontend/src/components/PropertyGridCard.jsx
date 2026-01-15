import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const PropertyGridCard = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg overflow-hidden cursor-pointer group transition-all hover:shadow-xl"
      onClick={() => navigate(`/listing/${property.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="p-4 text-center">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Address */}
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {property.address},<br />
          {property.city}, {property.country}
        </p>

        {/* Price */}
        <p className="text-base font-semibold text-gray-800 mb-1">
          ₺{property.price.toLocaleString()}
          {property.propertyType === "rent" && (
            <span className="font-normal text-gray-500">
              {" "}
              - ₺{(property.price * 1.5).toLocaleString()}
            </span>
          )}
        </p>

        {/* Beds Info */}
        <p className="text-sm text-gray-500">
          {property.facilities?.bedrooms === 0 ? "Studio" : "Studio"} -{" "}
          {property.facilities?.bedrooms || 2} Beds
        </p>
      </div>
    </div>
  );
};

PropertyGridCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    price: PropTypes.number,
    propertyType: PropTypes.string,
    facilities: PropTypes.shape({
      bedrooms: PropTypes.number,
      bathrooms: PropTypes.number,
      parkings: PropTypes.number,
    }),
  }).isRequired,
};

export default PropertyGridCard;
