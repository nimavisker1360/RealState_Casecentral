import { useState } from "react";
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
} from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate } from "react-router-dom";
import AddLocation from "../components/AddLocation";
import UploadImage from "../components/UploadImage";
import BasicDetails from "../components/BasicDetails";
import Facilities from "../components/Facilities";
import useAdmin from "../hooks/useAdmin";
import { MdDashboard, MdAddHome, MdList } from "react-icons/md";

const AdminPanel = () => {
  const [active, setActive] = useState(0);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

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
    userEmail: user?.email,
  });

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
          <p className="text-gray-600">در حال بارگذاری...</p>
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
            دسترسی غیرمجاز
          </Title>
          <Text color="dimmed" className="mb-4">
            شما مجوز دسترسی به پنل مدیریت را ندارید.
          </Text>
          <Button onClick={() => navigate("/")} color="gray">
            بازگشت به صفحه اصلی
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
                  پنل مدیریت
                </Title>
                <Text size="sm" color="dimmed">
                  خوش آمدید، {user?.name || user?.email}
                </Text>
              </div>
            </div>
            <Badge size="lg" color="green" variant="light">
              Admin
            </Badge>
          </div>
        </Paper>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Paper
            shadow="sm"
            p="lg"
            radius="md"
            className="cursor-pointer hover:shadow-md transition-shadow border-2 border-secondary"
          >
            <Group>
              <div className="bg-secondary/10 text-secondary p-3 rounded-full">
                <MdAddHome size={24} />
              </div>
              <div>
                <Text fw={600}>افزودن ملک جدید</Text>
                <Text size="sm" color="dimmed">
                  ثبت ملک جدید در سیستم
                </Text>
              </div>
            </Group>
          </Paper>

          <Paper
            shadow="sm"
            p="lg"
            radius="md"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/listing")}
          >
            <Group>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <MdList size={24} />
              </div>
              <div>
                <Text fw={600}>لیست املاک</Text>
                <Text size="sm" color="dimmed">
                  مشاهده تمام املاک ثبت شده
                </Text>
              </div>
            </Group>
          </Paper>
        </div>

        {/* Add Property Form */}
        <Paper shadow="sm" p="xl" radius="md">
          <div className="mb-6">
            <Title order={3} className="flex items-center gap-2 text-gray-800">
              <MdAddHome className="text-secondary" />
              ثبت ملک جدید
            </Title>
            <Text size="sm" color="dimmed" className="mt-1">
              اطلاعات ملک را در مراحل زیر وارد کنید
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
            <Stepper.Step label="موقعیت" description="آدرس و شهر">
              <div className="mt-6">
                <AddLocation
                  nextStep={nextStep}
                  propertyDetails={propertyDetails}
                  setPropertyDetails={setPropertyDetails}
                />
              </div>
            </Stepper.Step>

            <Stepper.Step label="تصاویر" description="آپلود عکس">
              <div className="mt-6">
                <UploadImage
                  prevStep={prevStep}
                  nextStep={nextStep}
                  propertyDetails={propertyDetails}
                  setPropertyDetails={setPropertyDetails}
                />
              </div>
            </Stepper.Step>

            <Stepper.Step label="جزئیات" description="مشخصات اصلی">
              <div className="mt-6">
                <BasicDetails
                  prevStep={prevStep}
                  nextStep={nextStep}
                  propertyDetails={propertyDetails}
                  setPropertyDetails={setPropertyDetails}
                />
              </div>
            </Stepper.Step>

            <Stepper.Step label="امکانات" description="تعداد اتاق‌ها">
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
                  ملک با موفقیت ثبت شد!
                </Title>
                <Text color="dimmed" className="mb-6">
                  ملک جدید به لیست املاک اضافه شد و در سایت نمایش داده می‌شود.
                </Text>
                <Group position="center">
                  <Button onClick={resetForm} color="green">
                    ثبت ملک جدید
                  </Button>
                  <Button
                    onClick={() => navigate("/listing")}
                    variant="outline"
                  >
                    مشاهده لیست املاک
                  </Button>
                </Group>
              </div>
            </Stepper.Completed>
          </Stepper>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminPanel;
