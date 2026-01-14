import { useState } from "react";
import { Modal, TextInput, Textarea, Button, Group } from "@mantine/core";
import { toast } from "react-toastify";
import { sendEmail } from "../utils/api";
import { FaEnvelope, FaUser, FaPhone } from "react-icons/fa6";
import PropTypes from "prop-types";

const ContactModal = ({ opened, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Property Inquiry",
    message: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await sendEmail(formData);
      toast.success("Message sent successfully! We will contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Property Inquiry",
        message: "",
      });
      onClose();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-secondary" />
          <span className="font-semibold">Contact Us</span>
        </div>
      }
      centered
      size="md"
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <div className="space-y-4">
        <TextInput
          label="Your Name"
          placeholder="Enter your full name"
          required
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          leftSection={<FaUser className="text-gray-400" />}
        />

        <TextInput
          label="Email Address"
          placeholder="your@email.com"
          required
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          leftSection={<FaEnvelope className="text-gray-400" />}
        />

        <TextInput
          label="Phone Number (Optional)"
          placeholder="+90 XXX XXX XXXX"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          leftSection={<FaPhone className="text-gray-400" />}
        />

        <TextInput
          label="Subject"
          placeholder="What is this about?"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        />

        <Textarea
          label="Your Message"
          placeholder="Tell us about your inquiry..."
          required
          minRows={4}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSubmit}
            loading={loading}
            leftSection={<FaEnvelope />}
          >
            Send Message
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

ContactModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ContactModal;
