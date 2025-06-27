import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMyContext } from "../context/Context";
import { showError, showSuccess } from "./toaster";
import { attachToken, responseInterceptor } from "../service/apiService";

function Login() {
  const navigate = useNavigate();
  const { isMobile, accessToken, setAccessToken } = useMyContext();
  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  });

  const [showpass, setShowpass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        data,
        { withCredentials: true },
      );
      if (response.data.success) {
        showSuccess(response.data.message, isMobile);
        // console.log("Success:", response.data);
        // console.log(res.data.accessToken);
        //  console.log(res.data.email);
        // setTimeout(() => {
        //   // console.log(response.data.message);
        // }, 4000);
        setAccessToken(response.data.accessToken);
        attachToken(response.data.accessToken);
        responseInterceptor(setAccessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
          error.response.data.errors.forEach((err) => {
            showError(err, isMobile);
          });
        } else {
          showError(error.response.data.message, isMobile);
        }
        // console.log(error.response.data);
      }
      // console.error("Error:", error.message);
    }
  };
  // console.log(errors);
  Object.values(errors).forEach((error) => {
    showError(error?.message, isMobile);
  });
  // console.log(watch("example"));
  return (
    <div className="h-screen w-full flex justify-center items-center bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] items-center gap-5 p-6 sm:shadow-2xl"
      >
        <h2 className="font-bold text-2xl sm:text-3xl">Task Master</h2>
        <div className="w-full flex flex-col gap-2 justify-center">
          <label htmlFor="email">Email</label>
          <div className="w-full flex items-center gap-2 border border-[#ccc] p-2 rounded-lg focus-within:border-purple-600 transition-all duration-300 ">
            <MdOutlineAlternateEmail />
            <input
              className=" w-full bg-transparent outline-none p-1"
              placeholder="Enter your Email"
              id="email"
              {...register("email", {
                required: { value: true, message: "Email is required" },
              })}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 justify-center">
          <label htmlFor="pass">Password</label>
          <div className="w-full flex items-center gap-2 border border-[#ccc] p-2 rounded-lg focus-within:border-purple-600 transition-all duration-300">
            <IoLockClosedOutline />
            <input
              className=" w-full bg-transparent outline-none p-1"
              type={showpass ? "text" : "password"}
              placeholder="Enter your Password"
              id="pass"
              {...register("password", {
                required: { value: true, message: "Password is required" },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <div onClick={() => setShowpass((prev) => !prev)}>
              {showpass ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
        </div>
        {Object.values(errors).map((error, index) => {
          <p key={index}>{error.message}</p>;
        })}
        <button
          className="bg-purple-600 disabled:bg-purple-400 hover:bg-purple-700 active:bg-purple-800 w-full text-white px-3 py-2 rounded-[8px] shadow transition-all duration-300"
          disabled={isSubmitting}
          type="submit"
        >
          Sign In
        </button>
        <p>
          Don't have an account?
          <NavLink className="ml-2 text-purple-600" to="/signup">
            Sign Up
          </NavLink>
        </p>
      </form>
    </div>
  );
}
export default Login;
