import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async () => {
    const response = await axios.get("/courses/all");
    return response.data;
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id) => {
    const response = await axios.get(`/courses/${id}`);
    return response.data;
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    allCourses: [],
    courseById: null,
    status: {
      courses: "idle",
      courseById: "idle",
    },
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status.courses = "loading";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status.courses = "succeeded";
        state.allCourses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status.courses = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.status.courseById = "loading";
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status.courseById = "succeeded";
        state.courseById = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status.courseById = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAllCourses = (state) => state.courses.allCourses;
export const getCourseById = (state) => state.courses.courseById;
export default coursesSlice.reducer;
