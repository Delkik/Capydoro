import { PERSIST_REHYDRATE } from "@redux-offline/redux-offline/lib/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IRootState } from "../store";

const BASE_URL = 'http://localhost:5000/';
export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as IRootState).user.user;

            if (token) {
                // headers.set('Access-Control-Allow-Origin', '*')
                headers.set('Access-Control-Allow-Credentials', 'true')
                headers.set('Authorization', `${token}`);
            }
            // console.log(headers.get('Authorization'))
            return headers;
        }
    }),
    extractRehydrationInfo: (action, { reducerPath }) => {
        if (action.type === PERSIST_REHYDRATE) {
            return action.payload[reducerPath];
        }
    },
    tagTypes: ['Task', 'Level'],
    endpoints: () => ({})
})