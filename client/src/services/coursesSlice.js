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
    const response = await axios.get(`/courses/id/${id}`);
    return response.data;
  }
);

export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async ({ toast, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/courses/add", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return response.data.course;
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      }
      return rejectWithValue([
        { msg: error.response?.data?.message || "An error occurred" },
      ]);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ toast, data, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/courses/update/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return response.data.course;
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      }
      return rejectWithValue([
        { msg: error.response?.data?.message || "An error occurred" },
      ]);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async ({ toast, id }) => {
    try {
      const response = await axios.delete(`/courses/delete/${id}`);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return id;
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return error.response.data.message;
    }
  }
);

export const searchCourse = createAsyncThunk(
  "courses/searchCourse",
  async (searchTerm) => {
    const response = await axios.get(
      `/courses/search?searchTerm=${searchTerm}`
    );
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
      })
      .addCase(addCourse.pending, (state) => {
        state.status.courses = "loading";
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.status.courses = "succeeded";
        state.allCourses.unshift(action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.status.courses = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCourse.pending, (state) => {
        state.status.courses = "loading";
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.status.courses = "succeeded";
        const index = state.allCourses.findIndex(
          (course) => course.id === action.payload.id
        );
        state.allCourses[index] = action.payload;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.status.courses = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.status.courses = "loading";
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.status.courses = "succeeded";
        state.allCourses = state.allCourses.filter(
          (course) => course.id !== action.payload
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.status.courses = "failed";
        state.error = action.error.message;
      })
      .addCase(searchCourse.pending, (state) => {
        state.status.courses = "loading";
      })
      .addCase(searchCourse.fulfilled, (state, action) => {
        state.status.courses = "succeeded";
        state.allCourses = action.payload;
      })
      .addCase(searchCourse.rejected, (state, action) => {
        state.status.courses = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAllCourses = (state) => state.courses.allCourses;
export const getCourseById = (state) => state.courses.courseById;
export const getStatus = (state) => state.allCourses.status;
export const getError = (state) => state.allCourses.error;

export default coursesSlice.reducer;
