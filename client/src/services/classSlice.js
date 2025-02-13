import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async () => {
    const response = await axios.get("/classes/all");
    return response.data;
  }
);

export const filterClasses = createAsyncThunk(
  "classes/filterClasses",
  async ({ name, semester, schoolYear }) => {
    const queryParams = new URLSearchParams();

    if (name) {
      queryParams.append("name", name);
    }

    if (semester) {
      queryParams.append("semester", semester);
    }
    if (schoolYear) {
      queryParams.append("schoolYear", schoolYear);
    }

    const response = await axios.get(`/classes/all-subjects?${queryParams}`);
    return response.data;
  }
);

export const getClassByInstructorSemSySubjectCode = createAsyncThunk(
  "classes/getClassByInstructorSemSySubjectCode",
  async ({ instructorId, semester, schoolYear, subjectCode }) => {
    const response = await axios.get(
      `/classes/instructorId/${instructorId}/semester/${semester}/schoolYear/${schoolYear}/subjectCode/${subjectCode}`
    );
    return response.data;
  }
);

export const removeFromClass = createAsyncThunk(
  "students/removeFromClass",
  async (studentId) => {
    const response = await axios.delete(
      `/classes/remove-student/studentId/${studentId}`
    );
    if (response.data.status === 200) {
      return studentId;
    }
  }
);

export const addStudentToClass = createAsyncThunk(
  "students/addStudentToClass",
  async (
    {
      studentId,
      studentName,
      subjectId,
      subjectCode,
      description,
      instructorId,
      instructor,
      semester,
      schoolYear,
    },
    { rejectWithValue }
  ) => {
    try {
      const data = {
        studentId,
        studentName,
        subjectId,
        subjectCode,
        description,
        instructorId,
        instructor,
        semester,
        schoolYear,
      };

      const response = await axios.post("/classes/add-student", data);
      return response.data;
    } catch (error) {
      // Properly return the error message
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const fetchStudentSubjectsBySemSY = createAsyncThunk(
  "students/fetchStudentSubjectsBySemSY",

  async (studentId) => {
    const response = await axios.get(`/classes/studentId/${studentId}`);
    return response.data;
  }
);

export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async ({ instructorId, subjectCode, semester, schoolYear, toast }) => {
    const response = await axios.delete(
      `/classes/delete/instructorId/${instructorId}/subjectCode/${subjectCode}/semester/${semester}/schoolYear/${schoolYear}`
    );

    if (response.data.status === "success") {
      toast.success(response.data.message);
      return response.data;
    }
  }
);

const classSlice = createSlice({
  name: "classes",
  initialState: {
    allClasses: [],
    filteredClasses: [],
    classByInstructor: null,
    studentAllSubjects: [],
    status: {
      classes: "idle",
      filteredClasses: "idle",
    },
  },
  reducers: {
    clearFilteredClasses(state) {
      state.filteredClasses = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status.classes = "loading";
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status.classes = "succeeded";
        state.allClasses = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status.classes = "failed";
      })
      .addCase(filterClasses.pending, (state) => {
        state.status.filteredClasses = "loading";
      })
      .addCase(filterClasses.fulfilled, (state, action) => {
        state.status.filteredClasses = "succeeded";
        state.filteredClasses = action.payload;
      })
      .addCase(filterClasses.rejected, (state, action) => {
        state.status.filteredClasses = "failed";
      })
      .addCase(getClassByInstructorSemSySubjectCode.pending, (state) => {
        state.status.classByInstructor = "loading";
      })
      .addCase(
        getClassByInstructorSemSySubjectCode.fulfilled,
        (state, action) => {
          state.status.classByInstructor = "succeeded";
          state.classByInstructor = action.payload;
        }
      )
      .addCase(
        getClassByInstructorSemSySubjectCode.rejected,
        (state, action) => {
          state.status.classByInstructor = "failed";
        }
      )
      .addCase(removeFromClass.pending, (state) => {
        state.status.removeClass = "loading";
      })
      .addCase(removeFromClass.fulfilled, (state, action) => {
        state.status.removeClass = "succeeded";
        state.classByInstructor.students =
          state.classByInstructor.students.filter(
            (s) => s.id !== action.payload
          );
      })
      .addCase(removeFromClass.rejected, (state, action) => {
        state.status.removeClass = "failed";
      })
      .addCase(addStudentToClass.pending, (state) => {
        state.status.addStudent = "loading";
      })
      .addCase(addStudentToClass.fulfilled, (state, action) => {
        state.status.addStudent = "succeeded";
        state.classByInstructor.students.push(action.payload);
      })
      .addCase(addStudentToClass.rejected, (state, action) => {
        state.status.addStudent = "failed";
      })
      .addCase(fetchStudentSubjectsBySemSY.pending, (state) => {
        state.status.studentAllSubjects = "loading";
      })
      .addCase(fetchStudentSubjectsBySemSY.fulfilled, (state, action) => {
        state.status.studentAllSubjects = "succeeded";
        state.studentAllSubjects = action.payload;
      })
      .addCase(fetchStudentSubjectsBySemSY.rejected, (state, action) => {
        state.status.studentAllSubjects = "failed";
      })
      .addCase(deleteClass.pending, (state) => {
        state.status.deleteClass = "loading";
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.status.deleteClass = "succeeded";
        state.classByInstructor = null;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.status.deleteClass = "failed";
      });
  },
});

export default classSlice.reducer;
export const getClassById = (state, classId) =>
  state.classes.allClasses.find((c) => c.id === classId);
export const getFilteredClasses = (state) => state.classes.filteredClasses;
export const getClassByInstructor = (state) => state.classes.classByInstructor;
export const getStudentAllSubjects = (state) =>
  state.classes.studentAllSubjects;
