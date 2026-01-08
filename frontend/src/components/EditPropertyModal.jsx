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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdSell, MdHome, MdOutlineCloudUpload } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import PropTypes from "prop-types";
import useCountries from "../hooks/useCountries";
import UserDetailContext from "../context/UserDetailContext";
import { updateResidency } from "../utils/api";
import { validateString } from "../utils/common";

const EditPropertyModal = ({ opened, setOpened, property, onSuccess }) => {
  const { getAll } = useCountries();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);

  const [imageURLs, setImageURLs] = useState([]);
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
      bedrooms: 0,
      parkings: 0,
      bathrooms: 0,
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value) => (value < 999 ? "Minimum 999 dolar olmalı" : null),
      country: (value) => validateString(value),
      city: (value) => validateString(value),
      address: (value) => validateString(value),
      bedrooms: (value) => (value < 1 ? "En az 1 yatak odası olmalı" : null),
      bathrooms: (value) => (value < 1 ? "En az 1 banyo olmalı" : null),
    },
  });

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
        bedrooms: property.facilities?.bedrooms || 0,
        parkings: property.facilities?.parkings || 0,
        bathrooms: property.facilities?.bathrooms || 0,
      });
      setImageURLs(property.images || (property.image ? [property.image] : []));
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
        maxFiles: 10,
        multiple: true,
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
        error?.response?.data?.message || "Mülk güncellenirken hata oluştu";
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
      toast.error("En az bir görsel eklemelisiniz", { position: "bottom-right" });
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
      image: imageURLs[0],
      images: imageURLs,
      facilities: {
        bedrooms: values.bedrooms,
        parkings: values.parkings,
        bathrooms: values.bathrooms,
      },
    };

    mutate(data);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Text fw={600} size="lg">
          Mülk Düzenle
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
            Mülk Türü <span className="text-red-500">*</span>
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
                    <span>Satılık</span>
                  </div>
                ),
                value: "sale",
              },
              {
                label: (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <MdHome size={18} />
                    <span>Kiralık</span>
                  </div>
                ),
                value: "rent",
              },
            ]}
          />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            withAsterisk
            label="Başlık"
            placeholder="Mülk adı"
            {...form.getInputProps("title")}
          />
          <NumberInput
            withAsterisk
            label={
              form.values.propertyType === "sale" ? "Fiyat ($)" : "Aylık Kira ($)"
            }
            placeholder="999"
            min={0}
            {...form.getInputProps("price")}
          />
        </div>

        <Textarea
          withAsterisk
          label="Açıklama"
          placeholder="Mülk açıklaması"
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
            placeholder="Şehir"
            {...form.getInputProps("city")}
          />
          <TextInput
            withAsterisk
            label="Adres"
            placeholder="Adres"
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
                Güncelleniyor...
              </>
            ) : (
              "Güncelle"
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

