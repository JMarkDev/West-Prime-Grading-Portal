import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSchoolYears = createAsyncThunk(
  "schoolYears/fetchSchoolYears",
  async () => {
    const response = await axios.get("/schoolYears/all");
    return response.data;
  }
);

export const fetchSchoolYearById = createAsyncThunk(
  "schoolYears/fetchSchoolYearById",
  async (id) => {
    const response = await axios.get(`/schoolYears/id/${id}`);
    return response.data;
  }
);

export const addSchoolYear = createAsyncThunk(
  "schoolYears/addSchoolYear",
  async ({ toast, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/schoolYears/create", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return response.data.newSchoolYear;
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

export const updateSchoolYear = createAsyncThunk(
  "schoolYears/updateSchoolYear",
  async ({ id, toast, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/schoolYears/update/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return response.data.schoolYearExist;
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

export const deleteSchoolYear = createAsyncThunk(
  "schoolYears/deleteSchoolYear",
  async ({ toast, id }) => {
    try {
      const response = await axios.delete(`/schoolYears/delete/${id}`);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return id;
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
);

export const searchSchoolYears = createAsyncThunk(
  "schoolYears/searchSchoolYears",
  async ({ schoolYear }) => {
    const response = await axios.get(
      `/schoolYears/search?schoolYear=${schoolYear}`
    );
    return response.data;
  }
);

const schoolYearSlice = createSlice({
  name: "schoolYears",
  initialState: {
    allSchoolYears: [],
    schoolYearById: null,
    status: {
      schoolYears: "idle",
      schoolYearById: "idle",
    },
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSchoolYears.pending, (state) => {
        state.status.schoolYears = "loading";
      })
      .addCase(fetchSchoolYears.fulfilled, (state, action) => {
        state.status.schoolYears = "succeeded";
        state.allSchoolYears = action.payload;
      })
      .addCase(fetchSchoolYears.rejected, (state, action) => {
        state.status.schoolYears = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSchoolYearById.pending, (state) => {
        state.status.schoolYearById = "loading";
      })
      .addCase(fetchSchoolYearById.fulfilled, (state, action) => {
        state.status.schoolYearById = "succeeded";
        state.schoolYearById = action.payload;
      })
      .addCase(fetchSchoolYearById.rejected, (state, action) => {
        state.status.schoolYearById = "failed";
        state.error = action.error.message;
      })
      .addCase(addSchoolYear.pending, (state) => {
        state.status.schoolYears = "loading";
      })
      .addCase(addSchoolYear.fulfilled, (state, action) => {
        state.status.schoolYears = "succeeded";
        state.allSchoolYears.unshift(action.payload);
      })
      .addCase(addSchoolYear.rejected, (state, action) => {
        state.status.schoolYears = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSchoolYear.pending, (state) => {
        state.status.schoolYears = "loading";
      })
      .addCase(updateSchoolYear.fulfilled, (state, action) => {
        state.status.schoolYears = "succeeded";
        const index = state.allSchoolYears.findIndex(
          (schoolYear) => schoolYear.id === action.payload.id
        );
        state.allSchoolYears[index] = action.payload;
      })
      .addCase(updateSchoolYear.rejected, (state, action) => {
        state.status.schoolYears = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteSchoolYear.pending, (state) => {
        state.status.schoolYears = "loading";
      })
      .addCase(deleteSchoolYear.fulfilled, (state, action) => {
        state.status.schoolYears = "succeeded";
        state.allSchoolYears = state.allSchoolYears.filter(
          (schoolYear) => schoolYear.id !== action.payload
        );
      })
      .addCase(deleteSchoolYear.rejected, (state, action) => {
        state.status.schoolYears = "failed";
        state.error = action.error.message;
      })
      .addCase(searchSchoolYears.pending, (state) => {
        state.status.schoolYears = "loading";
      })
      .addCase(searchSchoolYears.fulfilled, (state, action) => {
        state.status.schoolYears = "succeeded";
        state.allSchoolYears = action.payload;
      })
      .addCase(searchSchoolYears.rejected, (state, action) => {
        state.status.schoolYears = "failed";
        state.error = action.error.message;
      });
  },
});

export default schoolYearSlice.reducer;
export const getAllSchoolYears = (state) => state.schoolYears.allSchoolYears;
export const getSchoolYearById = (state) => state.schoolYears.schoolYearById;
