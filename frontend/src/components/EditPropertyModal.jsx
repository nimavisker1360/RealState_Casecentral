import { useState, useEffect, useContext, useRef } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Select,
  SegmentedControl,
  Text,
  Loader,
  Avatar,
  Checkbox,
  ScrollArea,
  Collapse,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  MdSell,
  MdHome,
  MdOutlineCloudUpload,
  MdPerson,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { BsHouseDoor, BsTree } from "react-icons/bs";
import { FaLandmark, FaHome, FaBriefcase } from "react-icons/fa";

// Property categories
const propertyCategories = [
  { value: "residential", label: "Residential", icon: FaHome },
  { value: "commercial", label: "Commercial", icon: FaBriefcase },
  { value: "land", label: "Land", icon: FaLandmark },
];

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
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import PropTypes from "prop-types";
import useCountries from "../hooks/useCountries";
import useConsultants from "../hooks/useConsultants";
import UserDetailContext from "../context/UserDetailContext";
import { updateResidency } from "../utils/api";
import { validateString } from "../utils/common";

const EditPropertyModal = ({ opened, setOpened, property, onSuccess }) => {
  const { getAll } = useCountries();
  const { data: consultants, isLoading: consultantsLoading } = useConsultants();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);

  const [imageURLs, setImageURLs] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState("");
  const [interiorFeatures, setInteriorFeatures] = useState([]);
  const [exteriorFeatures, setExteriorFeatures] = useState([]);
  const [interiorOpened, { toggle: toggleInterior }] = useDisclosure(false);
  const [exteriorOpened, { toggle: toggleExterior }] = useDisclosure(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      country: "",
      city: "",
      address: "",
      propertyType: "sale",
      category: "residential",
      bedrooms: 0,
      parkings: 0,
      bathrooms: 0,
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value) => (value < 999 ? "Minimum 999 lira olmalı" : null),
      country: (value) => validateString(value),
      city: (value) => validateString(value),
      address: (value) => validateString(value),
      bedrooms: (value) => (value < 1 ? "En az 1 yatak odası olmalı" : null),
      bathrooms: (value) => (value < 1 ? "En az 1 banyo olmalı" : null),
    },
  });

  // Prepare consultant options for select
  const consultantOptions =
    consultants?.map((c) => ({
      value: c.id,
      label: c.name,
      image: c.image,
      title: c.title,
    })) || [];

  // Initialize form when property changes
  useEffect(() => {
    if (property) {
      form.setValues({
        title: property.title || "",
        description: property.description || "",
        price: property.price || 0,
        country: property.country || "",
        city: property.city || "",
        address: property.address || "",
        propertyType: property.propertyType || "sale",
        category: property.category || "residential",
        bedrooms: property.facilities?.bedrooms || 0,
        parkings: property.facilities?.parkings || 0,
        bathrooms: property.facilities?.bathrooms || 0,
      });
      setImageURLs(property.images || (property.image ? [property.image] : []));
      setSelectedConsultantId(property.consultantId || "");
      setInteriorFeatures(property.interiorFeatures || []);
      setExteriorFeatures(property.exteriorFeatures || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  // Initialize Cloudinary widget
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "ducct0j1f",
        uploadPreset: "auvy3sl6",
        maxFiles: 30,
        multiple: true,
        resourceType: "image",
        clientAllowedFormats: [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "webp",
          "bmp",
          "tiff",
          "svg",
          "heic",
          "heif",
          "avif",
          "ico",
          "raw",
        ],
        sources: ["local", "url", "camera"],
      },
      (err, result) => {
        if (result?.event === "success") {
          setImageURLs((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
  }, []);

  const removeImage = (indexToRemove) => {
    setImageURLs((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => updateResidency(property.id, data, token),
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Error updating property";
      toast.error(message, { position: "bottom-right" });
    },
    onSuccess: () => {
      toast.success("Update operation completed successfully!", {
        position: "bottom-right",
      });
      setOpened(false);
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    if (imageURLs.length === 0) {
      toast.error("Please add at least one image", {
        position: "bottom-right",
      });
      return;
    }

    const values = form.values;
    const data = {
      title: values.title,
      description: values.description,
      price: values.price,
      country: values.country,
      city: values.city,
      address: values.address,
      propertyType: values.propertyType,
      category: values.category,
      image: imageURLs[0],
      images: imageURLs,
      facilities: {
        bedrooms: values.bedrooms,
        parkings: values.parkings,
        bathrooms: values.bathrooms,
      },
      consultantId: selectedConsultantId || null,
      interiorFeatures: interiorFeatures,
      exteriorFeatures: exteriorFeatures,
    };

    mutate(data);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Text fw={600} size="lg">
          Edit Property
        </Text>
      }
      size="xl"
      centered
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Property Type */}
        <div className="mb-4">
          <Text size="sm" fw={500} mb={4}>
            Property Type <span className="text-red-500">*</span>
          </Text>
          <SegmentedControl
            fullWidth
            color={form.values.propertyType === "sale" ? "green" : "blue"}
            value={form.values.propertyType}
            onChange={(value) => form.setFieldValue("propertyType", value)}
            data={[
              {
                label: (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <MdSell size={18} />
                    <span>For Sale</span>
                  </div>
                ),
                value: "sale",
              },
              {
                label: (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <MdHome size={18} />
                    <span>For Rent</span>
                  </div>
                ),
                value: "rent",
              },
            ]}
          />
        </div>

        {/* Property Category */}
        <Select
          label="Property Category"
          placeholder="Select property category"
          data={propertyCategories.map((cat) => ({
            value: cat.value,
            label: cat.label,
          }))}
          value={form.values.category}
          onChange={(value) => form.setFieldValue("category", value)}
          mb="md"
          withAsterisk
          renderOption={({ option }) => {
            const cat = propertyCategories.find(
              (c) => c.value === option.value
            );
            const IconComponent = cat?.icon || FaHome;
            return (
              <div className="flex items-center gap-2 py-1">
                <IconComponent size={16} />
                <span>{option.label}</span>
              </div>
            );
          }}
        />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Property name"
            {...form.getInputProps("title")}
          />
          <NumberInput
            withAsterisk
            label={
              form.values.propertyType === "sale"
                ? "Fiyat (₺)"
                : "Aylık Kira (₺)"
            }
            placeholder="999"
            min={0}
            {...form.getInputProps("price")}
          />
        </div>

        <Textarea
          withAsterisk
          label="Description"
          placeholder="Property description"
          mt="sm"
          minRows={3}
          {...form.getInputProps("description")}
        />

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Select
            withAsterisk
            label="Ülke"
            clearable
            searchable
            data={getAll()}
            {...form.getInputProps("country")}
          />
          <TextInput
            withAsterisk
            label="Şehir"
            placeholder="City"
            {...form.getInputProps("city")}
          />
          <TextInput
            withAsterisk
            label="Adres"
            placeholder="Address"
            {...form.getInputProps("address")}
          />
        </div>

        {/* Facilities */}
        <Text size="sm" fw={500} mt="lg" mb="xs">
          Olanaklar
        </Text>
        <div className="grid grid-cols-3 gap-4">
          <NumberInput
            withAsterisk
            label="Yatak Odası"
            min={0}
            {...form.getInputProps("bedrooms")}
          />
          <NumberInput
            withAsterisk
            label="Banyo"
            min={0}
            {...form.getInputProps("bathrooms")}
          />
          <NumberInput
            label="Otopark"
            min={0}
            {...form.getInputProps("parkings")}
          />
        </div>

        {/* Consultant Selector */}
        <Select
          label="Assign Consultant"
          placeholder="Select a consultant for this property"
          description="The consultant will be shown as the contact person for this property"
          data={consultantOptions}
          value={selectedConsultantId}
          onChange={(value) => setSelectedConsultantId(value || "")}
          clearable
          searchable
          disabled={consultantsLoading}
          mt="md"
          leftSection={<MdPerson size={16} />}
          renderOption={({ option }) => (
            <div className="flex items-center gap-2 py-1">
              <Avatar src={option.image} size="sm" radius="xl" />
              <div>
                <Text size="sm" fw={500}>
                  {option.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {option.title}
                </Text>
              </div>
            </div>
          )}
        />

        {/* Interior Features */}
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={toggleInterior}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BsHouseDoor className="text-green-600" size={18} />
              <Text fw={500} size="sm">
                Interior Features
              </Text>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {interiorFeatures.length} selected
              </span>
            </div>
            {interiorOpened ? (
              <MdExpandLess size={20} />
            ) : (
              <MdExpandMore size={20} />
            )}
          </button>
          <Collapse in={interiorOpened}>
            <ScrollArea h={200} className="p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ALL_INTERIOR_FEATURES.map((feature) => (
                  <Checkbox
                    key={feature}
                    label={feature}
                    size="xs"
                    checked={interiorFeatures.includes(feature)}
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setInteriorFeatures([...interiorFeatures, feature]);
                      } else {
                        setInteriorFeatures(
                          interiorFeatures.filter((f) => f !== feature)
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </Collapse>
        </div>

        {/* Exterior Features */}
        <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={toggleExterior}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BsTree className="text-blue-600" size={18} />
              <Text fw={500} size="sm">
                Exterior Features
              </Text>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {exteriorFeatures.length} selected
              </span>
            </div>
            {exteriorOpened ? (
              <MdExpandLess size={20} />
            ) : (
              <MdExpandMore size={20} />
            )}
          </button>
          <Collapse in={exteriorOpened}>
            <ScrollArea h={200} className="p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ALL_EXTERIOR_FEATURES.map((feature) => (
                  <Checkbox
                    key={feature}
                    label={feature}
                    size="xs"
                    checked={exteriorFeatures.includes(feature)}
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setExteriorFeatures([...exteriorFeatures, feature]);
                      } else {
                        setExteriorFeatures(
                          exteriorFeatures.filter((f) => f !== feature)
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </Collapse>
        </div>

        {/* Images */}
        <Text size="sm" fw={500} mt="lg" mb="xs">
          Görseller <span className="text-red-500">*</span>
        </Text>
        <div className="border border-gray-200 rounded-lg p-4">
          {imageURLs.length === 0 ? (
            <div
              onClick={() => widgetRef.current?.open()}
              className="flexCenter flex-col h-32 border-dashed border-2 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <MdOutlineCloudUpload size={32} color="grey" />
              <span className="text-sm text-gray-500">Görsel Yükle</span>
            </div>
          ) : (
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              }}
            >
              {imageURLs.map((url, index) => (
                <div
                  key={index}
                  className="relative h-24 rounded-lg overflow-hidden group"
                >
                  <img
                    src={url}
                    alt={`property-${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <AiOutlineClose size={12} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 py-0.5 rounded">
                      Ana
                    </span>
                  )}
                </div>
              ))}
              <div
                onClick={() => widgetRef.current?.open()}
                className="flexCenter flex-col h-24 border-dashed border-2 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <MdOutlineCloudUpload size={20} color="grey" />
                <span className="text-xs text-gray-500">Ekle</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => setOpened(false)}>
            İptal
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader size="xs" color="white" mr={8} />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

EditPropertyModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  setOpened: PropTypes.func.isRequired,
  property: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default EditPropertyModal;
