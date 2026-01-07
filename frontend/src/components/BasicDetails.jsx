import {
  Box,
  Button,
  Group,
  NumberInput,
  TextInput,
  Textarea,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "../utils/common";
import PropTypes from "prop-types";
import { MdSell, MdHome } from "react-icons/md";

const BasicDetails = ({
  prevStep,
  nextStep,
  propertyDetails,
  setPropertyDetails,
}) => {
  const form = useForm({
    initialValues: {
      title: propertyDetails.title,
      description: propertyDetails.description,
      price: propertyDetails.price,
      propertyType: propertyDetails.propertyType || "sale",
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value) => (value < 999 ? "Must be minimum 999 dollars" : null),
    },
  });

  const { title, description, price, propertyType } = form.values;
  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        title,
        description,
        price,
        propertyType,
      }));
      nextStep();
    }
  };

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
            Mülk Türü <span className="text-red-500">*</span>
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
                    <MdHome size={18} />
                    <span>Kiralık</span>
                  </div>
                ),
                value: "rent",
              },
            ]}
          />
        </div>

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
          label={propertyType === "sale" ? "Fiyat ($)" : "Aylık Kira ($)"}
          placeholder="999"
          min={0}
          {...form.getInputProps("price")}
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
