import rolesList from "../constants/rolesList";

export const getUserRole = (role) => {
  let userRole;

  switch (role) {
    case rolesList.admin:
      userRole = "Admin";
      break;
    case rolesList.instructor:
      userRole = "Instructor";
      break;
    case rolesList.student:
      userRole = "Student";
      break;
    default:
      break;
  }
  return userRole;
};
