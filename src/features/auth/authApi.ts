import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginResponse } from "@/types/LoginResponse";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl:
            typeof window === 'undefined'
                ? 'https://localhost:3000'
                : window.location.origin,
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, { userName: string, password: string }>({
            query: ({ userName, password }) => ({
                url: '/api/login',
                method: 'POST',
                body: {
                    userName,
                    password,
                },
            }),
        }),
        getAuthData: builder.query<LoginResponse, { token: string }>({
            query: ({ token }) => ({
                url: 'api/auth-details',
                // this is the default but I'm leaving it here for reference
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
    }),
});

export const { useLoginMutation, useGetAuthDataQuery } = authApi;
