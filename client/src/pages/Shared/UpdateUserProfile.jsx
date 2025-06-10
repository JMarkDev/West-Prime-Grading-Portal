import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUser, getUserData, logoutUser } from "../../services/authSlice";
import Profile from "../../components/profile_image/Profile";
import api from "../../api/axios";
import { useToast } from "../../hooks/useToast";
import Loading from "../../components/loader/loginloader/LoginLoading";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useForm } from "react-hook-form";

const UserProfile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const userData = useSelector(getUserData);
  const { register, handleSubmit, setValue } = useForm();

  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPass, setShowPass] = useState(false);
  const [edit, setEdit] = useState(true);

  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );

  const [data, setData] = useState({
    image: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    birthDate: "",
    email: "",
    role: "",
    contactNumber: "",
    address: "",
  });

  const id = userData?.id;

  useEffect(() => {
    if (userData) {
      setData(userData);
      setFullName(
        `${userData.firstName} ${userData.middleInitial}. ${userData.lastName}`
      );
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setValue("image", userData.image);
      setValue("firstName", userData.firstName);
      setValue("middleInitial", userData.middleInitial);
      setValue("lastName", userData.lastName);
      setValue("email", userData.email);
      setValue("contactNumber", userData.contactNumber);
      setValue("address", userData.address);
      if (userData.image) {
        setProfilePic(`${api.defaults.baseURL}${userData.image}`);
      }
    }
  }, [setValue, userData]);

  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("middleInitial", data.middleInitial);
    formData.append("email", data.email);
    formData.append("contactNumber", data.contactNumber);
    formData.append("address", data.address);
    formData.append("image", data.image); // Append the file

    try {
      const response = await api.put(
        `/users/update-profile/id/${id}`,
        formData
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        dispatch(fetchUser());
        setLoader(false);
        setTimeout(() => {
          setEdit(true);
        }, 1000);
      }
    } catch (error) {
      console.log(error.response);
      // toast.error(error.response.data.message);
    }
  };

  const changePassword = async () => {
    setLoader(true);
    const data = {
      oldPassword: password,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    try {
      const response = await api.put(`/users/update-password/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setActiveTab("profile");
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <div className="flex text-sm flex-col md:flex-row w-full gap-5">
        <div className="flex flex-col gap-3 justify-center items-center p-4 bg-white border border-gray-300 shadow-lg min-w-[250px] h-fit rounded-lg">
          {loader && <Loading />}
          {edit ? (
            <img className="w-32 h-32 rounded-full" src={profilePic} alt="" />
          ) : (
            <Profile image={data.image} setValue={setValue} />
          )}
          <h1 className="font-bold text-lg text-gray-800 text-center">
            {fullName}
          </h1>
          <span className="text-gray-700 md:text-md text-sm ">
            {data?.email}
          </span>
        </div>
        <div className="flex  flex-col flex-grow sm:border md:border-gray-300 md:shadow-lg rounded-lg">
          <ul className="flex gap-2 md:border md:border-gray-300 w-full h-12 items-center p-4 ">
            <li
              className={`cursor-pointer  text-sm text-nowrap px-2 py-1 rounded-md ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile info
            </li>
            <li
              className={`cursor-pointer  text-sm text-nowrap px-2 py-1 rounded-md  ${
                activeTab === "password"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Change password
            </li>
            <div className="ml-auto">
              <li
                className="cursor-pointer text-sm text-nowrap px-2 py-1 rounded-md bg-red-600 text-white"
                onClick={handleLogout}
              >
                Logout
              </li>
            </div>
          </ul>
          <div className="p-4 text-gray-600">
            {/* {activeTab === "profile" && (
              <div className="flex text-lg uppercase flex-col gap-3">
                <div>
                  <h1 className="text-lg uppercase text-gray-900 ">
                    STUDENT ID:{" "}
                    <span className="font-semibold">{userData?.studentId}</span>
                  </h1>
                  <h1 className="  text-gray-900 ">
                    STUDENT NAME:{" "}
                    <span className="font-semibold">
                      {`${userData?.lastName}, ${userData?.firstName} ${userData?.middleInitial}.`}
                    </span>
                  </h1>
                  <h1 className="  text-gray-900 ">
                    ADDRESS:{" "}
                    <span className="font-semibold">{userData?.address}</span>
                  </h1>
                  <h1 className="  text-gray-900 ">
                    COURSE:{" "}
                    <span className="font-semibold">{userData?.address}</span>
                  </h1>
                  <h1 className="  text-gray-900 ">
                    YEAR LEVEL:{" "}
                    <span className="font-semibold">
                      {userData?.student.yearLevel}
                    </span>
                  </h1>
                  <h1 className="  text-gray-900 ">
                    EMAIL:{" "}
                    <span className="font-semibold">{userData?.email}</span>
                  </h1>
                </div>
                <div className="flex  justify-end">
                  {edit ? (
                    <button
                      onClick={() => setEdit(!edit)}
                      type="button"
                      className="w-fit text-sm mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit(onSubmit)}
                      type="button"
                      className="w-fit text-sm mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Save Profile
                    </button>
                  )}
                </div>
              </div>
            )} */}

            {activeTab === "profile" && (
              <div className="flex flex-col gap-3">
                {userData?.student?.studentId && (
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor=""
                      className="font-semibold  text-gray-700 w-1/4"
                    >
                      Student ID:
                    </label>
                    <input
                      value={`${userData?.student.studentId}` || ""}
                      disabled={true}
                      className="rounded-lg cursor-not-allowed border bg-gray-200 border-gray-200 flex-grow p-2 border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      type="text"
                    />
                  </div>
                )}

                <div className="flex  items-center gap-5">
                  <label
                    htmlFor=""
                    className="font-semibold  text-gray-700 w-1/4"
                  >
                    Full name:
                  </label>
                  <input
                    value={
                      `${userData?.lastName}, ${userData?.firstName} ${userData?.middleInitial}.` ||
                      ""
                    }
                    disabled={true}
                    className="rounded-lg cursor-not-allowed border bg-gray-200 border-gray-200 flex-grow p-2 border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                  />
                </div>
                {userData?.student?.course && (
                  <div className="flex  items-center gap-5">
                    <label
                      htmlFor=""
                      className="font-semibold  text-gray-700 w-1/4"
                    >
                      Course:
                    </label>
                    <input
                      value={`${userData?.student?.course}` || ""}
                      disabled={true}
                      className="rounded-lg cursor-not-allowed border bg-gray-200 border-gray-200 flex-grow p-2 border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      type="text"
                    />
                  </div>
                )}

                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="font-semibold  text-gray-700 w-1/4"
                  >
                    Contact number:
                  </label>
                  <input
                    {...register("contactNumber")}
                    className="rounded-lg border  bg-gray-200 border-gray-200 flex-grow p-2  border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                    disabled={edit ? true : false}
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    Email Address:
                  </label>
                  <input
                    {...register("email")}
                    className="rounded-lg border  bg-gray-200 border-gray-200 flex-grow p-2  border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                    disabled={edit ? true : false}
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    Address:
                  </label>
                  <input
                    {...register("address")}
                    className="rounded-lg border  bg-gray-200 border-gray-200 flex-grow p-2 border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                    disabled={edit ? true : false}
                  />
                </div>

                <div className="flex  justify-end">
                  {edit ? (
                    <button
                      onClick={() => setEdit(!edit)}
                      type="button"
                      className="w-fit mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit(onSubmit)}
                      type="button"
                      className="w-fit mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Save Profile
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4 font-semibold text-gray-700"
                  >
                    Old password
                  </label>
                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter old password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4 font-semibold text-gray-700"
                  >
                    New password
                  </label>
                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter new password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4  font-semibold text-gray-700"
                  >
                    Confirm password
                  </label>

                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter new password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => changePassword()}
                    className="w-fit mt-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg p-2"
                  >
                    Change password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
