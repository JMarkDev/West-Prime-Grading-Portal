import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../services/authSlice";
import "./otp.css";
import sentImage from "../../assets/images/send-email.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import LoginLoading from "../../components/loader/loginloader/LoginLoading";
import { useToast } from "../../hooks/useToast";
import "react-toastify/dist/ReactToastify.css";
import rolesList from "../../constants/rolesList";
import Cookies from "js-cookie";
const VerifyOTP = ({ email, closeOTP, closeModal, onVerificationSuccess }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(0);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      // Ensuring only digits are entered
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Automatically focus the next input if a digit is entered
      if (value && index < 3) {
        document.getElementById(`otp-input${index + 2}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    setLoading(true);
    e.preventDefault();

    const data = {
      email: email,
      otp: otp.join(""),
    };
    try {
      const response = await api.post("/auth/verify-otp", data, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        // fetch the latest added data
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }

        const accessToken = response.data?.accessToken;

        toast.success(response.data.message);
        if (accessToken) {
          console.log("accessToken", accessToken);

          Cookies.set("accessToken", accessToken, { expires: 1 });
          dispatch(fetchUser());
          // Set the access token in the axios headers
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          const role = response.data.role;
          let path = "/";
          switch (role) {
            case rolesList.admin:
              path = "/admin-dashboard";
              break;
            case rolesList.supervisor:
              path = "/slaughterhouse-dashboard";
              break;
            default:
              break;
          }

          navigate(path);
        }
        closeOTP();
        closeModal(false);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/resend-otp", { email: email });
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setCountDown(60);
        setLoading(false);
        setErrorMessage("");
        setOtp(new Array(4).fill(""));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => setCountDown(countDown - 1), 1000);
    }
  }, [countDown]);

  const disableSubmit = otp.includes("") || otp.length < 4;
  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        className="fixed inset-0 z-[40] px-5 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
      >
        {loading && <LoginLoading />}

        <form className="otp-Form" onSubmit={handleSubmit}>
          <span className="mainHeading">Enter OTP</span>
          <img src={sentImage} alt="" className="w-32" />
          <p className="otpSubheading">
            Please enter the 4 digit OTP sent to <span>{email}</span>
          </p>
          <div className="inputContainer">
            {otp.map((digit, index) => (
              <input
                key={index}
                required
                maxLength="1"
                type="text"
                className="otp-input"
                id={`otp-input${index + 1}`}
                value={digit}
                onChange={(e) => handleChange(e, index)}
              />
            ))}
          </div>
          {errorMessage && (
            <span className="text-red-600 text-sm">{errorMessage}</span>
          )}

          <button
            disabled={disableSubmit ? true : false}
            className={`bg-main  text-white hover:bg-main_hover w-full p-2.5 rounded-lg ${
              disableSubmit ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            type="submit"
          >
            Verify
          </button>
          <button className="exitBtn" type="button" onClick={closeOTP}>
            ×
          </button>
          <p className="resendNote">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              className={`text-main font-bold ${
                countDown > 0 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              type="button"
              disabled={countDown > 0}
            >
              {`${
                countDown > 0 ? `Resend code in ${countDown}s` : "Resend Code"
              }`}
            </button>
          </p>
        </form>
      </div>
    </>
  );
};

VerifyOTP.propTypes = {
  email: PropTypes.string.isRequired,
  closeOTP: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  onVerificationSuccess: PropTypes.func,
};

export default VerifyOTP;
