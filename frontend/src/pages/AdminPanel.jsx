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
import UserDetailContext from "../context/UserDetailContext";
import { getAdminAllBookings, deleteResidency } from "../utils/api";
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
} from "react-icons/md";

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
  const { data: properties, isLoading: propertiesLoading, refetch: refetchProperties } = useProperties();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      toast.success("Delete operation completed successfully!", { position: "bottom-right" });
      setDeleteModalOpened(false);
      setPropertyToDelete(null);
      refetchProperties();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <Text fw={600}>Yeni Mülk Ekle</Text>
                <Text size="sm" color="dimmed">
                  Sisteme yeni mülk kaydet
                </Text>
              </div>
            </Group>
          </Paper>

          <Paper
            shadow="sm"
            p="lg"
            radius="md"
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              activeTab === "bookings" ? "border-2 border-orange-500" : ""
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            <Group>
              <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                <MdEventNote size={24} />
              </div>
              <div>
                <Text fw={600}>Kullanıcı Rezervasyonları</Text>
                <Text size="sm" color="dimmed">
                  {totalBookings} aktif rezervasyon
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
                <Text fw={600}>Mülk Listesi</Text>
                <Text size="sm" color="dimmed">
                  {properties?.length || 0} kayıtlı mülk
                </Text>
              </div>
            </Group>
          </Paper>
        </div>

        {/* Bookings Section */}
        {activeTab === "bookings" && (
          <Paper shadow="sm" p="xl" radius="md" className="mb-6">
            <div className="flexBetween mb-6">
              <div>
                <Title
                  order={3}
                  className="flex items-center gap-2 text-gray-800"
                >
                  <MdEventNote className="text-orange-500" />
                  Kullanıcı Rezervasyonları
                </Title>
                <Text size="sm" color="dimmed" className="mt-1">
                  Kullanıcılar tarafından yapılan tüm rezervasyonların listesi
                </Text>
              </div>
              <Button
                variant="light"
                color="orange"
                leftSection={<MdRefresh size={18} />}
                onClick={fetchBookings}
                loading={bookingsLoading}
              >
                Yenile
              </Button>
            </div>

            <Divider className="mb-6" />

            {bookingsLoading ? (
              <div className="flexCenter py-12">
                <Loader color="orange" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <MdEventNote size={64} className="text-gray-300 mx-auto mb-4" />
                <Text color="dimmed">
                  Henüz kayıtlı rezervasyon bulunmamaktadır
                </Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Kullanıcı</Table.Th>
                      <Table.Th>Mülk</Table.Th>
                      <Table.Th>Konum</Table.Th>
                      <Table.Th>Ziyaret Tarihi</Table.Th>
                      <Table.Th>İşlemler</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {bookings.map((booking) => (
                      <Table.Tr key={booking.bookingId}>
                        <Table.Td>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={booking.user.image}
                              alt={booking.user.name}
                              radius="xl"
                              size="sm"
                            />
                            <div>
                              <Text size="sm" fw={500}>
                                {booking.user.name || "İsimsiz"}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {booking.user.email}
                              </Text>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-3">
                            {booking.property.image && (
                              <img
                                src={booking.property.image}
                                alt={booking.property.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <Text size="sm" fw={500}>
                                {booking.property.title}
                              </Text>
                              {booking.property.price && (
                                <Text size="xs" color="dimmed">
                                  ${booking.property.price.toLocaleString()}
                                </Text>
                              )}
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-1">
                            <MdHome size={16} className="text-gray-400" />
                            <Text size="sm">
                              {booking.property.city},{" "}
                              {booking.property.country}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-2">
                            <MdCalendarToday
                              size={16}
                              className="text-orange-500"
                            />
                            <Badge color="orange" variant="light">
                              {booking.date}
                            </Badge>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            variant="subtle"
                            size="xs"
                            onClick={() =>
                              navigate(`/listing/${booking.property.id}`)
                            }
                          >
                            Mülkü Görüntüle
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}

            {/* Bookings Summary */}
            {bookings.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Text size="sm" color="dimmed">
                    Toplam rezervasyon: {totalBookings} rezervasyon
                  </Text>
                </div>
              </div>
            )}
          </Paper>
        )}

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
                  Mülk Listesi
                </Title>
                <Text size="sm" color="dimmed" className="mt-1">
                  Tüm kayıtlı mülkleri görüntüle, düzenle veya sil
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
                <Text color="dimmed">
                  Henüz kayıtlı mülk bulunmamaktadır
                </Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Mülk</Table.Th>
                      <Table.Th>Konum</Table.Th>
                      <Table.Th>Fiyat</Table.Th>
                      <Table.Th>Tür</Table.Th>
                      <Table.Th>Olanaklar</Table.Th>
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
                              <Text size="xs" color="dimmed" lineClamp={1} maw={200}>
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
                            ${property.price?.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={property.propertyType === "sale" ? "green" : "blue"}
                            variant="light"
                          >
                            {property.propertyType === "sale" ? "Satılık" : "Kiralık"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" color="dimmed">
                            {property.facilities?.bedrooms || 0} Yatak •{" "}
                            {property.facilities?.bathrooms || 0} Banyo •{" "}
                            {property.facilities?.parkings || 0} Otopark
                          </Text>
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
                              onClick={() => navigate(`/listing/${property.id}`)}
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
                    Toplam: {properties.length} mülk
                  </Text>
                  <div className="flex gap-4">
                    <Text size="sm" color="dimmed">
                      Satılık:{" "}
                      {properties.filter((p) => p.propertyType === "sale").length}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Kiralık:{" "}
                      {properties.filter((p) => p.propertyType === "rent").length}
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
                Yeni Mülk Kaydet
              </Title>
              <Text size="sm" color="dimmed" className="mt-1">
                Aşağıdaki adımlarda mülk bilgilerini girin
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
                    Mülk başarıyla kaydedildi!
                  </Title>
                  <Text color="dimmed" className="mb-6">
                    Yeni mülk listeye eklendi ve sitede görüntülenecektir.
                  </Text>
                  <Group position="center">
                    <Button onClick={resetForm} color="green">
                      Yeni Mülk Kaydet
                    </Button>
                    <Button
                      onClick={() => navigate("/listing")}
                      variant="outline"
                    >
                      Mülk Listesini Görüntüle
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
              Mülkü Sil
            </Text>
          }
          centered
        >
          <div className="py-4">
            <Text size="sm" color="dimmed" mb="md">
              Bu mülkü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
                    ${propertyToDelete.price?.toLocaleString()}
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
              <Button color="red" onClick={confirmDelete} loading={deleteLoading}>
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
