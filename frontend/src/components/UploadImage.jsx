import { Button, Group } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";

const UploadImage = ({
  prevStep,
  nextStep,
  propertyDetails,
  setPropertyDetails,
}) => {
  const [imageURLs, setImageURLs] = useState(
    propertyDetails.images ||
      (propertyDetails.image ? [propertyDetails.image] : [])
  );
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const handleNext = () => {
    setPropertyDetails((prev) => ({
      ...prev,
      images: imageURLs,
      image: imageURLs[0] || "",
    }));
    nextStep();
  };

  const removeImage = (indexToRemove) => {
    setImageURLs((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "ducct0j1f",
        uploadPreset: "auvy3sl6",
        maxFiles: 30,
        multiple: true,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff", "svg", "heic", "heif", "avif", "ico", "raw"],
        sources: ["local", "url", "camera"],
      },
      (err, result) => {
        if (result.event === "success") {
          setImageURLs((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
  }, []);

  return (
    <div className="mt-12 flex-col flexCenter">
      {imageURLs.length === 0 ? (
        <div
          onClick={() => widgetRef.current?.open()}
          className="flexCenter flex-col w-3/4 h-[21rem] border-dashed border-2 cursor-pointer"
        >
          <MdOutlineCloudUpload size={44} color="grey" />
          <span>Upload Images (max 10 photos)</span>
        </div>
      ) : (
        <div className="w-3/4">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            }}
          >
            {imageURLs.map((url, index) => (
              <div
                key={index}
                className="relative h-[150px] rounded-xl overflow-hidden group"
              >
                <img
                  src={url}
                  alt={`property-${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ lineHeight: 0 }}
                >
                  <AiOutlineClose size={16} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Main Image
                  </span>
                )}
              </div>
            ))}
            <div
              onClick={() => widgetRef.current?.open()}
              className="flexCenter flex-col h-[150px] border-dashed border-2 rounded-xl cursor-pointer hover:bg-gray-50"
            >
              <MdOutlineCloudUpload size={32} color="grey" />
              <span className="text-sm text-gray-500">Add Image</span>
            </div>
          </div>
        </div>
      )}

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={imageURLs.length === 0}>
          Next
        </Button>
      </Group>
    </div>
  );
};

UploadImage.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
};

export default UploadImage;
