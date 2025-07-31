import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { IToastMessage } from "../../models/toastMessage";

interface IToastReducer {
  toastMessage: IToastMessage;
}

const initialState: IToastReducer = {
  toastMessage: {
    message: '',
    severity: 'success'
  }
};

export const toastSlice = createSlice({
  name: "toastSlice",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IToastMessage>) => ({ ...state, toastMessage:{message:action.payload.message,severity:action.payload.severity} }),
  },
});

export const { addMessage } = toastSlice.actions;
