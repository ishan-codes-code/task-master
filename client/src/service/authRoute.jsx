import { useMyContext } from "../context/Context";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children, redirectTo, forLogedIn }) => {
  const { accessToken } = useMyContext();

  if (forLogedIn) {
    return accessToken ? <Navigate to={redirectTo} /> : children;
  } else {
    return !accessToken ? <Navigate to={redirectTo} /> : children;
  }
};
export default AuthRoute;
