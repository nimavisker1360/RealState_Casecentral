import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useProperties from "../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../components/PropertyCard";
import PropertiesMap from "../components/PropertiesMap";
import { MdSell, MdHome, MdList, MdSearch } from "react-icons/md";
import { FaLandmark, FaHome, FaBriefcase } from "react-icons/fa";

const Listing = () => {
  const { t } = useTranslation();
  const { data, isError, isLoading } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Property categories with translations
  const propertyCategories = [
    { value: "residential", label: t('categories.residential'), icon: FaHome },
    { value: "commercial", label: t('categories.commercial'), icon: FaBriefcase },
    { value: "land", label: t('categories.land'), icon: FaLandmark },
  ];

  // Get filters from URL
  const typeFilter = searchParams.get("type");
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";

  const [filter, setFilter] = useState(searchQuery);

  // Update filter when URL search param changes
  useEffect(() => {
    setFilter(searchQuery);
  }, [searchQuery]);

  // Update URL when filter changes
  const handleFilterChange = (value) => {
    setFilter(value);
    if (value.trim()) {
      searchParams.set("search", value);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  if (isError) {
    return (
      <div className="h-screen flexCenter">
        <span className="text-red-500">{t('listing.errorFetching')}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flexCenter">
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#16a34a"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  // Filter properties by type, category, and search
  const filteredData = data
    .filter((property) => {
      if (typeFilter) {
        return property.propertyType === typeFilter;
      }
      return true;
    })
    .filter((property) => {
      if (categoryFilter) {
        return property.category === categoryFilter;
      }
      return true;
    })
    .filter(
      (property) =>
        property.title.toLowerCase().includes(filter.toLowerCase()) ||
        property.city.toLowerCase().includes(filter.toLowerCase()) ||
        property.country.toLowerCase().includes(filter.toLowerCase()) ||
        property.address.toLowerCase().includes(filter.toLowerCase())
    );

  const handleTypeFilter = (type) => {
    if (type === null) {
      searchParams.delete("type");
      searchParams.delete("category");
    } else {
      searchParams.set("type", type);
    }
    setSearchParams(searchParams);
  };

  const handleCategoryFilter = (category) => {
    if (category === null) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const handlePropertyClick = (id) => {
    navigate(`/listing/${id}`);
  };

  return (
    <main className="h-screen pt-[80px] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Map */}
      <div className="w-full lg:w-[60%] h-[300px] lg:h-full relative">
        <PropertiesMap
          properties={filteredData}
          onPropertyClick={handlePropertyClick}
        />

        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <button className="bg-white p-2 rounded shadow hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="bg-white p-2 rounded shadow hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Side - Property Listings */}
      <div className="w-full lg:w-[40%] h-full flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          {/* Search Title */}
          <div className="mb-3">
            <h1 className="text-xl font-bold text-gray-900">
              {filter
                ? t('listing.propertiesIn', { location: filter })
                : t('listing.allProperties')}
            </h1>
            <p className="text-sm text-gray-500">
              {t('listing.propertiesFound', { count: filteredData.length })}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              placeholder={t('listing.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <button
              onClick={() => handleTypeFilter(null)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                !typeFilter
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <MdList size={16} />
              <span>{t('listing.all')}</span>
            </button>
            <button
              onClick={() => handleTypeFilter("sale")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                typeFilter === "sale"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              <MdSell size={16} />
              <span>{t('listing.forSale')}</span>
            </button>
            <button
              onClick={() => handleTypeFilter("rent")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                typeFilter === "rent"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <MdHome size={16} />
              <span>{t('listing.forRent')}</span>
            </button>
          </div>

          {/* Category Filter Buttons - Show when type is selected */}
          {typeFilter && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !categoryFilter
                    ? typeFilter === "sale" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{t('listing.allCategories')}</span>
              </button>
              {propertyCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = categoryFilter === cat.value;
                const isSale = typeFilter === "sale";
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryFilter(cat.value)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? isSale ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                        : isSale 
                          ? "bg-green-50 text-green-700 hover:bg-green-100" 
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    <IconComponent size={12} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Property List */}
        <div className="flex-1 overflow-y-auto">
          {filteredData.length > 0 ? (
            filteredData.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onCardClick={handlePropertyClick}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {t('listing.noProperties')}
              </h3>
              <p className="text-gray-500">
                {t('listing.tryAdjusting')}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Listing;
