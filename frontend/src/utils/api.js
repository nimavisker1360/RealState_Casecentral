import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://casecentral-yt-backend.vercel.app//api",
});

export const getAllProperties = async () => {
  try {
    const response = await api.get("/residency/allresd", {
      timeout: 10 * 1000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something's not right");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 1000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something's not right");
    throw error;
  }
};

export const createUser = async (userData, token) => {
  try {
    console.log("📤 Sending registration request to API for:", userData.email);
    const response = await api.post(`/user/register`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("📥 Registration API response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Registration API error:",
      error.response?.data || error.message
    );
    toast.error("Something's not right, Please Try again");
    throw error;
  }
};

export const bookVisit = async (date, propertyId, email, token) => {
  try {
    await api.post(
      `/user/bookVisit/${propertyId}`,
      {
        email,
        id: propertyId,
        date: dayjs(date).format("DD/MM/YYYY"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something's not right. Please try again.");
    throw error;
  }
};

export const removeBooking = async (id, email, token) => {
  try {
    await api.post(
      `/user/removeBooking/${id}`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something's not right. Please try again.");

    throw error;
  }
};

export const toFav = async (id, email, token) => {
  await api.post(
    `/user/toFav/${id}`,
    {
      email,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getAllFav = async (email, token) => {
  if (!token) return;
  try {
    const res = await api.post(
      `/user/allFav`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(res)
    return res.data["favResidenciesID"];
  } catch (e) {
    toast.error("Something went wrong while fetching favs");
    throw e;
  }
};

export const getAllBookings = async (email, token) => {
  if (!token) return;
  try {
    const res = await api.post(
      `/user/allBookings`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("res", res)
    return res.data["bookedVisits"];
  } catch (e) {
    toast.error("Something went wrong while fetching bookings");
    throw e;
  }
};

export const createResidency = async (data, token, userEmail) => {
  // Ensure userEmail is included in the data object
  const requestData = { ...data, userEmail };
  console.log("Sending residency data:", requestData);

  const response = await api.post(
    `/residency/create`,
    { data: requestData }, // Wrap in data object as backend expects req.body.data
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const checkAdmin = async (email, token) => {
  if (!token || !email) return { isAdmin: false };
  try {
    const res = await api.post(
      `/user/checkAdmin`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (e) {
    console.error("Error checking admin status:", e);
    return { isAdmin: false };
  }
};

// Get all bookings for admin panel
export const getAdminAllBookings = async (token) => {
  if (!token) return { totalBookings: 0, bookings: [] };
  try {
    const res = await api.get(`/user/admin/allBookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (e) {
    console.error("Error fetching all bookings:", e);
    return { totalBookings: 0, bookings: [] };
  }
};

// Update residency (admin)
export const updateResidency = async (id, data, token) => {
  try {
    const response = await api.put(
      `/residency/update/${id}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating residency:", error);
    toast.error("Mülk güncellenirken bir hata oluştu");
    throw error;
  }
};

// Delete residency (admin)
export const deleteResidency = async (id, token) => {
  try {
    const response = await api.delete(`/residency/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting residency:", error);
    toast.error("Mülk silinirken bir hata oluştu");
    throw error;
  }
};

// ============ CONSULTANT API FUNCTIONS ============

// Get all consultants
export const getAllConsultants = async () => {
  try {
    const response = await api.get("/consultant/all", {
      timeout: 10 * 1000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching consultants:", error);
    toast.error("Danışmanlar yüklenirken bir hata oluştu");
    throw error;
  }
};

// Get single consultant
export const getConsultant = async (id) => {
  try {
    const response = await api.get(`/consultant/${id}`, {
      timeout: 10 * 1000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching consultant:", error);
    throw error;
  }
};

// Create consultant (admin)
export const createConsultant = async (data, token) => {
  try {
    const response = await api.post(
      `/consultant/create`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating consultant:", error);
    toast.error("Danışman eklenirken bir hata oluştu");
    throw error;
  }
};

// Update consultant (admin)
export const updateConsultant = async (id, data, token) => {
  try {
    const response = await api.put(
      `/consultant/update/${id}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating consultant:", error);
    toast.error("Danışman güncellenirken bir hata oluştu");
    throw error;
  }
};

// Delete consultant (admin)
export const deleteConsultant = async (id, token) => {
  try {
    const response = await api.delete(`/consultant/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting consultant:", error);
    toast.error("Danışman silinirken bir hata oluştu");
    throw error;
  }
};

// Toggle consultant availability (admin)
export const toggleConsultantAvailability = async (id, token) => {
  try {
    const response = await api.patch(
      `/consultant/toggle/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling consultant availability:", error);
    toast.error("Danışman durumu değiştirilirken bir hata oluştu");
    throw error;
  }
};

// ============ USER PROFILE API FUNCTIONS ============

// Get user profile
export const getUserProfile = async (email, token) => {
  if (!token || !email) return null;
  try {
    const response = await api.post(
      `/user/profile`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (profileData, token) => {
  if (!token) throw new Error("No token provided");
  try {
    const response = await api.put(`/user/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Profil güncellenirken bir hata oluştu");
    throw error;
  }
};

// Get all users (admin only)
export const getAllUsers = async (token) => {
  if (!token) return { totalUsers: 0, users: [] };
  try {
    const response = await api.get(`/user/admin/allUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { totalUsers: 0, users: [] };
  }
};
