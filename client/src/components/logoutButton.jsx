import { logout } from "../service/logout";
import { useMyContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "./toaster";

const LogoutButton = () => {
  const { isMobile, setAccessToken } = useMyContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(setAccessToken);
    showSuccess("Logged out successfully", isMobile);
    navigate("/login"); 
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
