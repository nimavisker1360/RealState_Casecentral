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
  Grid,
  Switch,
  Divider,
  Paper,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MdSell,
  MdOutlineCloudUpload,
  MdPerson,
  MdExpandMore,
  MdExpandLess,
  MdLocationCity,
  MdPublic,
  MdDragIndicator,
} from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { BsHouseDoor, BsTree, BsLightningCharge, BsGeoAlt, BsGrid, BsEye } from "react-icons/bs";
import { FaLandmark, FaHome, FaBriefcase } from "react-icons/fa";

// Sortable Image Component
const SortableImage = ({ url, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative h-24 rounded-lg overflow-hidden group ${isDragging ? 'shadow-xl' : ''}`}
    >
      <img
        src={url}
        alt={`property-${index + 1}`}
        className="h-full w-full object-cover"
      />
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-black/50 text-white rounded p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MdDragIndicator size={14} />
      </div>
      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <AiOutlineClose size={12} />
      </button>
      {/* Main Image Badge */}
      {index === 0 && (
        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 py-0.5 rounded">
          Ana
        </span>
      )}
    </div>
  );
};

// Property categories
const propertyCategories = [
  { value: "residential", label: "Konut", icon: FaHome },
  { value: "commercial", label: "Ticari", icon: FaBriefcase },
  { value: "land", label: "Arsa", icon: FaLandmark },
];

// Turkish real estate options
const heatingOptions = [
  { value: "merkezi", label: "Merkezi" },
  { value: "merkezi-pay-olcer", label: "Merkezi (Pay Ölçer)" },
  { value: "dogalgaz-kombi", label: "Doğalgaz (Kombi)" },
  { value: "dogalgaz-soba", label: "Doğalgaz (Soba)" },
  { value: "klima", label: "Klima" },
  { value: "soba", label: "Soba" },
  { value: "yerden-isitma", label: "Yerden Isıtma" },
  { value: "yok", label: "Yok" },
];

const kitchenOptions = [
  { value: "acik-amerikan", label: "Açık (Amerikan)" },
  { value: "kapali", label: "Kapalı" },
  { value: "laminat", label: "Laminat" },
  { value: "hilton", label: "Hilton" },
];

const parkingOptions = [
  { value: "kapali-otopark", label: "Kapalı Otopark" },
  { value: "acik-otopark", label: "Açık Otopark" },
  { value: "otopark-yok", label: "Otopark Yok" },
];

const usageStatusOptions = [
  { value: "bos", label: "Boş" },
  { value: "kiraci", label: "Kiracı" },
  { value: "mulk-sahibi", label: "Mülk Sahibi" },
];


// İmar Durumu (Zoning Status) options
const imarDurumuOptions = [
  { value: "villa", label: "Villa" },
  { value: "konut", label: "Konut" },
  { value: "ticari", label: "Ticari" },
  { value: "arsa", label: "Arsa" },
  { value: "karma", label: "Karma" },
  { value: "sanayi", label: "Sanayi" },
  { value: "turizm", label: "Turizm" },
  { value: "tarimsal", label: "Tarımsal" },
];

const roomOptions = [
  { value: "1+0", label: "1+0 (Stüdyo)" },
  { value: "1+1", label: "1+1" },
  { value: "2+1", label: "2+1" },
  { value: "2+2", label: "2+2" },
  { value: "3+1", label: "3+1" },
  { value: "3+2", label: "3+2" },
  { value: "4+1", label: "4+1" },
  { value: "4+2", label: "4+2" },
  { value: "5+1", label: "5+1" },
  { value: "5+2", label: "5+2" },
  { value: "6+1", label: "6+1" },
  { value: "6+2", label: "6+2" },
];

// Altyapı (Infrastructure) features
const ALTYAPI_FEATURES = [
  "Elektrik",
  "Sanayi Elektriği",
  "Su",
  "Telefon",
  "Doğalgaz",
  "Kanalizasyon",
  "Arıtma",
  "Sondaj & Kuyu",
  "Zemin Etüdü",
  "Yolu Açılmış",
  "Yolu Açılmamış",
  "Yolu Yok",
];

// Konum (Location) features
const KONUM_FEATURES = [
  "Ana Yola Yakın",
  "Denize Sıfır",
  "Denize Yakın",
  "Havaalanına Yakın",
  "Toplu Ulaşıma Yakın",
];

// Genel Özellikler (General Features)
const GENEL_OZELLIKLER = [
  "İfrazlı",
  "Parselli",
  "Projeli",
  "Köşe Parsel",
];

// Manzara (View) features
const MANZARA_FEATURES = [
  "Şehir",
  "Deniz",
  "Doğa",
  "Boğaz",
  "Göl",
];

// Muhit (Neighborhood) features
const MUHIT_FEATURES = [
  "Alışveriş Merkezi",
  "Belediye",
  "Cami",
  "Denize Sıfır",
  "Eczane",
  "Eğlence Merkezi",
  "Göle Sıfır",
  "Hastane",
  "Havra",
  "İtfaiye",
  "Kilise",
  "Lise",
  "Park",
  "Plaj",
  "Polis Merkezi",
  "Semt Pazarı",
  "Spor Salonu",
  "Şehir Merkezi",
];

// All possible interior features (Turkish)
const ALL_INTERIOR_FEATURES = [
  "ADSL",
  "Akıllı Ev",
  "Alarm (Hırsız)",
  "Alarm (Yangın)",
  "Alüminyum Doğrama",
  "Amerikan Kapı",
  "Ankastre Fırın",
  "Beyaz Eşya",
  "Bulaşık Makinesi",
  "Kurutma Makinesi",
  "Çamaşır Makinesi",
  "Çamaşır Odası",
  "Çelik Kapı",
  "Duşakabin",
  "Fiber İnternet",
  "Fırın",
  "Giyinme Odası",
  "Gömme Dolap",
  "Görüntülü Diafon",
  "Kartonpiyer",
  "Kiler",
  "Klima",
  "Laminat Zemin",
  "Mobilya",
  "Ankastre Mutfak",
  "Laminat Mutfak",
  "Mutfak Doğalgazı",
  "Parke Zemin",
  "PVC Doğrama",
  "Seramik Zemin",
  "Set Üstü Ocak",
  "Spot Aydınlatma",
  "Jakuzi",
  "Küvet",
  "Teras",
  "Wi-Fi",
  "Şömine",
];

// All possible exterior features (Turkish)
const ALL_EXTERIOR_FEATURES = [
  "24 Saat Güvenlik",
  "Apartman Görevlisi",
  "Araç Şarj İstasyonu",
  "Çocuk Oyun Parkı",
  "Hamam",
  "Hidrofor",
  "Jeneratör",
  "Kablo TV",
  "Kamera Sistemi",
  "Müstakil Havuzlu",
  "Sauna",
  "Ses Yalıtımı",
  "Spor Alanı",
  "Su Deposu",
  "Tenis Kortu",
  "Yangın Merdiveni",
  "Yüzme Havuzu (Açık)",
  "Yüzme Havuzu (Kapalı)",
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
  const [muhitFeatures, setMuhitFeatures] = useState([]);
  const [interiorOpened, { toggle: toggleInterior }] = useDisclosure(false);
  const [exteriorOpened, { toggle: toggleExterior }] = useDisclosure(false);
  const [muhitOpened, { toggle: toggleMuhit }] = useDisclosure(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  // Turkish real estate fields state
  const [listingNo, setListingNo] = useState("");
  const [listingDate, setListingDate] = useState(null);
  const [areaGross, setAreaGross] = useState(0);
  const [areaNet, setAreaNet] = useState(0);
  const [rooms, setRooms] = useState("");
  const [buildingAge, setBuildingAge] = useState(0);
  const [floor, setFloor] = useState(0);
  const [totalFloors, setTotalFloors] = useState(0);
  const [heating, setHeating] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [balcony, setBalcony] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [parkingType, setParkingType] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [usageStatus, setUsageStatus] = useState("");
  const [siteName, setSiteName] = useState("");
  const [dues, setDues] = useState(0);
  const [mortgageEligible, setMortgageEligible] = useState(false);
  const [deedStatus, setDeedStatus] = useState("");
  const [imarDurumu, setImarDurumu] = useState("");
  
  // Land/Arsa features
  const [altyapiFeatures, setAltyapiFeatures] = useState([]);
  const [konumFeatures, setKonumFeatures] = useState([]);
  const [genelOzellikler, setGenelOzellikler] = useState([]);
  const [manzaraFeatures, setManzaraFeatures] = useState([]);

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
      price: (value) => (value < 999 ? "En az 999 TL olmalı" : null),
      country: (value) => validateString(value),
      city: (value) => validateString(value),
      address: (value) => validateString(value),
      // bedrooms and bathrooms are optional
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
      setMuhitFeatures(property.muhitFeatures || []);
      
      // Turkish real estate fields
      setListingNo(property.listingNo || "");
      setListingDate(property.listingDate ? new Date(property.listingDate) : null);
      setAreaGross(property.area?.gross || 0);
      setAreaNet(property.area?.net || 0);
      setRooms(property.rooms || "");
      setBuildingAge(property.buildingAge || 0);
      setFloor(property.floor || 0);
      setTotalFloors(property.totalFloors || 0);
      setHeating(property.heating || "");
      setKitchen(property.kitchen || "");
      setBalcony(property.balcony || false);
      setElevator(property.elevator || false);
      setParkingType(property.parking || "");
      setFurnished(property.furnished || false);
      setUsageStatus(property.usageStatus || "");
      setSiteName(property.siteName || "");
      setDues(property.dues || 0);
      setMortgageEligible(property.mortgageEligible || false);
      setDeedStatus(property.deedStatus || "");
      setImarDurumu(property.imarDurumu || "");
      
      // Land/Arsa features
      setAltyapiFeatures(property.altyapiFeatures || []);
      setKonumFeatures(property.konumFeatures || []);
      setGenelOzellikler(property.genelOzellikler || []);
      setManzaraFeatures(property.manzaraFeatures || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  // Initialize Cloudinary widget
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "ducct0j1f",
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "auvy3sl6",
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

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end - reorder images
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImageURLs((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => updateResidency(property.id, data, token),
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Mülk güncellenirken hata oluştu";
      toast.error(message, { position: "bottom-right" });
    },
    onSuccess: () => {
      toast.success("Mülk başarıyla güncellendi!", {
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
      toast.error("Lütfen en az bir görsel ekleyin", {
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
      muhitFeatures: muhitFeatures,
      // Turkish real estate fields
      listingNo,
      listingDate,
      area: { gross: areaGross, net: areaNet },
      rooms,
      buildingAge,
      floor,
      totalFloors,
      heating,
      kitchen,
      balcony,
      elevator,
      parking: parkingType,
      furnished,
      usageStatus,
      siteName,
      dues,
      mortgageEligible,
      deedStatus,
      imarDurumu,
      // Land/Arsa features
      altyapiFeatures,
      konumFeatures,
      genelOzellikler,
      manzaraFeatures,
    };

    mutate(data);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Text fw={600} size="lg">
          Mülkü Düzenle
        </Text>
      }
      size="90rem"
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
            Emlak Tipi <span className="text-red-500">*</span>
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
                    <MdLocationCity size={18} />
                    <span>Yurt İçi Proje</span>
                  </div>
                ),
                value: "local-project",
              },
              {
                label: (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <MdPublic size={18} />
                    <span>Yurt Dışı Proje</span>
                  </div>
                ),
                value: "international-project",
              },
            ]}
          />
        </div>

        {/* Property Category */}
        <Select
          label="Emlak Kategorisi"
          placeholder="Kategori seçin"
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
            label="Başlık"
            placeholder="Mülk adı"
            {...form.getInputProps("title")}
          />
          <NumberInput
            withAsterisk
            label="Fiyat (₺)"
            placeholder="999"
            min={0}
            thousandSeparator="."
            decimalSeparator=","
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
            label="Yatak Odası"
            min={0}
            {...form.getInputProps("bedrooms")}
          />
          <NumberInput
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
          label="Danışman Ata"
          placeholder="Bu mülk için bir danışman seçin"
          description="Danışman, bu mülk için iletişim kişisi olarak gösterilecektir"
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

        <Divider my="lg" label="İlan Bilgileri" labelPosition="center" />

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="İlan No"
              placeholder="1275908801"
              value={listingNo}
              onChange={(e) => setListingNo(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="İlan Tarihi"
              placeholder="Tarih seçin"
              value={listingDate}
              onChange={setListingDate}
              valueFormat="DD MMMM YYYY"
            />
          </Grid.Col>
        </Grid>

        <Divider my="lg" label="Bina ve Daire Bilgileri" labelPosition="center" />

        <Grid>
          <Grid.Col span={4}>
            <NumberInput
              label="m² (Brüt)"
              placeholder="4500"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              value={areaGross}
              onChange={setAreaGross}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="m² (Net)"
              placeholder="4000"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              value={areaNet}
              onChange={setAreaNet}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Oda Sayısı"
              placeholder="Seçin"
              data={roomOptions}
              value={rooms}
              onChange={setRooms}
              clearable
            />
          </Grid.Col>
        </Grid>

        <Grid mt="sm">
          <Grid.Col span={4}>
            <NumberInput
              label="Bina Yaşı"
              placeholder="5"
              min={0}
              value={buildingAge}
              onChange={setBuildingAge}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Bulunduğu Kat"
              placeholder="2"
              min={-2}
              value={floor}
              onChange={setFloor}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Kat Sayısı"
              placeholder="18"
              min={1}
              value={totalFloors}
              onChange={setTotalFloors}
            />
          </Grid.Col>
        </Grid>

        <Grid mt="sm">
          <Grid.Col span={4}>
            <Select
              label="Isıtma"
              placeholder="Seçin"
              data={heatingOptions}
              value={heating}
              onChange={setHeating}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Mutfak"
              placeholder="Seçin"
              data={kitchenOptions}
              value={kitchen}
              onChange={setKitchen}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Otopark Tipi"
              placeholder="Seçin"
              data={parkingOptions}
              value={parkingType}
              onChange={setParkingType}
              clearable
            />
          </Grid.Col>
        </Grid>

        <Divider my="lg" label="Özellikler" labelPosition="center" />

        <Paper p="md" withBorder>
          <Grid>
            <Grid.Col span={3}>
              <Switch
                label="Balkon"
                checked={balcony}
                onChange={(event) => setBalcony(event.currentTarget.checked)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch
                label="Asansör"
                checked={elevator}
                onChange={(event) => setElevator(event.currentTarget.checked)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch
                label="Eşyalı"
                checked={furnished}
                onChange={(event) => setFurnished(event.currentTarget.checked)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch
                label="Krediye Uygun"
                checked={mortgageEligible}
                onChange={(event) => setMortgageEligible(event.currentTarget.checked)}
              />
            </Grid.Col>
          </Grid>
        </Paper>

        <Divider my="lg" label="Diğer Bilgiler" labelPosition="center" />

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Site Adı"
              placeholder="Makyol Santral"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Aidat (TL)"
              placeholder="0"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              value={dues}
              onChange={setDues}
            />
          </Grid.Col>
        </Grid>

        <Grid mt="sm">
          <Grid.Col span={4}>
            <Select
              label="Kullanım Durumu"
              placeholder="Seçin"
              data={usageStatusOptions}
              value={usageStatus}
              onChange={setUsageStatus}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Tapu Durumu"
              placeholder="Tapu durumunu yazın"
              value={deedStatus}
              onChange={(e) => setDeedStatus(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="İmar Durumu"
              placeholder="Seçin"
              data={imarDurumuOptions}
              value={imarDurumu}
              onChange={setImarDurumu}
              clearable
            />
          </Grid.Col>
        </Grid>

        {/* Arsa/Land Features Section */}
        <Divider my="lg" label="Arsa Özellikleri" labelPosition="center" />

        {/* Altyapı (Infrastructure) */}
        <Paper p="md" withBorder mb="md" className="bg-amber-50">
          <div className="flex items-center gap-2 mb-3">
            <BsLightningCharge className="text-amber-600" size={18} />
            <Text fw={600} c="dark">Altyapı</Text>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full ml-auto">
              {altyapiFeatures.length} seçili
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {ALTYAPI_FEATURES.map((feature) => (
              <Checkbox
                key={feature}
                label={feature}
                size="xs"
                checked={altyapiFeatures.includes(feature)}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setAltyapiFeatures([...altyapiFeatures, feature]);
                  } else {
                    setAltyapiFeatures(altyapiFeatures.filter((f) => f !== feature));
                  }
                }}
              />
            ))}
          </div>
        </Paper>

        {/* Konum (Location) */}
        <Paper p="md" withBorder mb="md" className="bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            <BsGeoAlt className="text-blue-600" size={18} />
            <Text fw={600} c="dark">Konum</Text>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-auto">
              {konumFeatures.length} seçili
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {KONUM_FEATURES.map((feature) => (
              <Checkbox
                key={feature}
                label={feature}
                size="xs"
                checked={konumFeatures.includes(feature)}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setKonumFeatures([...konumFeatures, feature]);
                  } else {
                    setKonumFeatures(konumFeatures.filter((f) => f !== feature));
                  }
                }}
              />
            ))}
          </div>
        </Paper>

        {/* Genel Özellikler (General Features) */}
        <Paper p="md" withBorder mb="md" className="bg-green-50">
          <div className="flex items-center gap-2 mb-3">
            <BsGrid className="text-green-600" size={18} />
            <Text fw={600} c="dark">Genel Özellikler</Text>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-auto">
              {genelOzellikler.length} seçili
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {GENEL_OZELLIKLER.map((feature) => (
              <Checkbox
                key={feature}
                label={feature}
                size="xs"
                checked={genelOzellikler.includes(feature)}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setGenelOzellikler([...genelOzellikler, feature]);
                  } else {
                    setGenelOzellikler(genelOzellikler.filter((f) => f !== feature));
                  }
                }}
              />
            ))}
          </div>
        </Paper>

        {/* Manzara (View) */}
        <Paper p="md" withBorder mb="md" className="bg-purple-50">
          <div className="flex items-center gap-2 mb-3">
            <BsEye className="text-purple-600" size={18} />
            <Text fw={600} c="dark">Manzara</Text>
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full ml-auto">
              {manzaraFeatures.length} seçili
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {MANZARA_FEATURES.map((feature) => (
              <Checkbox
                key={feature}
                label={feature}
                size="xs"
                checked={manzaraFeatures.includes(feature)}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setManzaraFeatures([...manzaraFeatures, feature]);
                  } else {
                    setManzaraFeatures(manzaraFeatures.filter((f) => f !== feature));
                  }
                }}
              />
            ))}
          </div>
        </Paper>

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
                İç Özellikler
              </Text>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {interiorFeatures.length} seçili
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
                Dış Özellikler
              </Text>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {exteriorFeatures.length} seçili
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

        {/* Muhit Features */}
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={toggleMuhit}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BsGeoAlt className="text-purple-600" size={18} />
              <Text fw={500} size="sm">
                Muhit
              </Text>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                {muhitFeatures.length} seçili
              </span>
            </div>
            {muhitOpened ? (
              <MdExpandLess size={20} />
            ) : (
              <MdExpandMore size={20} />
            )}
          </button>
          <Collapse in={muhitOpened}>
            <ScrollArea h={200} className="p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MUHIT_FEATURES.map((feature) => (
                  <Checkbox
                    key={feature}
                    label={feature}
                    size="xs"
                    checked={muhitFeatures.includes(feature)}
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setMuhitFeatures([...muhitFeatures, feature]);
                      } else {
                        setMuhitFeatures(
                          muhitFeatures.filter((f) => f !== feature)
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
          {imageURLs.length > 0 && (
            <span className="text-gray-400 font-normal ml-2">(Sürükleyerek sıralayabilirsiniz)</span>
          )}
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={imageURLs} strategy={rectSortingStrategy}>
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  }}
                >
                  {imageURLs.map((url, index) => (
                    <SortableImage
                      key={url}
                      url={url}
                      index={index}
                      onRemove={removeImage}
                    />
                  ))}
                  <div
                    onClick={() => widgetRef.current?.open()}
                    className="flexCenter flex-col h-24 border-dashed border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <MdOutlineCloudUpload size={20} color="grey" />
                    <span className="text-xs text-gray-500">Ekle</span>
                  </div>
                </div>
              </SortableContext>
            </DndContext>
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
