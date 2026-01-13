import PropertyGridCard from "./PropertyGridCard";
import { Link } from "react-router-dom";
import useProperties from "../hooks/useProperties";
import { PuffLoader } from "react-spinners";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();

  if (isError) {
    return (
      <div className="max-padd-container py-16">
        <span className="text-red-500">Error while fetching data</span>
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
          color="#16a34a"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <section className="max-padd-container py-16 xl:py-24">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-green-600 font-medium text-sm uppercase tracking-wider mb-2">
          Your Future Home Awaits
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Find Your Dream Here
        </h2>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.slice(0, 8).map((property) => (
          <PropertyGridCard key={property.id} property={property} />
        ))}
      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-12">
        <Link
          to="/listing"
          className="px-8 py-3 bg-[#3d6b2f] text-white font-medium rounded hover:bg-[#2d5022] transition-colors"
        >
          View More
        </Link>
      </div>
    </section>
  );
};

export default Properties;
