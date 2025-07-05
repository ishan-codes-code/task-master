import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMyContext } from "../context/Context";
import { showError, showSuccess } from "./toaster";
import { API_BASE_URL } from "./item";

function Signup() {
  const { isMobile } = useMyContext();
  const [showpass, setShowpass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
      console.log("Success:", response.data);
      if (response.data.success) {
        showSuccess(response.data.message, isMobile);
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    } catch (error) {
      if (error.response) {
        // console.log(error.response.data);
        if (error.response.data.errors) {
          error.response.data.errors.forEach((err) => {
            showError(err, isMobile);
          });
        } else {
          showError(error.response.data.message, isMobile);
        }
      }
      // console.error("Error:", error.message);
    }
  };
  Object.values(errors).forEach((error) => {
    showError(error?.message, isMobile);
  });
  // console.log(watch("example"));
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex sm:border border-[#ccc] flex-col w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] items-center gap-5 p-6 sm:shadow-xl"
      >
        <h2 className="font-bold text-2xl sm:text-3xl">Task Master</h2>
        <div className="w-full flex flex-col gap-2 justify-center">
          <label htmlFor="name">Name</label>
          <div className="w-full flex items-center gap-2 border border-[#ccc] p-2 rounded-lg focus-within:border-[#0066ff] transition-all duration-300">
            <FaRegUser />
            <input
              {...register("name", {
                required: { value: true, message: "Name is required" },
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className=" w-full outline-none "
              placeholder="Enter your Name"
              id="name"
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 justify-center">
          <label htmlFor="email">Email</label>
          <div className="w-full flex items-center gap-2 border border-[#ccc] p-2 rounded-lg focus-within:border-[#0066ff] transition-all duration-300 ">
            <MdOutlineAlternateEmail />
            <input
              className=" w-full outline-none p-1"
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
          <div className="w-full flex items-center gap-2 border border-[#ccc] p-2 rounded-lg focus-within:border-[#0066ff] transition-all duration-300">
            <IoLockClosedOutline />
            <input
              className=" w-full outline-none p-1"
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
        <button
          className="bg-[#0066ff] disabled:bg-[#3385FF] hover:bg-[#0052CC] active:bg-[#003399] w-full text-white px-3 py-2 rounded-[8px] shadow transition-all duration-300"
          disabled={isSubmitting}
          type="submit"
        >
          Sign Up
        </button>
        <p>
          Already have an account?
          <NavLink className="ml-2 text-[#0066ff]" to="/login">
            Sign in
          </NavLink>
        </p>
      </form>
    </div>
  );
}
export default Signup;
