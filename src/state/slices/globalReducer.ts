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
  productAction: "CLOSE" | "OPEN" | "DELETE" | null;
  productImages: string[];
}
const initialState: GlobalTypes = {
  productFields: false,
  globalUserId: null,
  userAction: null,
  productDetails: null,
  productAction: null,
  productImages: [],
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
      >
    ) => {
      state.userAction = action.payload;
    },
    setProductAction: (
      state,
      action: PayloadAction<"CLOSE" | "OPEN" | "DELETE" | null>
    ) => {
      state.productAction = action.payload;
    },
    setProductDetails: (
      state,
      action: PayloadAction<ProductResponse | null>
    ) => {
      state.productDetails = action.payload;
    },
    setProductImages: (state, action: PayloadAction<string[]>) => {
      state.productImages = action.payload;
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
export const globalReducer = GlobalSlice.reducer;
