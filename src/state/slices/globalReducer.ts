import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GlobalTypes {
  productFields: boolean;
}
const initialState: GlobalTypes = {
  productFields: false,
};
export const GlobalSlice = createSlice({
  initialState,
  name: "globalstate",
  reducers: {
    setProductFields: (state, action: PayloadAction<boolean>) => {
      state.productFields = action.payload;
    },
  },
});

export const { setProductFields } = GlobalSlice.actions;

export const selectProductFields = (state: RootState) =>
  state.globalstate.productFields;
export const globalReducer = GlobalSlice.reducer;
