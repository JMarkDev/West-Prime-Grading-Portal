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
    const response = await axios.get(`/subjects/id/${id}`);
    return response.data;
  }
);

export const addSubject = createAsyncThunk(
  "subjects/addSubject",
  async ({ toast, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/subjects/add", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return response.data.subject;
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

export const updateSubject = createAsyncThunk(
  "subjects/updateSubject",
  async ({ toast, data, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/subjects/update/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        console.log(response.data.subject);
        return response.data.subject;
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

export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async ({ toast, id }) => {
    try {
      const response = await axios.delete(`/subjects/delete/${id}`);
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

export const searchSubject = createAsyncThunk(
  "subjects/searchSubject",
  async (searchTerm) => {
    const response = await axios.get(
      `/subjects/search?searchTerm=${searchTerm}`
    );
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
      })
      .addCase(addSubject.pending, (state) => {
        state.status.subjectById = "loading";
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.status.subjectById = "succeeded";
        state.allSubjects.unshift(action.payload);
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.status.subjectById = "failed";
        state.error = action.payload;
      })
      .addCase(updateSubject.pending, (state) => {
        state.status.subjectById = "loading";
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.status.subjectById = "succeeded";
        const index = state.allSubjects.findIndex(
          (subject) => subject.id === action.payload.id
        );
        state.allSubjects[index] = action.payload;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.status.subjectById = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSubject.pending, (state) => {
        state.status.subjectById = "loading";
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.status.subjectById = "succeeded";
        state.allSubjects = state.allSubjects.filter(
          (subject) => subject.id !== action.payload,
          console.log(action.payload)
        );
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.status.subjectById = "failed";
        state.error = action.payload;
      })
      .addCase(searchSubject.pending, (state) => {
        state.status.subjects = "loading";
      })
      .addCase(searchSubject.fulfilled, (state, action) => {
        state.status.subjects = "succeeded";
        state.allSubjects = action.payload;
      })
      .addCase(searchSubject.rejected, (state, action) => {
        state.status.subjects = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAllSubjects = (state) => state.subjects.allSubjects;
export const getSubjectById = (state) => state.subjects.subjectById;
export const getStatus = (state) => state.subjects.status;
export const getError = (state) => state.subjects.error;

export default subjectSlice.reducer;
