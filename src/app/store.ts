import { coursesSlice } from "@/lib/features/courses";
import { userSlice } from "@/lib/features/user";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        courses: coursesSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;