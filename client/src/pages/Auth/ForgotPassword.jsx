import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import LoginLoading from "../../components/loader/loginloader/LoginLoading";
import { useToast } from "../../hooks/useToast";
import { IoMdArrowRoundBack } from "react-icons/io";

const ForgotPassword = ({ handleForgotPassword }) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.put(
        `/auth/forgot-password/${data.email}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);

        setTimeout(() => {
          handleForgotPassword();
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoginLoading />}
      <div className="absolute bg-white text-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-xl p-8 w-11/12 max-w-md z-20">
        <div className="flex gap-5 rounded-t">
          <button onClick={handleForgotPassword} className="text-2xl font-bold">
            <IoMdArrowRoundBack />
          </button>
          <h1 className="md:text-2xl font-bold text-white text-lg">
            Forgot Password?
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-4 mt-4"
        >
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-white text-lg mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              className={`w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border ${
                errors.email ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-white text-lg mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border ${
                errors.newPassword ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="New password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-white text-lg mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
              className={`w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border ${
                errors.confirmPassword ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
          >
            {isLoading ? "Loading..." : "Change Password"}
          </button>
        </form>
      </div>
    </>
  );
};

ForgotPassword.propTypes = {
  handleForgotPassword: PropTypes.func,
};

export default ForgotPassword;
