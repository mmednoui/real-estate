import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    currentUser: null,
    error: null,
  },
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInDone: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    signInFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const { signInDone, signInFail, signInStart } = userSlice.actions;

export default userSlice.reducer;
