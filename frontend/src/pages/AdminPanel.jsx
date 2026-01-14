import { useState, useContext, useEffect, useCallback } from "react";
import {
  Container,
  Stepper,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Divider,
  Button,
  Avatar,
  Table,
  Loader,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  MultiSelect,
  Select,
} from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate } from "react-router-dom";
import AddLocation from "../components/AddLocation";
import UploadImage from "../components/UploadImage";
import BasicDetails from "../components/BasicDetails";
import Facilities from "../components/Facilities";
import EditPropertyModal from "../components/EditPropertyModal";
import useAdmin from "../hooks/useAdmin";
import useProperties from "../hooks/useProperties";
import useConsultants from "../hooks/useConsultants";
import UserDetailContext from "../context/UserDetailContext";
import {
  getAdminAllBookings,
  deleteResidency,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  toggleConsultantAvailability,
  getAllUsers,
  removeBooking,
} from "../utils/api";
import { toast } from "react-toastify";
import {
  MdDashboard,
  MdAddHome,
  MdList,
  MdEventNote,
  MdCalendarToday,
  MdHome,
  MdRefresh,
  MdEdit,
  MdDelete,
  MdPeople,
  MdPersonAdd,
  MdPhone,
  MdEmail,
  MdOutlineCloudUpload,
  MdClose,
} from "react-icons/md";
import { FaWhatsapp, FaStar } from "react-icons/fa6";
import { useRef } from "react";

const AdminPanel = () => {
  const [active, setActive] = useState(0);
  const [activeTab, setActiveTab] = useState("bookings");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);
  const navigate = useNavigate();

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);

  // Properties state
  const {
    data: properties,
    isLoading: propertiesLoading,
    refetch: refetchProperties,
  } = useProperties();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Consultants state
  const {
    data: consultants,
    isLoading: consultantsLoading,
    refetch: refetchConsultants,
  } = useConsultants();
  const [consultantModalOpened, setConsultantModalOpened] = useState(false);
  const [editConsultantModalOpened, setEditConsultantModalOpened] =
    useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [deleteConsultantModalOpened, setDeleteConsultantModalOpened] =
    useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState(null);
  const [consultantLoading, setConsultantLoading] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [consultantForm, setConsultantForm] = useState({
    name: "",
    title: "",
    specialty: "",
    experience: "",
    languages: [],
    rating: 5.0,
    reviews: 0,
    phone: "",
    whatsapp: "",
    email: "",
    linkedin: "",
    image: "",
    bio: "",
    available: true,
  });

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Turkish", label: "Turkish" },
    { value: "Arabic", label: "Arabic" },
    { value: "German", label: "German" },
    { value: "French", label: "French" },
    { value: "Russian", label: "Russian" },
    { value: "Mandarin", label: "Mandarin" },
    { value: "Spanish", label: "Spanish" },
    { value: "Persian", label: "Persian" },
  ];

  // Cloudinary widget for consultant image upload
  const cloudinaryRef = useRef();
  const consultantWidgetRef = useRef();
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    consultantWidgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "ducct0j1f",
        uploadPreset: "auvy3sl6",
        maxFiles: 1,
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff", "svg", "heic", "heif", "avif", "ico", "raw"],
        sources: ["local", "url", "camera"],
      },
      (err, result) => {
        if (result.event === "success") {
          setConsultantForm((prev) => ({
            ...prev,
            image: result.info.secure_url,
          }));
          setImageUploading(false);
        }
        if (result.event === "close") {
          setImageUploading(false);
        }
      }
    );
  }, []);

  const openConsultantImageUpload = () => {
    setImageUploading(true);
    consultantWidgetRef.current?.open();
  };

  const removeConsultantImage = () => {
    setConsultantForm((prev) => ({ ...prev, image: "" }));
  };

  const [propertyDetails, setPropertyDetails] = useState({
    title: "",
    description: "",
    price: 0,
    country: "",
    city: "",
    address: "",
    image: null,
    images: [],
    facilities: {
      bedrooms: 0,
      parkings: 0,
      bathrooms: 0,
    },
    propertyType: "sale",
    category: "residential",
    consultantId: null,
    userEmail: user?.email,
  });

  // Fetch all bookings
  const fetchBookings = useCallback(async () => {
    if (!token) return;
    setBookingsLoading(true);
    try {
      const data = await getAdminAllBookings(token);
      setBookings(data.bookings || []);
      setTotalBookings(data.totalBookings || 0);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setBookingsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) {
      fetchBookings();
    }
  }, [token, isAdmin, fetchBookings]);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data.users || []);
      setTotalUsers(data.totalUsers || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) {
      fetchUsers();
    }
  }, [token, isAdmin, fetchUsers]);

  // Handle delete booking (admin)
  const handleDeleteBooking = async (userEmail, propertyId) => {
    if (!token || !userEmail || !propertyId) return;

    try {
      await removeBooking(propertyId, userEmail, token);
      toast.success("Booking deleted successfully!", {
        position: "bottom-right",
      });
      // Refresh users list to update bookings
      fetchUsers();
      fetchBookings();
    } catch (error) {
      console.error("Delete booking error:", error);
      toast.error("Error deleting booking", { position: "bottom-right" });
    }
  };

  // Handle edit property
  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setEditModalOpened(true);
  };

  // Handle delete property
  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete || !token) return;

    setDeleteLoading(true);
    try {
      await deleteResidency(propertyToDelete.id, token);
      toast.success("Delete operation completed successfully!", {
        position: "bottom-right",
      });
      setDeleteModalOpened(false);
      setPropertyToDelete(null);
      refetchProperties();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Consultant functions
  const resetConsultantForm = () => {
    setConsultantForm({
      name: "",
      title: "",
      specialty: "",
      experience: "",
      languages: [],
      rating: 5.0,
      reviews: 0,
      phone: "",
      whatsapp: "",
      email: "",
      linkedin: "",
      image: "",
      bio: "",
      available: true,
    });
  };

  const handleCreateConsultant = async () => {
    if (!token) return;
    if (
      !consultantForm.name ||
      !consultantForm.email ||
      !consultantForm.phone
    ) {
      toast.error("Please fill required fields (Name, Email, Phone)", {
        position: "bottom-right",
      });
      return;
    }

    setConsultantLoading(true);
    try {
      await createConsultant(consultantForm, token);
      toast.success("Consultant added successfully!", {
        position: "bottom-right",
      });
      setConsultantModalOpened(false);
      resetConsultantForm();
      refetchConsultants();
    } catch (error) {
      console.error("Create consultant error:", error);
    } finally {
      setConsultantLoading(false);
    }
  };

  const handleEditConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    setConsultantForm({
      name: consultant.name || "",
      title: consultant.title || "",
      specialty: consultant.specialty || "",
      experience: consultant.experience || "",
      languages: consultant.languages || [],
      rating: consultant.rating || 5.0,
      reviews: consultant.reviews || 0,
      phone: consultant.phone || "",
      whatsapp: consultant.whatsapp || "",
      email: consultant.email || "",
      linkedin: consultant.linkedin || "",
      image: consultant.image || "",
      bio: consultant.bio || "",
      available:
        consultant.available !== undefined ? consultant.available : true,
    });
    setEditConsultantModalOpened(true);
  };

  const handleUpdateConsultant = async () => {
    if (!selectedConsultant || !token) return;

    setConsultantLoading(true);
    try {
      await updateConsultant(selectedConsultant.id, consultantForm, token);
      toast.success("Consultant updated successfully!", {
        position: "bottom-right",
      });
      setEditConsultantModalOpened(false);
      setSelectedConsultant(null);
      resetConsultantForm();
      refetchConsultants();
    } catch (error) {
      console.error("Update consultant error:", error);
    } finally {
      setConsultantLoading(false);
    }
  };

  const handleDeleteConsultantClick = (consultant) => {
    setConsultantToDelete(consultant);
    setDeleteConsultantModalOpened(true);
  };

  const confirmDeleteConsultant = async () => {
    if (!consultantToDelete || !token) return;

    setConsultantLoading(true);
    try {
      await deleteConsultant(consultantToDelete.id, token);
      toast.success("Consultant deleted successfully!", {
        position: "bottom-right",
      });
      setDeleteConsultantModalOpened(false);
      setConsultantToDelete(null);
      refetchConsultants();
    } catch (error) {
      console.error("Delete consultant error:", error);
    } finally {
      setConsultantLoading(false);
    }
  };

  const handleToggleAvailability = async (consultant) => {
    if (!token) return;
    try {
      await toggleConsultantAvailability(consultant.id, token);
      refetchConsultants();
    } catch (error) {
      console.error("Toggle availability error:", error);
    }
  };

  const nextStep = () => {
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const resetForm = () => {
    setPropertyDetails({
      title: "",
      description: "",
      price: 0,
      country: "",
      city: "",
      address: "",
      image: null,
      images: [],
      facilities: {
        bedrooms: 0,
        parkings: 0,
        bathrooms: 0,
      },
      propertyType: "sale",
      category: "residential",
      consultantId: null,
      userEmail: user?.email,
    });
    setActive(0);
  };

  // Loading states
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flexCenter bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flexCenter bg-gray-50">
        <Paper shadow="md" p="xl" radius="md" className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <Title order={3} className="mb-2">
            Yetkisiz Erişim
          </Title>
          <Text color="dimmed" className="mb-4">
            Yönetim paneline erişim yetkiniz bulunmamaktadır.
          </Text>
          <Button onClick={() => navigate("/")} color="gray">
            Ana Sayfaya Dön
          </Button>
        </Paper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Container size="xl">
        {/* Admin Header */}
        <Paper shadow="sm" p="lg" radius="md" className="mb-6">
          <div className="flexBetween flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-white p-3 rounded-full">
                <MdDashboard size={24} />
              </div>
              <div>
                <Title order={2} className="text-gray-800">
                  Yönetim Paneli
                </Title>
                <Text size="sm" color="dimmed">
                  Hoş geldiniz, {user?.name || user?.email}
                </Text>
              </div>
            </div>
            <Badge size="lg" color="green" variant="light">
              Admin
            </Badge>
          </div>
        </Paper>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Paper
            shadow="sm"
            p="lg"
            radius="md"
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              activeTab === "addProperty" ? "border-2 border-secondary" : ""
            }`}
            onClick={() => setActiveTab("addProperty")}
          >
            <Group>
              <div className="bg-secondary/10 text-secondary p-3 rounded-full">
                <MdAddHome size={24} />
              </div>
              <div>
                <Text fw={600}>Add New Property</Text>
                <Text size="sm" color="dimmed">
                  Add new property to system
                </Text>
              </div>
            </Group>
          </Paper>

          <Paper
            shadow="sm"
            p="lg"
            radius="md"
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              activeTab === "propertyList" ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("propertyList")}
          >
            <Group>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <MdList size={24} />
              </div>
              <div>
                <Text fw={600}>Property List</Text>
                <Text size="sm" color="dimmed">
                  {properties?.length || 0} registered properties
                </Text>
              </div>
            </Group>
          </Paper>

          <Paper
            shadow="sm"
            p="lg"
            radius="md"
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              activeTab === "consultants" ? "border-2 border-purple-500" : ""
            }`}
            onClick={() => setActiveTab("consultants")}
          >
            <Group>
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                <MdPeople size={24} />
              </div>
              <div>
                <Text fw={600}>Consultants</Text>
                <Text size="sm" color="dimmed">
                  {consultants?.length || 0} registered consultants
                </Text>
              </div>
            </Group>
          </Paper>

          <Paper
            shadow="sm"
            p="lg"
            radius="md"
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              activeTab === "users" ? "border-2 border-cyan-500" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Group>
              <div className="bg-cyan-100 text-cyan-600 p-3 rounded-full">
                <MdPeople size={24} />
              </div>
              <div>
                <Text fw={600}>Kullanıcılar</Text>
                <Text size="sm" color="dimmed">
                  {totalUsers} kullanıcı • {totalBookings} rez.
                </Text>
              </div>
            </Group>
          </Paper>
        </div>

        {/* Property List Section */}
        {activeTab === "propertyList" && (
          <Paper shadow="sm" p="xl" radius="md" className="mb-6">
            <div className="flexBetween mb-6">
              <div>
                <Title
                  order={3}
                  className="flex items-center gap-2 text-gray-800"
                >
                  <MdList className="text-blue-500" />
                  Property List
                </Title>
                <Text size="sm" color="dimmed" className="mt-1">
                  View, edit or delete all registered properties
                </Text>
              </div>
              <Button
                variant="light"
                color="blue"
                leftSection={<MdRefresh size={18} />}
                onClick={() => refetchProperties()}
                loading={propertiesLoading}
              >
                Yenile
              </Button>
            </div>

            <Divider className="mb-6" />

            {propertiesLoading ? (
              <div className="flexCenter py-12">
                <Loader color="blue" />
              </div>
            ) : !properties || properties.length === 0 ? (
              <div className="text-center py-12">
                <MdHome size={64} className="text-gray-300 mx-auto mb-4" />
                <Text color="dimmed">No properties registered yet</Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Property</Table.Th>
                      <Table.Th>Konum</Table.Th>
                      <Table.Th>Fiyat</Table.Th>
                      <Table.Th>Tür</Table.Th>
                      <Table.Th>Consultant</Table.Th>
                      <Table.Th>İşlemler</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {properties.map((property) => (
                      <Table.Tr key={property.id}>
                        <Table.Td>
                          <div className="flex items-center gap-3">
                            {property.image && (
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <Text size="sm" fw={500} lineClamp={1} maw={200}>
                                {property.title}
                              </Text>
                              <Text
                                size="xs"
                                color="dimmed"
                                lineClamp={1}
                                maw={200}
                              >
                                {property.address}
                              </Text>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-1">
                            <MdHome size={16} className="text-gray-400" />
                            <Text size="sm">
                              {property.city}, {property.country}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600} color="green">
                            ₺{property.price?.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={
                              property.propertyType === "sale"
                                ? "green"
                                : "blue"
                            }
                            variant="light"
                          >
                            {property.propertyType === "sale"
                              ? "For Sale"
                              : "For Rent"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {property.consultant ? (
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={property.consultant.image}
                                size="sm"
                                radius="xl"
                              />
                              <div>
                                <Text size="xs" fw={500}>
                                  {property.consultant.name}
                                </Text>
                                <Text size="xs" color="dimmed">
                                  {property.consultant.phone}
                                </Text>
                              </div>
                            </div>
                          ) : (
                            <Badge color="gray" variant="light" size="sm">
                              Not Assigned
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="lg"
                              onClick={() => handleEditProperty(property)}
                              title="Düzenle"
                            >
                              <MdEdit size={18} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              size="lg"
                              onClick={() => handleDeleteClick(property)}
                              title="Sil"
                            >
                              <MdDelete size={18} />
                            </ActionIcon>
                            <Button
                              variant="subtle"
                              size="xs"
                              onClick={() =>
                                navigate(`/listing/${property.id}`)
                              }
                            >
                              Görüntüle
                            </Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}

            {/* Properties Summary */}
            {properties && properties.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Text size="sm" color="dimmed">
                    Total: {properties.length} properties
                  </Text>
                  <div className="flex gap-4">
                    <Text size="sm" color="dimmed">
                      For Sale:{" "}
                      {
                        properties.filter((p) => p.propertyType === "sale")
                          .length
                      }
                    </Text>
                    <Text size="sm" color="dimmed">
                      For Rent:{" "}
                      {
                        properties.filter((p) => p.propertyType === "rent")
                          .length
                      }
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </Paper>
        )}

        {/* Consultants Section */}
        {activeTab === "consultants" && (
          <Paper shadow="sm" p="xl" radius="md" className="mb-6">
            <div className="flexBetween mb-6">
              <div>
                <Title
                  order={3}
                  className="flex items-center gap-2 text-gray-800"
                >
                  <MdPeople className="text-purple-500" />
                  Consultant Management
                </Title>
                <Text size="sm" color="dimmed" className="mt-1">
                  View, add, edit or delete consultants
                </Text>
              </div>
              <Group>
                <Button
                  variant="light"
                  color="purple"
                  leftSection={<MdRefresh size={18} />}
                  onClick={() => refetchConsultants()}
                  loading={consultantsLoading}
                >
                  Yenile
                </Button>
                <Button
                  color="grape"
                  leftSection={<MdPersonAdd size={18} />}
                  onClick={() => setConsultantModalOpened(true)}
                >
                  Add New Consultant
                </Button>
              </Group>
            </div>

            <Divider className="mb-6" />

            {consultantsLoading ? (
              <div className="flexCenter py-12">
                <Loader color="grape" />
              </div>
            ) : !consultants || consultants.length === 0 ? (
              <div className="text-center py-12">
                <MdPeople size={64} className="text-gray-300 mx-auto mb-4" />
                <Text color="dimmed">No consultants registered yet</Text>
                <Button
                  color="grape"
                  className="mt-4"
                  leftSection={<MdPersonAdd size={18} />}
                  onClick={() => setConsultantModalOpened(true)}
                >
                  Add First Consultant
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Consultant</Table.Th>
                      <Table.Th>Uzmanlık</Table.Th>
                      <Table.Th>Contact</Table.Th>
                      <Table.Th>İstatistik</Table.Th>
                      <Table.Th>Durum</Table.Th>
                      <Table.Th>İşlemler</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {consultants.map((consultant) => (
                      <Table.Tr key={consultant.id}>
                        <Table.Td>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={consultant.image}
                              alt={consultant.name}
                              radius="xl"
                              size="lg"
                            />
                            <div>
                              <Text size="sm" fw={600}>
                                {consultant.name}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {consultant.title}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {consultant.experience} deneyim
                              </Text>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text size="sm" fw={500}>
                              {consultant.specialty}
                            </Text>
                            <Text size="xs" color="dimmed">
                              {consultant.languages?.join(", ")}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <MdPhone size={14} className="text-gray-400" />
                              <Text size="xs">{consultant.phone}</Text>
                            </div>
                            <div className="flex items-center gap-1">
                              <MdEmail size={14} className="text-gray-400" />
                              <Text size="xs">{consultant.email}</Text>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="flex items-center gap-1">
                                <FaStar className="text-amber-500 text-xs" />
                                <Text size="sm" fw={600}>
                                  {consultant.rating}
                                </Text>
                              </div>
                              <Text size="xs" color="dimmed">
                                {consultant.reviews} yorum
                              </Text>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={consultant.available ? "green" : "gray"}
                            variant="light"
                            className="cursor-pointer"
                            onClick={() => handleToggleAvailability(consultant)}
                          >
                            {consultant.available ? "Müsait" : "Meşgul"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="lg"
                              onClick={() => handleEditConsultant(consultant)}
                              title="Düzenle"
                            >
                              <MdEdit size={18} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              size="lg"
                              onClick={() =>
                                handleDeleteConsultantClick(consultant)
                              }
                              title="Sil"
                            >
                              <MdDelete size={18} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}

            {/* Consultants Summary */}
            {consultants && consultants.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Text size="sm" color="dimmed">
                    Total: {consultants.length} consultants
                  </Text>
                  <div className="flex gap-4">
                    <Text size="sm" color="dimmed">
                      Müsait: {consultants.filter((c) => c.available).length}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Meşgul: {consultants.filter((c) => !c.available).length}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </Paper>
        )}

        {/* Users Section */}
        {activeTab === "users" && (
          <Paper shadow="sm" p="xl" radius="md" className="mb-6">
            <div className="flexBetween mb-6">
              <div>
                <Title
                  order={3}
                  className="flex items-center gap-2 text-gray-800"
                >
                  <MdPeople className="text-cyan-500" />
                  Kullanıcılar & Rezervasyonlar
                </Title>
                <Text size="sm" color="dimmed" className="mt-1">
                  Tüm kullanıcılar, bilgileri ve rezervasyonları
                </Text>
              </div>
              <Group>
                <Button
                  variant="light"
                  color="cyan"
                  leftSection={<MdRefresh size={18} />}
                  onClick={() => {
                    fetchUsers();
                    fetchBookings();
                  }}
                  loading={usersLoading}
                >
                  Yenile
                </Button>
              </Group>
            </div>

            <Divider className="mb-6" />

            {usersLoading ? (
              <div className="flexCenter py-12">
                <Loader color="cyan" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <MdPeople size={64} className="text-gray-300 mx-auto mb-4" />
                <Text color="dimmed">
                  Henüz kayıtlı kullanıcı bulunmamaktadır
                </Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Kullanıcı</Table.Th>
                      <Table.Th>Contact</Table.Th>
                      <Table.Th>Profil Durumu</Table.Th>
                      <Table.Th>Rezervasyonlar</Table.Th>
                      <Table.Th>Favorites</Table.Th>
                      <Table.Th>Kayıt Tarihi</Table.Th>
                      <Table.Th>Rol</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {users.map((u) => (
                      <Table.Tr key={u.id}>
                        <Table.Td>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={u.image}
                              alt={u.name}
                              radius="xl"
                              size="md"
                            />
                            <div>
                              <Text size="sm" fw={500}>
                                {u.name || "İsimsiz"}
                              </Text>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <MdEmail size={14} className="text-gray-400" />
                              <Text size="xs">{u.email}</Text>
                            </div>
                            {u.phone && (
                              <div className="flex items-center gap-1">
                                <FaWhatsapp
                                  size={14}
                                  className="text-green-500"
                                />
                                <Text size="xs">{u.phone}</Text>
                              </div>
                            )}
                            {u.address && (
                              <div className="flex items-center gap-1">
                                <MdHome size={14} className="text-gray-400" />
                                <Text size="xs" lineClamp={1}>
                                  {u.address}
                                </Text>
                              </div>
                            )}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={u.profileComplete ? "green" : "orange"}
                            variant="light"
                          >
                            {u.profileComplete ? "Tamamlandı" : "Eksik"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {u.bookedVisits?.length > 0 ? (
                            <div className="space-y-2">
                              {u.bookedVisits.map((booking, idx) => {
                                const property = properties?.find(
                                  (p) => p.id === booking.id
                                );
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"
                                  >
                                    {property?.image && (
                                      <img
                                        src={property.image}
                                        alt={property.title}
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <Text size="xs" fw={500} lineClamp={1}>
                                        {property?.title ||
                                          "Property not found"}
                                      </Text>
                                      <div className="flex items-center gap-1">
                                        <MdCalendarToday
                                          size={10}
                                          className="text-orange-500"
                                        />
                                        <Text size="xs" color="orange">
                                          {booking.date}
                                        </Text>
                                      </div>
                                    </div>
                                    {property && (
                                      <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        onClick={() =>
                                          navigate(`/listing/${property.id}`)
                                        }
                                        title="View property"
                                      >
                                        <MdHome size={14} />
                                      </ActionIcon>
                                    )}
                                    <ActionIcon
                                      variant="light"
                                      color="red"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteBooking(u.email, booking.id)
                                      }
                                      title="Rezervasyonu sil"
                                    >
                                      <MdDelete size={14} />
                                    </ActionIcon>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <Text size="xs" color="dimmed">
                              Rezervasyon yok
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge color="pink" variant="light">
                            {u.favResidenciesID?.length || 0} favori
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" color="dimmed">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString(
                                  "tr-TR",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={u.isAdmin ? "green" : "gray"}
                            variant="filled"
                          >
                            {u.isAdmin ? "Admin" : "Kullanıcı"}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}

            {/* Users Summary */}
            {users.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Text size="sm" color="dimmed">
                    Toplam: {totalUsers} kullanıcı
                  </Text>
                  <div className="flex gap-4 flex-wrap">
                    <Text size="sm" color="dimmed">
                      Profil Tamamlayan:{" "}
                      {users.filter((u) => u.profileComplete).length}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Admin: {users.filter((u) => u.isAdmin).length}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Aktif Rezervasyon:{" "}
                      {users.reduce(
                        (acc, u) => acc + (u.bookedVisits?.length || 0),
                        0
                      )}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </Paper>
        )}

        {/* Add Property Form */}
        {activeTab === "addProperty" && (
          <Paper shadow="sm" p="xl" radius="md">
            <div className="mb-6">
              <Title
                order={3}
                className="flex items-center gap-2 text-gray-800"
              >
                <MdAddHome className="text-secondary" />
                Save New Property
              </Title>
              <Text size="sm" color="dimmed" className="mt-1">
                Enter property information in the following steps
              </Text>
            </div>

            <Divider className="mb-6" />

            <Stepper
              active={active}
              onStepClick={setActive}
              breakpoint="sm"
              allowNextStepsSelect={false}
              color="green"
            >
              <Stepper.Step label="Konum" description="Adres ve şehir">
                <div className="mt-6">
                  <AddLocation
                    nextStep={nextStep}
                    propertyDetails={propertyDetails}
                    setPropertyDetails={setPropertyDetails}
                  />
                </div>
              </Stepper.Step>

              <Stepper.Step label="Görseller" description="Fotoğraf yükle">
                <div className="mt-6">
                  <UploadImage
                    prevStep={prevStep}
                    nextStep={nextStep}
                    propertyDetails={propertyDetails}
                    setPropertyDetails={setPropertyDetails}
                  />
                </div>
              </Stepper.Step>

              <Stepper.Step label="Detaylar" description="Ana özellikler">
                <div className="mt-6">
                  <BasicDetails
                    prevStep={prevStep}
                    nextStep={nextStep}
                    propertyDetails={propertyDetails}
                    setPropertyDetails={setPropertyDetails}
                  />
                </div>
              </Stepper.Step>

              <Stepper.Step label="Olanaklar" description="Oda sayısı">
                <div className="mt-6">
                  <Facilities
                    prevStep={prevStep}
                    propertyDetails={propertyDetails}
                    setPropertyDetails={setPropertyDetails}
                    setOpened={() => {}} // Not used in page mode
                    setActiveStep={setActive}
                    onSuccess={resetForm}
                    isPageMode={true}
                  />
                </div>
              </Stepper.Step>

              <Stepper.Completed>
                <div className="text-center py-8">
                  <div className="text-green-500 text-6xl mb-4">✓</div>
                  <Title order={3} className="mb-2">
                    Property saved successfully!
                  </Title>
                  <Text color="dimmed" className="mb-6">
                    New property added to the list and will be displayed on the
                    site.
                  </Text>
                  <Group position="center">
                    <Button onClick={resetForm} color="green">
                      Save New Property
                    </Button>
                    <Button
                      onClick={() => navigate("/listing")}
                      variant="outline"
                    >
                      Property Listni Görüntüle
                    </Button>
                  </Group>
                </div>
              </Stepper.Completed>
            </Stepper>
          </Paper>
        )}

        {/* Edit Property Modal */}
        <EditPropertyModal
          opened={editModalOpened}
          setOpened={setEditModalOpened}
          property={selectedProperty}
          onSuccess={() => {
            refetchProperties();
            setSelectedProperty(null);
          }}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteModalOpened}
          onClose={() => {
            setDeleteModalOpened(false);
            setPropertyToDelete(null);
          }}
          title={
            <Text fw={600} color="red">
              Delete Property
            </Text>
          }
          centered
        >
          <div className="py-4">
            <Text size="sm" color="dimmed" mb="md">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </Text>
            {propertyToDelete && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                {propertyToDelete.image && (
                  <img
                    src={propertyToDelete.image}
                    alt={propertyToDelete.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <Text size="sm" fw={500}>
                    {propertyToDelete.title}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {propertyToDelete.city}, {propertyToDelete.country}
                  </Text>
                  <Text size="xs" color="green" fw={500}>
                    ₺{propertyToDelete.price?.toLocaleString()}
                  </Text>
                </div>
              </div>
            )}
            <Group justify="flex-end" mt="xl">
              <Button
                variant="default"
                onClick={() => {
                  setDeleteModalOpened(false);
                  setPropertyToDelete(null);
                }}
              >
                İptal
              </Button>
              <Button
                color="red"
                onClick={confirmDelete}
                loading={deleteLoading}
              >
                Sil
              </Button>
            </Group>
          </div>
        </Modal>

        {/* Add Consultant Modal */}
        <Modal
          opened={consultantModalOpened}
          onClose={() => {
            setConsultantModalOpened(false);
            resetConsultantForm();
          }}
          title={
            <Text fw={600} color="grape">
              <div className="flex items-center gap-2">
                <MdPersonAdd />
                Add New Consultant
              </div>
            </Text>
          }
          size="lg"
          centered
        >
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Ad Soyad"
                placeholder="Consultant name"
                required
                value={consultantForm.name}
                onChange={(e) =>
                  setConsultantForm({ ...consultantForm, name: e.target.value })
                }
              />
              <TextInput
                label="Ünvan"
                placeholder="Örn: Senior Property Advisor"
                value={consultantForm.title}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Uzmanlık Alanı"
                placeholder="Örn: Luxury Villas & Apartments"
                value={consultantForm.specialty}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    specialty: e.target.value,
                  })
                }
              />
              <TextInput
                label="Deneyim"
                placeholder="Örn: 10 years"
                value={consultantForm.experience}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    experience: e.target.value,
                  })
                }
              />
            </div>

            <MultiSelect
              label="Diller"
              placeholder="Konuşulan dilleri seçin"
              data={languageOptions}
              value={consultantForm.languages}
              onChange={(value) =>
                setConsultantForm({ ...consultantForm, languages: value })
              }
              searchable
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Email"
                placeholder="email@example.com"
                required
                value={consultantForm.email}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    email: e.target.value,
                  })
                }
              />
              <TextInput
                label="Telefon"
                placeholder="+90 5XX XXX XXXX"
                required
                value={consultantForm.phone}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="WhatsApp"
                placeholder="+905XXXXXXXXX"
                value={consultantForm.whatsapp}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    whatsapp: e.target.value,
                  })
                }
              />
              <TextInput
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/..."
                value={consultantForm.linkedin}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    linkedin: e.target.value,
                  })
                }
              />
            </div>

            {/* Profile Image Upload */}
            <div>
              <Text size="sm" fw={500} mb={4}>
                Profil Fotoğrafı
              </Text>
              {consultantForm.image ? (
                <div className="relative inline-block">
                  <img
                    src={consultantForm.image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    radius="xl"
                    className="absolute top-0 right-0"
                    onClick={removeConsultantImage}
                  >
                    <MdClose size={14} />
                  </ActionIcon>
                </div>
              ) : (
                <div
                  onClick={openConsultantImageUpload}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flexCenter flex-col cursor-pointer hover:border-grape-500 hover:bg-gray-50 transition-colors"
                >
                  <MdOutlineCloudUpload size={28} className="text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Yükle</span>
                </div>
              )}
              {consultantForm.image && (
                <Button
                  variant="subtle"
                  size="xs"
                  mt="xs"
                  onClick={openConsultantImageUpload}
                  loading={imageUploading}
                >
                  Değiştir
                </Button>
              )}
            </div>

            <Textarea
              label="Biyografi"
              placeholder="Short description about consultant"
              rows={3}
              value={consultantForm.bio}
              onChange={(e) =>
                setConsultantForm({ ...consultantForm, bio: e.target.value })
              }
            />

            <div className="grid grid-cols-3 gap-4">
              <NumberInput
                label="Puan"
                placeholder="5.0"
                min={0}
                max={5}
                step={0.1}
                decimalScale={1}
                value={consultantForm.rating}
                onChange={(value) =>
                  setConsultantForm({ ...consultantForm, rating: value || 0 })
                }
              />
              <NumberInput
                label="Yorum Sayısı"
                placeholder="0"
                min={0}
                value={consultantForm.reviews}
                onChange={(value) =>
                  setConsultantForm({ ...consultantForm, reviews: value || 0 })
                }
              />
            </div>

            <Switch
              label="Müsait"
              checked={consultantForm.available}
              onChange={(e) =>
                setConsultantForm({
                  ...consultantForm,
                  available: e.currentTarget.checked,
                })
              }
            />

            <Group justify="flex-end" mt="xl">
              <Button
                variant="default"
                onClick={() => {
                  setConsultantModalOpened(false);
                  resetConsultantForm();
                }}
              >
                İptal
              </Button>
              <Button
                color="grape"
                onClick={handleCreateConsultant}
                loading={consultantLoading}
              >
                Add Consultant
              </Button>
            </Group>
          </div>
        </Modal>

        {/* Edit Consultant Modal */}
        <Modal
          opened={editConsultantModalOpened}
          onClose={() => {
            setEditConsultantModalOpened(false);
            setSelectedConsultant(null);
            resetConsultantForm();
          }}
          title={
            <Text fw={600} color="blue">
              <div className="flex items-center gap-2">
                <MdEdit />
                Edit Consultant
              </div>
            </Text>
          }
          size="lg"
          centered
        >
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Ad Soyad"
                placeholder="Consultant name"
                required
                value={consultantForm.name}
                onChange={(e) =>
                  setConsultantForm({ ...consultantForm, name: e.target.value })
                }
              />
              <TextInput
                label="Ünvan"
                placeholder="Örn: Senior Property Advisor"
                value={consultantForm.title}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Uzmanlık Alanı"
                placeholder="Örn: Luxury Villas & Apartments"
                value={consultantForm.specialty}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    specialty: e.target.value,
                  })
                }
              />
              <TextInput
                label="Deneyim"
                placeholder="Örn: 10 years"
                value={consultantForm.experience}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    experience: e.target.value,
                  })
                }
              />
            </div>

            <MultiSelect
              label="Diller"
              placeholder="Konuşulan dilleri seçin"
              data={languageOptions}
              value={consultantForm.languages}
              onChange={(value) =>
                setConsultantForm({ ...consultantForm, languages: value })
              }
              searchable
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Email"
                placeholder="email@example.com"
                required
                value={consultantForm.email}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    email: e.target.value,
                  })
                }
              />
              <TextInput
                label="Telefon"
                placeholder="+90 5XX XXX XXXX"
                required
                value={consultantForm.phone}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="WhatsApp"
                placeholder="+905XXXXXXXXX"
                value={consultantForm.whatsapp}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    whatsapp: e.target.value,
                  })
                }
              />
              <TextInput
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/..."
                value={consultantForm.linkedin}
                onChange={(e) =>
                  setConsultantForm({
                    ...consultantForm,
                    linkedin: e.target.value,
                  })
                }
              />
            </div>

            {/* Profile Image Upload */}
            <div>
              <Text size="sm" fw={500} mb={4}>
                Profil Fotoğrafı
              </Text>
              {consultantForm.image ? (
                <div className="relative inline-block">
                  <img
                    src={consultantForm.image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    radius="xl"
                    className="absolute top-0 right-0"
                    onClick={removeConsultantImage}
                  >
                    <MdClose size={14} />
                  </ActionIcon>
                </div>
              ) : (
                <div
                  onClick={openConsultantImageUpload}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flexCenter flex-col cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                >
                  <MdOutlineCloudUpload size={28} className="text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Yükle</span>
                </div>
              )}
              {consultantForm.image && (
                <Button
                  variant="subtle"
                  size="xs"
                  mt="xs"
                  onClick={openConsultantImageUpload}
                  loading={imageUploading}
                >
                  Değiştir
                </Button>
              )}
            </div>

            <Textarea
              label="Biyografi"
              placeholder="Short description about consultant"
              rows={3}
              value={consultantForm.bio}
              onChange={(e) =>
                setConsultantForm({ ...consultantForm, bio: e.target.value })
              }
            />

            <div className="grid grid-cols-3 gap-4">
              <NumberInput
                label="Puan"
                placeholder="5.0"
                min={0}
                max={5}
                step={0.1}
                decimalScale={1}
                value={consultantForm.rating}
                onChange={(value) =>
                  setConsultantForm({ ...consultantForm, rating: value || 0 })
                }
              />
              <NumberInput
                label="Yorum Sayısı"
                placeholder="0"
                min={0}
                value={consultantForm.reviews}
                onChange={(value) =>
                  setConsultantForm({ ...consultantForm, reviews: value || 0 })
                }
              />
            </div>

            <Switch
              label="Müsait"
              checked={consultantForm.available}
              onChange={(e) =>
                setConsultantForm({
                  ...consultantForm,
                  available: e.currentTarget.checked,
                })
              }
            />

            <Group justify="flex-end" mt="xl">
              <Button
                variant="default"
                onClick={() => {
                  setEditConsultantModalOpened(false);
                  setSelectedConsultant(null);
                  resetConsultantForm();
                }}
              >
                İptal
              </Button>
              <Button
                color="blue"
                onClick={handleUpdateConsultant}
                loading={consultantLoading}
              >
                Update
              </Button>
            </Group>
          </div>
        </Modal>

        {/* Delete Consultant Confirmation Modal */}
        <Modal
          opened={deleteConsultantModalOpened}
          onClose={() => {
            setDeleteConsultantModalOpened(false);
            setConsultantToDelete(null);
          }}
          title={
            <Text fw={600} color="red">
              Delete Consultant
            </Text>
          }
          centered
        >
          <div className="py-4">
            <Text size="sm" color="dimmed" mb="md">
              Are you sure you want to delete this consultant? This action
              cannot be undone.
            </Text>
            {consultantToDelete && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                {consultantToDelete.image && (
                  <Avatar
                    src={consultantToDelete.image}
                    alt={consultantToDelete.name}
                    size="lg"
                    radius="xl"
                  />
                )}
                <div>
                  <Text size="sm" fw={500}>
                    {consultantToDelete.name}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {consultantToDelete.title}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {consultantToDelete.email}
                  </Text>
                </div>
              </div>
            )}
            <Group justify="flex-end" mt="xl">
              <Button
                variant="default"
                onClick={() => {
                  setDeleteConsultantModalOpened(false);
                  setConsultantToDelete(null);
                }}
              >
                İptal
              </Button>
              <Button
                color="red"
                onClick={confirmDeleteConsultant}
                loading={consultantLoading}
              >
                Sil
              </Button>
            </Group>
          </div>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminPanel;
