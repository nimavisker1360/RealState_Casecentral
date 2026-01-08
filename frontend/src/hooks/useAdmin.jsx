import { useContext, useEffect, useState, useRef } from "react";
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
  const lastTokenRef = useRef(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      // Only fetch if we have a valid token and it's different from the last one we tried
      if (isAuthenticated && user?.email && token && token !== lastTokenRef.current) {
        lastTokenRef.current = token;
        setLoading(true);
        try {
          console.log("🔍 Checking admin status for:", user.email);
          const result = await checkAdmin(user.email, token);
          console.log("✅ Admin check result:", result);
          setIsAdmin(result.isAdmin);
        } catch (error) {
          console.error("❌ Error checking admin status:", error);
          // Don't set isAdmin to false on error - might be a temporary token issue
          // Only set to false if we get a definitive "not admin" response
          if (error.response?.status === 403) {
            setIsAdmin(false);
          }
          // On 401, the token might be refreshing, so keep current state
        }
        setLoading(false);
      } else if (!isAuthenticated) {
        setIsAdmin(false);
        setLoading(false);
      } else if (!token) {
        // Token not ready yet, keep loading
        setLoading(true);
      }
    };

    fetchAdminStatus();
  }, [isAuthenticated, user?.email, token]);

  return { isAdmin, loading };
};

export default useAdmin;


