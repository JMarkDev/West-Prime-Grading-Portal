import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    const response = await axios.get("/students/all");
    return response.data;
  }
);

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (id) => {
    const response = await axios.get(`/students/${id}`);
    return response.data;
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    allStudents: [],
    studentById: null,
    status: {
      students: "idle",
      studentById: "idle",
    },
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status.students = "loading";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status.students = "succeeded";
        state.allStudents = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status.students = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.status.studentById = "loading";
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.status.studentById = "succeeded";
        state.studentById = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.status.studentById = "failed";
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;
export const getAllStudents = (state) => state.students.allStudents;
export const getStudentById = (state) => state.students.studentById;
