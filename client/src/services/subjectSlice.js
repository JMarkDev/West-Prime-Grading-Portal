import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async () => {
    const response = await axios.get("/subjects/all");
    return response.data;
  }
);

export const fetchSubjectById = createAsyncThunk(
  "subjects/fetchSubjectById",
  async (id) => {
    const response = await axios.get(`/subjects/${id}`);
    return response.data;
  }
);

const subjectSlice = createSlice({
  name: "subjects",
  initialState: {
    allSubjects: [],
    subjectById: null,
    status: {
      subjects: "idle",
      subjectById: "idle",
    },
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.status.subjects = "loading";
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.status.subjects = "succeeded";
        state.allSubjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.status.subjects = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSubjectById.pending, (state) => {
        state.status.subjectById = "loading";
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.status.subjectById = "succeeded";
        state.subjectById = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.status.subjectById = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAllSubjects = (state) => state.subjects.allSubjects;
export const getSubjectById = (state) => state.subjects.subjectById;
export default subjectSlice.reducer;
