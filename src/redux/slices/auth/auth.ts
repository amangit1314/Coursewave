import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from 'cookies-next';
import { authApi } from "./authApi";
import { LoginResponse } from "@/types/LoginResponse";

const initialState: Partial<LoginResponse> = {};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (_state, { payload }) => {
                    // set the token in the cookies
                    setAuthCookie(payload.token, 'auth_token');

                    // store the user data in the store
                    // "mutation" also works
                    // state = payload;
                    return payload;
                }
            )
            .addMatcher(
                authApi.endpoints.getAuthData.matchFulfilled,
                (_state, { payload }) => {
                    // in case we receive a new token when refetching the details
                    setAuthCookie(payload.token, 'auth_token');
                    return payload;
                }
            );
    },
});

export default slice.reducer;

const setAuthCookie = (token: string, name: string) => {
    const toBase64 = Buffer.from(token).toString('base64');

    setCookie(name, toBase64, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    });
};