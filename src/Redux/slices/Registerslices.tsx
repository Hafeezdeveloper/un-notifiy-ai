import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const Registerslices = createSlice({
  name: "register", // ✅ Ensure name is lowercase if needed
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// ✅ Correct Export
export const { increment, decrement, incrementByAmount } = Registerslices.actions;
export default Registerslices.reducer; // ✅ Default export is reducer
