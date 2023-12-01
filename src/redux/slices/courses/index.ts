import { course } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

// Define an async thunk to fetch courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
    try {
        const response = await fetch('https://localhost:3000/api/courses/');
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        return data.data;
    } catch (error: any) {
        throw new Error('Error fetching courses: ' + error.message);
    }
});

export const coursesSlice = createSlice({
    initialState: {
        data: [] as course[],
        loading: false,
        error: '',
    },
    name: "courses",
    reducers: {
        fetchCoursesPending: (state) => {
            state.loading = true;
            state.error = '...fetching';
        },
        fetchCoursesSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        fetchCoursesRejected: (state, action) => {
            state.loading = false;
            state.error = 'Failed to fetch courses'
        }
    },
});

export const { fetchCoursesPending, fetchCoursesSuccess, fetchCoursesRejected } = coursesSlice.actions;
export default coursesSlice.reducer; 