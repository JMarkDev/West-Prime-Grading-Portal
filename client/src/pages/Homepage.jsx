import landingImg from "../assets/images/westprime1.png";
import logo from "../assets/images/west_prime_logo-removebg-preview.png";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import rolesList from "../constants/rolesList";
import Cookies from "js-cookie";
import { fetchUser } from "../services/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../services/authSlice";

const Homepage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (user && accessToken) {
      if (user.role === rolesList.admin) {
        navigate("/admin-dashboard");
      } else if (user.role === rolesList.instructor) {
        navigate("/instructor-dashboard");
      } else {
        navigate("/view-grades");
      }
    }
  }, [navigate, user]);

  const handleLogin = async (e) => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");
    e.preventDefault();
    try {
      const data = {
        email: email,
        password: password,
      };

      const response = await api.post("/auth/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        const accessToken = response.data?.accessToken;

        toast.success(response.data.message);

        const role = response.data.role;

        let path = "";
        if (accessToken) {
          Cookies.set("accessToken", accessToken, { expires: 1 });
          dispatch(fetchUser());
          // Set the access token in the axios headers
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          if (role === rolesList.admin) {
            path = "/admin-dashboard";
          } else if (role === rolesList.instructor) {
            path = "/instructor-dashboard";
          } else {
            path = "/view-grades";
          }
          navigate(path);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          if (error.path === "email") {
            setEmailError(error.msg);
          } else if (error.path === "password") {
            setPasswordError(error.msg);
          }
        });
      }
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
      {/* Dark Overlay for Readability */}
      <div className="absolute w-full h-full bg-black bg-opacity-50 z-10"></div>

      {/* Background Image */}
      <img
        src={landingImg}
        alt="Landing Background"
        className="absolute w-full h-full object-cover z-0"
      />

      {/* Login Form */}
      <div className="absolute bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-xl p-8 w-11/12 max-w-md z-20">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="WestPrime Logo"
            className="w-24 h-auto drop-shadow-lg"
          />
        </div>

        <h3 className="text-3xl text-center text-white mb-6 font-semibold drop-shadow-lg">
          Login to Your Account
        </h3>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-lg mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className={`${
                emailError || errorMessage
                  ? "border-red-600"
                  : "border-gray-300"
              } w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-lg mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className={`${
                passwordError || errorMessage
                  ? "border-red-600"
                  : "border-gray-300"
              } w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter your password"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
          >
            {isLoading ? (
              <>
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* <div className="mt-4 text-center text-white text-sm">
          <p>
            Don't have an account?{" "}
            <a href="#" className="text-blue-300 hover:underline">
              Sign up
            </a>
          </p>
          <p>
            <a href="#" className="text-blue-300 hover:underline">
              Forgot Password?
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Homepage;
