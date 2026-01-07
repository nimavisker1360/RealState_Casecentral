import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import Map from "../components/Map";
import { getProperty, removeBooking } from "../utils/api";
import useAuthCheck from "../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../components/BookingModal";
import UserDetailContext from "../context/UserDetailContext";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import {
  MdOutlineBed,
  MdOutlineBathtub,
  MdOutlineGarage,
  MdSell,
  MdHome,
} from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { CgRuler } from "react-icons/cg";
import HeartBtn from "../components/HeartBtn";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
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

  return (
    <section className="max-padd-container my-[99px]">
      {/* Image Slider */}
      <div className="pb-4 relative">
        <div className="space-y-3">
          {/* Main Slider */}
          <Swiper
            modules={[Navigation, Pagination, Thumbs]}
            navigation={propertyImages.length > 1}
            pagination={propertyImages.length > 1 ? { clickable: true } : false}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            className="property-main-slider rounded-xl overflow-hidden"
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
            }}
          >
            {propertyImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`${data?.title} - ${index + 1}`}
                  className="w-full h-[27rem] object-cover"
                />
              </SwiperSlide>
            ))}
            {/* like btn */}
            <div className="absolute top-8 right-8 z-10">
              <HeartBtn id={id} />
            </div>
          </Swiper>

          {/* Thumbnails - only show if more than 1 image */}
          {propertyImages.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Thumbs]}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              className="property-thumbs-slider"
              breakpoints={{
                320: { slidesPerView: 3 },
                640: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
            >
              {propertyImages.map((img, index) => (
                <SwiperSlide key={index} className="cursor-pointer">
                  <img
                    src={img}
                    alt={`thumb-${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-transparent hover:border-secondary transition-all"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      {/* container */}
      <div className="xl:flexBetween gap-8">
        {/* left side */}
        <div className="flex-1 rounded-2xl bg-white p-2">
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
              {data?.propertyType === "rent" ? <MdHome size={16} /> : <MdSell size={16} />}
              {data?.propertyType === "rent" ? "Kiralık" : "Satılık"}
            </span>
          </div>
          <div className="flexBetween">
            <h4 className="medium-18">{data?.title}</h4>
            <div className="bold-20">
              ${data?.price?.toLocaleString()}
              {data?.propertyType === "rent" && <span className="text-sm font-normal text-gray-500">/ay</span>}
            </div>
          </div>
          {/* info */}
          <div className="flex gap-x-4 py-2">
            <div className="flexCenter gap-x-2 border-r-2 border-gray-900/80 pr-4 font-[500]">
              <MdOutlineBed /> {data?.facilities.bedrooms}
            </div>
            <div className="flexCenter gap-x-2 border-r-2 border-gray-900/80 pr-4 font-[500]">
              <MdOutlineBathtub /> {data?.facilities.bathrooms}
            </div>
            <div className="flexCenter gap-x-2 border-r-2 border-gray-900/80 pr-4 font-[500]">
              <MdOutlineGarage /> {data?.facilities.parkings}
            </div>
            <div className="flexCenter gap-x-2 border-r-2 border-gray-900/80 pr-4 font-[500]">
              <CgRuler /> 400
            </div>
          </div>
          <p className="pt-2 mb-4">{data?.description}</p>
          <div className="flexStart gap-x-2 my-5">
            <FaLocationDot />
            <div>
              {data?.address} {data?.city} {data?.country}
            </div>
          </div>
          <div>
            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button
                  onClick={() => cancelBooking()}
                  variant="outline"
                  w={"100%"}
                  color="red"
                  disabled={cancelling}
                >
                  Cancel booking
                </Button>
                <p className="text-red-500 medium-15 mt-3">
                  You&apos;ve Already booked visit for{" "}
                  {bookings?.filter((booking) => booking?.id === id)[0].date}
                </p>
              </>
            ) : (
              <button
                onClick={() => {
                  validateLogin() && setModalOpened(true);
                }}
                className="btn-secondary rounded-xl !px-5 !py-[7px] shadow-sm"
              >
                Book the visit
              </button>
            )}
            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>
        </div>
        {/* right side */}
        <div className="flex-1">
          <Map
            address={data?.address}
            city={data?.city}
            country={data?.country}
          />
        </div>
      </div>
    </section>
  );
};

export default Property;
