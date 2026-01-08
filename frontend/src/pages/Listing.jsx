import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import useProperties from "../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import Item from "../components/Item";
import { MdSell, MdHome, MdList } from "react-icons/md";

const Listing = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get property type filter from URL
  const typeFilter = searchParams.get("type");

  if (isError) {
    return (
      <div>
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-64 flexCenter">
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#555"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  // Filter properties by type and search
  const filteredData = data
    .filter((property) => {
      // Filter by property type if set
      if (typeFilter) {
        return property.propertyType === typeFilter;
      }
      return true;
    })
    .filter((property) =>
      property.title.toLowerCase().includes(filter.toLowerCase()) ||
      property.city.toLowerCase().includes(filter.toLowerCase()) ||
      property.country.toLowerCase().includes(filter.toLowerCase())
    );

  const handleTypeFilter = (type) => {
    if (type === null) {
      searchParams.delete("type");
    } else {
      searchParams.set("type", type);
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="max-padd-container my-[99px] overflow-x-hidden">
      <div className="py-10 xl:py-22 bg-primary rounded-3xl px-4 sm:px-6 lg:px-12">
        <div className="">
          <Searchbar filter={filter} setFilter={setFilter} />
          
          {/* Property Type Filter Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6 mb-4">
            <button
              onClick={() => handleTypeFilter(null)}
              className={`flexCenter gap-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                !typeFilter
                  ? "bg-gray-700 text-white shadow-md"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <MdList size={18} />
              <span>Tümü</span>
            </button>
            <button
              onClick={() => handleTypeFilter("sale")}
              className={`flexCenter gap-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                typeFilter === "sale"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              <MdSell size={18} />
              <span>Satılık</span>
            </button>
            <button
              onClick={() => handleTypeFilter("rent")}
              className={`flexCenter gap-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                typeFilter === "rent"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              <MdHome size={18} />
              <span>Kiralık</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="text-center text-gray-500 text-sm mb-4">
            {filteredData.length} mülk bulundu
            {typeFilter && (
              <span className="ml-1">
                ({typeFilter === "sale" ? "Satılık" : "Kiralık"})
              </span>
            )}
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
            {filteredData.length > 0 ? (
              filteredData.map((property, i) => (
                <Item key={i} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <p className="text-gray-500">Bu kategoride mülk bulunmuyor</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Listing;
