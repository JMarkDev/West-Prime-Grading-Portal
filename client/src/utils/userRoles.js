import rolesList from "../constants/rolesList";

export const getUserRole = (role) => {
  let userRole;

  switch (role) {
    case rolesList.admin:
      userRole = "City Treasurer";
      break;
    case rolesList.supervisor:
      userRole = "Slaughter Admin";
      break;

    default:
      break;
  }
  return userRole;
};
