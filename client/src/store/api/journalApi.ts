import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const journalApi = createApi({
  reducerPath: "journalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}` || "http://localhost:8000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Entry"],
  endpoints: (builder) => ({
    // Journal endpoints
    getEntries: builder.query({
      query: () => "/entries",
      providesTags: ["Entry"],
    }),

    createEntry: builder.mutation({
      query: (entry) => ({
        url: "/entries",
        method: "POST",
        body: entry,
      }),
      invalidatesTags: ["Entry"],
    }),
    updateEntry: builder.mutation({
      query: ({ id, entry }) => ({
        url: `/entries/${id}`,
        method: "PUT",
        body: entry,
      }),
      invalidatesTags: ({ id }) => [{ type: "Entry", id }, { type: "Entry" }],
    }),
    deleteEntry: builder.mutation({
      query: (id) => ({
        url: `/entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Entry"],
    }),
    searchEntries: builder.query({
      query: (query) => `/entries/search?q=${encodeURIComponent(query)}`,
      providesTags: ["Entry"],
    }),
  }),
});

export const {
  useGetEntriesQuery,
  useCreateEntryMutation,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
  useSearchEntriesQuery,
} = journalApi;
