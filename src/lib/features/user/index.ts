import { createSlice } from "@reduxjs/toolkit";

type User = {
    id: string;
    name: string | null;
    email: string;
    profileImageUrl: string | null;
    password: string;
    isEmailVerified: boolean | null;
    refreshTokenGenerationTime: Date | null;
    refreshToken: string | null;
    refreshTokenExpiry: string | null;
    refreshTokenStatus: string | null;
    accessTokenGenerationTime: Date | null;
    accessToken: string | null;
    accessTokenExpiry: string | null;
    accessTokenStatus: string | null;
    resetTokenGenerationTime: Date | null;
    resetToken: string | null;
    resetTokenExpiry: string | null;
    resetTokenStatus: string | null;
    isInstructor: boolean | null;
    instructorName: string | null;
}

const initialUser: User = {
    id: "1",
    name: null,
    email: "",
    profileImageUrl: "https://github.com/shadcn.png",
    password: "",
    isEmailVerified: false,
    refreshTokenGenerationTime: null,
    refreshToken: null,
    refreshTokenExpiry: null,
    refreshTokenStatus: null,
    accessTokenGenerationTime: null,
    accessToken: null,
    accessTokenExpiry: null,
    accessTokenStatus: null,
    resetTokenGenerationTime: null,
    resetToken: null,
    resetTokenExpiry: null,
    resetTokenStatus: null,
    isInstructor: false,
    instructorName: null,
};

export const userSlice = createSlice({
    initialState: {
        data: initialUser,
    },
    name: "user",
    reducers: {
        getUser: (state, action) => {
            state.data = action.payload;
            console.log("User data: ", state.data);
        },
        updateUser: (state, action) => {
            state.data = { ...state.data, ...action.payload };
            console.log("Updated user: ", state.data);
         },
        setUser: (state, action) => {
            state.data = action.payload;
            console.log("User authenticated successfully, Setted user data: ", state.data);
         },
        deleteUser: (state) => { 
            state.data = initialUser;
            console.log("User data deleted successfully")
        },
    },
});

export const { getUser, setUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
