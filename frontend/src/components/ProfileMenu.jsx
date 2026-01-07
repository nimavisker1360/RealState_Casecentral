import { Avatar, Menu, Divider } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAdmin from "../hooks/useAdmin";
import { MdDashboard } from "react-icons/md";

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();

  return (
    <Menu>
      <Menu.Target>
        <Avatar
          src={user?.picture}
          alt="user image"
          radius={"xl"}
          className="cursor-pointer"
        />
      </Menu.Target>
      <Menu.Dropdown>
        {/* Admin Section - Only visible for admins */}
        {!loading && isAdmin && (
          <>
            <Menu.Label>Admin</Menu.Label>
            <Menu.Item
              leftSection={<MdDashboard size={16} />}
              onClick={() => navigate("/admin", { replace: true })}
              color="green"
            >
              پنل مدیریت
            </Menu.Item>
            <Divider my="xs" />
          </>
        )}

        <Menu.Label>Application</Menu.Label>
        <Menu.Item onClick={() => navigate("./favourites", { replace: true })}>
          Favourites
        </Menu.Item>
        <Menu.Item onClick={() => navigate("./bookings", { replace: true })}>
          Bookings
        </Menu.Item>
        <Menu.Label>Go back</Menu.Label>
        <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

ProfileMenu.propTypes = {
  user: PropTypes.shape({
    picture: PropTypes.string,
  }),
  logout: PropTypes.func.isRequired,
};

export default ProfileMenu;
