import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice";
import usersReducer from "../services/usersSlice";
import notificationReducer from "../services/notificationSlice";
import animalReducer from "../services/animalsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    notification: notificationReducer,
    animals: animalReducer,
  },
});
