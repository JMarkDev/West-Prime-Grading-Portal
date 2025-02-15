import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    const response = await axios.get("/students/all");
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async ({ id, toast }) => {
    const response = await axios.delete(`/students/delete/${id}`);

    if (response.data.status === "success") {
      toast.success(response.data.message);
      return id;
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (id) => {
    const response = await axios.get(`/students/${id}`);
    return response.data;
  }
);

export const filterStudents = createAsyncThunk(
  "students/filterStudents",
  async ({ name, course, yearLevel, schoolYear }) => {
    try {
      const queryParams = new URLSearchParams();

      if (name) {
        queryParams.append("name", name);
      }
      if (course) {
        queryParams.append("course", course);
      }
      if (yearLevel) {
        queryParams.append("yearLevel", yearLevel);
      }

      if (schoolYear) {
        queryParams.append("schoolYear", schoolYear);
      }

      const response = await axios.get(`/students/filter?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
    }
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
      })
      .addCase(deleteStudent.pending, (state) => {
        state.status.students = "loading";
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.status.students = "succeeded";
        state.allStudents = state.allStudents.filter(
          (student) => student.id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status.students = "failed";
        state.error = action.error.message;
      })
      .addCase(filterStudents.pending, (state) => {
        state.status.students = "loading";
      })
      .addCase(filterStudents.fulfilled, (state, action) => {
        state.status.students = "succeeded";
        state.allStudents = action.payload;
      })
      .addCase(filterStudents.rejected, (state, action) => {
        state.status.students = "failed";
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;
export const getAllStudents = (state) => state.students.allStudents;
export const getStudentById = (state) => state.students.studentById;
