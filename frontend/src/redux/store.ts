import { configureStore, combineReducers, StoreEnhancer } from '@reduxjs/toolkit';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import authSlice from './slices/authSlice';
import taskSlice from './slices/taskSlice';
import { api } from './apis/api';


const rootReducer = combineReducers({
    tasks: taskSlice,
    user: authSlice,
    [api.reducerPath]: api.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    enhancers: [offline(offlineConfig) as StoreEnhancer]
})

export type IRootState = ReturnType<typeof rootReducer>;