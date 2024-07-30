import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchData = createAsyncThunk('form/fetchData', async () => {
  const response = await axios.get('http://localhost:3001/data');
  return response.data;
});

export const addData = createAsyncThunk('form/addData', async (formData) => {
  const response = await axios.post('http://localhost:3001/data', formData);
  return response.data;
});

export const updateData = createAsyncThunk('form/updateData', async ({ id, formData }) => {
  const response = await axios.put(`http://localhost:3001/data/${id}`, formData);
  return response.data;
});

export const deleteData = createAsyncThunk('form/deleteData', async (id) => {
  await axios.delete(`http://localhost:3001/data/${id}`);
  return id;
});

// Slice to manage the form state and data
const formSlice = createSlice({
  name: 'form',
  initialState: {
    data: [],
    formData: { name: '', email: '', age: '' },
    errors: {},
    isEditing: false,
    editId: null,
  },
  reducers: {
    setFormData(state, action) {
      state.formData = action.payload;
    },
    setErrors(state, action) {
      state.errors = action.payload;
    },
    startEditing(state, action) {
      state.isEditing = true;
      state.editId = action.payload;
      state.formData = state.data.find((item) => item.id === action.payload);
      state.errors = ''

    },
    stopEditing(state) {
      state.isEditing = false;
      state.editId = null;
      state.formData = { name: '', email: '', age: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(addData.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateData.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        state.data[index] = action.payload;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      });
  },
});

export const { setFormData, setErrors, startEditing, stopEditing } = formSlice.actions;
export default formSlice.reducer;
