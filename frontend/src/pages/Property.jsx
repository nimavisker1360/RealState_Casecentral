import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import Map from "../components/Map";
import { getProperty, removeBooking } from "../utils/api";
import useAuthCheck from "../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../components/BookingModal";
import ContactModal from "../components/ContactModal";
import UserDetailContext from "../context/UserDetailContext";
import { Button, Avatar } from "@mantine/core";
import { toast } from "react-toastify";
import {
  MdOutlineBed,
  MdOutlineBathtub,
  MdOutlineGarage,
  MdSell,
  MdHome,
  MdVerified,
  MdCheck,
  MdClose,
} from "react-icons/md";
import {
  FaLocationDot,
  FaRegClock,
  FaCalendarPlus,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaStar,
} from "react-icons/fa6";
import { BsHouseDoor, BsTree } from "react-icons/bs";

// All possible interior features
const ALL_INTERIOR_FEATURES = [
  "ADSL",
  "Smart Home",
  "Burglar Alarm",
  "Fire Alarm",
  "Aluminum Joinery",
  "American Door",
  "Built-in Oven",
  "White Goods",
  "Dishwasher",
  "Dryer Machine",
  "Washing Machine",
  "Laundry Room",
  "Steel Door",
  "Shower Cabin",
  "Fiber Internet",
  "Oven",
  "Dressing Room",
  "Built-in Wardrobe",
  "Intercom System",
  "Crown Molding",
  "Pantry",
  "Air Conditioning",
  "Laminate Flooring",
  "Furniture",
  "Built-in Kitchen",
  "Laminate Kitchen",
  "Kitchen Natural Gas",
  "Parquet Flooring",
  "PVC Joinery",
  "Ceramic Flooring",
  "Stovetop",
  "Spot Lighting",
  "Jacuzzi",
  "Bathtub",
  "Terrace",
  "Wi-Fi",
  "Fireplace",
];

// All possible exterior features
const ALL_EXTERIOR_FEATURES = [
  "24/7 Security",
  "Doorman",
  "EV Charging Station",
  "Steam Room",
  "Children's Playground",
  "Turkish Bath (Hamam)",
  "Booster Pump",
  "Thermal Insulation",
  "Generator",
  "Cable TV",
  "Security Camera",
  "Nursery/Daycare",
  "Private Pool",
  "Sauna",
  "Sound Insulation",
  "Siding",
  "Sports Area",
  "Water Tank",
  "Satellite",
  "Fire Escape",
  "Indoor Swimming Pool",
  "Outdoor Swimming Pool",
  "Tennis Court",
  "Fitness Center",
  "Concierge",
  "Garden",
  "BBQ Area",
  "Parking Garage",
];
import { CgRuler } from "react-icons/cg";
import HeartBtn from "../components/HeartBtn";

// Format date helper function
const formatDate = (dateString, showFullDate = false) => {
  if (!dateString) return null;
  const date = new Date(dateString);

  if (showFullDate) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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

const Property = () => {
  const { pathname } = useLocation();
  // console.log(pathname);
  const id = pathname.split("/").slice(-1)[0];
  // console.log(id)
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );
  // console.log(data)
  const [modalOpened, setModalOpened] = useState(false);
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  // Get all images - support both 'images' array and single 'image'
  const getPropertyImages = () => {
    if (data?.images && data.images.length > 0) {
      return data.images;
    }
    if (data?.image) {
      return [data.image];
    }
    return [];
  };
  const propertyImages = getPropertyImages();

  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));

      toast.success("Booking cancelled", { position: "bottom-right" });
    },
  });

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

  if (isError) {
    return (
      <div>
        <span>Error while fetching data</span>
      </div>
    );
  }

  // Navigate gallery
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  return (
    <section className="max-padd-container my-[99px] overflow-x-hidden">
      {/* Image Gallery Grid */}
      <div className="pb-4 relative">
        <div className="flex gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
          {/* Main Large Image - Left Side */}
          <div
            className="relative flex-[1.5] group cursor-pointer"
            onClick={() => setGalleryOpened(true)}
          >
            <img
              src={propertyImages[0] || "https://via.placeholder.com/800x600"}
              alt={data?.title}
              className="w-full h-full object-cover"
            />
            {/* Navigation Arrow Left */}
            {propertyImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flexCenter shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MdOutlineBed className="rotate-180 text-xl" />‹
              </button>
            )}
            {/* Like Button */}
            <div className="absolute top-4 right-4 z-10">
              <HeartBtn id={id} />
            </div>
          </div>

          {/* Right Side - 2x2 Grid */}
          {propertyImages.length > 1 && (
            <div className="flex-1 grid grid-cols-2 gap-2">
              {propertyImages.slice(1, 5).map((img, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer overflow-hidden group"
                  onClick={() => {
                    setCurrentImageIndex(index + 1);
                    setGalleryOpened(true);
                  }}
                >
                  <img
                    src={img}
                    alt={`${data?.title} - ${index + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Show overlay on last visible image if more images */}
                  {index === 3 && propertyImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flexCenter">
                      <span className="text-white font-semibold text-lg">
                        +{propertyImages.length - 5} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Navigation Arrow Right */}
          {propertyImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flexCenter shadow-lg z-10"
            >
              ›
            </button>
          )}
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg flex items-center gap-4">
          <button
            onClick={() => setGalleryOpened(true)}
            className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors"
          >
            <span className="font-medium text-secondary">
              {propertyImages.length} Photos
            </span>
          </button>
          <div className="w-px h-5 bg-gray-300"></div>
          <button className="flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors">
            <span>Virtual Tour</span>
          </button>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {galleryOpened && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setGalleryOpened(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flexCenter text-white text-2xl z-10"
          >
            ×
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm">
            {currentImageIndex + 1} / {propertyImages.length}
          </div>

          {/* Main Image */}
          <img
            src={propertyImages[currentImageIndex]}
            alt={`${data?.title} - ${currentImageIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />

          {/* Navigation Arrows */}
          {propertyImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flexCenter text-white text-3xl"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flexCenter text-white text-3xl"
              >
                ›
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
            {propertyImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index + 1}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-16 w-24 object-cover rounded-lg cursor-pointer transition-all ${
                  currentImageIndex === index
                    ? "ring-2 ring-secondary opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
              />
            ))}
          </div>
        </div>
      )}
      {/* container */}
      <div className="max-w-4xl mx-auto">
        {/* Property Content */}
        <div className="rounded-2xl bg-white p-2">
          <div className="flexBetween mb-2">
            <h5 className="bold-16 text-secondary">{data?.city}</h5>
            {/* Property Type Badge */}
            <span
              className={`flexCenter gap-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                data?.propertyType === "rent"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {data?.propertyType === "rent" ? (
                <MdHome size={16} />
              ) : (
                <MdSell size={16} />
              )}
              {data?.propertyType === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>
          <div className="flexBetween">
            <h4 className="medium-18">{data?.title}</h4>
            <div className="bold-20">
              ₺{data?.price?.toLocaleString()}
              {data?.propertyType === "rent" && (
                <span className="text-sm font-normal text-gray-500">/mo</span>
              )}
            </div>
          </div>
          {/* info */}
          <div className="flex flex-wrap gap-2 sm:gap-x-4 py-2">
            <div className="flexCenter gap-x-2 border-r-2 border-gray-900/80 pr-2 sm:pr-4 font-[500] text-sm sm:text-base">
              <MdOutlineBed /> {data?.rooms || data?.facilities?.bedrooms}
            </div>
            <div className="flexCenter gap-x-2 border-r-2 border-gray-900/80 pr-2 sm:pr-4 font-[500] text-sm sm:text-base">
              <MdOutlineBathtub /> {data?.bathrooms || data?.facilities?.bathrooms}
            </div>
            <div className="flexCenter gap-x-2 border-r-2 border-gray-900/80 pr-2 sm:pr-4 font-[500] text-sm sm:text-base">
              <MdOutlineGarage /> {data?.facilities?.parkings}
            </div>
            <div className="flexCenter gap-x-2 font-[500] text-sm sm:text-base">
              <CgRuler /> {data?.area?.gross || data?.area?.net || 0} m²
            </div>
          </div>
          <p className="pt-2 mb-4">{data?.description}</p>
          <div className="flexStart gap-x-2 my-5">
            <FaLocationDot />
            <div>
              {data?.address} {data?.city} {data?.country}
            </div>
          </div>

          {/* Map Section - Moved Higher */}
          <div className="my-6 rounded-xl overflow-hidden h-[300px]">
            <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>

          {/* Property Details Table - Turkish Real Estate Style */}
          <div className="my-6 border border-gray-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-sm">
              <tbody>
                {data?.listingNo && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 w-1/3 border-r border-gray-200">İlan No</td>
                    <td className="px-4 py-3 text-gray-900">{data.listingNo}</td>
                  </tr>
                )}
                {data?.listingDate && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">İlan Tarihi</td>
                    <td className="px-4 py-3 text-gray-900">
                      {new Date(data.listingDate).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Emlak Tipi</td>
                  <td className="px-4 py-3 text-gray-900">{data?.propertyType === "sale" ? "Satılık" : "Kiralık"} Daire</td>
                </tr>
                {data?.area?.gross > 0 && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">m² (Brüt)</td>
                    <td className="px-4 py-3 text-gray-900">{data.area.gross}</td>
                  </tr>
                )}
                {data?.area?.net > 0 && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">m² (Net)</td>
                    <td className="px-4 py-3 text-gray-900">{data.area.net}</td>
                  </tr>
                )}
                {data?.rooms && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Oda Sayısı</td>
                    <td className="px-4 py-3 text-gray-900">{data.rooms}</td>
                  </tr>
                )}
                {data?.buildingAge !== undefined && data?.buildingAge !== null && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Bina Yaşı</td>
                    <td className="px-4 py-3 text-gray-900">{data.buildingAge}</td>
                  </tr>
                )}
                {data?.floor !== undefined && data?.floor !== null && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Bulunduğu Kat</td>
                    <td className="px-4 py-3 text-gray-900">{data.floor}</td>
                  </tr>
                )}
                {data?.totalFloors > 0 && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Kat Sayısı</td>
                    <td className="px-4 py-3 text-gray-900">{data.totalFloors}</td>
                  </tr>
                )}
                {data?.heating && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Isıtma</td>
                    <td className="px-4 py-3 text-gray-900 capitalize">{data.heating.replace(/-/g, " ")}</td>
                  </tr>
                )}
                {(data?.bathrooms > 0 || data?.facilities?.bathrooms > 0) && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Banyo Sayısı</td>
                    <td className="px-4 py-3 text-gray-900">{data.bathrooms || data.facilities?.bathrooms}</td>
                  </tr>
                )}
                {data?.kitchen && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Mutfak</td>
                    <td className="px-4 py-3 text-gray-900 capitalize">{data.kitchen.replace(/-/g, " ")}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Balkon</td>
                  <td className="px-4 py-3 text-gray-900">{data?.balcony ? "Var" : "Yok"}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Asansör</td>
                  <td className="px-4 py-3 text-gray-900">{data?.elevator ? "Var" : "Yok"}</td>
                </tr>
                {data?.parking && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Otopark</td>
                    <td className="px-4 py-3 text-gray-900 capitalize">{data.parking.replace(/-/g, " ")}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Eşyalı</td>
                  <td className="px-4 py-3 text-gray-900">{data?.furnished ? "Evet" : "Hayır"}</td>
                </tr>
                {data?.usageStatus && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Kullanım Durumu</td>
                    <td className="px-4 py-3 text-gray-900 capitalize">{data.usageStatus.replace(/-/g, " ")}</td>
                  </tr>
                )}
                {data?.siteName && (
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Site Adı</td>
                    <td className="px-4 py-3 text-gray-900">{data.siteName}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Aidat (TL)</td>
                  <td className="px-4 py-3 text-gray-900">{data?.dues > 0 ? `₺${data.dues.toLocaleString()}` : "Belirtilmemiş"}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Krediye Uygun</td>
                  <td className="px-4 py-3 text-gray-900">{data?.mortgageEligible ? "Evet" : "Hayır"}</td>
                </tr>
                {data?.deedStatus && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">Tapu Durumu</td>
                    <td className="px-4 py-3 text-gray-900 capitalize">{data.deedStatus.replace(/-/g, " ")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Date Information */}
          <div className="flex flex-wrap gap-4 my-4 p-4 bg-primary rounded-xl">
            {data?.createdAt && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flexCenter">
                  <FaCalendarPlus className="text-secondary" />
                </div>
                <div>
                  <p className="text-gray-30 text-xs">Listed on</p>
                  <p className="font-medium text-tertiary">
                    {formatDate(data.createdAt, true)}
                  </p>
                </div>
              </div>
            )}
            {data?.updatedAt && data?.updatedAt !== data?.createdAt && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flexCenter">
                  <FaRegClock className="text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-30 text-xs">Last updated</p>
                  <p className="font-medium text-tertiary">
                    {formatDate(data.updatedAt, true)}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <div className="flex gap-2">
                  <Button
                    onClick={() => cancelBooking()}
                    variant="outline"
                    className="flex-1"
                    color="red"
                    disabled={cancelling}
                  >
                    Cancel booking
                  </Button>
                  <Button
                    onClick={() => setContactModalOpen(true)}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    leftSection={<FaEnvelope />}
                  >
                    Send Message
                  </Button>
                </div>
                <p className="text-green-600 medium-15 flex items-center gap-2">
                  <MdCheck className="text-lg" />
                  You&apos;ve booked visit for{" "}
                  {bookings?.filter((booking) => booking?.id === id)[0].date}
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    validateLogin() && setModalOpened(true);
                  }}
                  className="btn-secondary rounded-xl !px-5 !py-[7px] shadow-sm w-full"
                >
                  Book the visit
                </button>
                <Button
                  onClick={() => {
                    if (!validateLogin()) return;
                    toast.warning("⚠️ Please book this property first to send a message", {
                      position: "bottom-right",
                      autoClose: 5000,
                    });
                  }}
                  variant="outline"
                  color="gray"
                  className="w-full"
                  leftSection={<FaEnvelope />}
                  disabled
                >
                  Send Message (Book First)
                </Button>
              </>
            )}
            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>

          {/* Property Features Section */}
          <div className="mt-8 space-y-6">
            {/* Interior Features */}
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flexCenter">
                  <BsHouseDoor className="text-green-600" />
                </div>
                <h4 className="font-semibold text-tertiary">
                  Interior Features
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {ALL_INTERIOR_FEATURES.map((feature, index) => {
                  const hasFeature = data?.interiorFeatures?.includes(feature);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        !hasFeature ? "opacity-50" : ""
                      }`}
                    >
                      {hasFeature ? (
                        <MdCheck
                          className="text-green-500 flex-shrink-0"
                          size={18}
                        />
                      ) : (
                        <MdClose
                          className="text-red-400 flex-shrink-0"
                          size={18}
                        />
                      )}
                      <span
                        className={
                          hasFeature
                            ? "text-gray-700 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exterior Features */}
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flexCenter">
                  <BsTree className="text-blue-600" />
                </div>
                <h4 className="font-semibold text-tertiary">
                  Exterior Features
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {ALL_EXTERIOR_FEATURES.map((feature, index) => {
                  const hasFeature = data?.exteriorFeatures?.includes(feature);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        !hasFeature ? "opacity-50" : ""
                      }`}
                    >
                      {hasFeature ? (
                        <MdCheck
                          className="text-green-500 flex-shrink-0"
                          size={18}
                        />
                      ) : (
                        <MdClose
                          className="text-red-400 flex-shrink-0"
                          size={18}
                        />
                      )}
                      <span
                        className={
                          hasFeature
                            ? "text-gray-700 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Consultant Contact Section */}
          {data?.consultant && (
            <div className="mt-6 p-5 bg-gradient-to-br from-tertiary to-tertiary/90 rounded-2xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-secondary rounded-lg flexCenter">
                  <FaPhone className="text-white text-sm" />
                </div>
                <h4 className="font-semibold">Contact Property Consultant</h4>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <Avatar
                  src={data.consultant.image}
                  alt={data.consultant.name}
                  size="lg"
                  radius="xl"
                  className="border-2 border-secondary"
                />
                <div className="flex-1">
                  <h5 className="font-semibold flex items-center gap-2">
                    {data.consultant.name}
                    <MdVerified className="text-secondary" />
                  </h5>
                  <p className="text-white/70 text-sm">
                    {data.consultant.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-xs font-medium">
                        {data.consultant.rating}
                      </span>
                    </div>
                    <span className="text-white/50 text-xs">•</span>
                    <span className="text-white/70 text-xs">
                      {data.consultant.deals}+ deals
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultant Specialty */}
              <div className="mb-4 p-3 bg-white/10 rounded-xl">
                <p className="text-white/60 text-xs mb-1">Specialty</p>
                <p className="text-sm">{data.consultant.specialty}</p>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-2">
                <div className="flexCenter gap-2 bg-white text-tertiary py-3 rounded-xl font-medium text-sm w-full select-text cursor-default">
                  <FaPhone className="text-secondary" />
                  <span dir="ltr">+90 542 435 9694</span>
                </div>
                <a
                  href={`https://wa.me/${data.consultant.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flexCenter gap-2 bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#20bd5a] transition-colors font-medium text-sm w-full"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
              </div>

              {/* Languages */}
              {data.consultant.languages?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/60 text-xs mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {data.consultant.languages.map((lang) => (
                      <span
                        key={lang}
                        className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal - Only opens after booking */}
      <ContactModal
        opened={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        propertyId={id}
        propertyTitle={data?.title}
        userEmail={user?.email}
      />
    </section>
  );
};

export default Property;
