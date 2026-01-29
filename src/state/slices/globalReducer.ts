import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
// import { act } from "react";
import { ProductResponse } from "../../types";

interface GlobalTypes {
  productFields: boolean;
  globalUserId: string | null;
  userAction:
    | "SUSPEND"
    | "UNSUSPEND"
    | "ACTIVATE"
    | "DEACTIVATE"
    | "DELETE"
    | "VERIFY"
    | null;
  productDetails: ProductResponse | null;
  productAction: "CLOSE" | "OPEN" | "DELETE" | "VIEW_REVIEWS" | null;
  productImages: string[];
  currentPage: number;
}
const initialState: GlobalTypes = {
  productFields: false,
  globalUserId: null,
  userAction: null,
  productDetails: null,
  productAction: null,
  productImages: [],
  currentPage: 1,
};
export const GlobalSlice = createSlice({
  initialState,
  name: "globalstate",
  reducers: {
    setProductFields: (state, action: PayloadAction<boolean>) => {
      state.productFields = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.globalUserId = action.payload;
    },
    setUserAction: (
      state,
      action: PayloadAction<
        | "SUSPEND"
        | "UNSUSPEND"
        | "ACTIVATE"
        | "DEACTIVATE"
        | "DELETE"
        | "VERIFY"
        | null
      >,
    ) => {
      state.userAction = action.payload;
    },
    setProductAction: (
      state,
      action: PayloadAction<
        "CLOSE" | "OPEN" | "DELETE" | "VIEW_REVIEWS" | null
      >,
    ) => {
      state.productAction = action.payload;
    },
    setProductDetails: (
      state,
      action: PayloadAction<ProductResponse | null>,
    ) => {
      state.productDetails = action.payload;
    },
    setProductImages: (state, action: PayloadAction<string[]>) => {
      state.productImages = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetGlobalState: (state) => {
      state.productFields = false;
      state.globalUserId = null;
      state.userAction = null;
      state.productDetails = null;
      state.productAction = null;
      state.productImages = [];
    },
  },
});

export const {
  setProductFields,
  setUserId,
  setUserAction,
  setProductDetails,
  setProductAction,
  setProductImages,
  resetGlobalState,
  setCurrentPage,
} = GlobalSlice.actions;

export const selectProductFields = (state: RootState) =>
  state.globalstate.productFields;
export const selectUserId = (state: RootState) =>
  state.globalstate.globalUserId;
export const selectUserAction = (state: RootState) =>
  state.globalstate.userAction;
export const selectProduct = (state: RootState) =>
  state.globalstate.productDetails;
export const selectProductAction = (state: RootState) =>
  state.globalstate.productAction;
export const selectProductImages = (state: RootState) =>
  state.globalstate.productImages;
export const selectCurrentPage = (state: RootState) =>
  state.globalstate.currentPage;
export const globalReducer = GlobalSlice.reducer;
