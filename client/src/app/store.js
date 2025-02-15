import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice";
import usersReducer from "../services/usersSlice";
import notificationReducer from "../services/notificationSlice";
import studentReducer from "../services/studentSlice";
import subjectReducer from "../services/subjectSlice";
import courseReducer from "../services/coursesSlice";
import schoolYearReducer from "../services/schoolYearSlice";
import classReducer from "../services/classSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    notification: notificationReducer,
    students: studentReducer,
    subjects: subjectReducer,
    courses: courseReducer,
    schoolYears: schoolYearReducer,
    classes: classReducer,
  },
});
