import {
  Box,
  Button,
  Group,
  NumberInput,
  TextInput,
  Textarea,
  SegmentedControl,
  Text,
  Select,
  Avatar,
  Grid,
  Switch,
  Divider,
  Paper,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { validateString } from "../utils/common";
import PropTypes from "prop-types";
import { MdSell, MdPerson, MdLocationCity, MdPublic } from "react-icons/md";
import { FaLandmark, FaHome, FaBriefcase } from "react-icons/fa";
import useConsultants from "../hooks/useConsultants";

// Property categories
const propertyCategories = [
  { value: "residential", label: "Konut", icon: FaHome },
  { value: "commercial", label: "Ticari", icon: FaBriefcase },
  { value: "land", label: "Arsa", icon: FaLandmark },
];

// Heating options
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

// Kitchen options
const kitchenOptions = [
  { value: "acik-amerikan", label: "Açık (Amerikan)" },
  { value: "kapali", label: "Kapalı" },
  { value: "laminat", label: "Laminat" },
  { value: "hilton", label: "Hilton" },
];

// Parking options
const parkingOptions = [
  { value: "kapali-otopark", label: "Kapalı Otopark" },
  { value: "acik-otopark", label: "Açık Otopark" },
  { value: "otopark-yok", label: "Otopark Yok" },
];

// Usage status options
const usageStatusOptions = [
  { value: "bos", label: "Boş" },
  { value: "kiraci", label: "Kiracı" },
  { value: "mulk-sahibi", label: "Mülk Sahibi" },
];

// Deed status options
const deedStatusOptions = [
  { value: "kat-mulkiyetli", label: "Kat Mülkiyetli" },
  { value: "kat-irtifakli", label: "Kat İrtifaklı" },
  { value: "hisseli-tapu", label: "Hisseli Tapu" },
  { value: "kooperatif", label: "Kooperatif" },
];

// Room options
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

const BasicDetails = ({
  prevStep,
  nextStep,
  propertyDetails,
  setPropertyDetails,
}) => {
  const { data: consultants, isLoading: consultantsLoading } = useConsultants();

  const form = useForm({
    initialValues: {
      title: propertyDetails.title,
      description: propertyDetails.description,
      price: propertyDetails.price,
      propertyType: propertyDetails.propertyType || "sale",
      category: propertyDetails.category || "residential",
      consultantId: propertyDetails.consultantId || "",
      // Turkish real estate fields
      listingNo: propertyDetails.listingNo || "",
      listingDate: propertyDetails.listingDate || null,
      areaGross: propertyDetails.area?.gross || 0,
      areaNet: propertyDetails.area?.net || 0,
      rooms: propertyDetails.rooms || "",
      buildingAge: propertyDetails.buildingAge || 0,
      floor: propertyDetails.floor || 0,
      totalFloors: propertyDetails.totalFloors || 0,
      heating: propertyDetails.heating || "",
      kitchen: propertyDetails.kitchen || "",
      balcony: propertyDetails.balcony || false,
      elevator: propertyDetails.elevator || false,
      parking: propertyDetails.parking || "",
      furnished: propertyDetails.furnished || false,
      usageStatus: propertyDetails.usageStatus || "",
      siteName: propertyDetails.siteName || "",
      dues: propertyDetails.dues || 0,
      mortgageEligible: propertyDetails.mortgageEligible || false,
      deedStatus: propertyDetails.deedStatus || "",
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value) => (value < 999 ? "En az 999 TL olmalı" : null),
    },
  });

  const {
    title,
    description,
    price,
    propertyType,
    category,
    consultantId,
    listingNo,
    listingDate,
    areaGross,
    areaNet,
    rooms,
    buildingAge,
    floor,
    totalFloors,
    heating,
    kitchen,
    balcony,
    elevator,
    parking,
    furnished,
    usageStatus,
    siteName,
    dues,
    mortgageEligible,
    deedStatus,
  } = form.values;
  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        title,
        description,
        price,
        propertyType,
        category,
        consultantId: consultantId || null,
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
        parking,
        furnished,
        usageStatus,
        siteName,
        dues,
        mortgageEligible,
        deedStatus,
      }));
      nextStep();
    }
  };

  // Prepare consultant options for select
  const consultantOptions =
    consultants?.map((c) => ({
      value: c.id,
      label: c.name,
      image: c.image,
      title: c.title,
    })) || [];

  return (
    <Box
      maw={"90%"}
      mx="auto"
      my={"md"}
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Property Type Selector */}
        <div className="mb-4">
          <Text size="sm" fw={500} mb={4}>
            Emlak Tipi <span className="text-red-500">*</span>
          </Text>
          <SegmentedControl
            fullWidth
            color={propertyType === "sale" ? "green" : "blue"}
            value={propertyType}
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

        {/* Property Category Selector */}
        <Select
          label="Emlak Kategorisi"
          placeholder="Kategori seçin"
          description="Mülk türünü seçin"
          data={propertyCategories.map((cat) => ({
            value: cat.value,
            label: cat.label,
          }))}
          value={category}
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

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              withAsterisk
              label="Başlık"
              placeholder="Mülk Adı"
              {...form.getInputProps("title")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              withAsterisk
              label="Fiyat (₺)"
              placeholder="999"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              {...form.getInputProps("price")}
            />
          </Grid.Col>
        </Grid>

        <Textarea
          withAsterisk
          label="Açıklama"
          placeholder="Mülk açıklaması"
          mt="sm"
          {...form.getInputProps("description")}
        />

        {/* Consultant Selector */}
        <Select
          label="Danışman Ata"
          placeholder="Bu mülk için bir danışman seçin"
          description="Danışman, bu mülk için iletişim kişisi olarak gösterilecektir"
          data={consultantOptions}
          value={consultantId}
          onChange={(value) => form.setFieldValue("consultantId", value)}
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
              {...form.getInputProps("listingNo")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="İlan Tarihi"
              placeholder="Tarih seçin"
              value={listingDate}
              onChange={(value) => form.setFieldValue("listingDate", value)}
              valueFormat="DD MMMM YYYY"
            />
          </Grid.Col>
        </Grid>

        <Divider
          my="lg"
          label="Bina ve Daire Bilgileri"
          labelPosition="center"
        />

        <Grid>
          <Grid.Col span={4}>
            <NumberInput
              label="m² (Brüt)"
              placeholder="125"
              min={0}
              {...form.getInputProps("areaGross")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="m² (Net)"
              placeholder="85"
              min={0}
              {...form.getInputProps("areaNet")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Oda Sayısı"
              placeholder="Seçin"
              data={roomOptions}
              value={rooms}
              onChange={(value) => form.setFieldValue("rooms", value)}
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
              {...form.getInputProps("buildingAge")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Bulunduğu Kat"
              placeholder="2"
              min={-2}
              {...form.getInputProps("floor")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Kat Sayısı"
              placeholder="18"
              min={1}
              {...form.getInputProps("totalFloors")}
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
              onChange={(value) => form.setFieldValue("heating", value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Mutfak"
              placeholder="Seçin"
              data={kitchenOptions}
              value={kitchen}
              onChange={(value) => form.setFieldValue("kitchen", value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Otopark"
              placeholder="Seçin"
              data={parkingOptions}
              value={parking}
              onChange={(value) => form.setFieldValue("parking", value)}
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
                onChange={(event) =>
                  form.setFieldValue("balcony", event.currentTarget.checked)
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch
                label="Asansör"
                checked={elevator}
                onChange={(event) =>
                  form.setFieldValue("elevator", event.currentTarget.checked)
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch
                label="Eşyalı"
                checked={furnished}
                onChange={(event) =>
                  form.setFieldValue("furnished", event.currentTarget.checked)
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Switch
                label="Krediye Uygun"
                checked={mortgageEligible}
                onChange={(event) =>
                  form.setFieldValue(
                    "mortgageEligible",
                    event.currentTarget.checked
                  )
                }
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
              {...form.getInputProps("siteName")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Aidat (TL)"
              placeholder="0"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              {...form.getInputProps("dues")}
            />
          </Grid.Col>
        </Grid>

        <Grid mt="sm">
          <Grid.Col span={6}>
            <Select
              label="Kullanım Durumu"
              placeholder="Seçin"
              data={usageStatusOptions}
              value={usageStatus}
              onChange={(value) => form.setFieldValue("usageStatus", value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Tapu Durumu"
              placeholder="Seçin"
              data={deedStatusOptions}
              value={deedStatus}
              onChange={(value) => form.setFieldValue("deedStatus", value)}
              clearable
            />
          </Grid.Col>
        </Grid>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Geri
          </Button>
          <Button type="submit">İleri</Button>
        </Group>
      </form>
    </Box>
  );
};

BasicDetails.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.object.isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
};

export default BasicDetails;
