import { useContext, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../utils/api";
import useFavourites from "../hooks/useFavourites.jsx";
import useBookings from "../hooks/useBookings.jsx";

const Layout = () => {
  useFavourites();
  useBookings();

  const { isAuthenticated, user, getIdTokenClaims } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: ({ userData, token }) => createUser(userData, token),
  });

  useEffect(() => {
    const getTokenAndRegister = async () => {
      try {
        console.log("🔑 Layout: Getting ID token for", user?.email);
        const claims = await getIdTokenClaims();
        const token = claims?.__raw;

        if (token) {
          localStorage.setItem("access_token", token);
          setUserDetails((prev) => ({ ...prev, token: token }));
          console.log("✅ Layout: ID Token received");

          // Send user data to database
          const userData = {
            email: user.email,
            name: user.name,
            image: user.picture,
          };
          console.log("📤 Layout: Registering user to database", userData);
          mutate({ userData, token: token });
        }
      } catch (error) {
        console.error("❌ Layout: Failed to get token", error.message);
      }
    };

    if (isAuthenticated && user?.email) {
      getTokenAndRegister();
    }
  }, [isAuthenticated, user, getIdTokenClaims, mutate, setUserDetails]);

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col">
      <div className="flex-1">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
