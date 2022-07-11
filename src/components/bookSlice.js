import { createSlice } from "@reduxjs/toolkit";
import api from "../apiService";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  books: [],
  bookDetail: [],
  bookFavorite: [],
};

const slice = createSlice({
  name: "book",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getBookSuccess(state, action) {
      state.isLoading = false;
      state.hasError = null;
      state.books = action.payload;
    },
    getBookDetailSuccess(state, action) {
      state.isLoading = false;
      state.hasError = null;
      state.bookDetail = action.payload;
    },
    getFavoriteBookSuccess(state, action) {
      state.isLoading = false;
      state.hasError = null;
      state.bookFavorite = action.payload;
    },
    resetBook(state, action) {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export default slice.reducer;

export const getBook =
  ({ pageNum, limit = 10, query }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let url = `/books?_page=${pageNum}&_limit=${limit}`;
      if (query) url += `&q=${query}`;
      const response = await api.get(url);

      dispatch(slice.actions.getBookSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const getBookDetail =
  ({ bookId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await api.get(`/books/${bookId}`);
      dispatch(slice.actions.getBookDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const postData =
  ({ addingBook }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await api.post(`/favorites`, addingBook);
      dispatch(slice.actions.resetBook());
      toast.success("The book has been added to the reading list!");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const getFavoriteBook = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await api.get(`/favorites`);
    dispatch(slice.actions.getFavoriteBookSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const removeBookFromList =
  ({ removedBookId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await api.delete(`/favorites/${removedBookId}`);
      dispatch(slice.actions.resetBook());
      toast.success("The book has been removed");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
