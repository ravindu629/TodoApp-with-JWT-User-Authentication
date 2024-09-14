import { ITEMS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const itemSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => ({
        url: ITEMS_URL,
      }),
      providesTags: ["Item"],
      keepUnusedDataFor: 5,
    }),
    getItemDetails: builder.query({
      query: (itemId) => ({
        url: `${ITEMS_URL}/${itemId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createItem: builder.mutation({
      query: (data) => ({
        url: `${ITEMS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Item"],
    }),
    updateItem: builder.mutation({
      query: (data) => ({
        url: `${ITEMS_URL}/${data.itemId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Item"],
    }),

    deleteItem: builder.mutation({
      query: (itemId) => ({
        url: `${ITEMS_URL}/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Item"],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemDetailsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemSlice;
