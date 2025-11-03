import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GlobalTypes {
  productFields: boolean;
  globalUserId: string | null;
}
const initialState: GlobalTypes = {
  productFields: false,
  globalUserId: null,
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
  },
});

export const { setProductFields, setUserId } = GlobalSlice.actions;

export const selectProductFields = (state: RootState) =>
  state.globalstate.productFields;
export const selectUserId = (state: RootState) =>
  state.globalstate.globalUserId;
export const globalReducer = GlobalSlice.reducer;
