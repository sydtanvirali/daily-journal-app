import { configureStore } from "@reduxjs/toolkit";
import { journalApi } from "./api/journalApi";
import authReducer from "./slices/authSlice";
import journalReducer from "./slices/journalSlice";
import { authApi } from "./api/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
    [authApi.reducerPath]: authApi.reducer,
    [journalApi.reducerPath]: journalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, journalApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
