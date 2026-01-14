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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "../utils/common";
import PropTypes from "prop-types";
import { MdSell, MdHome, MdPerson } from "react-icons/md";
import { FaLandmark, FaHome, FaBriefcase } from "react-icons/fa";
import useConsultants from "../hooks/useConsultants";

// Property categories
const propertyCategories = [
  { value: "residential", label: "Residential", icon: FaHome },
  { value: "commercial", label: "Commercial", icon: FaBriefcase },
  { value: "land", label: "Land", icon: FaLandmark },
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
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value) => (value < 999 ? "Must be minimum 999 lira" : null),
    },
  });

  const { title, description, price, propertyType, category, consultantId } =
    form.values;
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
    <Box maw={"50%"} mx="auto" my={"md"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Property Type Selector */}
        <div className="mb-4">
          <Text size="sm" fw={500} mb={4}>
            Property Type <span className="text-red-500">*</span>
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

        {/* Property Category Selector */}
        <Select
          label="Property Category"
          placeholder="Select property category"
          description="Choose the type of property"
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

        <TextInput
          withAsterisk
          label="Title"
          placeholder="Property Name"
          {...form.getInputProps("title")}
        />
        <Textarea
          withAsterisk
          label="Description"
          placeholder="Description"
          {...form.getInputProps("description")}
        />
        <NumberInput
          withAsterisk
          label={propertyType === "sale" ? "Price (₺)" : "Monthly Rent (₺)"}
          placeholder="999"
          min={0}
          {...form.getInputProps("price")}
        />

        {/* Consultant Selector */}
        <Select
          label="Assign Consultant"
          placeholder="Select a consultant for this property"
          description="The consultant will be shown as the contact person for this property"
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

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">Next</Button>
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
