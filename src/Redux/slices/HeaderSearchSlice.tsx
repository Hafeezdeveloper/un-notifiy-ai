// import { createSlice,PayloadAction  } from '@reduxjs/toolkit';

// const HeaderSearchSlice = createSlice({
//     name: 'USER_PROFILE',
//     initialState: {
//         value: "",
//         currentPage: 1,
//         perPage: 10,
//         sort: "desc",
//         isLoader: false,
//         numberOfResults: 0,
//         data: [],
//         bool: false,
//     },
//     reducers: {
//         setValue: ((state, action) => {
//             state.value = action.payload;
//         }),
//         setCurrentPage: ((state, action) => {
//             state.currentPage = action.payload;
//         }),
//         setSort: ((state, action) => {
//             state.sort = action.payload;
//         }),
//         setLoader: ((state, action) => {
//             state.isLoader = action.payload;
//         }),
//         setNumber: ((state, action) => {
//             state.numberOfResults = action.payload;
//         }),
//         setData: ((state, action) => {
//             state.data = action.payload;
//         }),
//         runTimeUpdate: ((state, action) => {
//             state.bool = !state.bool;
//         }),
//     },
// });

// export const { setValue, setCurrentPage, setSort, setLoader, setNumber, setData, runTimeUpdate } = HeaderSearchSlice.actions;
// export default HeaderSearchSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HeaderSearchState {
    value: string;
    currentPage: number;
    perPage: number;
    sort: string;
    isLoader: boolean;
    numberOfResults: number;
    data: any[]; // Adjust the type according to the data structure
    bool: boolean;
}

const initialState: HeaderSearchState = {
    value: "",
    currentPage: 1,
    perPage: 10,
    sort: "desc",
    isLoader: false,
    numberOfResults: 0,
    data: [],
    bool: false,
};

const HeaderSearchSlice = createSlice({
    name: 'USER_PROFILE',
    initialState,
    reducers: {
        setValue: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setSort: (state, action: PayloadAction<string>) => {
            state.sort = action.payload;
        },
        setLoader: (state, action: PayloadAction<boolean>) => {
            state.isLoader = action.payload;
        },
        setNumber: (state, action: PayloadAction<number>) => {
            state.numberOfResults = action.payload;
        },
        setData: (state, action: PayloadAction<any[]>) => { // Adjust the type according to the data structure
            state.data = action.payload;
        },
        runTimeUpdate: (state) => {
            state.bool = !state.bool;
        },
    },
});

export const { setValue, setCurrentPage, setSort, setLoader, setNumber, setData, runTimeUpdate } = HeaderSearchSlice.actions;
export default HeaderSearchSlice.reducer;
