import { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../context/UserDetailContext";
import { checkAdmin } from "../utils/api";

const useAdmin = () => {
  const { user, isAuthenticated } = useAuth0();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (isAuthenticated && user?.email && token) {
        try {
          const result = await checkAdmin(user.email, token);
          setIsAdmin(result.isAdmin);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    fetchAdminStatus();
  }, [isAuthenticated, user?.email, token]);

  return { isAdmin, loading };
};

export default useAdmin;

